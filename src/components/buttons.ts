/* Capsule actions: 48px height, 28px radius, 12px 20px padding.
   Primary (neon) leads on dark; Inverse (forest ink) leads on pale surfaces;
   Glass is the secondary on dark material only. */

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-action px-5 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon active:scale-[0.99]";

export const btnPrimary = `${base} bg-neon text-ink hover:bg-neon-active`;

export const btnInverse = `${base} bg-ink text-white hover:bg-moss`;

export const btnGlass = `${base} bg-white/10 text-white backdrop-blur-xl hover:bg-white/15`;
