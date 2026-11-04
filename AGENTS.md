<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Catalogue content lives in `src/data/*.json` (scraped verbatim from shumbacoopers.co.zw) and branches in `src/data/branches.json` (from the FCC branch list xlsx); pages read only through `src/lib/catalog.ts` and `src/lib/distributors.ts` so content stays single-sourced.
- All category pages share one route `/category/$slug` keyed by the original site slugs, so every old menu item maps to exactly one page.
