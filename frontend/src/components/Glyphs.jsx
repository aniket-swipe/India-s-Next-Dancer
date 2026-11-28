const base = {
  className: 'glyph',
  viewBox: '0 0 56 56',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Glyphs = {
  kids: () => (
    <svg {...base}>
      <circle cx="28" cy="13" r="5" />
      <path d="M28 19v14M28 24l-10-5M28 24l10 6M28 33l-7 13M28 33l8 12" />
      <path d="M44 10l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
    </svg>
  ),
  teens: () => (
    <svg {...base}>
      <circle cx="30" cy="10" r="5" />
      <path d="M29 16l-3 16M27 22l-12-4M27 22l12 -8M26 32l-9 7-2 8M26 32l12 5 4 9" />
    </svg>
  ),
  adults: () => (
    <svg {...base}>
      <circle cx="20" cy="14" r="5" />
      <path d="M22 20l6 12M24 24l-6-14-4-6M25 26l14-16M28 32l-10 14M28 32l14 2 6 10" />
    </svg>
  ),
  group: () => (
    <svg {...base}>
      <circle cx="14" cy="14" r="4" /><circle cx="28" cy="10" r="4" /><circle cx="42" cy="14" r="4" />
      <path d="M14 19v11l-5 14M14 30l5 14M28 15v13l-5 16M28 28l5 16M42 19v11l-5 14M42 30l5 14M14 23l14 -2 14 2" />
    </svg>
  ),
}
