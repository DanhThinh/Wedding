/** Analytics only needs the page path; query strings and fragments may contain guest names. */
function pageUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}

export function getAnalyticsPageParams() {
  return {
    page_location: pageUrl(window.location.href),
    page_referrer: pageUrl(document.referrer),
  };
}
