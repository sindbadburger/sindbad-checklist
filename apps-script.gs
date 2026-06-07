/**
 * SINDBAD BURGER — DAILY CHECKLIST BACKEND
 * Google Apps Script web app
 *   - Logs each submission to a Google Sheet
 *   - Saves uploaded photos to a Google Drive folder
 *   - Emails a summary to Info@sindbadburger.com
 *
 * DEPLOYMENT
 *   1. Open https://script.google.com  → New project
 *   2. Paste this entire file in as Code.gs
 *   3. Set the constants below (SHEET_ID, DRIVE_FOLDER_ID, EMAIL_TO)
 *   4. Deploy → New deployment → Type: Web app
 *      - Execute as:  Me
 *      - Who has access:  Anyone
 *   5. Copy the Web App URL and paste into index.html → window.SHEET_URL
 */

// ====== CONFIG — fill these in ======
const SHEET_ID        = '1oe9pX_7SgINxVBcw4qHsBT_kL2Q8wWDZ5DGySMoY7MQ';
const SHEET_TAB       = 'Checklists';
const DRIVE_FOLDER_ID = '1qMGzEgvp3d_Em7S5Md58nYVL0RdCuI_O';
const EMAIL_TO        = 'Info@sindbadburger.com';
const BRAND_TEAL      = '#097C87';
const BRAND_GOLD      = '#C8922A';
// ====================================

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ts   = new Date();

    // ----- 1. Save photos to Drive -----
    const photoLinks = [];
    if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID !== 'PUT_YOUR_DRIVE_FOLDER_ID_HERE') {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      // create a sub-folder per submission so it's organised
      const subFolderName = `${body.date}_${body.shift}_${sanitize(body.name)}_${ts.getTime()}`;
      const subFolder = folder.createFolder(subFolderName);
      body.tasks.forEach((t, ti) => {
        (t.photos || []).forEach((p, pi) => {
          try {
            const meta = p.dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
            if (!meta) return;
            const blob = Utilities.newBlob(
              Utilities.base64Decode(meta[2]),
              meta[1],
              `task${t.idx}_${sanitize(t.section)}_${pi+1}.jpg`
            );
            const file = subFolder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            photoLinks.push({
              section: t.section,
              taskIdx: t.idx,
              label: t.label,
              url: file.getUrl(),
            });
          } catch (err) {
            // photo failed — keep going
          }
        });
      });
    }

    // ----- 2. Log to Sheet -----
    if (SHEET_ID && SHEET_ID !== 'PUT_YOUR_GOOGLE_SHEET_ID_HERE') {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      let sheet = ss.getSheetByName(SHEET_TAB);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_TAB);
        sheet.appendRow([
          'Timestamp', 'Name', 'Signed In As', 'Date', 'Shift',
          'Tasks Complete', 'All Notes', 'Photos',
        ]);
        sheet.getRange(1,1,1,8).setFontWeight('bold').setBackground(BRAND_TEAL).setFontColor('#ffffff');
      }
      const tasksComplete = body.tasks.every(t => t.checked)
        ? `YES — ${body.tasks.length} / ${body.tasks.length}`
        : `NO — ${body.tasks.filter(t=>t.checked).length} / ${body.tasks.length}`;
      const notesSummary = body.tasks
        .filter(t => (t.note||'').trim())
        .map(t => `[${t.section} #${t.idx}] ${t.label}: ${t.note}`)
        .join('\n') || '';
      const photoSummary = photoLinks.map(p => p.url).join('\n');
      sheet.appendRow([
        ts,
        body.name,
        body.googleEmail || '',
        body.date,
        body.shift === 'opening' ? 'Opening' : 'Closing',
        tasksComplete,
        notesSummary,
        photoSummary,
      ]);
    }

    // ----- 3. Email summary -----
    if (EMAIL_TO) {
      MailApp.sendEmail({
        to: EMAIL_TO,
        subject: `Sindbad Burger — ${capitalize(body.shift)} Checklist — ${body.name} — ${body.date}`,
        htmlBody: buildEmailHtml(body, photoLinks),
        body: buildEmailText(body, photoLinks), // plain-text fallback
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, photos: photoLinks.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Sindbad Burger Checklist webhook — POST only.');
}

/* ===== HTML EMAIL ===== */
function buildEmailHtml(body, photoLinks) {
  const shiftLabel = capitalize(body.shift);
  // group tasks by section
  const bySection = {};
  body.tasks.forEach(t => { (bySection[t.section] = bySection[t.section] || []).push(t); });

  let sectionsHtml = '';
  Object.keys(bySection).forEach(sec => {
    sectionsHtml += `
      <tr><td style="padding:14px 20px 6px;font-family:'Playfair Display',Georgia,serif;color:${BRAND_TEAL};font-size:16px;font-weight:700;border-bottom:2px solid #C8EEF0;">${escapeHtml(sec)}</td></tr>`;
    bySection[sec].forEach(t => {
      const check = t.checked ? '✓' : '✗';
      const colour = t.checked ? BRAND_GOLD : '#A32020';
      sectionsHtml += `
        <tr><td style="padding:6px 20px;font-family:Inter,Arial,sans-serif;font-size:13px;color:#0A1F20;border-bottom:1px solid #F0F8F8;">
          <span style="display:inline-block;width:18px;color:${colour};font-weight:700;">${check}</span>
          <strong>${t.idx}.</strong> ${escapeHtml(t.label)}
          ${t.note && t.note.trim() ? `<div style="margin:4px 0 0 26px;color:#3D7A80;font-style:italic;font-size:12px;">📝 ${escapeHtml(t.note)}</div>` : ''}
          ${t.photos && t.photos.length ? `<div style="margin:4px 0 0 26px;color:${BRAND_TEAL};font-size:11px;font-weight:600;">📷 ${t.photos.length} photo(s)</div>` : ''}
        </td></tr>`;
    });
  });

  const photosHtml = photoLinks.length ? `
    <tr><td style="padding:14px 20px 6px;font-family:'Playfair Display',Georgia,serif;color:${BRAND_TEAL};font-size:16px;font-weight:700;border-bottom:2px solid #C8EEF0;">Uploaded Photos</td></tr>
    <tr><td style="padding:10px 20px;font-family:Inter,Arial,sans-serif;font-size:12px;color:#0A1F20;">
      ${photoLinks.map(p => `<div style="margin-bottom:4px;"><a href="${p.url}" style="color:${BRAND_TEAL};">Task ${p.taskIdx} (${escapeHtml(p.section)}) — view photo</a></div>`).join('')}
    </td></tr>` : '';

  const allDone = body.tasks.every(t => t.checked);
  const statusBadge = allDone
    ? `<span style="background:${BRAND_GOLD};color:#fff;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:700;">ALL ${body.tasks.length} TASKS COMPLETE</span>`
    : `<span style="background:#A32020;color:#fff;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:700;">INCOMPLETE</span>`;

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4FEFE;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #C8EEF0;">
        <tr><td style="background:${BRAND_TEAL};padding:22px;text-align:center;">
          <div style="font-family:'Playfair Display',Georgia,serif;color:#fff;font-size:22px;font-weight:700;">Sindbad Burger</div>
          <div style="font-family:Inter,Arial,sans-serif;color:#B2EEF2;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;margin-top:4px;">${shiftLabel} Checklist</div>
        </td></tr>
        <tr><td style="padding:18px 20px;background:#EBF9FA;">
          <table width="100%" style="font-family:Inter,Arial,sans-serif;font-size:13px;color:#0A1F20;">
            <tr><td style="padding:3px 0;color:#3D7A80;font-weight:600;width:110px;">Staff</td><td style="font-weight:700;">${escapeHtml(body.name)}</td></tr>
            ${body.googleEmail ? `<tr><td style="padding:3px 0;color:#3D7A80;font-weight:600;">Signed in as</td><td style="font-weight:700;">${escapeHtml(body.googleEmail)}</td></tr>` : ''}
            <tr><td style="padding:3px 0;color:#3D7A80;font-weight:600;">Date</td><td style="font-weight:700;">${escapeHtml(body.date)}</td></tr>
            <tr><td style="padding:3px 0;color:#3D7A80;font-weight:600;">Shift</td><td style="font-weight:700;">${shiftLabel}</td></tr>
            <tr><td style="padding:8px 0 0;" colspan="2">${statusBadge}</td></tr>
          </table>
        </td></tr>
        ${sectionsHtml}
        ${photosHtml}
        <tr><td style="padding:16px 20px;background:#F4FEFE;font-family:Inter,Arial,sans-serif;font-size:11px;color:#7ABFC4;text-align:center;">
          Submitted ${new Date().toLocaleString()} — Sindbad Burger Daily Checklist
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}

/* ===== PLAIN TEXT FALLBACK ===== */
function buildEmailText(body, photoLinks) {
  let out = `SINDBAD BURGER — ${capitalize(body.shift)} CHECKLIST\n`;
  out += `Staff: ${body.name}\n`;
  if (body.googleEmail) out += `Signed in as: ${body.googleEmail}\n`;
  out += `Date: ${body.date}\n\n`;
  const bySection = {};
  body.tasks.forEach(t => { (bySection[t.section] = bySection[t.section] || []).push(t); });
  Object.keys(bySection).forEach(sec => {
    out += `--- ${sec} ---\n`;
    bySection[sec].forEach(t => {
      out += `[${t.checked?'X':' '}] ${t.idx}. ${t.label}`;
      if (t.note && t.note.trim()) out += `\n     Note: ${t.note}`;
      if (t.photos && t.photos.length) out += `\n     ${t.photos.length} photo(s)`;
      out += '\n';
    });
    out += '\n';
  });
  if (photoLinks.length) {
    out += '--- Photo Links ---\n';
    photoLinks.forEach(p => out += `Task ${p.taskIdx} (${p.section}): ${p.url}\n`);
  }
  return out;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
function sanitize(s) {
  return String(s || '').replace(/[^a-z0-9_-]+/gi, '_').slice(0, 40);
}
function capitalize(s) {
  return String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
}
