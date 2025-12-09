# homepage-hero-gdoc block (Lycamobile-style carousel)

This block is an EDS-ready hero carousel (Lycamobile-style) with:
- Auto-rotation (5s)
- Fade transition
- Left/right arrow controls
- Dot pagination
- Desktop + mobile background support
- CTA button
- Title + Subtitle
- Fully responsive
- Keyboard and touch swipe support

## Files
- homepage-hero-gdoc.plain.html  — template used by EDS (placeholders)
- homepage-hero-gdoc.css         — BEM CSS styles
- homepage-hero-gdoc.js          — vanilla JS carousel (export default function decorate(block))
- sample-homepage-hero-gdoc.csv  — sample CSV / Google Sheets rows for 3 slides

## How to use
1. Add `/blocks/homepage-hero-gdoc/` folder to your GitHub repo used by EDS.
2. Commit files and push.
3. In your Google Sheet / Doc content source, include rows matching `sample-homepage-hero-gdoc.csv`.
4. Preview in EDS — the block will be rendered and JS will be executed automatically.
5. Optionally include client-side bundling per your project setup (some EDS setups auto-import `/blocks/*` CSS/JS).

## Notes
- Replace `/images/...` paths in the CSV with your actual Shared Drive image paths (or full URLs).
- The JS file exports `decorate(block)` — ensure your EDS pipeline calls decorate for blocks.
