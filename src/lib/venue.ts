export function hasMappableAddress(address: string) {
  return address.trim().length > 0 && !/cập nhật|chưa có|đang cập nhật/i.test(address);
}

/** Prefer an exact map pin when supplied, otherwise look up the displayed address. */
export function getVenueMapQuery(venue: { address: string; mapQuery?: string }) {
  return venue.mapQuery?.trim() || venue.address.trim();
}
