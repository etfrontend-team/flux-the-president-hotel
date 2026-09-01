// Tailwind CSS v4 PostCSS plugin.
//
// This config is global to the project, but the plugin only injects Tailwind
// output (utilities + Preflight reset) into stylesheets that contain an
// `@import "tailwindcss"` directive. The Payload admin styles do not import
// Tailwind, so the admin panel is passed through untouched. Tailwind is scoped
// to the (frontend) route group via src/app/(frontend)/styles.css.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
