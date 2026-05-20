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
 * @property {1=} aiqa     AI Q&A ChatGPT link
 */

/**
 * @typedef {Object} Process
 * @property {string} cat
 * @property {string} name
 * @property {string} pc      Person In Charge
 * @property {string} solver  Process solver
 * @property {string} exec    Executive who runs it
 * @property {ProcessLinks} links
 * @property {string=} group  Optional sub-group within category (e.g. "Double A")
 */

/** @type {Process[]} */
export const DB = [
  // -------- SALES --------
  {cat:"Sales",name:"Order to Delivery FMS",pc:"Ms. Preksha",solver:"Mukesh",exec:"Khushi",links:{fms:1,form:1,videoBCI:1,aiqa:1}},
  {cat:"Sales",name:"O2D Direct Dispatch FMS",pc:"Ms. Preksha",solver:"Mr. Mukesh",exec:"Khushi",links:{fms:1,aiqa:1}},
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
  {cat:"Sales",group:"Double A",name:"Double A New Distributor Checklist",pc:"Mr. Mukesh",solver:"Mr. Pranav/Ms. Neha",exec:"Mr. Rishabh",links:{form:1,sheet:1,aiqa:1}},
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

  // -------- FAMILY --------
  {cat:"Family",name:"Satija Family Documents",pc:"Ms. Neha",solver:"Ms. Mukesh",exec:"Ms. Khushi",links:{folder:1}}
];

/**
 * Visual metadata for each link type.
 * Used by both the process cards and the access-modal proc list.
 */
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
  folder:    {label:'View Folder',    icon:'fas fa-folder-open',      cls:'btn-folder'},
  aiqa:      {label:'AI Q&A',         icon:'fas fa-robot',            cls:'btn-aiqa',
               url:'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center'}
};

/** Sidebar navigation tabs config. Drives counts + visibility. */
export const NAV_TABS = [
  {cat:'All',        nav:'navAll',        cnt:'cntAll'},
  {cat:'Sales',      nav:'navSales',      cnt:'cntSales'},
  {cat:'Purchase',   nav:'navPurchase',   cnt:'cntPurchase'},
  {cat:'Management', nav:'navManagement', cnt:'cntManagement'},
  {cat:'HR',         nav:'navHR',         cnt:'cntHR'},
  {cat:'Finance',    nav:'navFinance',    cnt:'cntFinance'},
  {cat:'Support',    nav:'navSupport',    cnt:'cntSupport'},
  {cat:'My System',  nav:'navMy',         cnt:'cntMy'},
  {cat:'Family',     nav:'navFamily',     cnt:'cntFamily'},
  {cat:'Products',   nav:'navProducts',   cnt:'cntProducts'}
];

/**
 * Product catalogue – all brands from satijapaper.com
 * Used by the Products page view.
 */
