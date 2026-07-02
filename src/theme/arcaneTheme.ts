// PrimeVue 4 unstyled pass-through theme, scoped to only the components this
// foundational phase actually instantiates (Button for the d20 roll button,
// Dialog for the command-palette shell). Expand per-component as later
// feature pages need more of PrimeVue's ~90 components — do not pre-theme
// the whole library speculatively.
export const arcaneTheme = {
  button: {
    root: 'inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 font-body text-sm font-semibold text-void transition-colors hover:bg-gold-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50',
    label: 'leading-none',
    icon: 'text-current',
    loadingIcon: 'animate-spin',
  },
  dialog: {
    mask: 'fixed inset-0 z-50 flex items-center justify-center bg-void/70 backdrop-blur-sm',
    root: 'w-full max-w-lg overflow-hidden rounded-lg border border-border bg-obsidian text-parchment shadow-2xl',
    header: 'flex items-center justify-between border-b border-border px-4 py-3',
    title: 'font-display text-lg text-gold',
    headerActions: 'flex items-center gap-2',
    pcCloseButton: 'tap-target flex items-center justify-center text-ink hover:text-gold',
    content: 'p-0',
    footer: 'border-t border-border px-4 py-3',
  },
}
