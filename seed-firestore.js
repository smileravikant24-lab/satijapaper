const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ projectId: 'sp-dashboard-1e9c8' });
const db = getFirestore();

function safeId(name){ return name.replace(/\//g, '|'); }

const AIQA_URL = 'https://chatgpt.com/g/g-6a0c9090a45c81919ac3a2682dfe1dfa-satija-paper-ai-command-center';

// NOTE: GAS script.google.com URLs use key "gasForm", Google Forms use key "form"
const PROCESS_LINKS = [
  // ============ DISPATCH ============
  { name:"Order to Delivery FMS", cat:"Dispatch",
    links:{ fms:"https://docs.google.com/spreadsheets/d/1yq1zQy71b2X0DYU3FWeQKquWj4mBmxqF4067O-FW8RE/edit?gid=1264286419#gid=1264286419", gasForm:"https://script.google.com/macros/s/AKfycbzjlijGXaELu2FYQZifc08hsEJk8fBBbuq7a7gnmifw6olnQS0hyzpIcXOVlC2k5Q4/exec", videoBCI:"https://youtu.be/PI_hErtw5hg", videoAI:"https://drive.google.com/file/d/1cDYnQ2xb6-y0HgZdXtd8W5cci5sZrGO_/view?usp=sharing", aiqa: AIQA_URL }},
  { name:"O2D Direct Dispatch FMS", cat:"Dispatch",
    links:{ fms:"https://docs.google.com/spreadsheets/d/1Cmxy8vlV-Q6nqezlOnazhW2wFMglarpk4D53xDzKyi4/edit?gid=542810445#gid=542810445", aiqa: AIQA_URL }},
  { name:"Sale Report", cat:"Dispatch", links:{ sheet:"https://docs.google.com/spreadsheets/d/1L7sg568GtMr96mMH8aIctdiy_zWjgic2RaF7_Bu7jo0/edit?gid=0#gid=0" }},

  // ============ SALES ============
  { name:"Ruchira 100 Best Customer", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1KEtqNJi2qh2I40jgvfusNIT39IxeJZdeMcKongMihZA/edit?gid=0#gid=0", aiqa: AIQA_URL }},
  { name:"Follow Up Calls", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1pXEmkwPbw9MWmkv4pHpcd_SPd0ec0Pzh1jsHHfUcpq4/edit?usp=sharing", aiqa: AIQA_URL }},
  { name:"Next Week/ Day Marketing Plan", cat:"Sales", links:{ gasForm:"https://script.google.com/macros/s/AKfycbw9Jt-4Qc9OczLWJjUm2_bWEsaddr31AVBgJS89-aBHOKZYN38u9wVYRE1K8p6VQrxR/exec", sheet:"https://docs.google.com/spreadsheets/d/1JHimWmLl3LWJrqTAJ1HhItTk21KvNd99vsNIta2i7mM/edit?gid=1906678901#gid=1906678901", aiqa: AIQA_URL }},
  { name:"New Customer Visit", cat:"Sales", links:{ form:"https://forms.gle/simx8cyQQBD5x4aj8", sheet:"https://docs.google.com/spreadsheets/d/1J0iqWAHLvAPrHMfKXGQRZmVhv7Y_N1bI_nJvVhkPlM4/edit?usp=sharing", aiqa: AIQA_URL }},
  { name:"Enquiry Capture FY 2026-27", cat:"Sales", links:{ gasForm:"https://script.google.com/macros/s/AKfycbzjlijGXaELu2FYQZifc08hsEJk8fBBbuq7a7gnmifw6olnQS0hyzpIcXOVlC2k5Q4/exec", sheet:"https://docs.google.com/spreadsheets/d/1dzxpe1pC8GttTMmyrS_AAez81W54T4YquwpBgyrilHc/edit?gid=0#gid=0", aiqa: AIQA_URL }},
  { name:"CRM Payment FMS", cat:"Sales", links:{ fms:"https://docs.google.com/spreadsheets/d/1RWzVwiihyzjZKLyZew4csbI4y4z9j4o2zxQZPdFjG88/edit?gid=2061178155#gid=2061178155", aiqa: AIQA_URL }},
  { name:"Price List", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1MNAJurPOo-gmx_0jOugi9-KBpvEXYaDm6ZiW02AY4qs/edit?usp=sharing", aiqa: AIQA_URL }},
  { name:"Scot Sheet", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1l3nHTSwkbQUfJEoSvJNBPVs8XceBt-L3yDa1xbIJSQU/edit?gid=0#gid=0", aiqa: AIQA_URL }},
  { name:"Stock Dashboard", cat:"Sales", links:{ stockDash:"https://script.google.com/macros/s/AKfycbyyk7pqn2qmLAWkN39JJEdWtNw7i7mYlEeZDjFQcMi9u_aAXG08qZ_lj5TQjfCNIpPC/exec", aiqa: AIQA_URL }},
  { name:"Mr. Mukesh Debtors List", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/14oRauUueILp3JfxYcd5y3PL6BNGaBbnrlYNLoa9Hypg/edit?usp=sharing", aiqa: AIQA_URL }},
  { name:"Mr. Pranav Satija Debtors List", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1ujFse-oVBlZ5Uh-T471qYO_7gyz9thuUgKt-naBJJrU/edit?gid=0#gid=0", aiqa: AIQA_URL }},
  { name:"All Party Name", cat:"Sales", links:{ sheet:"https://docs.google.com/spreadsheets/d/1tHAWXZrETIbcT3jp18PHCm5-4m0PvZtK/edit?gid=1060455945#gid=1060455945", aiqa: AIQA_URL }},

  // ── Double A ──────────────────────────────────────────────────
  { name:"Double A Advance Container Booking Form", cat:"Sales", group:"Double A", links:{ gasForm:"https://script.google.com/macros/s/AKfycby6egRY9Iwv8VZbkApHOfzTQJGuohimxqz08QuJ1La3kO1pC1XNAK8CYiEeKxgoWci-/exec", sheet:"https://docs.google.com/spreadsheets/d/1SoeYZrERSmUEiaLyIOh0aMduacbeAnVTrkif2RJfcPs/edit?usp=sharing", aiqa: AIQA_URL }},
  { name:"Double A New Distributor Form", cat:"Sales", group:"Double A", links:{ form:"https://forms.gle/uAC3jHJkJRKkWhzD9", sheet:"https://docs.google.com/spreadsheets/d/1qUq8t-ny3jYw8Sr5EX1o8JPwTZTABq-84u3WZmqZiGA/edit?gid=1524564798#gid=1524564798", terms:"https://drive.google.com/file/d/1Er0Uol8HZ8h3pGJWad-Qox4GKCUpYIxx/view", drive:"https://drive.google.com/file/d/1Er0Uol8HZ8h3pGJWad-Qox4GKCUpYIxx/view", guidelineForm:"https://drive.google.com/file/d/1k6gWqDgcoew6iLC97ydXi-_qgPYcFdn9/view?usp=sharing", aiqa: AIQA_URL }},
  { name:"Double A District Distributor", cat:"Sales", group:"Double A", links:{ sheet:"https://docs.google.com/spreadsheets/d/1jJPqq0nyDNw-lp0DiB0PSgj8tgcuF6SK/edit?gid=804725302#gid=804725302" }},
  { name:"Double A CME Payment FMS FY 2026-27", cat:"Sales", group:"Double A", links:{ fms:"https://docs.google.com/spreadsheets/d/1Qd36JU8bTIVyeKi99KC26ktH2XOy_SwtgBm4f3qzAnc/edit?gid=663292535#gid=663292535", gasForm:"https://script.google.com/macros/s/AKfycbzFD8VRBltDC03aYXP7XKNHp4ho6iQSkYPcHihW5CUvBs4hNGLPnNtXi51lGCw_zo6_/exec", aiqa: AIQA_URL }},
  { name:"Double A Dealer", cat:"Sales", group:"Double A", links:{ sheet:"https://docs.google.com/spreadsheets/d/18ErQDYMyKCmjaXSDPOU1DdGpPR6hBGKmfVkesmuK9YA/edit?usp=sharing" }},
  { name:"Double A CME Folder", cat:"Sales", group:"Double A", links:{ folder:"https://drive.google.com/drive/folders/1TUhBrHh3L7qz-XyFTmMc48KGMYDOovEc?usp=sharing" }},
  { name:"Double A Retail Customer", cat:"Sales", group:"Double A", links:{ sheet:"https://docs.google.com/spreadsheets/d/19L5wgRLmcV33r-C7VxIYFFyn0iF810nojYChInB3z1o/edit?gid=0#gid=0", guidelineForm:"https://docs.google.com/presentation/d/1rlGNPKiIX3-6hKct8Rll-tndPEeUxoFD/edit?usp=sharing&ouid=108679167360920301270&rtpof=true&sd=true" }},
  { name:"Double A Corporate Customer", cat:"Sales", group:"Double A", links:{ sheet:"https://docs.google.com/spreadsheets/d/1voCORpn8jx77cse87ERNqXa4HlPPaJkOaClnbg4kihI/edit?gid=0#gid=0" }},
  { name:"Double A Display Links", cat:"Sales", group:"Double A", links:{ folder:"https://drive.google.com/drive/folders/1b8zTbTYPxCwDDKemuEnQnQKhHyRroUnv?usp=sharing" }},

  // ============ PURCHASE ============
  { name:"Purchase FMS", cat:"Purchase", links:{ fms:"https://docs.google.com/spreadsheets/d/1XrykdT3AGzqeWxyxTjwW-wx_ah9g1vXsz7VaB90pVgQ/edit?gid=663292535#gid=663292535", gasForm:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbxQNUAtVUGNGBNQBH6sQy_67tmCyiruYf9-quHGxNQKKTkzs9ZeBIIQvV7DEOBCN6m9/exec", video:"https://drive.google.com/file/d/1fWolylWij-qPSDPB8UNTTFFV4oO75_U_/view?usp=sharing", videoBCI:"https://youtu.be/PI_hErtw5hg" }},
  { name:"IMS (Inventory System)", cat:"Purchase", links:{ form:"https://forms.gle/MjxJZb2PfeSEpy8K9", sheet:"https://docs.google.com/spreadsheets/d/1vQqvQpARP6nQQOA5me4MMRGxojzVjNvVgl2FXNTEz4M/edit?gid=1525898616#gid=1525898616", video:"https://youtu.be/N1Rs7-0gW5c" }},
  { name:"WMS", cat:"Purchase", links:{ gasForm:"https://script.google.com/macros/s/AKfycbywofvP3NAHcOcSWVHQx2D5uUksmuF-g9g9E6MCCJraXs5ZI-MH3RKCxBrH1Vto6EyAag/exec", sheet:"https://docs.google.com/spreadsheets/d/1R1eMFIwOdN5CyfrZa0K8NSVaJZnVmjPd95bOp2FYz90/edit?usp=sharing" }},
  { name:"Godown Stock Report", cat:"Purchase", links:{ gasForm:"https://script.google.com/macros/s/AKfycbzfqBm6PWLqSLdUi63UyJdK2bXyIoFRQkuXgQhpBb1oqkHPhEEeHCRBw5N76d0jTcAx0w/exec", sheet:"https://docs.google.com/spreadsheets/d/1rCSqHPeT2YnmBJL2B-JFAwLwur5nXNki15yVy7DEs1A/edit?gid=897009476#gid=897009476" }},
  { name:"Godown Inward Report", cat:"Purchase", links:{ sheet:"https://docs.google.com/spreadsheets/d/1IYPzs2sLsg9NKFzz84DP0FvNndS_rmOS/edit?usp=sharing&ouid=108679167360920301270&rtpof=true&sd=true" }},
  { name:"Stock Transfer FMS", cat:"Purchase", links:{ fms:"https://docs.google.com/spreadsheets/d/1DGirLMKqUeBb3F9NAc85BDOXHZrbePg26yvqfXtKGSE/edit?gid=1990994408#gid=1990994408", gasForm:"https://script.google.com/macros/s/AKfycbws-GLp4ffZcV72DAmvMZCPRsqlMzxiWxvPvEtAJ87T154B7GU_IWSMmQi1VyUfsowIGg/exec" }},
  { name:"Shop Stock Report", cat:"Purchase", links:{ gasForm:"https://script.google.com/macros/s/AKfycbzNbIamfka8psOPpbyTIamfda0xnFJahk6Fhfl9xCCt-rvvtbVmiGAQSEGgPjQ3lYZD/exec", sheet:"https://docs.google.com/spreadsheets/d/1GlNfTrMe48seaYVe38oH5LREwyvn2h80Ndk2sXloRJ8/edit?gid=893002110#gid=893002110" }},

  // ============ MANAGEMENT ============
  { name:"Ultimate Checklist", cat:"Management", links:{ check:"https://docs.google.com/spreadsheets/d/1CjiaW5EuDdyUtzLcM-3lg7Omp47Uc94PxtdNkd8X7cM/edit?gid=2123213379#gid=2123213379", video:"https://youtu.be/b3CDW57r7hA", dashEmp:"https://lookerstudio.google.com/reporting/867783ed-3310-433d-af65-215a8637dc1c", dashPC:"https://lookerstudio.google.com/reporting/47123040-143d-40e6-accd-ca979d4821f8" }},
  { name:"Delegation Sheet", cat:"Management", links:{ gasForm:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbwkZJdwMiyW3RRXrd5xUxZUoiWuqarz7Gm-f-xUgywpZdpAYMeR35uCykCCm9HHXXEJsg/exec", sheet:"https://docs.google.com/spreadsheets/d/1wlNnew6xsTyKubBaiGh_AjFf9WURcyI_ChsRHI3PfJU/edit?usp=sharing", video:"https://youtu.be/zTtmwX-8N5c" }},
  { name:"To Do (MIS)", cat:"Management", links:{ form:"https://forms.gle/RZk3BaqF2RR4dRWZA", sheet:"https://docs.google.com/spreadsheets/d/1E1-RY6Q8v3DQDgvlzGL8y7-DBrQccNA8A7yOer3oElM/edit?usp=sharing" }},
  { name:"To Do (EA)", cat:"Management", links:{ form:"https://forms.gle/aJkEUVAkXSM2zar4A", sheet:"https://docs.google.com/spreadsheets/d/1JI2j-2pZVqv0cfbLv_xK5GtIPOzHn1FRSWdHNOIR3eQ/edit?usp=sharing" }},
  { name:"MIS Score", cat:"Management", links:{ sheet:"https://docs.google.com/spreadsheets/d/1a_mXf1x6CBuzYdzY0CMNPXq9jb96FVL9nPfOJCi8zgc/edit?gid=0#gid=0" }},
  { name:"Dashboard of All FMS", cat:"Management", links:{ dashEmp:"https://lookerstudio.google.com/reporting/4daa3083-8427-456b-a445-75984280c0e9", dashPC:"https://script.google.com/macros/s/AKfycbwx_O8TkIVVbXrT-Qr3K3Lnc3N1v9NzdZTxCS4XrUAR5i_ATuJYFR1WYLCC7_001ES4lw/exec", sheet:"https://docs.google.com/spreadsheets/d/1DRdCdKOJG1DSNUaFnAA7Q3xVjTpxW2yeG4NB-uwKpzo/edit?gid=0#gid=0" }},
  { name:"FMS OF FMS", cat:"Management", links:{ sheet:"https://docs.google.com/spreadsheets/d/145fPQ-xJYiR9sceKh391kVoXPr3dwNThR73Ij0sih3c/edit?gid=663292535#gid=663292535", form:"https://forms.gle/CxsCmRZzeESiygMt9" }},
  { name:"Home Loan FMS", cat:"Management", links:{ fms:"https://docs.google.com/spreadsheets/d/1jTcRgNlFTX1uVl5VVEkyHKXFA8fM5W4bJQrk-owadEM/edit?gid=663292535#gid=663292535", gasForm:"https://script.google.com/macros/s/AKfycbxt0haql2_FmwYXklLBQ3itBn4IsxpnbM49oQr-QY_nj1iiY4cfsUjF8wuTSzXP_RAY/exec" }},
  { name:"eMail & Password Sheet", cat:"Management", links:{ sheet:"https://docs.google.com/spreadsheets/d/1R5Z1EYWvxdps9DlGsClu21akraJiMiT7jkwWpDxvJTM/edit?gid=0#gid=0" }},
  { name:"SCT-FMS", cat:"Management", links:{ form:"https://forms.gle/BALDzKW2M7ErMGKd9", fms:"https://docs.google.com/spreadsheets/d/1fWBPTLDEtrLt5E4fOSOLmgfAC5_PoajHCVOlqfRcMnk/edit?gid=208859944#gid=208859944" }},
  { name:"Repair & Maintenance System", cat:"Management", links:{ gasForm:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbz5lHAq9m-vp7-m2rQojWcmhM68vKqBNSA2z1MFQAIU-egWeYrqI87jt_SLLjd8izPXCw/exec", sheet:"https://docs.google.com/spreadsheets/d/1z6mB5PvtlHyfttNQsERoeVDCW6DITb3fzndgE7_CBTM/edit?gid=708767099#gid=708767099" }},

  // ============ SUPPORT / MY SYSTEM ============
  { name:"Help Ticket", cat:"Support", links:{ form:"https://forms.gle/1spYybVfM8C3a8bu9", sheet:"https://docs.google.com/spreadsheets/d/16sHaywxje9okn-UBIdlocm6_ZlmWJfjnAvmfZjdwApg/edit?resourcekey=&gid=1739158437#gid=1739158437" }},
  { name:"Google Site", cat:"My System", links:{ form:"https://sites.google.com/satijapaper.com/satija-paper/home", sheet:"https://docs.google.com/spreadsheets/d/1cILiWFTHeoJ5ELsw0HKr5UWfWne7TVgrGy5xdgseZWE/edit?gid=0#gid=0" }},

  // ============ HR ============
  { name:"Office Chores Form", cat:"HR", links:{ gasForm:"https://script.google.com/macros/s/AKfycbwN-zMYqEPGy4IdgXHMxcsIwndpKLzib7hGqRxIx_j4pdy-V7xAHn10RYq2aM2HOzZ3/exec", sheet:"https://docs.google.com/spreadsheets/d/1o3j9B0UAE_AywprE7SV2hRtXscYyVXivDDVok2otPEM/edit?usp=sharing" }},
  { name:"Attendances Sheet", cat:"HR", links:{ gasForm:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbyosWuO3w6o6BbLPr6MgS3Mxg9Nz0jWTusvezFVx4-ntUCS2dKcCfjiSUuH8DE0A38i/exec", sheet:"https://docs.google.com/spreadsheets/d/179U4qy_lPVOV4HtmNHoGfnNy_TgWHhzhxg0Ip-2sR2k/edit?gid=0#gid=0", admin:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbyosWuO3w6o6BbLPr6MgS3Mxg9Nz0jWTusvezFVx4-ntUCS2dKcCfjiSUuH8DE0A38i/exec?page=admin" }},
  { name:"Sales Meeting Attendances Sheet", cat:"HR", links:{ gasForm:"https://script.google.com/macros/s/AKfycbxIwKk0x48Z4KFkCSirY4B-iDaAwhQOAJhMLKSTM9HbpF7kLV6LmBTyTObx0-kMMB4b-g/exec", sheet:"https://docs.google.com/spreadsheets/d/1uZAoXHg5eos28Z-mWPCqu40ir61jMlSQj9ID41MM9bk/edit?gid=1979712700#gid=1979712700" }},
  { name:"Courier FMS", cat:"HR", links:{ fms:"https://docs.google.com/spreadsheets/d/1oxxIzERQ5DGgh9QsapS9sefu8_-Y8Z9_7QNHJF9cks8/edit?gid=760114361#gid=760114361", form:"https://forms.gle/BRZFSt6MmUMbUogZ6", videoAI:"https://drive.google.com/file/d/117gdZM5Ygl_zLvNHLVyKC90kPw5oEGNP/view?usp=sharing" }},

  // ============ FINANCE ============
  { name:"Petrol/Rider Form", cat:"Finance", links:{ form:"https://forms.gle/DicXKSdhGBVBnBDL8", sheet:"https://docs.google.com/spreadsheets/d/1fSytJSS3zc2QhpIaMFLKawRBW-taOvd0TJd0l6K9fFQ/edit?gid=1674675112#gid=1674675112" }},
  { name:"Cheque Payment", cat:"Finance", links:{ fms:"https://docs.google.com/spreadsheets/d/1O-d1HUIXLrqZceHw46RXHS08Kv0S89GLLvyBd4Rf1xg/edit?gid=183137054#gid=183137054", form:"https://forms.gle/bzgaZgtAhdPExPLS6" }},
  { name:"Company Payment", cat:"Finance", links:{ fms:"https://docs.google.com/spreadsheets/d/1SICtsFKfdsnP0Ailr6k0EyFu3Cd_7YGDPpIgI9E5kp4/edit?gid=663292535#gid=663292535", form:"https://forms.gle/sRnf7J8obGq1agnV7" }},
  { name:"GP Sheet", cat:"Finance", links:{ sheet:"https://docs.google.com/spreadsheets/d/1bN8KpRkbFmflD0ThrLrHQLWrL6EXAH7s8GoHD1GC6pU/edit?gid=0#gid=0", gpDash:"https://script.google.com/a/macros/satijapaper.com/s/AKfycbycFnOfp2JwTukCsjSS2x0V2b45UL6zJN1fKJBu5HMdusDYBSa8rDl-I6bXYu85YKc__A/exec" }},
  { name:"Account Checklist", cat:"Finance", links:{ sheet:"https://docs.google.com/spreadsheets/d/1khinmqZSWmq2sFS4iIiBlmCcdvhbqt0TSjFSeJmCkC8/edit?gid=0#gid=0" }},
  { name:"Sales Marketing Daily Expense", cat:"Finance", links:{ gasForm:"https://script.google.com/macros/s/AKfycbx9Ltu16HEzS97tOuJg2mYnizudpPALNLILcX7TqJqFA_eVa8tnsWKMMMsnqSV5lxNl4Q/exec", sheet:"https://docs.google.com/spreadsheets/d/1qyeQpj9VHFGzuRBeLbhJIhIHANRy3sU0CKKioEPrRD8/edit?gid=0#gid=0" }},

  // ============ DOCUMENTS / FAMILY ============
  { name:"Satija Family Documents", cat:"Documents", links:{ folder:"https://drive.google.com/drive/folders/18UcntWtEEj9mB0av6Zk4kABstyKqXwaj?usp=sharing" }},
  { name:"Satija Paper Documents", cat:"Documents", links:{ folder:"https://drive.google.com/drive/folders/1TY7m4KyQqF2l9yHfy8ZcaM8rWUHlgZLr?usp=sharing" }},
  { name:"SP Team Members Documents", cat:"Documents", links:{ folder:"https://drive.google.com/drive/folders/1jtkH6QsT8MzMmOwnkrtWdFzWU6vWvQ1z?usp=sharing" }},
  { name:"Policy Details", cat:"Documents", links:{ sheet:"https://docs.google.com/spreadsheets/d/1JpnwjPYjJME74hhn4TLNi1SjYTUGuoC4F_Ma-V9Uh-I/edit?gid=0#gid=0" }},
];

const BANK_DETAILS = [
  { id:'hsbc',      group:'satija_paper', groupLabel:'Satija Paper', order:1,
    bankName:'HSBC Bank',            holderName:'SATIJA PAPER',
    accountNo:'166485698001',        bank:'HSBC Bank',
    branch:'Barakhamba Road, C.P.',  ifsc:'HSBC0110002',
    hasQR:false },
  { id:'pnb',       group:'satija_paper', groupLabel:'Satija Paper', order:2,
    bankName:'Punjab National Bank', holderName:'SATIJA PAPER',
    accountNo:'1524002100033322',    bank:'Punjab National Bank (India)',
    branch:'Mukherjee Nagar',        ifsc:'PUNB0498800',
    hasQR:true },
  { id:'pnb_veena', group:'personal', groupLabel:'Personal', order:3,
    bankName:'Punjab National Bank', holderName:'VEENA SATIJA',
    accountNo:'0991000100329435',    bank:'Punjab National Bank',
    branch:'Dr Mukherjee Nagar',     ifsc:'PUNB0498800',
    hasQR:false },
  { id:'pnb_silky', group:'personal', groupLabel:'Personal', order:4,
    bankName:'Punjab National Bank', holderName:'SILKY GROVER SATIJA',
    accountNo:'4988000100037648',    bank:'Punjab National Bank',
    branch:'Dr Mukherjee Nagar',     ifsc:'PUNB0498800',
    hasQR:false },
  { id:'yes_bank',  group:'personal', groupLabel:'Personal', order:5,
    bankName:'YES BANK',             holderName:'SILKY GROVER SATIJA',
    accountNo:'023190200002302',     bank:'YES BANK',
    branch:'Prashant Vihar, Rohini', ifsc:'YESB0000231',
    hasQR:false },
];

async function seed() {
  console.log(`Uploading ${PROCESS_LINKS.length} processes to Firestore...`);
  const batch = db.batch();

  PROCESS_LINKS.forEach(proc => {
    const docId = safeId(proc.name);
    const ref   = db.collection('process_links').doc(docId);
    const data  = { name: proc.name, cat: proc.cat, links: proc.links };
    if (proc.group) data.group = proc.group;
    batch.set(ref, data);
  });

  const oldEntries = [
    'Double A New Distributor Checklist',
  ];
  oldEntries.forEach(id => {
    batch.delete(db.collection('process_links').doc(id));
  });

  await batch.commit();
  console.log(`✅ All ${PROCESS_LINKS.length} processes uploaded to Firestore successfully!`);

  // Seed bank_details collection
  const bankBatch = db.batch();
  BANK_DETAILS.forEach(b => {
    bankBatch.set(db.collection('bank_details').doc(b.id), b);
  });
  await bankBatch.commit();
  console.log(`✅ Bank details seeded (${BANK_DETAILS.length} accounts)`);
  process.exit(0);
}

seed().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