export const PRODUCTS = [
  {
    id: 'doublea',
    name: 'Double A',
    origin: 'Thailand',
    tagline: 'Premium 30M fibres/gram copier. Jam-free, CIE 167 whiteness.',
    img: 'https://satijapaper.com/doublea.jpg',
    cert: ['FSC Certified','ISO 9001','CIE 167'],
    variants: [
      {name:'Double A 70 GSM', gsm:70, sizes:['A4','A3','A11'], brightness:'102% ISO', cie:'148', opacity:'93%', bestFor:'Forms, memos, daily printing'},
      {name:'Double A 75 GSM', gsm:75, sizes:['A4','A3','A11'], brightness:'103% ISO', cie:'152', opacity:'94%', bestFor:'Reports, official documents'},
      {name:'Double A 80 GSM (Premium)', gsm:80, sizes:['A4','A3','A11'], brightness:'104% ISO', cie:'167', thickness:'110 µm', bestFor:'Presentations, letterheads'},
      {name:'Double A 100 GSM', gsm:100, sizes:['A4','A3'], brightness:'104% ISO', cie:'167', opacity:'97%', bestFor:'Charts, proposals, premium reports'}
    ],
    productImg: {
      70:  'https://satijapaper.com/DA 70.jpg',
      75:  'https://satijapaper.com/DA75.jpeg',
      80:  'https://satijapaper.com/doublea.jpg',
      100: 'https://satijapaper.com/DA100.jpeg'
    }
  },
  {
    id: 'nra',
    name: 'NR Agarwal',
    fullName: 'NR Agarwal Industries – Brilliance Copier',
    origin: 'Gujarat, India',
    tagline: '100% de-inked recycled fibre with VOITH German de-inking technology.',
    img: 'https://satijapaper.com/nra.jpg',
    cert: ['VOITH German Tech','ISO 9001','354K TPA Capacity'],
    variants: [
      {name:'Brilliance 70 GSM', gsm:70, sizes:['A4','A3'], brightness:'90% ISO', sheets:500, bestFor:'Daily office, drafts'},
      {name:'Brilliance 75 GSM', gsm:75, sizes:['A4','A3'], brightness:'92% ISO', sheets:500, bestFor:'Reports, presentations'},
      {name:'Brilliance 80 GSM', gsm:80, sizes:['A4','A3'], brightness:'94% ISO', sheets:500, bestFor:'Contracts, letterheads'}
    ]
  },
  {
    id: 'satia',
    name: 'Satia Industries',
    fullName: 'Satia Industries – Superb Copier',
    origin: 'Punjab, India',
    tagline: 'Eco-friendly from agricultural residues. ECF bleached. ISI & FSC certified.',
    img: 'https://satijapaper.com/satia.jpg',
    cert: ['ECF Bleached','ISI BIS Certified','FSC Certified'],
    variants: [
      {name:'Satia 65 GSM', gsm:65, sizes:['A4','FS'], brightness:'86–88% ISO', bestFor:'Bulk, draft printing'},
      {name:'Satia 70 GSM', gsm:70, sizes:['A4','A3','FS'], brightness:'88–90% ISO', bestFor:'High-volume printing'},
      {name:'Satia 75 GSM', gsm:75, sizes:['A4','A3','FS'], brightness:'88–90% ISO', bestFor:'Reports, stationery'},
      {name:'Satia 80 GSM', gsm:80, sizes:['A4','A3','FS'], brightness:'90–92% ISO', bestFor:'Premium office use'}
    ]
  },
  {
    id: 'khanna',
    name: 'Khanna Paper',
    fullName: 'Khanna Paper Mills – Hi-Bright Copier',
    origin: 'India',
    tagline: 'Hi-bright copier range with strong opacity. Established 1985.',
    img: 'https://satijapaper.com/khanna.jpg',
    cert: ['ISO 9001','Hi-Bright Range','Since 1985'],
    variants: [
      {name:'Khanna 70 GSM', gsm:70, sizes:['A4','A3'], brightness:'90% ISO', bestFor:'Daily office printing'},
      {name:'Khanna 75 GSM', gsm:75, sizes:['A4','A3'], brightness:'92% ISO', bestFor:'Reports, business docs'},
      {name:'Khanna 80 GSM', gsm:80, sizes:['A4','A3'], brightness:'94% ISO', bestFor:'Presentations, contracts'}
    ]
  },
  {
    id: 'ruchira',
    name: 'Ruchira Papers',
    fullName: 'Ruchira Papers – 100% Tree-Free',
    origin: 'India',
    tagline: '100% tree-free sustainable paper. Eco-friendly production.',
    img: 'https://satijapaper.com/ruchira.jpg',
    cert: ['Tree-Free','Eco-Friendly','ISO 9001'],
    variants: [
      {name:'Ruchira 70 GSM', gsm:70, sizes:['A4','A3'], brightness:'90% ISO', bestFor:'Daily office, forms'},
      {name:'Ruchira 75 GSM', gsm:75, sizes:['A4','A3'], brightness:'92% ISO', bestFor:'Reports, documents'},
      {name:'Ruchira 80 GSM', gsm:80, sizes:['A4','A3'], brightness:'94% ISO', bestFor:'Presentations, letterheads'}
    ]
  },
  {
    id: 'andhra',
    name: 'Andhra Paper',
    fullName: 'Andhra Paper Limited – Reflection Series',
    origin: 'Andhra Pradesh, India',
    tagline: 'Reflection series with ECF technology. Low-lint, smooth surface.',
    img: 'https://satijapaper.com/andhra.jpg',
    cert: ['ECF Technology','ISO 9001','Low-Lint'],
    variants: [
      {name:'Andhra 70 GSM', gsm:70, sizes:['A4','A3'], brightness:'90% ISO', bestFor:'Daily office printing'},
      {name:'Andhra 75 GSM', gsm:75, sizes:['A4','A3'], brightness:'92% ISO', bestFor:'Reports, official docs'},
      {name:'Andhra 80 GSM', gsm:80, sizes:['A4','A3'], brightness:'94% ISO', bestFor:'Premium presentations'}
    ]
  }
];
