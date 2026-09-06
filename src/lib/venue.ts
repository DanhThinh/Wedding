export function hasMappableAddress(address: string) {
  return address.trim().length > 0 && !/cập nhật|chưa có|đang cập nhật/i.test(address);
}
