/* =========================================================
   GLOBAL CONSTANTS
   ========================================================= */

const MAIN = "MAIN_LOG";
const VENDOR = "MASTER_VENDOR";
const PART = "MASTER_PART";


/* =========================================================
   WEB APP ENTRY POINT
   ========================================================= */

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("EDI / PO Tracking");
}


/* =========================================================
   FETCH VENDORS FROM MASTER SHEET
   ========================================================= */

function getVendors() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(VENDOR);

  return sh
    .getRange(2, 1, sh.getLastRow() - 1, 1)
    .getValues()
    .flat()
    .filter(String);
}


/* =========================================================
   FETCH PART NUMBERS FROM MASTER SHEET
   ========================================================= */

function getParts() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(PART);

  return sh
    .getRange(2, 1, sh.getLastRow() - 1, 1)
    .getValues()
    .flat()
    .filter(String);
}


/* =========================================================
   SAVE LOG DC ENTRY
   ========================================================= */

function saveEntry(data) {

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {

    const sh = SpreadsheetApp
      .getActive()
      .getSheetByName(MAIN);

    const sr = sh.getLastRow();

    const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    sh.appendRow([
      sr,
      today,
      data.plant,
      data.type,
      data.vendor,
      data.type=="Without EDI" ? data.dc : "",   
      data.type=="Inward DC" ? data.dc : "",     
      "",                                        
      "",                                        
      data.part,
      data.qty,
      data.dock,
      "Pending",
      "",             
      data.remark,
      ""              
    ]);

    return { status: true };

  }
  catch (err) {

    return { status: false, msg: err.message };

  }
  finally {

    lock.releaseLock();

  }

}


/* =========================================================
   FETCH OPEN DC LIST
   ========================================================= */

function getOpenDC() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(MAIN);

  const data = sh.getDataRange().getValues();

  let arr = [];

  for (let i = 1; i < data.length; i++) {

    if (data[i][12] == "Pending") {

      if (data[i][3] == "Without EDI") {
        arr.push(data[i][5] + " | " + data[i][4]);   // Vendor Invoice
      } else {
        arr.push(data[i][6] + " | " + data[i][4]);   // DC No
      }

    }

  }

  return arr;
}


/* =========================================================
   CLOSE DC ENTRY
   ========================================================= */

function closeDC(data) {

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {

    const sh = SpreadsheetApp
      .getActive()
      .getSheetByName(MAIN);

    const rows = sh.getDataRange().getValues();

    let found = false;

    for (let i = 1; i < rows.length; i++) {

      if (
        (
          (data.type=="Without EDI" && String(rows[i][5]).trim()==String(data.dc).trim()) ||
          (data.type=="Inward DC" && String(rows[i][6]).trim()==String(data.dc).trim())
        ) &&
        (data.vendor=="" || rows[i][4]==data.vendor) &&
        rows[i][3] == data.type
      ) {

        /* Write EDI or Invoice depending on type */

        if (data.type == "Without EDI") {
          sh.getRange(i + 1, 8).setValue(data.edi);
        }

        if (data.type == "Inward DC") {
          sh.getRange(i + 1, 9).setValue(data.invoice);
        }

        /* Mark as completed */

        sh.getRange(i + 1, 13).setValue("Completed");

        /* Calculate aging duration */

        const start = rows[i][1];
        const end = new Date();

        const diff = (end - new Date(start)) / (1000 * 60 * 60 * 24);

        sh.getRange(i + 1, 16).setValue(diff);

        /* Set closed date */

        sh.getRange(i + 1, 14).setValue(
          Utilities.formatDate(
            new Date(),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          )
        );

        found = true;
        break;

      }

    }

    if (found) {
      return { status: true };
    }
    else {
      return { status: false, msg: "Record not found" };
    }

  }
  catch (err) {

    return { status: false, msg: err.message };
  }
  finally {
    lock.releaseLock();

  }

}
