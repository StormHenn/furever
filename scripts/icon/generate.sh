#!/usr/bin/env bash
# Rasterises the app mark into the PNGs the home screen needs.
#
#   ./scripts/icon/generate.sh
#
# Sources are scripts/icon/*.svg; outputs land in public/. Re-run after editing
# a source. Uses headless Chrome because it is the one renderer we can count on
# being installed on a Mac; set CHROME to point at another binary.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
out="$root/public"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

[ -x "$CHROME" ] || { echo "Chrome not found at: $CHROME (set CHROME=...)" >&2; exit 1; }

# render <source.svg> <size> <output.png>
# The SVG is inlined rather than linked: as a sub-resource it loses a race with
# --screenshot on a cold Chrome start and captures a broken-image placeholder.
render() {
  local src="$1" size="$2" dest="$3"
  {
    printf '<html><head><style>html,body{margin:0}svg{width:%spx;height:%spx;display:block}</style></head><body>' "$size" "$size"
    cat "$root/scripts/icon/$src"
    printf '</body></html>'
  } > "$tmp/page.html"
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size="$size,$size" \
    --virtual-time-budget=2000 \
    --screenshot="$tmp/out.png" "$tmp/page.html" >/dev/null 2>&1
  mv "$tmp/out.png" "$out/$dest"
  echo "  $dest  (${size}x${size})"
}

echo "Rendering icons into public/"
render mark.svg          180 apple-touch-icon.png
render mark.svg          192 icon-192.png
render mark.svg          512 icon-512.png
render mark-maskable.svg 192 icon-maskable-192.png
render mark-maskable.svg 512 icon-maskable-512.png
# PNG fallbacks for browsers that won't take an SVG favicon (older Safari).
render mark-favicon.svg   32 favicon-32.png
render mark-favicon.svg   96 favicon-96.png
cp "$root/scripts/icon/mark-favicon.svg" "$out/favicon.svg"
echo "  favicon.svg"
