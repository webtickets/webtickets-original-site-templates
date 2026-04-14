# Webtickets Original Site Templates

Original site templates (circa 2017) written in Pug with Bootstrap CSS, based on the CreateX theme.

## Project Structure

- `src/templates/` — Pug source templates
- `src/scss/` — Custom SCSS styles
- `src/vendor/` — Vendor CSS/JS and Bootstrap SCSS source
- `dist/` — Compiled HTML, CSS, and JS output

## Build

Requires Node.js. Install dependencies:

```sh
npm install
```

Build tasks use Gulp:

```sh
npx gulp pug              # Compile Pug templates to dist/
npx gulp sass:expanded    # Compile SCSS (expanded)
npx gulp sass:minified    # Compile SCSS (minified + sourcemaps)
npx gulp sass:bootstrap   # Compile Bootstrap CSS
npx gulp                  # Full build + watch + BrowserSync dev server
```

## Deploy

Deployed to Vercel from the `dist/` directory:

```sh
cd dist && vercel --prod
```

Production URL: https://dist-tau-weld-85.vercel.app