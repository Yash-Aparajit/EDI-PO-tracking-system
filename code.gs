const MAIN = "MAIN_LOG";
const VENDOR = "MASTER_VENDOR";
const PART = "MASTER_PART";

/* WEB APP */

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("EDI / PO Tracking");
}

/* FETCH VENDORS */

function getVendors(){

const sh = SpreadsheetApp.getActive().getSheetByName(VENDOR);

return sh.getRange(2,1,sh.getLastRow()-1,1)
.getValues()
.flat()
.filter(String);

}

/* FETCH PARTS */

function getParts(){

const sh = SpreadsheetApp.getActive().getSheetByName(PART);

return sh.getRange(2,1,sh.getLastRow()-1,1)
.getValues()
.flat()
.filter(String);

}

/* SAVE ENTRY */

function saveEntry(data){

const lock = LockService.getScriptLock();
lock.waitLock(20000);

try{

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN);

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
data.dc,
"",
data.part,
data.qty,
data.dock,
"Pending",
"",
data.remark
]);


return {status:true};

}

catch(err){

return {status:false,msg:err.message};

}

finally{

lock.releaseLock();

}

}

/* GET OPEN DC */

function getOpenDC(){

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN);

const data = sh.getDataRange().getValues();

let arr=[];

for(let i=1;i<data.length;i++){

if(data[i][9]=="Pending"){

arr.push(data[i][4]);

}

}

return arr;

}

/* CLOSE DC */

function closeDC(data){

const lock = LockService.getScriptLock();
lock.waitLock(20000);

try{

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN);

const rows = sh.getDataRange().getValues();

for(let i=1;i<rows.length;i++){

if(rows[i][4]==data.dc){

if(data.type=="Without EDI"){
sh.getRange(i+1,6).setValue(data.edi);
}

if(data.type=="Inward DC"){
sh.getRange(i+1,14).setValue(data.invoice);
}


sh.getRange(i+1,10).setValue("Completed");

const start = rows[i][1];
const end = new Date();

const diff = (end - new Date(start)) / 86400000;

sh.getRange(i+1,13).setValue(diff);

sh.getRange(i+1,11).setValue(
Utilities.formatDate(new Date(),
Session.getScriptTimeZone(),
"dd/MM/yyyy")
);

break;

}

}

return {status:true};

}

catch(err){

return {status:false,msg:err.message};

}

finally{

lock.releaseLock();

}

}
