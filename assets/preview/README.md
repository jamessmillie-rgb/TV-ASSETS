# Design previews (not used by the live site)

Files here are NOT loaded by any truevitals.co.uk page. They exist so a design change can be previewed on the live
page in one browser tab before James approves it. Nothing here holds customer data.

- tvpv.js: run it in a tab on truevitals.co.uk. It swaps /compare-panels to the staged embed (cmp-embed.html) and loads
  polish/common.css + polish/<page>.css. Add ?tvpv=off to the page address (or set window.__tvpvOff=true first) for "before".
- polish/*.css: the proposed design layer, one file per page plus common.css.
