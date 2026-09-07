import { readFileSync } from 'node:fs';
import { after, before, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';

let environment;
before(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-wedding-tests',
    firestore: { host: '127.0.0.1', port: 8088, rules: readFileSync('firestore.rules', 'utf8') },
  });
});
beforeEach(async () => { await environment.clearFirestore(); });
after(async () => { await environment?.cleanup(); });
const db = () => environment.unauthenticatedContext().firestore();
const reference = () => doc(db(), 'rsvps', 'a'.repeat(32));
const submission = (changes = {}) => ({
  schemaVersion: 2, name: 'Khách kiểm thử', phone: '', attending: true,
  eventIds: [1, 3], plusOnes: 1, message: '', editToken: 'b'.repeat(64), updatedAt: serverTimestamp(), ...changes,
});

test('accepts attendance and a decline without requiring a phone number', async () => {
  await assertSucceeds(setDoc(reference(), submission()));
  await assertSucceeds(setDoc(reference(), submission({ attending: false, eventIds: [], plusOnes: 0 })));
});
test('same capability supports retries and changes in one document', async () => {
  await assertSucceeds(setDoc(reference(), submission()));
  await assertSucceeds(setDoc(reference(), submission()));
  await assertSucceeds(setDoc(reference(), submission({ eventIds: [2], plusOnes: 3 })));
  await environment.withSecurityRulesDisabled(async context => {
    const snapshot = await getDocs(collection(context.firestore(), 'rsvps'));
    if (snapshot.size !== 1 || snapshot.docs[0].data().plusOnes !== 3) throw new Error('Retry created duplicate or update was lost');
  });
});
test('other guests cannot read, list, overwrite or delete confirmations', async () => {
  await assertSucceeds(setDoc(reference(), submission()));
  await assertFails(getDoc(reference()));
  await assertFails(getDocs(collection(db(), 'rsvps')));
  await assertFails(setDoc(reference(), submission({ editToken: 'c'.repeat(64) })));
  await assertFails(deleteDoc(reference()));
});
for (const [label, changes] of Object.entries({
  unknownEvent: { eventIds: [999] }, wrongType: { eventIds: ['1'] }, duplicates: { eventIds: [1, 1] },
  missingEvent: { eventIds: [] }, invalidCount: { plusOnes: 11 }, fractionalCount: { plusOnes: 1.5 },
  invalidPhone: { phone: 'abc' }, longMessage: { message: 'x'.repeat(501) },
  emptyName: { name: '' }, extraField: { admin: true }, shortToken: { editToken: 'guess' },
  declineWithEvents: { attending: false }, fakeTimestamp: { updatedAt: 'today' },
})) test(`rejects invalid RSVP: ${label}`, async () => { await assertFails(setDoc(reference(), submission(changes))); });

test('old RSVP tabs remain compatible, with validated event IDs', async () => {
  const old = { name: 'Khách cũ', phone: '0901234567', eventIds: [1], plusOnes: 0, createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(db(), 'rsvps', 'legacy'), old));
  await assertFails(setDoc(doc(db(), 'rsvps', 'invalid-legacy'), { ...old, eventIds: [99] }));
  await assertFails(setDoc(doc(db(), 'rsvps', 'duplicate-legacy'), { ...old, eventIds: [1, 1] }));
  await assertFails(setDoc(doc(db(), 'rsvps', 'legacy'), submission()));
});
test('wishes are public, bounded and immutable', async () => {
  const wish = doc(db(), 'wishes', 'wish');
  await assertSucceeds(setDoc(wish, { name: 'An', message: 'Chúc mừng!', createdAt: serverTimestamp() }));
  await assertSucceeds(getDoc(wish));
  await assertFails(setDoc(wish, { name: 'An', message: 'Thay đổi', createdAt: serverTimestamp() }));
  await assertFails(setDoc(doc(db(), 'wishes', 'long'), { name: 'An', message: 'x'.repeat(501), createdAt: serverTimestamp() }));
});
