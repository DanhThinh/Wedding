export type WeddingPhase = 'before' | 'wedding-day' | 'after';

export function getWeddingPhase(weddingDate: Date, now = new Date()): WeddingPhase {
  const start = new Date(weddingDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  if (now.getTime() < start.getTime()) return 'before';
  if (now.getTime() < end.getTime()) return 'wedding-day';
  return 'after';
}

export function hasGiftDetails(data: {
  groom: { bank: { bankName: string; number: string; qrCode: string } };
  bride: { bank: { bankName: string; number: string; qrCode: string } };
}) {
  return [data.groom, data.bride].some(person => Boolean(
    person.bank.bankName.trim()
    && person.bank.number.trim()
    && person.bank.qrCode.trim(),
  ));
}
