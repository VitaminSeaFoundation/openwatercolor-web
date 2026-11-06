# openwatercolor-web

Restores the colours of underwater photos in the browser. The red that water absorbs is rebuilt and the blue-green cast is lifted. Photos are processed entirely on the device and never uploaded.

**Try it:** <https://underwatercolor.vitaminsea.studio/>

The home page shows a built-in sample with a before/after divider you can drag (arrow keys also work). After you pick a photo, four sliders appear:

- **Restore** (0–100 %, default 100 %): mixes in real time.
- **Warmth**, **Water** and **Clarity** (default 0): recompute when you release them.

Preview and save both use the current settings. The UI is in Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Spanish and French, and follows the browser language (`zh-TW`, `zh-HK` and `zh-Hant` get Traditional Chinese). The language menu in the top bar switches it and the choice is remembered. `?lang=ja` (or `zh`, `zh-TW`, `en`, `ko`, `es`, `fr`) in the URL overrides both.

No npm packages, CDN or online services are used.

## Layout

```
core/                 platform-neutral modules (UMD: classic <script> or CommonJS require)
  restore.js          the colour model, working on RGBA pixel arrays
  compare.js          the shareable before/after image, drawn on any 2D canvas context
  i18n.js             every UI string, per language
web/                  the H5 user interface
  index.html
  assets/app.js       UI logic; talks to the platform only through window.UnderwaterPlatform
  assets/style.css
  platforms/web.js    platform adapter for independent hosting
scripts/build.mjs     builds dist/<target>/
scripts/serve.mjs     static server for local testing
```

## Build and run

Needs Node 18 or later.

```bash
node scripts/build.mjs web            # → dist/web/
node scripts/serve.mjs dist/web 8080  # → http://localhost:8080/
```

`dist/web/` is a plain static site. Upload it to any static host (GitHub Pages, Netlify, Cloudflare Pages, S3, nginx…) under any path; all URLs inside it are relative. Serve it over HTTPS, because saving through the system sheet on phones only works in a secure context.

## Platform adapters

`web/assets/app.js` never calls a platform API directly. Everything that differs between hosts lives in a file under `web/platforms/`. The build copies the chosen adapter to `assets/platform.js`, and it must define `window.UnderwaterPlatform`:

| Member | Purpose |
| --- | --- |
| `id` | Short name. Set as `<html data-platform>`, so CSS can tell hosts apart. |
| `languageCandidates()` | Preferred language tags, most preferred first. |
| `rememberLanguage(code)` | Persist the user's choice (may do nothing). |
| `labels` | i18n keys for `save`, `saved`, `savingStatus`, `savedStatus`, and `share` / `comment` when the adapter has them. |
| `canShare()`, `canComment()` | Decide whether those buttons are shown. Both buttons also stay hidden when the adapter has no `share` / `comment` function. |
| `save(canvas, t)` | Save the result. Resolves when done, resolves `"cancelled"` if the user backed out, rejects with `{ i18nKey, params }`. |
| `share(images, ui)`, `comment(images, ui)` (optional) | `images` holds the canvases `comparison`, `before` and `after`. Call `ui.release()` once you have handed off to the platform so the buttons come back, and report progress with `ui.setStatus(key, params, isError)`. |
| `closeButtonTop()` | Resolves to a pixel offset for the overlay's close button, or `null`. |

The web build has no share or comment features. After saving, the overlay just confirms and offers **Done**. **Save** downloads a JPG; on touch devices it opens the system sheet instead, because that is where "Save Image" lives on phones.

## Adding a language

Add an entry to `LANGUAGES` and a table to `MESSAGES` in `core/i18n.js`. Missing keys fall back to Simplified Chinese. Static text in `index.html` is marked with `data-i18n="key"` (text) or `data-i18n-attr="aria-label:key"` (attributes).

The heading font, ZCOOL KuaiLe (SIL OFL 1.1, see `web/licenses/`), is a subset that only covers the Chinese heading text. Re-subset it after changing that text, otherwise the new characters fall back to the system font. Traditional Chinese, Japanese and Korean headings use a system font instead, so the subset never mixes with other glyphs. Latin languages use the system font too.

## Image processing

The "AI" on the button is product copy: the processing is an on-device Canvas 2D algorithm, not generative AI. It was tuned on an earlier sample photo; the current `web/assets/sample.jpg` has not been re-tuned.

1. **Detect the cast.** The cast is measured as (G − R) / G. Photos without a clear underwater cast are left unchanged and the user is told so.
2. **Rebuild red.** Underwater, the red channel is close to empty (the tuning photo averaged 16/255), so scaling it up cannot bring the colour back. Red is compensated from green: `R + k·(1 − R)·G`, after Ancuti et al., *Color Balance and Fusion for Underwater Image Enhancement* (IEEE TIP 2018). The `(1 − R)` term fades the added red out in highlights, so whites stay neutral instead of turning pink.
3. **Solve the strength.** `k` and the blue scale are solved so non-water areas approach R:G = 0.95 and B:G = 0.8. The solve runs per grid tile and is interpolated smoothly, because the cast changes with distance.
4. **Protect open water.** Areas where blue exceeds green get less correction and keep their blue. The water test runs on a blurred low-resolution mask, so surface ripples and JPEG blocks don't leave red flecks.
5. **Tone.** Part of the haze is removed and the white point is set; the stretch is limited so open-water photos don't get their red amplified. Then local contrast, a dark-area lift, a slight saturation boost and a highlight shoulder are applied.

Known limits:

- Red is estimated, not recovered, so objects with a strong green channel (green coral, seaweed) lean yellow.
- Real-world results have only been tuned on one sample photo.
- Large photos are processed at most 1800 px on the long edge and 1.4 MP in total.
- Imported files are limited to 25 MB.

The comparison image keeps a portrait photo's shape, split exactly down the middle: before on the left, after on the right. Other photos are stacked vertically with a "Before" and an "After" label, about 1800 px on the long edge.

## Compatibility

The JS targets ES2017 / Chrome 61 and uses classic scripts with no modules. Photos are chosen through the system file picker, which accepts JPG, PNG and WebP only. With reduced motion turned on in the system, the processing sweep and the save animation show their final state.

## Licence

The code is released under the [MIT License](LICENSE). The bundled ZCOOL KuaiLe font subset stays under the SIL Open Font License 1.1 (`web/licenses/ZCOOLKuaiLe-OFL.txt`).
