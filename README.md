# Steal the Beat website

Live at **https://stealthebeat.ng**. Static site on GitHub Pages, member sign-ups saved to a Google Sheet through a Google Apps Script web app.

Owners: June Clarke (joonspoon) and Blayke. Started November 2026.

## What's here

| Path | What it is |
|---|---|
| `index.html` | Front page: logo, Members sign up and Shop buttons |
| `join.html` | Member sign-up form (people who own a piece of STB clothing) |
| `shop.html` | Placeholder for the Shopify store embed. Not linked yet: Shop links go straight to stealthebeat.africa |
| `assets/style.css` | All styling. Black background with an asphalt grain (remove `class="asphalt"` from `<body>` for plain black) |
| `assets/form.js` | Form validation and submission. `ENDPOINT` holds the Apps Script web app URL |
| `assets/logo.png`, `logo-mark.png`, `favicon.png` | Official logo (white, transparent, no "by blayke" byline), header mark, browser tab icon |
| `apps-script/Code.gs` | **Master copy** of the sign-up backend. Google runs a copy of this file |
| `CNAME` | Tells GitHub Pages to serve the site at stealthebeat.ng |

No build step. Edit the files, commit to `main`, and GitHub Pages redeploys in a minute or two.

## Hosting and domain

- **GitHub Pages:** repo Settings → Pages, source `main` / root, custom domain `stealthebeat.ng`, Enforce HTTPS on.
- **DNS:** stealthebeat.ng is managed in **ZoneEdit** (user jclarke5). Records:
  - A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - CNAME `www` → joonspoon.github.io.
  - The domain was parked in ZoneEdit until 23 Nov 2026 and reactivated then. It costs ZoneEdit credits; if credits run out, DNS can be suspended and the site goes down.
- **Store:** the Shopify store is at **stealthebeat.africa** (separate, locked out as of Nov 2026). To embed it on `shop.html`, use Shopify's Buy Button sales channel; a full store can't be put in an iframe.

## Sign-up form backend

- **Sheet:** "Steal the Beat Members" in June's Google Drive (joonspoon@gmail.com), folder "steal the beat".
  ID `1GpsyrWOqYSDJfre9BNcqvigB-xgCLpHKe6zs8MuqjHA`. One row per sign-up on the `Members` tab.
- **Apps Script project:** "STB member sign-ups" (standalone, owned by joonspoon@gmail.com), at
  https://script.google.com/home/projects/1F9AmbCBHje2hoxzo7DFI37X-5Hvtddu-0TRZ_hq79gYuCH42b9HcV4oC/edit
- **Web app deployment:** Execute as Me, access Anyone. URL (also in `assets/form.js`):
  https://script.google.com/macros/s/AKfycbyhQj5wXqlxlfM4xf-IMTzBgtQ_giW1O3TVDKwDrdHmuvni0a01yJSOt6nScj1o3BgD/exec

### Changing the backend

1. Edit `apps-script/Code.gs` here and commit it.
2. Paste the same code into the Apps Script project and save.
3. Deploy → **Manage deployments** → pencil icon → Version: **New version** → Deploy.
   This keeps the same URL, so `form.js` doesn't change. ("New deployment" would make a new URL.)

### Adding or removing a form field

Change it in three places: the input in `join.html` (its `name`), the checks in `problem()` in `assets/form.js` if it's required, and the `FIELDS` list in `apps-script/Code.gs` (then redeploy as above). New columns appear at the end of the Sheet; the header row is only written when the Sheet is empty, so add the new column header by hand.

### How it works

The form posts JSON as plain text (no CORS preflight) to the web app. `doPost` checks a hidden honeypot field (`website`) to drop spam bots, then appends a row. `doGet` returns a status message, so opening the URL in a browser is a quick health check.

## Copy and design notes

- Minimal, plain wording. No hype.
- Footer on every page: "✂️ Handmade in Lagos, Nigeria" and @stealdbeat.
- The official logo has no "by blayke" byline.
