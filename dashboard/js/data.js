import { _IMG } from './images.js';

/**
 * @typedef {Object} ProcessLinks
 * @property {1=} fms
 * @property {1=} form
 * @property {1=} sheet
 * @property {1=} check
 * @property {1=} video
 * @property {1=} videoBCI
 * @property {1=} dashEmp
 * @property {1=} dashPC
 * @property {1=} admin
 * @property {1=} gpDash
 * @property {1=} stockDash
 * @property {1=} folder
 * @property {1=} aiqa
 */

/**
 * @typedef {Object} Process
 * @property {string} cat
 * @property {string} name
 * @property {string} pc
 * @property {string} solver
 * @property {string} exec
 * @property {ProcessLinks} links
 * @property {string=} group
 */

/** @type {Process[]} */
export const DB = [
  // -------- SALES --------
  {cat:"Dispatch",name:"Order to Delivery FMS",pc:"Ms. Preksha",solver:"Mukesh",exec:"Khushi",links:{fms:1,form:1,videoBCI:1,aiqa:1}},
  {cat:"Dispatch",name:"O2D Direct Dispatch FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Khushi",links:{fms:1,aiqa:1}},
  {cat:"Sales",name:"Ruchira 100 Best Customer",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Sales Team",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Follow Up Calls",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Next Day Market Plan",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Rishabh / Pawan",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"Next Week Marketing Plan",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Sale's Team",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"Customer Visit",pc:"Neha",solver:"Neha / Pranav",exec:"Sonu, Pawan, Rishabh",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"Enquiry Capture FY 2026-27",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Neha",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"CRM Payment FMS",pc:"Ms. Preksha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Pooja",links:{fms:1,aiqa:1}},
  {cat:"Sales",name:"Price List",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Stock Dashboard",pc:"Ms. Preksha",solver:"Ravi",exec:"All Sales",links:{stockDash:1,aiqa:1}},
  {cat:"Sales",name:"Mr. Mukesh Debtors List",pc:"Ms. Preksha",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Mr. Pranav Satija Debtors List",pc:"Ms. Preksha",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},

  // -------- SALES → DOUBLE A FOLDER --------
  {cat:"Sales",group:"Double A",name:"Double A Advance Container Booking Form",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Rishabh",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",group:"Double A",name:"Double A New Distributor Form",pc:"Mr. Mukesh",solver:"Mr. Pranav/Ms. Neha",exec:"Mr. Rishabh",links:{form:1,sheet:1,aiqa:1,terms:1,drive:1,guidelineForm:1}},
  {cat:"Sales",group:"Double A",name:"Double A District Distributor",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{folder:1}},
  {cat:"Sales",group:"Double A",name:"Double A Dealer",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{folder:1}},
  {cat:"Sales",group:"Double A",name:"Double A CME Folder",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{folder:1}},
  {cat:"Sales",group:"Double A",name:"Double A CME Payment FMS FY 2026-27",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Mukesh/Ms. Preksha",links:{fms:1,form:1,aiqa:1}},

  // -------- PURCHASE --------
  {cat:"Purchase",name:"Purchase FMS",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{fms:1,form:1,video:1,videoBCI:1}},
  {cat:"Purchase",name:"IMS (Inventory System)",pc:"Ms. Neha",solver:"Mukesh / Pranav",exec:"Khushi",links:{form:1,sheet:1,video:1}},
  {cat:"Purchase",name:"WMS",pc:"Ms. Neha",solver:"Mr. Mukesh",exec:"Ms. Preksha/Ms. Khushi",links:{form:1,sheet:1}},
  {cat:"Purchase",name:"Stock Transfer FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Pooja",links:{fms:1,form:1}},

  // -------- MANAGEMENT --------
  {cat:"Management",name:"Ultimate Checklist",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{check:1,video:1,dashEmp:1,dashPC:1}},
  {cat:"Management",name:"Delegation Sheet",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{form:1,sheet:1,video:1}},
  {cat:"Management",name:"To Do (MIS)",pc:"Ms. Neha",solver:"Khushi / Pranav",exec:"Neha / Khushi",links:{form:1,sheet:1}},
  {cat:"Management",name:"To Do (EA)",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha / Pranav",links:{form:1,sheet:1}},
  {cat:"Management",name:"MIS Score",pc:"Ms. Neha",solver:"Ms. Khushi",exec:"Ms. Neha/Ms. Khushi",links:{sheet:1}},
  {cat:"Management",name:"Dashboard of All FMS",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team Members",links:{dashEmp:1,dashPC:1}},
  {cat:"Management",name:"FMS OF FMS",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{sheet:1,form:1}},
  {cat:"Management",name:"Home Loan FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Neha/Ms. Preksha",links:{fms:1,form:1}},
  {cat:"Management",name:"eMail & Password Sheet",pc:"MDO",solver:"Ms. Khushi",exec:"Ms. Khushi",links:{sheet:1}},
  {cat:"Management",name:"SCT-FMS",pc:"Ms. Preksha",solver:"Neha / Pranav",exec:"Khushi",links:{form:1,sheet:1}},
  {cat:"Management",name:"Repair & Maintenance System",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"Ms. Khushi",links:{sheet:1,form:1}},

  // -------- SUPPORT --------
  {cat:"Support",name:"Help Ticket",pc:"Ms. Preksha",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},

  // -------- MY SYSTEM --------
  {cat:"My System",name:"Google Site",pc:"Ms. Preksha",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},

  // -------- HR --------
  {cat:"HR",name:"Office Chores Form",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Rashmi",links:{form:1,sheet:1}},
  {cat:"HR",name:"Attendances Sheet",pc:"Neha / Preksha",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1,admin:1}},
  {cat:"HR",name:"Sales Meeting Attendances Sheet",pc:"Neha / Preksha",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1}},
  {cat:"HR",name:"Courier FMS",pc:"Neha",solver:"Neha / Pranav",exec:"Indresh",links:{sheet:1,form:1}},

  // -------- FINANCE --------
  {cat:"Finance",name:"Petrol/Rider Form",pc:"Neha / Mukesh",solver:"Neha / Pranav",exec:"Sonu, Pawan...",links:{form:1,sheet:1}},
  {cat:"Finance",name:"Cheque Payment",pc:"Neha / Mukesh",solver:"Mukesh",exec:"Indresh",links:{sheet:1,form:1}},
  {cat:"Finance",name:"Company Payment",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Mr. Sandeep/Ms. Neha",links:{fms:1,form:1}},
  {cat:"Finance",name:"GP Sheet",pc:"Ms. Neha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Khushi",links:{sheet:1,gpDash:1}},
  {cat:"Finance",name:"Sales Marketing Daily Expense",pc:"Ms. Preksha",solver:"Ms. Neha",exec:"Sale's Team",links:{form:1,sheet:1}},
  {cat:"Finance",name:"Account Checklist",pc:"Ms. Preksha",solver:"Mr. Pranav",exec:"Ms. Khushi",links:{sheet:1}},

  // -------- FAMILY / DOCUMENTS --------
  {cat:"Documents",name:"Satija Paper Documents",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team",links:{folder:1}},
  {cat:"Documents",name:"SP Team Members Documents",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team",links:{folder:1}}
];

export const LINK_META = {
  fms:       {label:'FMS',            icon:'fas fa-table-cells',      cls:'btn-fms'},
  form:      {label:'Form',           icon:'fab fa-google-drive',     cls:'btn-form'},
  sheet:     {label:'Sheet',          icon:'fas fa-file-spreadsheet', cls:'btn-sheet'},
  check:     {label:'Checklist',      icon:'fas fa-square-check',     cls:'btn-check'},
  video:     {label:'Training',       icon:'fas fa-circle-play',      cls:'btn-video'},
  videoBCI:  {label:'Training (BCI)', icon:'fas fa-circle-play',      cls:'btn-video'},
  dashEmp:   {label:'Emp Dashboard',  icon:'fas fa-chart-pie',        cls:'btn-dash'},
  dashPC:    {label:'PC Dashboard',   icon:'fas fa-chart-line',       cls:'btn-dash'},
  admin:     {label:'Admin Panel',    icon:'fas fa-user-gear',        cls:'btn-admin'},
  gpDash:    {label:'GP Dashboard',   icon:'fas fa-chart-column',     cls:'btn-gp'},
  stockDash: {label:'Stock Dashboard',icon:'fas fa-boxes-stacking',   cls:'btn-stock'},
  folder:    {label:'View Folder',    icon:'fas fa-folder-open',      cls:'btn-folder'}, // ← Used for documents dynamic labels
  terms:     {label:'T&C',            icon:'fas fa-file-contract',    cls:'btn-form'},
  drive:     {label:'Drive',          icon:'fab fa-google-drive',     cls:'btn-form'},
  guidelineForm:{label:'Guideline Form',  icon:'fas fa-clipboard-list',   cls:'btn-form'},
  aiqa:      {label:'AI Q&A',         icon:'fas fa-robot',            cls:'btn-aiqa',
              url:'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center'}
};

export const NAV_TABS = [
  {cat:'All',        nav:'navAll',        cnt:'cntAll'},
  {cat:'Sales',      nav:'navSales',      cnt:'cntSales'},
  {cat:'Dispatch',   nav:'navDispatch',   cnt:'cntDispatch'},
  {cat:'Purchase',   nav:'navPurchase',   cnt:'cntPurchase'},
  {cat:'Management', nav:'navManagement', cnt:'cntManagement'},
  {cat:'HR',         nav:'navHR',         cnt:'cntHR'},
  {cat:'Finance',    nav:'navFinance',    cnt:'cntFinance'},
  {cat:'Support',    nav:'navSupport',    cnt:'cntSupport'},
  {cat:'My System',  nav:'navMy',         cnt:'cntMy'},
  {cat:'Documents',  nav:'navFamily',     cnt:'cntFamily'},
  {cat:'Products',   nav:'navProducts',   cnt:'cntProducts'}
];

export const PRODUCTS = [ /* Kept intact from your config */ ];
