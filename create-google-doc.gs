/**
 * SINDBAD BURGER — CREATE REFERENCE GOOGLE DOC
 *
 * One-time helper. Adds this function to your existing Apps Script project.
 *
 * HOW TO USE:
 *   1. Open your Apps Script project at https://script.google.com
 *   2. In the Files panel, click "+" → Script → name it "createReferenceDoc"
 *   3. Paste this entire file in
 *   4. Save (Ctrl+S)
 *   5. In the function dropdown at top, select "createReferenceDoc"
 *   6. Click Run
 *   7. Approve the Drive/Docs permissions when prompted
 *   8. Check the Execution log (bottom) — it prints the link to your new Google Doc
 *   9. The doc also appears in your Drive root: "Sindbad Burger Checklist App — Reference Doc"
 *
 * You can delete this function after running it once.
 */

function createReferenceDoc() {
  const TEAL = '#097C87';
  const GOLD = '#C8922A';
  const MUTED = '#3D7A80';
  const HINT = '#7ABFC4';

  const doc = DocumentApp.create('Sindbad Burger Checklist App — Reference Doc');
  const body = doc.getBody();
  body.clear();

  // ===== Helper functions =====
  const h1 = (txt) => {
    const p = body.appendParagraph(txt);
    p.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    p.editAsText().setForegroundColor(TEAL).setBold(true);
    return p;
  };
  const h2 = (txt) => {
    const p = body.appendParagraph(txt);
    p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    p.editAsText().setForegroundColor(TEAL).setBold(true);
    return p;
  };
  const p = (txt) => body.appendParagraph(txt);
  const bullet = (txt) => body.appendListItem(txt).setGlyphType(DocumentApp.GlyphType.BULLET);
  const num = (txt) => body.appendListItem(txt).setGlyphType(DocumentApp.GlyphType.NUMBER);
  const sub = (txt) => {
    const para = body.appendParagraph(txt);
    para.editAsText().setForegroundColor(MUTED).setItalic(true);
    return para;
  };
  const tbl = (rows) => {
    const table = body.appendTable(rows);
    // Style: header-like first column with teal text, light teal alternating rows
    for (let r = 0; r < rows.length; r++) {
      const row = table.getRow(r);
      const cell0 = row.getCell(0);
      cell0.editAsText().setForegroundColor(TEAL).setBold(true);
      if (r % 2 === 0) {
        row.getCell(0).setBackgroundColor('#EBF9FA');
        row.getCell(1).setBackgroundColor('#EBF9FA');
      }
    }
    return table;
  };

  // ===== TITLE =====
  const title = body.appendParagraph('SINDBAD BURGER');
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.editAsText().setForegroundColor(TEAL).setBold(true);

  const sub1 = body.appendParagraph('Daily Checklist App — Reference Document');
  sub1.setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  sub1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sub1.editAsText().setForegroundColor(GOLD).setBold(true);

  const sub2 = body.appendParagraph('Everything you need to operate, maintain, and grow the app.');
  sub2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sub2.editAsText().setForegroundColor(MUTED).setItalic(true);

  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  sub(`Last updated: ${today}`);
  sub('Maintained by: al.kinani@kasa.com  •  Brand owner: Info@sindbadburger.com');
  body.appendHorizontalRule();

  // ===== 1. WHAT THIS APP DOES =====
  h1('1.  What This App Does');
  p('A mobile-friendly web app that lets staff complete Opening and Closing checklists for both Front of House and Back of House. Every submission is automatically logged to a Google Sheet, photos are saved to Google Drive, and a branded email summary is sent to management.');
  h2('Key features');
  bullet('PIN-protected entry (PIN: 1981).');
  bullet('Google Sign-In — every submission is tied to a real Gmail address for accountability.');
  bullet('Date is locked to today only — staff cannot back-date or future-date a checklist.');
  bullet('Front of House + Back of House sections, separately for Opening and Closing.');
  bullet('Optional note next to every task.');
  bullet('Optional photo upload per task — taken on the spot from the phone camera.');
  bullet('Cannot submit unless every item is checked — warning shows which items are missing.');
  bullet('Review screen lets the staff member confirm everything before final submit.');
  bullet('Auto-logs to Google Sheets, uploads photos to Drive, and emails Info@sindbadburger.com.');

  // ===== 2. LIVE URLS =====
  h1('2.  Live URLs');
  p('Bookmark these. The first one is what your staff use every day.');
  tbl([
    ['Staff App (Live)', 'https://sindbadburger.github.io/sindbad-checklist'],
    ['GitHub Repo', 'https://github.com/sindbadburger/sindbad-checklist'],
    ['Google Sheet', 'Open https://sheets.google.com → "Sindbad Burger Checklists"'],
    ['Drive Folder (photos)', 'Open https://drive.google.com → "Sindbad Burger Checklist Photos"'],
    ['Apps Script', 'Open https://script.google.com → "Sindbad Burger Checklist"'],
    ['Email Inbox', 'Info@sindbadburger.com — every submission emails a branded summary here'],
  ]);

  // ===== 3. IMPORTANT IDS =====
  h1('3.  Important IDs (keep these private)');
  p('These IDs are stored inside the app code and the Apps Script. You normally do not need to touch them, but keep them somewhere safe in case you ever need to rebuild or migrate.');
  tbl([
    ['Google Sheet ID', '1oe9pX_7SgINxVBcw4qHsBT_kL2Q8wWDZ5DGySMoY7MQ'],
    ['Drive Folder ID', '1qMGzEgvp3d_Em7S5Md58nYVL0RdCuI_O'],
    ['OAuth Client ID', '315489164345-mft5dv5usasvvuc7mr9auht0uhj5mthr.apps.googleusercontent.com'],
    ['Apps Script Web URL', 'https://script.google.com/macros/s/AKfycbzpqWeo3PAMxsIp0ITHY8OsoSRkQClwR5SCVHy4Tvqa37FtgkDB1--e88C04Wqq6KrCfQ/exec'],
    ['Staff PIN', '1981'],
  ]);
  h2('Where each one is referenced');
  bullet('SHEET_URL & GOOGLE_CLIENT_ID — index.html (top of <script> block)');
  bullet('SHEET_ID, DRIVE_FOLDER_ID, EMAIL_TO — apps-script.gs (top constants)');
  bullet('PIN ("1981") — index.html (constant near top)');

  // ===== 4. FILES ON YOUR COMPUTER =====
  h1('4.  Files on Your Computer');
  p('Everything for the app lives in this folder:');
  const codePath = body.appendParagraph('C:\\Users\\Al Kinani\\Documents\\Sindbad Burger\\sindbad-checklist\\');
  codePath.editAsText().setFontFamily('Consolas').setForegroundColor('#7A5418');
  tbl([
    ['index.html', 'The app itself. One self-contained file.'],
    ['apps-script.gs', 'Backend code — paste into Apps Script editor when you edit.'],
    ['sindbad.jpg', 'Logo shown on every screen.'],
    ['README.md', 'Full technical documentation (developer-focused).'],
    ['Sindbad Burger Checklist App — Reference Doc.docx', 'Local Word version of this document.'],
  ]);

  // ===== 5. ROLLOUT =====
  h1('5.  How to Roll It Out to Staff');
  h2('On each phone or tablet');
  num('Open the app URL in the phone\'s browser: https://sindbadburger.github.io/sindbad-checklist');
  num('Tap the browser menu → "Add to Home Screen" (on iPhone: Share → Add to Home Screen; on Android: ⋮ → Add to Home Screen).');
  num('A Sindbad Burger icon appears on the home screen — staff can launch it like a real app.');
  h2('Training the first staff member');
  num('Pick one shift lead to test first.');
  num('Walk them through one complete Opening checklist (PIN → Sign in with Google → fill in name → tap Opening → check off every task → add a photo on at least one → Review & Submit).');
  num('Show them how the Sign Out button (top-right pill on the Name screen) switches accounts at end of shift.');
  num('Open the Google Sheet together so they see their submission appear.');
  h2('Daily routine for staff');
  bullet('Morning shift: tap the icon → PIN → Google Sign-In → fill name → tap Opening → walk through the kitchen and dining area checking items off as they are done → add notes/photos when something needs attention → Submit.');
  bullet('Evening shift: same flow but tap Closing instead of Opening.');
  bullet('Sunday morning shift: includes the weekly inventory checklist item — do not skip.');
  h2('Manager routine');
  bullet('Check the Google Sheet every morning to confirm last night\'s closing was submitted.');
  bullet('Scan email inbox for any photo attachments showing issues that need follow-up.');
  bullet('Use the Drive folder to review photos when a staff member flags something with a note.');

  // ===== 6. FUTURE UPGRADES =====
  h1('6.  Future Upgrade Ideas');
  p('These are features we can add anytime. None are required — the app works fully as-is.');
  h2('Easy wins (low effort, high value)');
  bullet('Multiple PINs per staff member — assign each person a unique PIN (e.g., 1234 = Ali, 5678 = Sara). The app auto-fills the Name field, so staff do not have to type their name every shift.');
  bullet('Sign Out reminder — auto-sign-out from Google after 8 hours so a tablet left on the counter does not stay signed in to one staff member forever.');
  bullet('Required-photo flag — mark certain tasks (e.g., "Scrub the flattop") so a photo is mandatory, not optional.');
  h2('Manager / reporting features');
  bullet('Daily reminder email — Apps Script pings the manager at, say, 11am and 10pm if no checklist has been submitted yet that day.');
  bullet('Weekly summary email — every Monday morning, auto-emails the manager last week\'s completion stats: who submitted what, average tasks complete, photos uploaded.');
  bullet('Manager dashboard — a second web page that reads the Sheet and shows the last 30 days of compliance at a glance (calendar heatmap, who skipped what).');
  bullet('Compliance score per staff member — track which staff complete checklists most reliably; surface a leaderboard.');
  h2('Tied to the broader Sindbad Burger platform');
  bullet('Connect to the existing Inventory Ordering app — if a closing checklist flags "low on shawarma," auto-add it to the next inventory order.');
  bullet('Temperature Log integration — same PIN/Sign-In, separate quick form for daily fridge/freezer temperatures.');
  bullet('Waste Log integration — same pattern for logging end-of-day food waste.');
  bullet('Staff Schedule app — show today\'s shift list on the Name screen so the right person is auto-selected.');

  // ===== 7. TROUBLESHOOTING =====
  h1('7.  Troubleshooting');
  h2('"Google Sign-In is not configured" yellow banner');
  p('The OAuth Client ID in index.html is missing or wrong. This should never happen now, but if it does:');
  bullet('Open index.html, find window.GOOGLE_CLIENT_ID at the top of the <script> block.');
  bullet('Make sure it is set to: 315489164345-mft5dv5usasvvuc7mr9auht0uhj5mthr.apps.googleusercontent.com');
  bullet('Commit and push the change. GitHub Pages redeploys in ~1 minute.');
  h2('Sign-In button does nothing / errors');
  bullet('Almost always: the URL the staff is using is not in the OAuth "Authorised JavaScript origins" list. Go to console.cloud.google.com → APIs & Services → Credentials → click the OAuth Client → add the URL.');
  bullet('Make sure they are using https://sindbadburger.github.io/sindbad-checklist (not opening the HTML file from email or anywhere else).');
  h2('Checklist submits but nothing appears in the Sheet');
  bullet('Open script.google.com → Sindbad Burger Checklist project → check SHEET_ID at top.');
  bullet('Confirm SHEET_ID matches the ID in section 3 above.');
  bullet('If you edited the script, redeploy: Deploy → Manage deployments → pencil icon → Version: New version → Deploy. (Same URL, new version — does not break the app.)');
  h2('Photos do not upload to Drive');
  bullet('Open the Apps Script project, click Run on any function — it will re-prompt for authorisation. Approve Drive scope.');
  bullet('Confirm DRIVE_FOLDER_ID matches the ID in section 3.');
  h2('Email never arrives');
  bullet('Check Spam folder once and mark "Not Spam" — after that Gmail learns it.');
  bullet('Gmail has a 100 email/day limit for Apps Script — way more than needed for a single restaurant.');
  h2('"Permission denied" when pushing to GitHub');
  bullet('Your computer is signed in as waelkinani but pushing to sindbadburger/sindbad-checklist. waelkinani was added as a collaborator, so this should work — but if it fails again, run: git config --global credential.helper manager, then push again.');
  h2('Date field shows the wrong day');
  bullet('The app uses the phone\'s system clock. If wrong, fix the phone\'s date/time settings — the app cannot override it.');

  // ===== 8. WHAT NEVER TO DO =====
  h1('8.  What Never to Do');
  bullet('Do not delete the Google Sheet or rename the "Checklists" tab — the Apps Script writes to it by name.');
  bullet('Do not delete the Drive folder — but you can move it inside another folder; the ID stays the same.');
  bullet('Do not change "Who has access" on the Apps Script deployment to anything except "Anyone." The app needs this to submit data.');
  bullet('Do not publish the OAuth Client ID anywhere except inside the app code (it is in the code already — that is normal and safe).');
  bullet('Do not edit apps-script.gs locally and forget to also paste the change into the Apps Script editor and redeploy — the local file is a backup, the deployed version is what actually runs.');

  // ===== 9. CHEAT SHEET =====
  h1('9.  Quick Reference Cheat Sheet');
  tbl([
    ['Staff PIN', '1981'],
    ['App URL', 'https://sindbadburger.github.io/sindbad-checklist'],
    ['Sheet name', 'Sindbad Burger Checklists  →  tab "Checklists"'],
    ['Drive folder name', 'Sindbad Burger Checklist Photos'],
    ['Email recipient', 'Info@sindbadburger.com'],
    ['Brand colors', 'Teal #097C87  •  Gold #C8922A  •  Turquoise #23CED9'],
    ['Fonts', 'Playfair Display (headings)  •  Inter (body)'],
  ]);

  const end = body.appendParagraph('— End of Document —');
  end.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  end.editAsText().setForegroundColor(HINT).setItalic(true);

  doc.saveAndClose();

  const url = doc.getUrl();
  Logger.log('============================================');
  Logger.log('✓ Google Doc created!');
  Logger.log('Open it: ' + url);
  Logger.log('It is in your Drive root — move it wherever you like.');
  Logger.log('============================================');

  // Also email it to yourself for easy access
  try {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: 'Sindbad Burger Checklist App — Reference Doc is ready',
      htmlBody: `
        <p>Your reference Google Doc is ready.</p>
        <p><a href="${url}" style="background:#097C87;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;">Open the Reference Doc</a></p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#666;">It was saved to your Drive root. Move it into a folder if you want — the link will still work.</p>
      `,
    });
  } catch (e) { /* ignore email errors */ }

  return url;
}
