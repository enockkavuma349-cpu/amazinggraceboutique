# Kitenge Design Across Shop Pages

## What will change
- Add a reusable, readable Kitenge page banner treatment with distinct motif variations for each main navigation page.
- Apply the treatment to Home, Browse, About Us, Contact, and How to Order & Delivery without changing shop behavior.
- Add the Delivery link beside the logo navigation so every designed page is directly reachable.
- Keep mobile layouts compact, preserve clear contrast, and use the existing semantic color system.

## Technical details
- Extend `src/styles.css` with reusable Kitenge motif utilities and overlay tokens.
- Update the shared navigation in `SiteLayout`.
- Restyle each route header and selected section accents using the shared motifs rather than duplicating decorative code.
- Verify the pages at the current mobile viewport and confirm the project builds cleanly.
