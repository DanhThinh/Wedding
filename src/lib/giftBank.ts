import type { weddingData } from '../data/weddingData';

type Person = typeof weddingData.groom | typeof weddingData.bride;

/** Chỉ hiện thẻ ngân hàng khi đã điền đủ số tài khoản + tên ngân hàng. */
export const hasBank = (person: Person) => Boolean(person.bank.number && person.bank.bankName);
