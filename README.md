# Sindbad Burger — Daily Checklist App

Front-of-house and back-of-house **Opening / Closing** checklists for Sindbad Burger staff. PIN-protected, mobile-friendly, with notes + photo uploads, Google Sheets logging, Google Drive photo storage, and email notification to `Info@sindbadburger.com`.

Built per [`../SINDBAD_BURGER_BRAND.md`](../SINDBAD_BURGER_BRAND.md). Task lists come from [`../Sindbad Burger Opening_Closing Checklists.md`](../Sindbad%20Burger%20Opening_Closing%20Checklists.md).

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The app — single self-contained file |
| `apps-script.gs` | Google Apps Script backend (Sheets + Drive + Gmail) |
| `sindbad.jpg` | Logo — copy from the existing inventory app folder |

---

## How the app flows

```
PIN (1981)
   ↓
Sign in with Google  ←  any Google/Gmail account
   ↓
Name + Date  →  [ Opening ]  or  [ Closing ]
   • a "Signed in as <email>" pill shows at top
   • [Sign out] button returns to PIN screen for the next staff
   ↓
Checklist (Front + Back of House sections)
   • check off each task
   • optional note next to each
   • optional photo(s) per task
   ↓
Review screen — shows summary (incl. signed-in Gmail)
   ↓
Submit
   • Google Sheet row appended (incl. "Signed In As" column)
   • Photos uploaded to Drive folder
   • Branded email to Info@sindbadburger.com (incl. signed-in Gmail)
   ↓
Success → reset back to PIN
   • the Google account stays signed in for the next checklist
   • use [Sign out] to switch staff
```

If staff try to submit before ticking every box, the app shows a red warning toast, marks the missing items in red, and scrolls to the first one. Submission is blocked until everything is checked.

---

## Google Sheet columns

| Timestamp | Name | Signed In As | Date | Shift | Tasks Complete | All Notes | Photos |

That's the minimum you asked for — plus a notes column and a Drive-links column so the manager has the full context without opening the email.

---

## Setup — one time

### 1. Google Sheet
1. Create a new Google Sheet, e.g. **Sindbad Burger Checklists**.
2. Copy the **Sheet ID** from the URL (between `/d/` and `/edit`).

### 2. Google Drive folder
1. Create a folder in Drive, e.g. **Sindbad Burger Checklist Photos**.
2. Copy the **Folder ID** from the URL (after `/folders/`).

### 3. Apps Script
1. Go to <https://script.google.com> → **New project**.
2. Paste the entire contents of `apps-script.gs` into `Code.gs`.
3. Set the constants at the top:
   ```js
   const SHEET_ID        = 'your-sheet-id';
   const DRIVE_FOLDER_ID = 'your-drive-folder-id';
   const EMAIL_TO        = 'Info@sindbadburger.com';
   ```
4. Save → **Deploy** → **New deployment** → ⚙ select **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize when prompted (Drive + Sheets + Gmail scopes).
6. Copy the **Web app URL**.

### 4. Wire the app
Open `index.html` and replace:
```js
window.SHEET_URL = "REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL";
```
with the URL you just copied.

### 5. Logo
Copy `sindbad.jpg` from the existing `sindbad-inventory` repo into this folder.

### 6. Google Sign-In setup (OAuth Client ID)

The app uses Google Identity Services for sign-in. You need a free OAuth 2.0 Client ID — ~5 minutes one-time setup.

1. Go to **<https://console.cloud.google.com>** and sign in with the Sindbad Burger Google account.
2. Top bar → project dropdown → **New Project** → name it `Sindbad Burger Checklist` → Create.
3. Left menu → **APIs & Services → OAuth consent screen**
   - User Type: **External** → Create
   - App name: `Sindbad Burger Checklist`
   - User support email: `Info@sindbadburger.com`
   - Developer contact: `Info@sindbadburger.com`
   - **Save and Continue** through Scopes and Test users (no changes needed).
   - On the Summary page click **Back to Dashboard**.
   - **Publishing status → Publish App** (so any Google account can sign in, not just test users).
4. Left menu → **APIs & Services → Credentials**
   - **+ Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Sindbad Burger Checklist Web`
   - **Authorised JavaScript origins** — add every URL the app runs on:
     - `https://sindbadburger.github.io` (production — GitHub Pages)
     - `http://localhost` and `http://localhost:8080` (local testing, optional)
   - Leave Authorised redirect URIs empty.
   - **Create**.
5. Copy the **Client ID** (looks like `123456-xxxxx.apps.googleusercontent.com`).
6. Open `index.html` and replace:
   ```js
   window.GOOGLE_CLIENT_ID = "REPLACE_WITH_GOOGLE_CLIENT_ID";
   ```
   with your Client ID.

That's it. Any Google or Gmail account can now sign in. If Sign-In ever stops working, double-check that the page's URL is in **Authorised JavaScript origins**.

> ⚠️ Sign-In will not work when you open `index.html` directly from your hard drive (`file://`). Use the GitHub Pages URL, or run `python -m http.server 8080` from the folder and open `http://localhost:8080`.

---

## Deploy to GitHub Pages

```bash
cd "sindbad-checklist"
git init
git add .
git commit -m "Initial — Sindbad Burger checklist app"
gh repo create sindbadburger/sindbad-checklist --public --source=. --push
```

Then in GitHub: **Settings → Pages → Branch: main → / (root) → Save.**

Live URL: <https://sindbadburger.github.io/sindbad-checklist>

---

## Local test (no submit)

Run a tiny local server so Google Sign-In works (it does **not** work on `file://`):

```bash
cd sindbad-checklist
python -m http.server 8080
# then open http://localhost:8080
```

The PIN is `1981`. If `GOOGLE_CLIENT_ID` is still the placeholder, the Sign-In screen shows a yellow warning — you can't proceed without configuring it. If `SHEET_URL` is the placeholder, the app will ask before "submitting" and won't actually send data.

---

## PIN

Default: **1981** (matches the inventory app — see brand guide §5).
Change in `index.html`:
```js
const PIN = "1981";
```

---

## Notes for future upgrades

- Multi-PIN per staff (so the name auto-fills) — listed in the brand guide as a planned upgrade for the inventory app; can be shared here.
- Daily auto-reminder email if no checklist submitted by X time.
- Manager dashboard reading from the same Google Sheet.
