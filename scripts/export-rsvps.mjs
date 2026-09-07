#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parseRsvpReport, rsvpReportCsv } from '../src/lib/rsvpReport.ts';

const { values } = parseArgs({ options: {
  project: { type: 'string' }, from: { type: 'string' }, out: { type: 'string' },
} });
const out = resolve(values.out || `.private/rsvps-${new Date().toISOString().replace(/[:.]/g, '-')}`);
let rows;
if (values.from) rows = parseRsvpReport(JSON.parse(readFileSync(values.from, 'utf8')));
else {
  if (!values.project) throw new Error('Cần --project <Firebase project ID> hoặc --from <report.json>.');
  const { initializeApp, applicationDefault, deleteApp } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  // Admin credentials remain on the operator’s machine, never in a VITE_* variable.
  const app = initializeApp({ projectId: values.project, credential: applicationDefault() });
  try {
    const db = getFirestore(app);
    const snapshots = await Promise.all(['rsvps', 'attendances'].map(collection => db.collection(collection).get()));
    rows = parseRsvpReport(snapshots.flatMap((snapshot, index) => snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, source: index === 0 ? 'rsvps' : 'attendances',
        name: data.name, phone: data.phone ?? '', attending: data.attending ?? true,
        eventIds: data.eventIds ?? [], plusOnes: data.plusOnes ?? 0, message: data.message ?? '',
        updatedAt: (data.updatedAt ?? data.createdAt)?.toDate?.().toISOString() ?? '',
      };
    })));
  } finally { await deleteApp(app); }
}
mkdirSync(dirname(out), { recursive: true, mode: 0o700 });
writeFileSync(`${out}.json`, JSON.stringify({ version: 1, rows }, null, 2), { flag: 'wx', mode: 0o600 });
writeFileSync(`${out}.csv`, rsvpReportCsv(rows), { flag: 'wx', mode: 0o600 });
console.log(`Đã xuất ${rows.length} xác nhận vào ${out}.json và ${out}.csv`);
