import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRsvpDraft, persistRsvpDraft, readRsvpDraft, rsvpStorageKey, saveRsvp, validateRsvp, RSVP_TIMEOUT_MS } from './rsvp';

const backend = vi.hoisted(() => ({ configured: true, setDoc: vi.fn(), client: vi.fn() }));
vi.mock('./firebase', () => ({ get isFirebaseConfigured() { return backend.configured; }, getFirebaseClient: backend.client }));
vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, collection: string, id: string) => ({ collection, id }),
  setDoc: backend.setDoc, serverTimestamp: () => 'server-time',
}));
const key = rsvpStorageKey();
const validDraft = () => ({ ...createRsvpDraft(), input: { name: '  Nguyễn Văn An ', phone: '090 123-4567', attending: true, eventIds: [1, 3], plusOnes: 1, message: ' Hẹn gặp! ' } });

beforeEach(() => {
  backend.configured = true;
  backend.client.mockReset().mockResolvedValue({ db: {} });
  backend.setDoc.mockReset().mockResolvedValue(undefined);
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
});
afterEach(() => vi.useRealTimers());

describe('shared RSVP validation', () => {
  it('normalizes phone numbers and allows an optional phone or a decline', () => {
    expect(validateRsvp(validDraft().input)).toEqual({});
    expect(validateRsvp({ ...validDraft().input, phone: '', attending: false, eventIds: [], plusOnes: 0 })).toEqual({});
  });
  it('rejects missing choices, invalid event IDs, duplicates and invalid counts', () => {
    expect(validateRsvp({ ...validDraft().input, attending: null, name: ' ', phone: '123' })).toMatchObject({ attending: expect.any(String), name: expect.any(String), phone: expect.any(String) });
    for (const eventIds of [[], [999], [1, 1]]) expect(validateRsvp({ ...validDraft().input, eventIds }).eventIds).toBeTruthy();
    for (const plusOnes of [-1, 11, 1.5]) expect(validateRsvp({ ...validDraft().input, plusOnes }).plusOnes).toBeTruthy();
    expect(validateRsvp({ ...validDraft().input, message: 'x'.repeat(501) }).message).toBeTruthy();
  });
});

describe('RSVP delivery and durable drafts', () => {
  it('only reports success after acknowledgement and writes normalized data', async () => {
    const draft = validDraft();
    expect(await saveRsvp(draft, key)).toEqual({ mode: 'firestore' });
    expect(backend.setDoc).toHaveBeenCalledWith({ collection: 'rsvps', id: draft.id }, expect.objectContaining({
      name: 'Nguyễn Văn An', phone: '0901234567', message: 'Hẹn gặp!', schemaVersion: 2, editToken: draft.editToken,
    }));
    expect(readRsvpDraft(key)?.status).toBe('sent');
  });
  it('keeps offline and unconfigured submissions pending, without claiming delivery', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const draft = validDraft();
    expect(await saveRsvp(draft, key)).toEqual({ mode: 'pending', reason: 'offline' });
    expect(backend.setDoc).not.toHaveBeenCalled();
    expect(readRsvpDraft(key)).toMatchObject({ id: draft.id, status: 'pending' });
    backend.configured = false;
    expect(await saveRsvp(draft, key)).toEqual({ mode: 'pending', reason: 'unavailable' });
  });
  it('preserves a rejected draft and retries with the same document and edit capability', async () => {
    const draft = validDraft();
    backend.setDoc.mockRejectedValueOnce(new Error('permission-denied'));
    expect(await saveRsvp(draft, key)).toEqual({ mode: 'pending', reason: 'rejected' });
    expect(readRsvpDraft(key)?.input).toEqual(draft.input);
    expect(await saveRsvp(draft, key)).toEqual({ mode: 'firestore' });
    expect(backend.setDoc.mock.calls[0]).toEqual(backend.setDoc.mock.calls[1]);
  });
  it('releases the form after a timeout, reuses the pending write and accepts a late acknowledgement', async () => {
    vi.useFakeTimers();
    let resolveWrite!: () => void;
    backend.setDoc.mockImplementationOnce(() => new Promise<void>(resolve => { resolveWrite = resolve; }));
    const draft = validDraft();
    const first = saveRsvp(draft, key);
    await vi.advanceTimersByTimeAsync(RSVP_TIMEOUT_MS);
    expect(await first).toEqual({ mode: 'pending', reason: 'timeout' });
    const retry = saveRsvp(draft, key);
    expect(backend.setDoc).toHaveBeenCalledTimes(1);
    resolveWrite();
    expect(await retry).toEqual({ mode: 'firestore' });
    expect(readRsvpDraft(key)?.status).toBe('sent');
  });
  it('does not mark newer unsent edits as sent when an old response arrives', async () => {
    vi.useFakeTimers();
    let resolveWrite!: () => void;
    backend.setDoc.mockImplementationOnce(() => new Promise<void>(resolve => { resolveWrite = resolve; }));
    const draft = validDraft();
    const first = saveRsvp(draft, key);
    await vi.advanceTimersByTimeAsync(RSVP_TIMEOUT_MS);
    await first;
    const edited = { ...draft, revision: draft.revision + 1, input: { ...draft.input, plusOnes: 3 } };
    persistRsvpDraft(key, edited);
    resolveWrite();
    await vi.runAllTimersAsync();
    expect(readRsvpDraft(key)).toEqual(edited);
    expect(await saveRsvp(edited, key)).toEqual({ mode: 'firestore' });
    expect(backend.setDoc.mock.calls[1][0]).toEqual(backend.setDoc.mock.calls[0][0]);
  });
  it.each(['{broken', '{}'])('never overwrites damaged stored data: %s', async raw => {
    localStorage.setItem(key, raw);
    await expect(saveRsvp(validDraft(), key)).rejects.toThrow();
    expect(localStorage.getItem(key)).toBe(raw);
    expect(backend.setDoc).not.toHaveBeenCalled();
  });
  it('does not send if the durable retry identifier cannot be stored', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Storage full', 'QuotaExceededError'); });
    await expect(saveRsvp(validDraft(), key)).rejects.toThrow('Storage full');
    expect(backend.setDoc).not.toHaveBeenCalled();
  });
  it('isolates personal invitation drafts and never puts capabilities in the storage key', () => {
    const draft = validDraft();
    persistRsvpDraft(rsvpStorageKey('An'), draft);
    expect(readRsvpDraft(rsvpStorageKey('Bình'))).toBeNull();
    expect(key).not.toContain(draft.editToken);
  });
});
