export const DEFAULT_PAGE_SIZE = "letter-3up";

export const PAGE_SIZES = [
  {
    id: "letter-3up",
    name: "Letter, 3 per page",
    description: "US Letter, three 2.75 × 10.5 in cards",
    cardWidth: "198pt",
    cardHeight: "756pt",
    paper: "letter",
    cardsPerPage: 3,
    layout: "columns",
    pngColumns: 3
  },
  {
    id: "insert-5x7.5",
    name: "Checklist pocket 4¼ × 7¼ in",
    description: "Binder pocket window (MIL-B-83963 / NSN 7510-21-806-0746)",
    cardWidth: "4.25in",
    cardHeight: "7.25in",
    cardPadding: "0.15in",
    paper: "letter",
    cardsPerPage: 1,
    layout: "page",
    cropGuides: true,
    pngColumns: 1,
    printHint: "Print on US Letter at 100% scale (one section per page). Fold or cut at 4¼ in, then trim the length to 7¼ in. Disable headers and footers."
  },
  {
    id: "a4-3up",
    name: "A4, 3 per page",
    description: "A4, three cards per page",
    cardWidth: "198pt",
    cardHeight: "804pt",
    paper: "A4",
    cardsPerPage: 3,
    layout: "columns",
    pngColumns: 3
  }
];

export function isValidPageSize(id) {
  return PAGE_SIZES.some(function(size) {
    return size.id === id;
  });
}

export function getPageSize(id) {
  for (var i = 0; i < PAGE_SIZES.length; i++) {
    if (PAGE_SIZES[i].id === id) {
      return PAGE_SIZES[i];
    }
  }
  return PAGE_SIZES[0];
}
