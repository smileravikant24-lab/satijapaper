import { _IMG } from './images.js';
export const DB = [
  // -------- SALES --------
  {cat:"Dispatch",name:"Order to Delivery FMS",pc:"Ms. Richa",solver:"Mukesh",exec:"Khushi",links:{fms:1,form:1,videoBCI:1,videoAI:1,aiqa:1}},
  {cat:"Dispatch",name:"O2D Direct Dispatch FMS",pc:"Ms. Richa",solver:"Mr. Mukesh",exec:"Khushi",links:{fms:1,aiqa:1}},
  {cat:"Dispatch",name:"Sale Report",pc:"Ms. Richa",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Pooja",links:{sheet:1}},
  {cat:"Sales",name:"Ruchira 100 Best Customer",pc:"Ms. Richa",solver:"Mr. Pranav/Mr. Mukesh",exec:"Sales Team",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Follow Up Calls",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Next Week/ Day Marketing Plan",pc:"Ms. Richa",solver:"Mr. Pranav/Mr. Mukesh",exec:"Sale's Team",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"New Customer Visit",pc:"Neha",solver:"Neha / Pranav",exec:"Sonu, Pawan, Rishabh",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"Enquiry Capture FY 2026-27",pc:"Ms. Richa",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Neha",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",name:"CRM Payment FMS",pc:"Ms. Richa",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Pooja",links:{fms:1,aiqa:1}},
  {cat:"Sales",name:"Price List",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Scot Sheet",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Stock Dashboard",pc:"Ms. Richa",solver:"Ravi",exec:"All Sales",links:{stockDash:1,aiqa:1}},
  {cat:"Sales",name:"Mr. Mukesh Debtors List",pc:"Ms. Richa",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"Mr. Pranav Satija Debtors List",pc:"Ms. Richa",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},
  {cat:"Sales",name:"All Party Name",pc:"Ms. Richa",solver:"Ravi",exec:"Mr. Mukesh",links:{sheet:1,aiqa:1}},

  // -------- SALES → DOUBLE A FOLDER --------
  {cat:"Sales",group:"Double A",name:"Double A Advance Container Booking Form",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Rishabh",links:{form:1,sheet:1,aiqa:1}},
  {cat:"Sales",group:"Double A",name:"Double A New Distributor Form",pc:"Mr. Mukesh",solver:"Mr. Pranav/Ms. Neha",exec:"Mr. Rishabh",links:{form:1,sheet:1,aiqa:1,terms:1,guidelineForm:1}},
  {cat:"Sales",group:"Double A",name:"Double A District Distributor",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1}},
  {cat:"Sales",group:"Double A",name:"Double A CME Payment FMS FY 2026-27",pc:"Ms. Richa",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Mukesh/Ms. Richa",links:{fms:1,form:1,aiqa:1}},
  {cat:"Sales",group:"Double A",name:"Double A Dealer",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{sheet:1}},
  {cat:"Sales",group:"Double A",name:"Double A CME Folder",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{folder:1}},
  {cat:"Sales",group:"Double A",name:"Double A Retail Customer",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Rishabh",links:{sheet:1,guidelineForm:1}},
  {cat:"Sales",group:"Double A",name:"Double A Corporate Customer",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Rishabh",links:{sheet:1}},
  {cat:"Sales",group:"Double A",name:"Double A Display Links",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Mukesh",links:{folder:1}},
  // -------- PURCHASE --------
  {cat:"Purchase",name:"Purchase FMS",pc:"Ms. Richa",solver:"Neha / Pranav",exec:"Khushi",links:{fms:1,form:1,video:1,videoBCI:1}},
  {cat:"Purchase",name:"IMS (Inventory System)",pc:"Ms. Neha",solver:"Mukesh / Pranav",exec:"Khushi",links:{form:1,sheet:1,video:1}},
  {cat:"Purchase",name:"WMS",pc:"Ms. Neha",solver:"Mr. Mukesh",exec:"Ms. Richa/Ms. Khushi",links:{form:1,sheet:1}},
  {cat:"Purchase",name:"Godown Stock Report",pc:"Ms. Neha",solver:"Mr. Mukesh",exec:"Ms. Richa/Ms. Khushi",links:{form:1,sheet:1}},
  {cat:"Purchase",name:"Godown Inward Report",pc:"Ms. Neha",solver:"Mr. Mukesh",exec:"Ms. Richa/Ms. Khushi",links:{sheet:1}},
  {cat:"Purchase",name:"Stock Transfer FMS",pc:"Ms. Richa",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Pooja",links:{fms:1,form:1}},

  // -------- MANAGEMENT --------
  {cat:"Management",name:"Ultimate Checklist",pc:"Ms. Richa",solver:"Neha / Pranav",exec:"Khushi",links:{check:1,video:1,dashEmp:1,dashPC:1}},
  {cat:"Management",name:"Delegation Sheet",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha",links:{form:1,sheet:1,video:1}},
  {cat:"Management",name:"To Do (MIS)",pc:"Ms. Neha",solver:"Khushi / Pranav",exec:"Neha / Khushi",links:{form:1,sheet:1}},
  {cat:"Management",name:"To Do (EA)",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Neha / Pranav",links:{form:1,sheet:1}},
  {cat:"Management",name:"MIS Score",pc:"Ms. Neha",solver:"Ms. Khushi",exec:"Ms. Neha/Ms. Khushi",links:{sheet:1}},
  {cat:"Management",name:"Dashboard of All FMS",pc:"Ms. Richa",solver:"Ms. Khushi",exec:"All Team Members",links:{dashEmp:1,dashPC:1,sheet:1}},
  {cat:"Management",name:"FMS OF FMS",pc:"Ms. Richa",solver:"Neha / Pranav",exec:"Khushi",links:{sheet:1,form:1}},
  {cat:"Management",name:"Home Loan FMS",pc:"Ms. Richa",solver:"Mr. Mukesh",exec:"Mr. Indresh/Sandeep/Ms. Neha/Ms. Richa",links:{fms:1,form:1}},
  {cat:"Management",name:"eMail & Password Sheet",pc:"MDO",solver:"Ms. Khushi",exec:"Ms. Khushi",links:{sheet:1}},
  {cat:"Management",name:"SCT-FMS",pc:"Ms. Richa",solver:"Neha / Pranav",exec:"Khushi",links:{form:1,sheet:1}},
  {cat:"Management",name:"Repair & Maintenance System",pc:"Ms. Richa",solver:"Ms. Khushi",exec:"Ms. Khushi",links:{sheet:1,form:1}},

  // -------- SUPPORT --------
  {cat:"Support",name:"Help Ticket",pc:"Ms. Richa",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},

  // -------- MY SYSTEM --------
  {cat:"My System",name:"Google Site",pc:"Ms. Richa",solver:"Khushi/Ravi",exec:"Ravi",links:{form:1,sheet:1}},

  // -------- HR --------
  {cat:"HR",name:"Office Chores Form",pc:"Ms. Neha",solver:"Neha / Pranav",exec:"Rashmi",links:{form:1,sheet:1}},
  {cat:"HR",name:"Attendances Sheet",pc:"Neha / Richa",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1,admin:1}},
  {cat:"HR",name:"Sales Meeting Attendances Sheet",pc:"Neha / Richa",solver:"Neha / Pranav",exec:"All Staff",links:{form:1,sheet:1}},
  {cat:"HR",name:"Courier FMS",pc:"Neha",solver:"Neha / Pranav",exec:"Indresh",links:{sheet:1,form:1}},

  // -------- FINANCE --------
  {cat:"Finance",name:"Petrol/Rider Form",pc:"Neha / Mukesh",solver:"Neha / Pranav",exec:"Sonu, Pawan...",links:{form:1,sheet:1}},
  {cat:"Finance",name:"Cheque Payment",pc:"Neha / Mukesh",solver:"Mukesh",exec:"Indresh",links:{sheet:1,form:1}},
  {cat:"Finance",name:"Company Payment",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Mr. Sandeep/Ms. Neha",links:{fms:1,form:1}},
  {cat:"Finance",name:"GP Sheet",pc:"Ms. Neha",solver:"Mr. Pranav/Mr. Mukesh",exec:"Ms. Khushi",links:{sheet:1,gpDash:1}},
  {cat:"Finance",name:"Sales Marketing Daily Expense",pc:"Ms. Richa",solver:"Ms. Neha",exec:"Sale's Team",links:{form:1,sheet:1}},

  {cat:"Finance",name:"Account Checklist",pc:"Ms. Richa",solver:"Mr. Pranav",exec:"Ms. Khushi",links:{sheet:1}},

  // -------- FAMILY --------
  {cat:"Documents",name:"Satija Family Documents",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team",links:{folder:1}},
  {cat:"Documents",name:"Satija Paper Documents",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team",links:{folder:1}},
  {cat:"Documents",name:"SP Team Members Documents",pc:"Ms. Preksha",solver:"Ms. Khushi",exec:"All Team",links:{folder:1}},
  {cat:"Documents",name:"Policy Details",pc:"Ms. Richa",solver:"Ms. Khushi",exec:"All Team",links:{sheet:1}}
];


export const LINK_META = {
  fms:       {label:'FMS',            icon:'fas fa-table-cells',      cls:'btn-fms'},
  form:      {label:'Form',           icon:'fab fa-google-drive',     cls:'btn-form'},
  sheet:     {label:'Sheet',          icon:'fas fa-file-spreadsheet', cls:'btn-sheet'},
  check:     {label:'Checklist',      icon:'fas fa-square-check',     cls:'btn-check'},
  video:     {label:'Training',       icon:'fas fa-circle-play',      cls:'btn-video'},
  videoBCI:  {label:'Training (BCI)', icon:'fas fa-circle-play',      cls:'btn-video'},
  videoAI:   {label:'Training Video AI', icon:'fas fa-circle-play',   cls:'btn-video', url:'https://drive.google.com/file/d/1cDYnQ2xb6-y0HgZdXtd8W5cci5sZrGO_/view?usp=sharing'},
  dashEmp:   {label:'Emp Dashboard',  icon:'fas fa-chart-pie',        cls:'btn-dash'},
  dashPC:    {label:'PC Dashboard',   icon:'fas fa-chart-line',       cls:'btn-dash'},
  admin:     {label:'Admin Panel',    icon:'fas fa-user-gear',        cls:'btn-admin'},
  gpDash:    {label:'GP Dashboard',   icon:'fas fa-chart-column',     cls:'btn-gp'},
  stockDash: {label:'Stock Dashboard',icon:'fas fa-boxes-stacking',   cls:'btn-stock'},
  folder:    {label:'View Folder',    icon:'fas fa-folder-open',      cls:'btn-folder'},
  terms:       {label:'T&C',             icon:'fas fa-file-contract',    cls:'btn-form'},
  drive:       {label:'Drive',            icon:'fab fa-google-drive',     cls:'btn-form'},
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
  {cat:'Products',   nav:'navProducts',   cnt:'cntProducts'},
  {cat:'Bank Details', nav:'navBankDetails', cnt:'cntBankDetails'}
];


export const PRODUCTS = [
  {
    id: 'doublea',
    name: 'Double A',
    fullName: 'Double A',
    origin: 'Thailand',
    tagline: 'Premium 30M fibres/gram copier. Jam-free, CIE 167 whiteness.',
    img: 'https://satijapaper.com/DA-logo.png',
    cert: ['FSC Certified', 'CIE 167', '120+ Countries'],
    shareMsg: 'Hi! I am interested in Double A paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'Double A 70 GSM', gsm: 70, sizes: ['A4','A3','A11'],
        brightness: '102% ISO', cie: '148', opacity: '93%',
        bestFor: 'Forms, memos, daily printing',
        img: 'https://satijapaper.com/DA 70.jpg',
        fallbackImg: 'https://i.indiamart.com/data/img/catalogue/double-a-a4-70gsm-paper_24148053_xxl.jpg'
      },
      {
        name: 'Double A 75 GSM', gsm: 75, sizes: ['A4','A3','A11'],
        brightness: '103% ISO', cie: '152', opacity: '94%',
        bestFor: 'Reports, official documents',
        img: 'https://satijapaper.com/DA75.jpeg',
        fallbackImg: 'https://i.indiamart.com/data/img/catalogue/double-a-75-gsm-a4-copier-paper_230_xxl.jpg'
      },
      {
        name: 'Double A 80 GSM', gsm: 80, sizes: ['A4','A3','A11'],
        brightness: '104% ISO', cie: '167', thickness: '110 µm',
        bestFor: 'Presentations, letterheads',
        img: 'https://satijapaper.com/doublea.jpg',
        fallbackImg: 'https://i.indiamart.com/data/img/catalogue/double-a-premium-paper-a4-80gsm_xxl.jpg'
      },
      {
        name: 'Double A 100 GSM', gsm: 100, sizes: ['A4','A3'],
        brightness: '104% ISO', cie: '167', opacity: '97%',
        bestFor: 'Charts, proposals, premium reports',
        img: 'https://satijapaper.com/DA100.jpeg',
        fallbackImg: 'https://i.indiamart.com/data/img/catalogue/double-a-presentation-100gsm_250_xxl.jpg'
      }
    ]
  },
  {
    id: 'nra',
    name: 'NR Agarwal',
    fullName: 'NR Agarwal Industries – Brilliance Copier',
    origin: 'Gujarat, India',
    tagline: '100% de-inked recycled fibre with VOITH German de-inking technology.',
    img: 'https://satijapaper.com/nra.jpg',
    cert: ['VOITH German Tech', '354K TPA Capacity', 'ISO 9001'],
    shareMsg: 'Hi! I am interested in NR Agarwal Brilliance Copier paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'NR Copier 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '90% ISO', sheets: 500,
        bestFor: 'Eco-friendly daily printing',
        img: _IMG['NR_70'], fallbackImg: 'https://satijapaper.com/nra.jpg'
      },
      {
        name: 'NR Copier 75 GSM', gsm: 75, sizes: ['A4'],
        brightness: '92% ISO', sheets: 500,
        bestFor: 'Reports, presentations',
        img: _IMG['NR_75'], fallbackImg: 'https://satijapaper.com/nra.jpg'
      },
      {
        name: 'NR Copier 80 GSM', gsm: 80, sizes: ['A4'],
        brightness: '94% ISO', sheets: 500,
        bestFor: 'Contracts, letterheads',
        img: _IMG['NR_80'], fallbackImg: 'https://satijapaper.com/nra.jpg'
      }
    ]
  },
  {
    id: 'satia',
    name: 'Satia Industries',
    fullName: 'Satia Industries – Superb Copier',
    origin: 'Punjab, India',
    tagline: 'Eco-friendly from agricultural residues. ECF bleached. ISI & FSC certified.',
    img: 'https://satijapaper.com/satia-logo.jpg',
    cert: ['ECF Bleached', 'ISI BIS Certified', 'FSC Certified'],
    shareMsg: 'Hi! I am interested in Satia Superb Copier paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'Satia Superb 65 GSM', gsm: 65, sizes: ['A4'],
        brightness: '86–88% ISO', sheets: 500,
        bestFor: 'Bulk, draft printing',
        img: _IMG['SATIA_65'], fallbackImg: 'https://satijapaper.com/satia.jpg'
      },
      {
        name: 'Satia Superb 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '88–90% ISO', sheets: 500,
        bestFor: 'High-volume printing, copiers',
        img: _IMG['SATIA_70'], fallbackImg: 'https://satijapaper.com/satia.jpg'
      },
      {
        name: 'Satia Superb 75 GSM', gsm: 75, sizes: ['A4'],
        brightness: '88–90% ISO', sheets: 500,
        bestFor: 'Reports, stationery',
        img: _IMG['SATIA_75'], fallbackImg: 'https://satijapaper.com/satia.jpg'
      },
      {
        name: 'Satia Superb 80 GSM', gsm: 80, sizes: ['A4'],
        brightness: '90–92% ISO', sheets: 500,
        bestFor: 'Premium office use, double-sided',
        img: _IMG['SATIA_80'], fallbackImg: 'https://satijapaper.com/satia.jpg'
      }
    ]
  },
  {
    id: 'khanna',
    name: 'Khanna Paper',
    fullName: 'Khanna Paper Mills – K Bold / E-Print / E-Copy / White Gem',
    origin: 'Punjab, India',
    tagline: 'Premium copier range: K Bold · E-Print · E-Copy · White Gem. Jam-free, hi-bright, all-printer compatible.',
    img: 'https://satijapaper.com/khanna.jpg',
    cert: ['ISO 9001', 'Hi-Bright 92% ISO', 'Jam-Free', 'Since 1985'],
    shareMsg: 'Hi! I am interested in Khanna Paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'K Bold 65 GSM', gsm: 65, sizes: ['A4','A3'],
        brightness: 'Superior Brightness',
        bestFor: 'High-speed printing, all printers & copiers',
        features: [
          'Superior Brightness for Clear, Vibrant Prints',
          'Jam-Free Performance for Hassle-Free Use',
          'High Image Contrast with exceptional sharpness',
          'Compatible with All Printers & Copiers',
          'No Misfeeds, Ensuring Consistent Output Quality',
          'Optimized for High-Speed Printing'
        ],
        img: _IMG['KHANNA_KBOLD_65'],
        fallbackImg: 'https://satijapaper.com/khanna.jpg'
      },
      {
        name: 'E-Print 70 GSM', gsm: 70, sizes: ['A4','FS','A3'],
        brightness: '92% ISO',
        bestFor: 'Bulk printing, double-sided, high-speed machines',
        features: [
          'Jam-Free Performance for Hassle-Free Use',
          'No Misfeeds, Ensuring Consistent Printing',
          'High-Bright paper with 92% ISO brightness',
          'Perfect for Double-Sided Printing',
          'Reliable and Efficient for Bulk Printing',
          'Designed for High-Speed Machines'
        ],
        img: _IMG['KHANNA_EPRINT_70'],
        fallbackImg: 'https://satijapaper.com/khanna.jpg'
      },
      {
        name: 'E-Copy 75 GSM', gsm: 75, sizes: ['A4','FS','A3'],
        brightness: '92% ISO',
        bestFor: 'Premium copying, photocopiers, double-sided',
        features: [
          'Exceptional Quality for Printing and Copying',
          'High-Bright paper with 92% ISO brightness',
          'Perfect for Double-Sided Printing',
          'Excellent Runnability in All Photocopiers',
          'High Image Contrast for Sharper Prints',
          'Jam-Free Performance for Hassle-Free Use'
        ],
        img: _IMG['KHANNA_ECOPY_75'],
        fallbackImg: 'https://satijapaper.com/khanna.jpg'
      },
      {
        name: 'White Gem 80 GSM', gsm: 80, sizes: ['A4'],
        brightness: 'High-Quality',
        bestFor: 'Presentations, letterheads, smudge-free results',
        features: [
          'Vivid Contrast with Exceptional Sharpness',
          'Enhanced Opacity for Superior Print Quality',
          'Compatible with All Printers & Copiers',
          'Engineered for Jam-Free Performance',
          'Ideal for Double-Sided Printing',
          'Fast-drying surface for smudge-free results'
        ],
        img: _IMG['KHANNA_WHITEGEM_80'],
        fallbackImg: 'https://satijapaper.com/khanna.jpg'
      }
    ]
  },
  {
    id: 'ruchira',
    name: 'Ruchira Papers',
    fullName: 'Ruchira Papers – Tarang · Rozana · Mela · Mogra · Kora · VV',
    origin: 'Himachal Pradesh, India',
    tagline: 'Earth-friendly paper from agro-waste. Tarang (colour), Rozana (daily), Mela, Mogra (invitations), Kora (maplitho), VV (premium).',
    img: 'https://satijapaper.com/ruchira.jpg',
    cert: ['Tree-Free', 'FSC Certified', 'ISO 9001'],
    shareMsg: 'Hi! I am interested in Ruchira Papers from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [

      {
        name: 'Tarang — Rose', gsm: 75, sizes: ['A4'],
        brightness: '85–90% ISO', sheets: 100,
        bestFor: 'Colour-coded filing, creative use',
        color: '#F4B8C1', colorName: 'Rose Pink',
        img: _IMG['TARANG_ROSE'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Tarang — Lemon', gsm: 75, sizes: ['A4'],
        brightness: '85–90% ISO', sheets: 500,
        bestFor: 'Colour-coded filing, notices',
        color: '#F9E79F', colorName: 'Lemon Yellow',
        img: _IMG['TARANG_LEMON'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Tarang — Green', gsm: 75, sizes: ['A4'],
        brightness: '85–90% ISO', sheets: 500,
        bestFor: 'Eco filing, colour separation',
        color: '#82C784', colorName: 'Green',
        img: _IMG['TARANG_GREEN'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Tarang — Sky', gsm: 75, sizes: ['A4'],
        brightness: '85–90% ISO', sheets: 500,
        bestFor: 'Colour-coded filing, presentations',
        color: '#87CEEB', colorName: 'Sky Blue',
        img: _IMG['TARANG_SKY'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Rozana 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '88–90% ISO', sheets: 500,
        bestFor: 'Daily home & office copier/xerox use',
        color: '#6B8E9F', colorName: 'Blue-Grey',
        img: _IMG['RUCHIRA_ROZANA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Rozana 75 GSM', gsm: 75, sizes: ['A4'],
        brightness: '88–90% ISO', sheets: 500,
        bestFor: 'Economy range multipurpose printing',
        color: '#7B9E6B', colorName: 'Olive Green',
        img: _IMG['RUCHIRA_ROZANA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Rozana 80 GSM', gsm: 80, sizes: ['A4'],
        brightness: '88–90% ISO', sheets: 500,
        bestFor: 'Economy range, all printers & copiers',
        color: '#5B7FA6', colorName: 'Blue',
        img: _IMG['RUCHIRA_ROZANA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Mela — Colour Printing', gsm: 75, sizes: ['A4'],
        brightness: '85–88% ISO', sheets: 500,
        bestFor: 'Bill books, vouchers, colour forms',
        color: '#F0E68C', colorName: 'Multi-colour',
        img: _IMG['RUCHIRA_MELA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Mogra — Invitation', gsm: 160, sizes: ['A4'],
        brightness: '88% ISO', sheets: 250,
        bestFor: 'Wedding cards, invitations, announcements',
        color: '#E8A020', colorName: 'Golden Yellow',
        img: _IMG['RUCHIRA_MOGRA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'Kora — Maplitho', gsm: 70, sizes: ['A4','A3'],
        brightness: '85–86% ISO', sheets: 500,
        bestFor: 'Notebooks, textbooks, bill books, stationery',
        color: '#C4A882', colorName: 'Cream / Natural',
        img: _IMG['RUCHIRA_KORA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      },
      {
        name: 'VV — Premium White', gsm: 75, sizes: ['A4'],
        brightness: '90–92% ISO', sheets: 500,
        bestFor: 'High-quality office printing, documents',
        color: '#FAFAFA', colorName: 'Bright White',
        img: _IMG['RUCHIRA_ROZANA'], fallbackImg: 'https://satijapaper.com/ruchira.jpg'
      }
    ]
  },
  {
    id: 'holmen',
    name: 'Holmen',
    fullName: 'Holmen Creamy',
    origin: 'Sweden',
    tagline: 'Premium creamy newsprint — 52 GSM, 58.5 cm width.',
    img: 'https://satijapaper.com/Holmenlogo.jpg',
    cert: ['FSC Certified', 'Acid-Free'],
    shareMsg: 'Hi! I am interested in Holmen Creamy paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'Holmen Creamy 52 GSM', gsm: 52, sizes: ['58.5 cm (23")'],
        brightness: '-', sheets: '-',
        bestFor: 'Newsprint, publishing, bulk printing',
        img: _IMG['HOLMEN_52'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      }
    ]
  },
  {
    id: 'ik',
    name: 'IK / i-K Copy',
    fullName: 'IK i-K Copy',
    origin: 'Indonesia',
    tagline: 'Economy A4 copier — 70 GSM.',
    img: 'https://satijapaper.com/APP.png',
    cert: ['ISO 9001'],
    shareMsg: 'Hi! I am interested in IK Copy paper from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'i-K Copy A4 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '—', sheets: 500,
        bestFor: 'Daily office, economy printing',
        img: _IMG['IK_70'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      }
    ]
  },
  {
    id: 'paperone',
    name: 'Paper One / Aprilfine',
    fullName: 'Aprilfine',
    origin: 'Indonesia',
    tagline: 'Premium A4/A3 copier — 70, 75, 100 GSM.',
    img: 'https://satijapaper.com/Aprillogo.png',
    cert: ['FSC Certified', 'ISO 9001', 'PEFC'],
    shareMsg: 'Hi! I am interested in Paper One / Aprilfine from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'Paper One A4 100 GSM', gsm: 100, sizes: ['A4'],
        brightness: '—', sheets: 500,
        bestFor: 'Premium presentations, letterheads',
        img: _IMG['APRILFINE_100'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      },
      {
        name: 'Paper One A3 100 GSM', gsm: 100, sizes: ['A3'],
        brightness: '—', sheets: 500,
        bestFor: 'Large format presentations, charts',
        img: _IMG['PAPERONE_A3_100'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      },
      {
        name: 'Paper One A4 75 GSM', gsm: 75, sizes: ['A4'],
        brightness: '—', sheets: 500,
        bestFor: 'Reports, official documents',
        img: _IMG['PAPERONE_75'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      },
      {
        name: 'Paper One A4 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '—', sheets: 500,
        bestFor: 'Daily office printing',
        img: _IMG['PAPERONE_70'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      },
      {
        name: 'PP Lite A4 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '—', sheets: 500,
        bestFor: 'Economy daily printing',
        img: _IMG['PPLITE_70'],
        fallbackImg: 'https://satijapaper.com/logo.png'
      }
    ]
  },
  {
    id: 'andhra',
    name: 'Andhra Paper',
    fullName: 'Andhra Paper – Reflection Series',
    origin: 'Andhra Pradesh, India',
    tagline: 'Reflection series with ECF technology. Low-lint, smooth surface.',
    img: 'https://satijapaper.com/andhra.jpg',
    cert: ['ECF Technology', 'ISO 9001', 'Low-Lint'],
    shareMsg: 'Hi! I am interested in Andhra Paper Reflection series from Satija Paper. Please share pricing. www.satijapaper.com',
    variants: [
      {
        name: 'Reflection White 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '93% ISO', thickness: '98 µm', sheets: 500,
        bestFor: 'Daily multipurpose printing',
        img: _IMG['ANDHRA_70_WHITE'], fallbackImg: 'https://satijapaper.com/andhra.jpg'
      },
      {
        name: 'Reflection 70 GSM', gsm: 70, sizes: ['A4'],
        brightness: '91% ISO', thickness: '98 µm', sheets: 500,
        bestFor: 'High-volume office printing',
        img: _IMG['ANDHRA_70'], fallbackImg: 'https://satijapaper.com/andhra.jpg'
      },
      {
        name: 'Reflection 75 GSM', gsm: 75, sizes: ['A4'],
        brightness: '93% ISO', thickness: '103 µm', sheets: 500,
        bestFor: 'Reports, official documents',
        img: _IMG['ANDHRA_75'], fallbackImg: 'https://satijapaper.com/andhra.jpg'
      },
      {
        name: 'Reflection 80 GSM', gsm: 80, sizes: ['A4'],
        brightness: '92% ISO', thickness: '100 µm', sheets: 500,
        bestFor: 'Premium presentations, letterheads',
        img: _IMG['ANDHRA_80'], fallbackImg: 'https://satijapaper.com/andhra.jpg'
      },
      {
        name: 'Reflection 100 GSM', gsm: 100, sizes: ['A4'],
        brightness: '93% ISO', sheets: 500,
        bestFor: 'Digital printing, premium office paper',
        img: _IMG['ANDHRA_100'], fallbackImg: 'https://satijapaper.com/andhra.jpg'
      }
    ]
  }
];
