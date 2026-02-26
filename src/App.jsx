import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   FONTS & GLOBAL CSS
═══════════════════════════════════════════ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Playfair+Display:wght@400;500;700&family=DM+Mono:wght@300;400&family=Outfit:wght@200;300;400;500;600&display=swap');

    *{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --gold:#C9A84C; --gold2:#E2C97E; --gold3:#8A6F30;
      --bg:#0C0C0E; --bg2:#141416; --bg3:#1A1A1E; --bg4:#222226;
      --bdr:rgba(201,168,76,.14); --bdr2:rgba(255,255,255,.06);
      --t:#F0EDE8; --t2:#A09A92; --t3:#55504A;
    }
    html,body{min-height:100%;background:var(--bg);color:var(--t);font-family:'Outfit',sans-serif;}
    ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:var(--gold3);border-radius:2px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0)}50%{box-shadow:0 0 0 8px rgba(201,168,76,.08)}}
    @keyframes check{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}

    .fu{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
    .fu1{animation-delay:.05s} .fu2{animation-delay:.1s} .fu3{animation-delay:.15s} .fu4{animation-delay:.2s}

    input,textarea,select{
      width:100%;background:var(--bg3);border:1px solid var(--bdr2);
      color:var(--t);font-family:'Outfit',sans-serif;font-size:13px;
      padding:11px 14px;border-radius:8px;outline:none;transition:border .2s;
    }
    input:focus,textarea:focus{border-color:var(--gold)}
    input::placeholder,textarea::placeholder{color:var(--t3)}
    textarea{resize:none}

    .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;
      border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;
      font-weight:500;letter-spacing:.04em;transition:all .2s;white-space:nowrap}
    .btn-gold{background:linear-gradient(135deg,#C9A84C,#A8873A);color:#0C0C0E;
      box-shadow:0 4px 20px rgba(201,168,76,.2)}
    .btn-gold:hover{filter:brightness(1.08);transform:translateY(-1px)}
    .btn-gold:disabled{opacity:.6;transform:none;cursor:default}
    .btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--bdr2)}
    .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
    .btn-sm{padding:7px 14px;font-size:12px}
    .btn-danger{background:rgba(220,60,60,.1);color:#E06060;border:1px solid rgba(220,60,60,.2)}

    .card{background:var(--bg2);border:1px solid var(--bdr2);border-radius:12px;padding:24px}
    .card-gold{border-color:var(--bdr)}

    .tag{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:20px;font-size:11px;letter-spacing:.05em;font-weight:500}
    .tg{background:rgba(201,168,76,.1);color:var(--gold);border:1px solid rgba(201,168,76,.2)}
    .tgr{background:rgba(72,199,142,.08);color:#48C78E;border:1px solid rgba(72,199,142,.18)}
    .tgb{background:var(--bg4);color:var(--t3);border:1px solid var(--bdr2)}
    .tgred{background:rgba(220,60,60,.08);color:#E06060;border:1px solid rgba(220,60,60,.18)}

    .fl{display:flex;align-items:center}
    .fld{display:flex;flex-direction:column}
    .fg{gap:8px} .fg12{gap:12px} .fg16{gap:16px} .fg24{gap:24px}
    .jb{justify-content:space-between} .jc{justify-content:center} .ac{align-items:center}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .span2{grid-column:span 2}

    label.lbl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:5px;display:block}
    .err{font-size:11px;color:#E06060;margin-top:4px}

    .divider{height:1px;background:var(--bdr2);margin:20px 0}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent)}

    .spinner{width:16px;height:16px;border:2px solid rgba(12,12,14,.3);border-top-color:#0C0C0E;border-radius:50%;animation:spin .7s linear infinite}

    .step-dot{width:8px;height:8px;border-radius:50%;background:var(--bdr2);transition:all .3s}
    .step-dot.active{background:var(--gold);box-shadow:0 0 8px rgba(201,168,76,.4)}
    .step-dot.done{background:var(--gold3)}

    table{width:100%;border-collapse:collapse}
    th{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);
       padding:10px 14px;text-align:left;border-bottom:1px solid var(--bdr2);font-weight:400}
    td{padding:13px 14px;font-size:13px;color:var(--t2);border-bottom:1px solid rgba(255,255,255,.025)}
    tr:hover td{background:rgba(255,255,255,.01)}

    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:100;display:flex;
      align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px)}
    .modal{background:var(--bg2);border:1px solid var(--bdr2);border-radius:16px;
      padding:32px;width:100%;max-width:480px;animation:fadeUp .3s cubic-bezier(.16,1,.3,1)}

    .nfc-card{width:100%;max-width:320px;height:196px;border-radius:16px;position:relative;
      overflow:hidden;border:1px solid rgba(201,168,76,.22);
      transition:background .4s,border-color .4s,box-shadow .4s}
    .nfc-dark{background:linear-gradient(135deg,#1A1A1E 0%,#0F0F12 60%,#1A1814 100%)}
    .nfc-light{background:linear-gradient(135deg,#F7F2E8 0%,#EDE5CF 60%,#F2EAD8 100%);
      border-color:rgba(138,111,48,.35);box-shadow:0 4px 32px rgba(0,0,0,.12)}
    .chip{width:30px;height:22px;border-radius:4px;
      background:linear-gradient(135deg,var(--gold3),var(--gold));
      position:absolute;top:22px;left:22px}
    .color-swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;
      transition:all .2s;border:2px solid transparent;
      display:flex;align-items:center;justify-content:center}
    .color-swatch.active{border-color:var(--gold);transform:scale(1.1);
      box-shadow:0 0 0 3px rgba(201,168,76,.2)}
    .color-swatch:hover:not(.active){transform:scale(1.06)}

    .profile-bg{min-height:100vh;
      background:radial-gradient(ellipse 70% 50% at 50% -10%,rgba(201,168,76,.1) 0%,transparent 65%),
      linear-gradient(180deg,#09090B,#0D0D10)}

    .action-tile{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;
      padding:14px 8px;border-radius:10px;cursor:pointer;transition:all .2s;
      background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);
      font-size:11px;color:var(--t3);letter-spacing:.03em}
    .action-tile:hover{background:rgba(201,168,76,.06);border-color:rgba(201,168,76,.2);color:var(--gold2)}

    .social-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:9px;
      background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);
      text-decoration:none;transition:all .2s;cursor:pointer}
    .social-row:hover{background:rgba(201,168,76,.06);border-color:rgba(201,168,76,.2)}

    .plan-card{border:1px solid var(--bdr2);border-radius:12px;padding:20px;cursor:pointer;
      transition:all .25s;background:var(--bg2)}
    .plan-card.sel{border-color:var(--gold);background:rgba(201,168,76,.05);
      transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.1)}

    .contact-info-row{display:flex;align-items:center;gap:12px;padding:11px 0;
      border-bottom:1px solid rgba(255,255,255,.04)}

    .add-btn{width:100%;padding:15px;border-radius:12px;border:none;cursor:pointer;
      font-family:'Outfit',sans-serif;font-weight:600;font-size:14px;letter-spacing:.08em;
      text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:10px;
      transition:all .35s cubic-bezier(.16,1,.3,1)}
    .add-btn.idle{background:linear-gradient(135deg,#C9A84C,#A8873A);color:#0C0C0E;
      box-shadow:0 8px 32px rgba(201,168,76,.28)}
    .add-btn.idle:hover{filter:brightness(1.08);transform:translateY(-1px)}
    .add-btn.loading{background:linear-gradient(135deg,#A8873A,#8A6F30);color:rgba(12,12,14,.8)}
    .add-btn.done{background:linear-gradient(135deg,#1E3A2A,#162E21);color:#48C78E;
      border:1px solid rgba(72,199,142,.25)}

    .sidebar{width:210px;min-height:100vh;background:var(--bg2);border-right:1px solid var(--bdr2);
      display:flex;flex-direction:column;padding:0;flex-shrink:0}
    .nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;border-radius:7px;
      cursor:pointer;transition:all .15s;font-size:13px;color:var(--t2);margin:0 8px}
    .nav-item:hover{background:var(--bg3);color:var(--t)}
    .nav-item.active{background:rgba(201,168,76,.09);color:var(--gold)}

    .notif{position:fixed;top:18px;right:18px;z-index:200;
      background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;
      padding:13px 18px;display:flex;align-items:center;gap:10px;
      font-size:13px;animation:fadeUp .3s;box-shadow:0 8px 32px rgba(0,0,0,.4)}
  `}</style>
);

/* ═══════════════════════════════════════════
   ICONS
═══════════════════════════════════════════ */
const Ic = ({ n, s = 16, c = "currentColor" }) => {
  const d = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    checkC: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    wifi: <><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    adduser: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>,
    qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zm3 3h3v3h-3zm-3 3v3"/></>,
    crown: <><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="5" y1="20" x2="19" y2="20"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
const slug = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const uid  = () => Math.random().toString(36).slice(2,9).toUpperCase();
const BASE = "https://ncard.io/p/";
const url  = o => `${BASE}${slug(o.firstName+" "+o.lastName)}`;

const PLANS = [
  { id:"Standard", price:"49€", sub:"+ 29€/an", color:"var(--t2)", features:["Profil connecté","Lien NFC","QR Code","3 réseaux sociaux"] },
  { id:"Premium",  price:"89€", sub:"+ 49€/an", color:"var(--gold)", popular:true, features:["Tout Standard","Biographie & logo","Réseaux illimités","Statistiques avancées"] },
  { id:"Prestige", price:"149€",sub:"+ 79€/an", color:"var(--gold2)", features:["Tout Premium","Visite virtuelle 360°","Design sur-mesure","Gestionnaire dédié"] },
];

const SOCIALS = [
  {k:"linkedin",   l:"LinkedIn",      ic:"linkedin",  ph:"linkedin.com/in/…"},
  {k:"instagram",  l:"Instagram",     ic:"instagram", ph:"@compte"},
  {k:"twitter",    l:"X (Twitter)",   ic:"twitter",   ph:"@compte"},
  {k:"website",    l:"Site internet", ic:"globe",     ph:"www.monsite.fr"},
];

/* ═══════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════ */
const STORE_KEY = "ncard-orders-v1";

async function loadOrders() {
  try {
    const r = await window.storage.get(STORE_KEY, true);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}
async function saveOrders(orders) {
  try { await window.storage.set(STORE_KEY, JSON.stringify(orders), true); } catch {}
}

const CARD_THEMES = [
  { id:"dark",  label:"Noir",  bg:"linear-gradient(135deg,#1A1A1E,#0F0F12,#1A1814)", text:"#F0EDE8", sub:"rgba(201,168,76,.85)", border:"rgba(201,168,76,.22)", shine:"rgba(201,168,76,.04)" },
  { id:"light", label:"Ivoire",bg:"linear-gradient(135deg,#F7F2E8,#EDE5CF,#F2EAD8)",  text:"#2A2318", sub:"rgba(138,111,48,.9)",  border:"rgba(138,111,48,.35)", shine:"rgba(255,255,255,.5)" },
  { id:"slate", label:"Ardoise",bg:"linear-gradient(135deg,#252830,#1A1D24,#252520)", text:"#E8E4DC", sub:"rgba(201,168,76,.8)",  border:"rgba(201,168,76,.18)", shine:"rgba(201,168,76,.03)" },
  { id:"stone", label:"Pierre", bg:"linear-gradient(135deg,#3A3530,#2E2A24,#3A3530)", text:"#F0EDE8", sub:"rgba(226,201,126,.85)",border:"rgba(201,168,76,.2)",  shine:"rgba(201,168,76,.04)" },
];

/* ── NFC Card visual component ── */
const NFCCard = ({ firstName="", lastName="", title="", theme="dark", withLogo=false, style={} }) => {
  const t = CARD_THEMES.find(c=>c.id===theme)||CARD_THEMES[0];
  return (
    <div className="nfc-card" style={{background:t.bg, borderColor:t.border, ...style}}>
      {/* Chip */}
      <div className="chip"/>
      {/* NFC antenna rings (top right) */}
      <div style={{position:"absolute",top:14,right:14,width:44,height:44}}>
        {[44,32,20].map((sz,i)=>(
          <div key={sz} style={{position:"absolute",top:(44-sz)/2,left:(44-sz)/2,
            width:sz,height:sz,borderRadius:"50%",
            border:`1px solid ${t.id==="light"?"rgba(138,111,48,.25)":"rgba(201,168,76,.18)"}`,
            opacity:1-i*.2}}/>
        ))}
      </div>
      {/* Center: N-CARD logo */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-58%)",textAlign:"center"}}>
        {withLogo ? (
          <div style={{width:36,height:36,borderRadius:8,
            background:t.id==="light"?"rgba(138,111,48,.15)":"rgba(201,168,76,.1)",
            border:`1px dashed ${t.id==="light"?"rgba(138,111,48,.4)":"rgba(201,168,76,.3)"}`,
            display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontSize:9,color:t.id==="light"?"rgba(138,111,48,.7)":"rgba(201,168,76,.6)"}}>
            LOGO
          </div>
        ) : (
          <div style={{display:"flex",alignItems:"baseline",gap:1,justifyContent:"center",marginBottom:4}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:t.sub,lineHeight:1}}>N</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:200,letterSpacing:".2em",color:t.text==="#2A2318"?"rgba(42,35,24,.5)":"rgba(240,237,232,.35)"}}>-CARD</span>
          </div>
        )}
      </div>
      {/* Bottom: name + title */}
      <div style={{position:"absolute",bottom:16,left:18,right:18}}>
        <div style={{height:"0.5px",background:`linear-gradient(90deg,${t.sub},transparent)`,marginBottom:8,opacity:.5}}/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:400,color:t.text,letterSpacing:".02em",marginBottom:2,lineHeight:1.2}}>
          {firstName||"Prénom"} {lastName||"Nom"}
        </p>
        <p style={{fontSize:9,color:t.sub,letterSpacing:".07em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",fontWeight:300}}>
          {title||"Poste / Fonction"}
        </p>
      </div>
      {/* Sheen overlay */}
      <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${t.shine},transparent 55%,${t.shine})`,pointerEvents:"none"}}/>
    </div>
  );
};
const Notif = ({ msg, ok, onClose }) => (
  <div className="notif">
    <Ic n={ok ? "checkC" : "x"} s={15} c={ok ? "#48C78E" : "#E06060"} />
    <span>{msg}</span>
    <div onClick={onClose} style={{cursor:"pointer",color:"var(--t3)",marginLeft:6}}><Ic n="x" s={13}/></div>
  </div>
);

/* ═══════════════════════════════════════════
   PUBLIC PROFILE  (vue interlocuteur NFC)
═══════════════════════════════════════════ */
const PublicProfile = ({ order, onClose }) => {
  const [btnState, setBtnState] = useState("idle");
  const ini = `${order.firstName[0]}${order.lastName[0]}`.toUpperCase();

  const makeVCF = () => {
    return [
      "BEGIN:VCARD","VERSION:3.0",
      `FN:${order.firstName} ${order.lastName}`,
      `N:${order.lastName};${order.firstName};;;`,
      order.title   && `TITLE:${order.title}`,
      order.company && `ORG:${order.company}`,
      order.phone   && `TEL;TYPE=CELL:${order.phone}`,
      order.email   && `EMAIL;TYPE=WORK:${order.email}`,
      order.website && `URL:https://${order.website.replace(/^https?:\/\//,"")}`,
      order.bio     && `NOTE:${order.bio}`,
      order.linkedin  && `X-SOCIALPROFILE;TYPE=linkedin:${order.linkedin}`,
      order.instagram && `X-SOCIALPROFILE;TYPE=instagram:${order.instagram}`,
      `X-NCARD-URL:${url(order)}`,
      `REV:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z`,
      "END:VCARD"
    ].filter(Boolean).join("\r\n");
  };

  const addContact = () => {
    setBtnState("loading");
    setTimeout(() => {
      const blob = new Blob([makeVCF()], {type:"text/vcard;charset=utf-8"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${order.firstName}_${order.lastName}.vcf`;
      a.click();
      setBtnState("done");
      setTimeout(() => setBtnState("idle"), 4000);
    }, 700);
  };

  const planData = PLANS.find(p => p.id === order.plan) || PLANS[1];

  return (
    <div className="profile-bg" style={{minHeight:"100vh",position:"relative"}}>
      {onClose && (
        <div style={{position:"fixed",top:16,left:16,zIndex:10}}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{backdropFilter:"blur(8px)",background:"rgba(12,12,14,.6)"}}>
            <Ic n="x" s={13}/> Fermer
          </button>
        </div>
      )}
      <div style={{maxWidth:400,margin:"0 auto",padding:"52px 20px 48px"}} className="fu">

        {/* Gold line top */}
        <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.5),transparent)",marginBottom:40}}/>

        {/* Identity */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:96,height:96,borderRadius:"50%",margin:"0 auto 16px",
            background:"linear-gradient(135deg,#1C1C20,#242428)",
            border:"2px solid rgba(201,168,76,.4)",
            boxShadow:"0 0 0 6px rgba(201,168,76,.05),0 16px 48px rgba(0,0,0,.5)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,
            color:"var(--gold2)"}}>
            {ini}
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
            <span className="tag tg" style={{fontSize:10}}>◆ Profil Vérifié N-CARD</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:500,marginBottom:4}}>
            {order.firstName} {order.lastName}
          </h1>
          <p style={{color:"var(--gold)",fontSize:13,letterSpacing:".05em",marginBottom:3}}>{order.title}</p>
          <p style={{color:"var(--t3)",fontSize:12}}>{order.company}</p>
        </div>

        {/* ── AJOUTER AUX CONTACTS ── */}
        <div style={{marginBottom:24}}>
          <button className={`add-btn ${btnState}`} onClick={btnState==="idle"?addContact:undefined}>
            {btnState==="loading" && <div className="spinner" style={{borderTopColor:"rgba(12,12,14,.5)"}}/>}
            {btnState==="done"    && <Ic n="checkC" s={17} c="#48C78E"/>}
            {btnState==="idle"    && <Ic n="adduser" s={17} c="#0C0C0E"/>}
            {btnState==="loading" ? "Préparation…"
             : btnState==="done"  ? "Contact enregistré !"
             : "Ajouter aux Contacts"}
          </button>
          <p style={{textAlign:"center",fontSize:11,color:"var(--t3)",marginTop:7}}>
            {btnState==="done"
              ? "Ouvrez le fichier .vcf pour enregistrer dans vos contacts"
              : "Appuyez pour enregistrer cette fiche dans votre téléphone"}
          </p>
        </div>

        {/* Gold divider */}
        <div className="gold-line" style={{margin:"4px 0 22px"}}/>

        {/* Bio */}
        {order.bio && (
          <p style={{fontSize:14,fontFamily:"'Cormorant Garamond',serif",color:"var(--t2)",
            lineHeight:1.75,textAlign:"center",marginBottom:22,fontStyle:"italic"}}>
            "{order.bio}"
          </p>
        )}

        {/* Quick actions */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {order.phone && (
            <a href={`tel:${order.phone}`} className="action-tile" style={{textDecoration:"none"}}>
              <Ic n="phone" s={16} c="var(--gold)"/> Appeler
            </a>
          )}
          {order.email && (
            <a href={`mailto:${order.email}`} className="action-tile" style={{textDecoration:"none"}}>
              <Ic n="mail" s={16} c="var(--gold)"/> E-mail
            </a>
          )}
          <div className="action-tile" onClick={addContact}>
            <Ic n="download" s={16} c="var(--gold)"/> vCard
          </div>
        </div>

        {/* Contact details */}
        <div style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,marginBottom:18,overflow:"hidden"}}>
          {[
            order.phone   && {ic:"phone",  l:"Téléphone",  v:order.phone,   href:`tel:${order.phone}`},
            order.email   && {ic:"mail",   l:"E-mail",     v:order.email,   href:`mailto:${order.email}`},
            order.website && {ic:"globe",  l:"Site web",   v:order.website, href:`https://${order.website.replace(/^https?:\/\//,"")}`},
          ].filter(Boolean).map((row,i,arr)=>(
            <div key={row.l} className="contact-info-row"
              style={{padding:"11px 14px",cursor:row.href?"pointer":"default",
                      borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,.04)":"none"}}
              onClick={()=>row.href&&window.open(row.href)}>
              <div style={{width:30,height:30,borderRadius:7,background:"rgba(201,168,76,.07)",
                border:"1px solid rgba(201,168,76,.12)",display:"flex",alignItems:"center",
                justifyContent:"center",flexShrink:0}}>
                <Ic n={row.ic} s={13} c="var(--gold)"/>
              </div>
              <div style={{flex:1,minWidth:0,marginLeft:10}}>
                <p style={{fontSize:10,color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase"}}>{row.l}</p>
                <p style={{fontSize:13,color:"var(--t2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.v}</p>
              </div>
              {row.href && <Ic n="link" s={11} c="var(--t3)"/>}
            </div>
          ))}
        </div>

        {/* Socials */}
        {(order.linkedin||order.instagram||order.twitter) && (
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
            {order.linkedin  && <a className="social-row" href={`https://linkedin.com/${order.linkedin}`} target="_blank" rel="noopener noreferrer"><Ic n="linkedin" s={15} c="var(--gold)"/><span style={{fontSize:13,color:"var(--t2)"}}>{order.linkedin}</span><Ic n="link" s={10} c="var(--t3)" style={{marginLeft:"auto"}}/></a>}
            {order.instagram && <a className="social-row" href={`https://instagram.com/${order.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer"><Ic n="instagram" s={15} c="var(--gold)"/><span style={{fontSize:13,color:"var(--t2)"}}>{order.instagram}</span><Ic n="link" s={10} c="var(--t3)" style={{marginLeft:"auto"}}/></a>}
            {order.twitter   && <a className="social-row" href={`https://x.com/${order.twitter.replace("@","")}`} target="_blank" rel="noopener noreferrer"><Ic n="twitter" s={15} c="var(--gold)"/><span style={{fontSize:13,color:"var(--t2)"}}>{order.twitter}</span><Ic n="link" s={10} c="var(--t3)" style={{marginLeft:"auto"}}/></a>}
          </div>
        )}

        {/* Footer */}
        <div className="gold-line" style={{margin:"8px 0 20px"}}/>
        <div style={{textAlign:"center"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:"var(--gold)"}}>N</span>
          <span style={{fontSize:12,letterSpacing:".15em",color:"var(--t3)"}}>-CARD</span>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--t3)",marginTop:4,opacity:.5}}>{url(order)}</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   ORDER FORM  (tunnel de commande client)
═══════════════════════════════════════════ */
const OrderForm = ({ onSuccess }) => {
  const [step, setStep]   = useState(0);
  const [plan, setPlan]   = useState("Premium");
  const [cardTheme, setCardTheme] = useState("dark");
  const [logoEngraving, setLogoEngraving] = useState(false);
  const [fd,   setFd]     = useState({});
  const [errs, setErrs]   = useState({});
  const [busy, setBusy]   = useState(false);

  const upd = (k,v) => { setFd(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };

  const validate = () => {
    if(step!==1) return true;
    const e={};
    if(!fd.firstName?.trim()) e.firstName="Requis";
    if(!fd.lastName?.trim())  e.lastName="Requis";
    if(!fd.title?.trim())     e.title="Requis";
    if(!fd.company?.trim())   e.company="Requis";
    if(!fd.email?.trim())     e.email="Requis";
    else if(!/\S+@\S+\.\S+/.test(fd.email)) e.email="E-mail invalide";
    setErrs(e); return !Object.keys(e).length;
  };

  const next = () => { if(validate()) setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);

  const submit = async () => {
    setBusy(true);
    const orders = await loadOrders();
    const order = { ...fd, plan, cardTheme, logoEngraving, id:uid(), nfcId:`NFC-${uid()}`, createdAt:new Date().toISOString(), nfcEncoded:false };
    orders.push(order);
    await saveOrders(orders);
    setBusy(false);
    onSuccess(order);
  };

  const STEPS = ["Gamme","Informations","Réseaux","Confirmation"];
  const planData = PLANS.find(p=>p.id===plan);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>

      {/* Header */}
      <div style={{padding:"16px 28px",borderBottom:"1px solid var(--bdr2)",background:"var(--bg2)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div className="fl fg">
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:300,color:"var(--gold)"}}>N</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:200,letterSpacing:".2em",color:"var(--t)"}}>-CARD</span>
        </div>
        {/* Progress */}
        <div className="fl fg12">
          {STEPS.map((s,i)=>(
            <div key={s} className="fl fg" style={{gap:5,alignItems:"center"}}>
              {i>0 && <div style={{width:24,height:1,background:i<=step?"var(--gold3)":"var(--bdr2)",transition:"background .3s"}}/>}
              <div className="fl" style={{gap:5,alignItems:"center"}}>
                <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                  background:i<step?"var(--gold)":i===step?"rgba(201,168,76,.12)":"var(--bg3)",
                  border:`1.5px solid ${i<=step?"var(--gold)":"var(--bdr2)"}`,
                  fontSize:10,fontWeight:600,transition:"all .3s",
                  color:i<step?"#0C0C0E":i===step?"var(--gold)":"var(--t3)"}}>
                  {i<step ? <Ic n="check" s={10} c="#0C0C0E"/> : i+1}
                </div>
                <span style={{fontSize:10,letterSpacing:".06em",color:i===step?"var(--gold)":i<step?"var(--t2)":"var(--t3)",display:"none"}}>{s.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{width:80}}/>
      </div>

      {/* Content */}
      <div style={{flex:1,display:"flex",justifyContent:"center",padding:"44px 24px 24px",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:step===0?860:step===1?760:600}} className="fu">

          {/* STEP 0 — Plan + Personnalisation carte */}
          {step===0 && (
            <>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:6}}>Choisissez votre gamme</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginBottom:28}}>Carte physique NFC + profil numérique inclus</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:32}}>
                {PLANS.map(p=>(
                  <div key={p.id} className={`plan-card ${plan===p.id?"sel":""}`} onClick={()=>setPlan(p.id)} style={{position:"relative"}}>
                    {p.popular && <div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",background:"var(--gold)",color:"#0C0C0E",fontSize:9,fontWeight:700,padding:"2px 12px",borderRadius:20,letterSpacing:".08em",whiteSpace:"nowrap"}}>LE PLUS CHOISI</div>}
                    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
                      <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${plan===p.id?p.color:"var(--t3)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                        {plan===p.id && <div style={{width:7,height:7,borderRadius:"50%",background:p.color}}/>}
                      </div>
                    </div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:500,color:p.color,marginBottom:2}}>{p.id}</div>
                    <div style={{fontSize:22,fontWeight:600,marginBottom:1}}>{p.price}</div>
                    <div style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>{p.sub}</div>
                    <div style={{height:1,background:`linear-gradient(90deg,${p.color}25,transparent)`,marginBottom:12}}/>
                    {p.features.map(f=>(
                      <div key={f} className="fl" style={{gap:7,marginBottom:6,fontSize:12,color:"var(--t2)"}}>
                        <span style={{color:p.color,fontWeight:600}}>›</span>{f}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── Personnalisation de la carte physique ── */}
              <div style={{border:"1px solid var(--bdr2)",borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",background:"var(--bg3)",borderBottom:"1px solid var(--bdr2)",display:"flex",alignItems:"center",gap:10}}>
                  <Ic n="edit" s={14} c="var(--gold3)"/>
                  <p style={{fontSize:13,fontWeight:500,color:"var(--t)"}}>Personnalisation de votre carte physique</p>
                </div>

                <div style={{padding:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>

                  {/* Left: controls */}
                  <div>
                    {/* Couleur */}
                    <div style={{marginBottom:24}}>
                      <label className="lbl" style={{marginBottom:12}}>Couleur de la carte</label>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        {CARD_THEMES.map(t=>(
                          <div key={t.id} title={t.label}
                            className={`color-swatch ${cardTheme===t.id?"active":""}`}
                            onClick={()=>setCardTheme(t.id)}
                            style={{background:t.bg}}>
                            {cardTheme===t.id && (
                              <div style={{width:8,height:8,borderRadius:"50%",background:"rgba(201,168,76,.9)"}}/>
                            )}
                          </div>
                        ))}
                      </div>
                      <p style={{fontSize:11,color:"var(--gold)",marginTop:8,letterSpacing:".04em"}}>
                        {CARD_THEMES.find(t=>t.id===cardTheme)?.label}
                      </p>
                    </div>

                    {/* Gravure logo */}
                    <div style={{padding:"14px 16px",borderRadius:10,
                      background:logoEngraving?"rgba(201,168,76,.06)":"var(--bg3)",
                      border:`1px solid ${logoEngraving?"rgba(201,168,76,.3)":"var(--bdr2)"}`,
                      cursor:"pointer",transition:"all .25s"}}
                      onClick={()=>setLogoEngraving(v=>!v)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <Ic n="zap" s={14} c={logoEngraving?"var(--gold)":"var(--t3)"}/>
                          <span style={{fontSize:13,fontWeight:500,color:logoEngraving?"var(--t)":"var(--t2)"}}>Gravure de mon logo</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,fontWeight:600,color:"var(--gold)"}}>+ 30€</span>
                          {/* Toggle */}
                          <div style={{width:34,height:19,borderRadius:10,background:logoEngraving?"var(--gold)":"var(--bg4)",border:`1px solid ${logoEngraving?"var(--gold)":"var(--bdr2)"}`,position:"relative",transition:"all .2s",flexShrink:0}}>
                            <div style={{position:"absolute",top:2,left:logoEngraving?15:2,width:13,height:13,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
                          </div>
                        </div>
                      </div>
                      <p style={{fontSize:11,color:"var(--t3)",lineHeight:1.5,paddingLeft:22}}>
                        Votre logo d'entreprise gravé sur la carte — envoi du fichier (SVG ou PNG HD) après commande.
                      </p>
                      {logoEngraving && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(201,168,76,.15)",paddingLeft:22,display:"flex",alignItems:"center",gap:6}}>
                          <Ic n="check" s={12} c="#48C78E"/>
                          <span style={{fontSize:11,color:"#48C78E"}}>Option ajoutée — nous vous contacterons pour le fichier logo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: live card preview */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                    <p className="lbl" style={{alignSelf:"flex-start"}}>Aperçu en direct</p>
                    <NFCCard
                      firstName="" lastName="" title=""
                      theme={cardTheme} withLogo={logoEngraving}
                      style={{maxWidth:"100%",boxShadow:"0 12px 48px rgba(0,0,0,.4)"}}
                    />
                    <p style={{fontSize:10,color:"var(--t3)",textAlign:"center",lineHeight:1.5}}>
                      Le nom et le poste apparaîtront une fois vos informations renseignées
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 1 — Infos */}
          {step===1 && (
            <>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:6}}>Vos informations professionnelles</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginBottom:24}}>Ces données seront sur votre carte et sur votre profil numérique</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:24,alignItems:"start"}}>
                {/* Form fields */}
                <div className="g2">
                  {[
                    {k:"firstName",l:"Prénom",      ph:"Sophie",           req:true, half:true},
                    {k:"lastName", l:"Nom",          ph:"Leclerc",          req:true, half:true},
                    {k:"title",    l:"Poste / Fonction", ph:"Directrice Commerciale", req:true, span:true},
                    {k:"company",  l:"Entreprise",   ph:"SL Luxury Events", req:true, span:true},
                    {k:"phone",    l:"Téléphone",    ph:"+33 6 00 00 00 00", half:true},
                    {k:"email",    l:"E-mail professionnel", ph:"sophie@entreprise.fr", req:true, half:true, type:"email"},
                  ].map(f=>(
                    <div key={f.k} style={{gridColumn:f.span?"span 2":"span 1"}}>
                      <label className="lbl">{f.l}{f.req&&<span style={{color:"var(--gold)",marginLeft:3}}>*</span>}</label>
                      <input value={fd[f.k]||""} onChange={e=>upd(f.k,e.target.value)} placeholder={f.ph} type={f.type||"text"}
                        style={{borderColor:errs[f.k]?"rgba(220,60,60,.5)":undefined}}/>
                      {errs[f.k] && <p className="err">{errs[f.k]}</p>}
                    </div>
                  ))}
                  <div style={{gridColumn:"span 2"}}>
                    <label className="lbl">Biographie courte <span style={{color:"var(--t3)",fontWeight:300}}>(optionnel, max 240 car.)</span></label>
                    <textarea value={fd.bio||""} onChange={e=>upd("bio",e.target.value)} rows={2} maxLength={240}
                      placeholder="Décrivez votre activité en quelques mots…"/>
                    <div style={{textAlign:"right",fontSize:11,color:"var(--t3)",marginTop:3}}>{(fd.bio||"").length}/240</div>
                  </div>
                  {/* URL preview */}
                  {(fd.firstName||fd.lastName) && (
                    <div style={{gridColumn:"span 2",padding:"10px 14px",background:"var(--bg3)",borderRadius:8,border:"1px solid var(--bdr2)",display:"flex",alignItems:"center",gap:8}}>
                      <Ic n="link" s={12} c="var(--gold3)"/>
                      <span style={{fontSize:11,color:"var(--t3)"}}>Votre URL :</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--gold2)"}}>
                        {BASE}{slug(`${fd.firstName||""} ${fd.lastName||""}`.trim())}
                      </span>
                    </div>
                  )}
                </div>
                {/* Live card preview */}
                <div style={{position:"sticky",top:24,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <p className="lbl" style={{alignSelf:"flex-start"}}>Votre carte</p>
                  <NFCCard
                    firstName={fd.firstName} lastName={fd.lastName} title={fd.title}
                    theme={cardTheme} withLogo={logoEngraving}
                    style={{maxWidth:"100%",boxShadow:"0 12px 48px rgba(0,0,0,.4)"}}
                  />
                  <div style={{textAlign:"center"}}>
                    <span className="tag tg" style={{fontSize:10}}>{CARD_THEMES.find(t=>t.id===cardTheme)?.label}</span>
                    {logoEngraving && <span className="tag tg" style={{fontSize:10,marginLeft:6}}>+ Gravure logo</span>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — Socials */}
          {step===2 && (
            <>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:6}}>Réseaux sociaux & liens</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginBottom:28}}>Tous optionnels — apparaîtront sur votre profil public</p>
              <div className="g2">
                {SOCIALS.map(s=>(
                  <div key={s.k}>
                    <label className="lbl" style={{display:"flex",alignItems:"center",gap:5}}>
                      <Ic n={s.ic} s={11} c="var(--gold3)"/> {s.l}
                    </label>
                    <input value={fd[s.k]||""} onChange={e=>upd(s.k,e.target.value)} placeholder={s.ph}/>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 3 — Confirm */}
          {step===3 && (
            <>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:6}}>Récapitulatif de votre commande</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginBottom:24}}>Vérifiez avant de valider — vous pourrez modifier votre profil depuis votre espace client</p>

              <div className="g2">
                {/* Gamme */}
                <div className="card card-gold">
                  <p className="lbl" style={{marginBottom:10}}>Gamme</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:planData.color}}>{plan}</span>
                    <span style={{fontSize:18,fontWeight:600}}>{planData.price}</span>
                  </div>
                  <p style={{fontSize:11,color:"var(--t3)",marginBottom:10}}>{planData.sub} (renouvellement annuel)</p>
                  <div className="divider" style={{margin:"10px 0"}}/>
                  {planData.features.map(f=><div key={f} className="fl" style={{gap:7,fontSize:11,color:"var(--t2)",marginBottom:5}}><span style={{color:planData.color}}>›</span>{f}</div>)}
                  {logoEngraving && (
                    <div style={{marginTop:10,padding:"8px 10px",background:"rgba(201,168,76,.06)",borderRadius:7,border:"1px solid rgba(201,168,76,.15)"}}>
                      <div className="fl" style={{gap:7,fontSize:11,color:"var(--gold)"}}>
                        <Ic n="zap" s={11} c="var(--gold)"/>
                        Gravure logo · <strong>+30€</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card preview */}
                <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
                  <p className="lbl" style={{alignSelf:"flex-start"}}>Votre carte physique</p>
                  <NFCCard
                    firstName={fd.firstName} lastName={fd.lastName} title={fd.title}
                    theme={cardTheme} withLogo={logoEngraving}
                    style={{maxWidth:"100%",boxShadow:"0 12px 40px rgba(0,0,0,.4)"}}
                  />
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
                    <span className="tag tg" style={{fontSize:10}}>{CARD_THEMES.find(t=>t.id===cardTheme)?.label}</span>
                    {logoEngraving && <span className="tag tg" style={{fontSize:10}}>◆ Gravure logo · +30€</span>}
                  </div>
                </div>

                {/* Infos */}
                <div className="card">
                  <p className="lbl" style={{marginBottom:10}}>Vos informations</p>
                  {[
                    [fd.firstName+" "+fd.lastName,"user"],
                    [fd.title,"edit"],
                    [fd.company,"package"],
                    [fd.phone,"phone"],
                    [fd.email,"mail"],
                  ].filter(([v])=>v).map(([v,ic])=>(
                    <div key={v} className="fl" style={{gap:9,padding:"7px 0",borderBottom:"1px solid var(--bdr2)"}}>
                      <Ic n={ic} s={12} c="var(--t3)"/>
                      <span style={{fontSize:12,color:"var(--t2)"}}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Socials */}
                <div className="card">
                  <p className="lbl" style={{marginBottom:10}}>Réseaux & liens</p>
                  {SOCIALS.filter(s=>fd[s.k]).map(s=>(
                    <div key={s.k} className="fl" style={{gap:9,padding:"7px 0",borderBottom:"1px solid var(--bdr2)"}}>
                      <Ic n={s.ic} s={12} c="var(--gold3)"/>
                      <span style={{fontSize:12,color:"var(--t2)"}}>{fd[s.k]}</span>
                    </div>
                  ))}
                  {!SOCIALS.some(s=>fd[s.k]) && <p style={{fontSize:12,color:"var(--t3)",fontStyle:"italic"}}>Aucun réseau renseigné</p>}
                </div>
              </div>

              {/* Delivery notice */}
              <div style={{marginTop:14,padding:"14px 18px",background:"rgba(201,168,76,.04)",border:"1px solid rgba(201,168,76,.12)",borderRadius:10,display:"flex",gap:12,alignItems:"center"}}>
                <Ic n="package" s={18} c="var(--gold3)"/>
                <div>
                  <p style={{fontSize:13,fontWeight:500,marginBottom:2}}>Production & livraison sous 7 à 10 jours ouvrés</p>
                  <p style={{fontSize:11,color:"var(--t3)"}}>Votre carte sera encodée NFC avec votre URL personnelle et expédiée à l'adresse indiquée lors du paiement.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{padding:"16px 28px",borderTop:"1px solid var(--bdr2)",background:"var(--bg2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button className="btn btn-ghost" onClick={back} style={{visibility:step>0?"visible":"hidden"}}>← Précédent</button>
        <div className="fl" style={{gap:6}}>
          {STEPS.map((_,i)=><div key={i} className={`step-dot ${i===step?"active":i<step?"done":""}`}/>)}
        </div>
        {step<3
          ? <button className="btn btn-gold" onClick={next}>Suivant →</button>
          : <button className="btn btn-gold" onClick={submit} disabled={busy}>
              {busy ? <><div className="spinner"/>Envoi en cours…</> : <><Ic n="checkC" s={14} c="#0C0C0E"/> Confirmer la commande</>}
            </button>
        }
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   ORDER SUCCESS
═══════════════════════════════════════════ */
const OrderSuccess = ({ order, onViewProfile, onNewOrder }) => (
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{maxWidth:520,width:"100%",textAlign:"center"}} className="fu">
      {/* Checkmark */}
      <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(72,199,142,.1)",border:"1px solid rgba(72,199,142,.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#48C78E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" style={{strokeDasharray:30,strokeDashoffset:0,animation:"check .4s ease .2s both"}}/>
        </svg>
      </div>

      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,marginBottom:8}}>Commande enregistrée !</h2>
      <p style={{fontSize:14,color:"var(--t2)",marginBottom:28,lineHeight:1.7}}>
        Merci <strong style={{color:"var(--t)"}}>{order.firstName}</strong>. Votre carte <span style={{color:"var(--gold)"}}>{order.plan}</span> est en cours de traitement.
      </p>

      {/* Card preview */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
        <NFCCard
          firstName={order.firstName} lastName={order.lastName} title={order.title}
          theme={order.cardTheme||"dark"} withLogo={order.logoEngraving}
          style={{maxWidth:300,boxShadow:"0 16px 56px rgba(0,0,0,.5)"}}
        />
      </div>
      {order.logoEngraving && (
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{padding:"8px 16px",background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.2)",borderRadius:8,fontSize:12,color:"var(--gold)",display:"flex",alignItems:"center",gap:8}}>
            <Ic n="zap" s={13} c="var(--gold)"/>
            Gravure logo activée — nous vous contacterons par e-mail pour récupérer votre fichier
          </div>
        </div>
      )}

      <div className="card card-gold" style={{textAlign:"left",marginBottom:20}}>
        <p className="lbl" style={{marginBottom:12}}>Votre profil numérique</p>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--bg3)",borderRadius:8,marginBottom:12}}>
          <Ic n="link" s={14} c="var(--gold)"/>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold2)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url(order)}</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard.writeText(url(order)).catch(()=>{})}}>
            <Ic n="copy" s={12}/>
          </button>
        </div>
        <div className="fl" style={{gap:8}}>
          <div style={{flex:1,padding:"10px",background:"var(--bg3)",borderRadius:8,textAlign:"center"}}>
            <p style={{fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>ID NFC</p>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--t)",marginTop:3}}>{order.nfcId}</p>
          </div>
          <div style={{flex:1,padding:"10px",background:"var(--bg3)",borderRadius:8,textAlign:"center"}}>
            <p style={{fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>Gamme</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"var(--gold)",marginTop:3}}>{order.plan}</p>
          </div>
          <div style={{flex:1,padding:"10px",background:"var(--bg3)",borderRadius:8,textAlign:"center"}}>
            <p style={{fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>Couleur</p>
            <p style={{fontSize:12,color:"var(--t2)",marginTop:3}}>{CARD_THEMES.find(t=>t.id===order.cardTheme)?.label||"Noir"}</p>
          </div>
        </div>
      </div>

      <div className="fl fg12" style={{justifyContent:"center"}}>
        <button className="btn btn-gold" onClick={onViewProfile}><Ic n="eye" s={14} c="#0C0C0E"/> Voir mon profil public</button>
        <button className="btn btn-ghost" onClick={onNewOrder}><Ic n="plus" s={14}/> Nouvelle commande</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   ADMIN LOGIN
═══════════════════════════════════════════ */
const AdminLogin = ({ onLogin }) => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const PASS = "ncard2025";
  const tryLogin = () => { if(pw===PASS) onLogin(); else { setErr(true); setTimeout(()=>setErr(false),2000); }};
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:340,width:"100%"}} className="fu">
        <div style={{textAlign:"center",marginBottom:32}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:"var(--gold)"}}>N</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:200,letterSpacing:".2em"}}>-CARD</span>
          <p style={{fontSize:11,color:"var(--t3)",letterSpacing:".1em",marginTop:4}}>ESPACE ADMINISTRATEUR</p>
        </div>
        <div className="card card-gold">
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(201,168,76,.08)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ic n="lock" s={18} c="var(--gold)"/>
            </div>
          </div>
          <label className="lbl">Mot de passe administrateur</label>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}}
            onKeyDown={e=>e.key==="Enter"&&tryLogin()}
            placeholder="••••••••"
            style={{borderColor:err?"rgba(220,60,60,.5)":undefined,marginBottom:err?4:16}}/>
          {err && <p className="err" style={{marginBottom:12}}>Mot de passe incorrect</p>}
          <button className="btn btn-gold" style={{width:"100%",justifyContent:"center"}} onClick={tryLogin}>
            <Ic n="lock" s={14} c="#0C0C0E"/> Accéder au panel
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"var(--t3)",marginTop:16}}>Mot de passe par défaut : <span style={{fontFamily:"'DM Mono',monospace",color:"var(--gold)"}}>ncard2025</span></p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════ */
const AdminPanel = ({ onLogout, showNotif }) => {
  const [orders,   setOrders]   = useState([]);
  const [search,   setSearch]   = useState("");
  const [planF,    setPlanF]    = useState("all");
  const [tab,      setTab]      = useState("orders"); // orders | nfc
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [editOrder, setEditOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const reload = useCallback(async()=>{ setLoading(true); const o=await loadOrders(); setOrders(o); setLoading(false); },[]);
  useEffect(()=>{ reload(); },[reload]);

  const markEncoded = async(id) => {
    const updated = orders.map(o=>o.id===id?{...o,nfcEncoded:true,encodedAt:new Date().toLocaleDateString("fr-FR")}:o);
    await saveOrders(updated); setOrders(updated);
    showNotif("Carte marquée comme encodée","ok");
  };

  const deleteOrder = async(id) => {
    const updated = orders.filter(o=>o.id!==id);
    await saveOrders(updated); setOrders(updated);
    showNotif("Commande supprimée","ok");
  };

  const copyUrl = (order) => {
    const u = url(order);
    navigator.clipboard.writeText(u).catch(()=>{});
    setCopiedId(order.id);
    showNotif(`URL copiée : ${u}`,"ok");
    setTimeout(()=>setCopiedId(null),2000);
  };

  const exportCSV = () => {
    const rows = [["ID","Nom","Entreprise","Gamme","Téléphone","E-mail","URL Profil","NFC ID","Encodée","Date commande"],
      ...orders.map(o=>[o.id,`${o.firstName} ${o.lastName}`,o.company,o.plan,o.phone||"",o.email,url(o),o.nfcId,o.nfcEncoded?"Oui":"Non",new Date(o.createdAt).toLocaleDateString("fr-FR")])
    ];
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="ncard-commandes.csv"; a.click();
    showNotif("Export CSV téléchargé","ok");
  };

  const exportNFC = () => {
    const lines = orders.filter(o=>!o.nfcEncoded).map(o=>`${o.nfcId} → ${url(o)}`);
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain"})); a.download="ncard-a-encoder.txt"; a.click();
    showNotif(`${lines.length} URL(s) exportées`,"ok");
  };

  const filtered = orders.filter(o=>{
    const s=search.toLowerCase();
    const matchS = `${o.firstName} ${o.lastName} ${o.company} ${o.email} ${o.nfcId}`.toLowerCase().includes(s);
    const matchP = planF==="all"||o.plan===planF;
    return matchS&&matchP;
  });

  const toEncode = orders.filter(o=>!o.nfcEncoded);
  const encoded  = orders.filter(o=>o.nfcEncoded);

  const planColor = p => p==="Prestige"?"var(--gold2)":p==="Premium"?"var(--gold)":"var(--t2)";

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{padding:"22px 20px 16px",borderBottom:"1px solid var(--bdr2)"}}>
          <div className="fl fg" style={{gap:4,marginBottom:4}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:"var(--gold)"}}>N</span>
            <span style={{fontSize:12,fontWeight:200,letterSpacing:".18em"}}>-CARD</span>
          </div>
          <p style={{fontSize:9,color:"var(--t3)",letterSpacing:".1em"}}>ADMIN</p>
        </div>

        <div style={{padding:"12px 8px",flex:1}}>
          {[
            {id:"orders", ic:"users",  l:"Commandes"},
            {id:"nfc",    ic:"wifi",   l:"Encodage NFC"},
          ].map(item=>(
            <div key={item.id} className={`nav-item ${tab===item.id?"active":""}`} onClick={()=>setTab(item.id)}>
              <Ic n={item.ic} s={14}/> {item.l}
              {item.id==="nfc" && toEncode.length>0 && (
                <span style={{marginLeft:"auto",minWidth:18,height:18,borderRadius:9,background:"var(--gold)",color:"#0C0C0E",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>
                  {toEncode.length}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{padding:"12px 8px",borderTop:"1px solid var(--bdr2)"}}>
          <div className="nav-item" onClick={onLogout}><Ic n="logout" s={14}/> Déconnexion</div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,padding:"28px 28px 28px 24px",overflowY:"auto"}}>

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
          {[
            {l:"Commandes",     v:orders.length,              ic:"users"},
            {l:"À encoder",     v:toEncode.length,            ic:"zap",    hi:toEncode.length>0},
            {l:"Cartes encodées",v:encoded.length,            ic:"checkC"},
            {l:"Prestige",      v:orders.filter(o=>o.plan==="Prestige").length, ic:"crown"},
          ].map(s=>(
            <div key={s.l} className="card" style={{borderColor:s.hi?"rgba(201,168,76,.3)":"var(--bdr2)"}}>
              <div className="fl jb" style={{marginBottom:8}}>
                <p style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"var(--t3)"}}>{s.l}</p>
                <Ic n={s.ic} s={13} c={s.hi?"var(--gold)":"var(--t3)"}/>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:s.hi?"var(--gold)":"var(--t)"}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:2,background:"var(--bg3)",borderRadius:8,padding:4,width:"fit-content",marginBottom:20}}>
          {[["orders","Commandes"],["nfc","Encodage NFC"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:6,border:"none",cursor:"pointer",background:tab===id?"var(--bg2)":"transparent",color:tab===id?(id==="nfc"?"var(--gold)":"var(--t)"):"var(--t3)",fontSize:12,fontFamily:"'Outfit',sans-serif",transition:"all .15s"}}>
              {l}{id==="nfc"&&toEncode.length>0&&<span style={{marginLeft:6,background:"var(--gold)",color:"#0C0C0E",borderRadius:10,fontSize:10,padding:"1px 5px",fontWeight:700}}>{toEncode.length}</span>}
            </button>
          ))}
        </div>

        {/* ── COMMANDES ── */}
        {tab==="orders" && (
          <>
            <div className="fl jb" style={{marginBottom:14,flexWrap:"wrap",gap:10}}>
              <div className="fl fg12" style={{flex:1,minWidth:200}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…" style={{maxWidth:260}}/>
                <select value={planF} onChange={e=>setPlanF(e.target.value)} style={{width:"auto",padding:"10px 12px"}}>
                  <option value="all">Toutes les gammes</option>
                  {PLANS.map(p=><option key={p.id} value={p.id}>{p.id}</option>)}
                </select>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={exportCSV}><Ic n="download" s={13}/> Export CSV</button>
            </div>

            <div className="card" style={{padding:0,overflow:"hidden"}}>
              {loading ? (
                <div style={{padding:40,textAlign:"center",color:"var(--t3)"}}>
                  <div className="spinner" style={{margin:"0 auto",borderTopColor:"var(--gold3)"}}/>
                </div>
              ) : filtered.length===0 ? (
                <div style={{padding:48,textAlign:"center",color:"var(--t3)"}}>
                  <Ic n="users" s={28} c="var(--bdr2)"/>
                  <p style={{marginTop:12,fontSize:13}}>{orders.length===0?"Aucune commande pour l'instant":"Aucun résultat"}</p>
                </div>
              ) : (
                <table>
                  <thead><tr>
                    <th>Client</th><th>Gamme</th><th>Carte</th><th>Contact</th><th>URL Profil</th><th>NFC</th><th>Date</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(o=>(
                      <tr key={o.id}>
                        <td>
                          <div className="fl" style={{gap:10}}>
                            <div style={{width:32,height:32,borderRadius:"50%",background:"var(--bg3)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:"'Cormorant Garamond',serif",color:"var(--gold)",flexShrink:0}}>
                              {o.firstName[0]}{o.lastName[0]}
                            </div>
                            <div>
                              <p style={{fontSize:13,color:"var(--t)",fontWeight:400}}>{o.firstName} {o.lastName}</p>
                              <p style={{fontSize:11,color:"var(--t3)"}}>{o.company}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="tag tg" style={{color:planColor(o.plan),borderColor:`${planColor(o.plan)}30`}}>{o.plan}</span></td>
                        <td>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:12,height:12,borderRadius:"50%",background:CARD_THEMES.find(t=>t.id===o.cardTheme)?.bg||"#1A1A1E",border:"1px solid rgba(201,168,76,.3)",flexShrink:0}}/>
                              <span style={{fontSize:11,color:"var(--t2)"}}>{CARD_THEMES.find(t=>t.id===o.cardTheme)?.label||"Noir"}</span>
                            </div>
                            {o.logoEngraving && <span className="tag tg" style={{fontSize:9,padding:"1px 7px",width:"fit-content"}}>◆ Gravure</span>}
                          </div>
                        </td>
                        <td>
                          <p style={{fontSize:12}}>{o.phone||"—"}</p>
                          <p style={{fontSize:11,color:"var(--t3)"}}>{o.email}</p>
                        </td>
                        <td>
                          <div className="fl" style={{gap:6}}>
                            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--gold2)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url(o)}</span>
                            <button className="btn btn-ghost btn-sm" style={{padding:"3px 7px",borderColor:copiedId===o.id?"rgba(72,199,142,.3)":"undefined",color:copiedId===o.id?"#48C78E":"undefined"}} onClick={()=>copyUrl(o)}>
                              <Ic n={copiedId===o.id?"check":"copy"} s={11} c={copiedId===o.id?"#48C78E":"currentColor"}/>
                            </button>
                          </div>
                        </td>
                        <td>
                          {o.nfcEncoded
                            ? <span className="tag tgr" style={{fontSize:10}}>◆ Encodée{o.encodedAt&&` · ${o.encodedAt}`}</span>
                            : <span className="tag tg" style={{fontSize:10}}>En attente</span>
                          }
                        </td>
                        <td style={{fontSize:11,color:"var(--t3)"}}>{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td>
                          <div className="fl" style={{gap:5}}>
                            <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={()=>setPreview(o)} title="Voir le profil"><Ic n="eye" s={12}/></button>
                            <button className="btn btn-danger btn-sm" style={{padding:"4px 8px"}} onClick={()=>deleteOrder(o.id)} title="Supprimer"><Ic n="trash" s={12}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── ENCODAGE NFC ── */}
        {tab==="nfc" && (
          <>
            {toEncode.length>0 && (
              <div style={{padding:"13px 18px",background:"rgba(201,168,76,.05)",border:"1px solid rgba(201,168,76,.2)",borderRadius:10,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <Ic n="zap" s={16} c="var(--gold)"/>
                <p style={{fontSize:13,flex:1}}>
                  <strong style={{color:"var(--gold)"}}>{toEncode.length} carte{toEncode.length>1?"s":""}</strong> prête{toEncode.length>1?"s":""} à encoder.
                </p>
                <button className="btn btn-ghost btn-sm" onClick={()=>{
                  const lines=toEncode.map(o=>`${o.nfcId} → ${url(o)}`).join("\n");
                  navigator.clipboard.writeText(lines).catch(()=>{});
                  showNotif(`${toEncode.length} URL(s) copiées`,"ok");
                }}>
                  <Ic n="copy" s={12}/> Tout copier
                </button>
                <button className="btn btn-gold btn-sm" onClick={exportNFC}>
                  <Ic n="download" s={12}/> Exporter TXT
                </button>
              </div>
            )}

            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <table>
                <thead><tr>
                  <th>Client</th><th>ID NFC</th><th>URL du profil</th><th>Statut</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {orders.length===0 ? (
                    <tr><td colSpan={5} style={{textAlign:"center",padding:40,color:"var(--t3)"}}>Aucune commande enregistrée</td></tr>
                  ) : orders.map(o=>(
                    <tr key={o.id}>
                      <td>
                        <p style={{fontSize:13,color:"var(--t)"}}>{o.firstName} {o.lastName}</p>
                        <p style={{fontSize:11,color:"var(--t3)"}}>{o.company}</p>
                      </td>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{o.nfcId}</span></td>
                      <td>
                        <div className="fl" style={{gap:6}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--gold2)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url(o)}</span>
                          <button className="btn btn-ghost btn-sm" style={{padding:"3px 7px"}} onClick={()=>copyUrl(o)}>
                            <Ic n={copiedId===o.id?"check":"copy"} s={11} c={copiedId===o.id?"#48C78E":"currentColor"}/>
                          </button>
                        </div>
                      </td>
                      <td>
                        {o.nfcEncoded
                          ? <span className="tag tgr" style={{fontSize:10}}>◆ Encodée · {o.encodedAt}</span>
                          : <span className="tag tg" style={{fontSize:10}}>⚡ À encoder</span>
                        }
                      </td>
                      <td>
                        <div className="fl" style={{gap:6}}>
                          {!o.nfcEncoded && (
                            <button className="btn btn-gold btn-sm" onClick={()=>markEncoded(o.id)}>
                              <Ic n="check" s={11} c="#0C0C0E"/> Encodée
                            </button>
                          )}
                          <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={()=>setPreview(o)}>
                            <Ic n="eye" s={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Profile preview modal */}
      {preview && (
        <div className="overlay" onClick={()=>setPreview(null)}>
          <div style={{width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto",borderRadius:16,background:"var(--bg)"}} onClick={e=>e.stopPropagation()}>
            <PublicProfile order={preview} onClose={()=>setPreview(null)}/>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   LANDING
═══════════════════════════════════════════ */
const Landing = ({ onOrder, onAdmin }) => (
  <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",width:500,height:400,background:"radial-gradient(ellipse,rgba(201,168,76,.07),transparent 70%)",pointerEvents:"none"}}/>

    <div style={{textAlign:"center",maxWidth:500,position:"relative",zIndex:1}} className="fu">
      <div style={{marginBottom:44}}>
        <div style={{display:"inline-flex",alignItems:"baseline",gap:2,marginBottom:12}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:80,fontWeight:300,color:"var(--gold)",lineHeight:1}}>N</span>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:200,letterSpacing:".25em",color:"var(--t)"}}>-CARD</span>
        </div>
        <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.45),transparent)",margin:"0 auto",width:200}}/>
      </div>

      <h1 className="fu fu1" style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:400,lineHeight:1.25,marginBottom:14}}>
        Votre identité professionnelle,<br/>
        <span style={{color:"var(--gold)",fontStyle:"italic"}}>en un geste.</span>
      </h1>
      <p className="fu fu2" style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,marginBottom:40,fontWeight:300}}>
        La carte de visite connectée NFC qui partage votre profil complet d'un simple tap — sans application.
      </p>

      <div className="fu fu3" style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center",maxWidth:320,margin:"0 auto"}}>
        <button className="btn btn-gold" style={{width:"100%",padding:"14px 24px",fontSize:14,letterSpacing:".08em",justifyContent:"center",borderRadius:10,boxShadow:"0 8px 40px rgba(201,168,76,.22)"}} onClick={onOrder}>
          <Ic n="package" s={16} c="#0C0C0E"/> Commander ma carte N-Card
        </button>
        <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",fontSize:13}} onClick={onAdmin}>
          <Ic n="lock" s={14}/> Espace administrateur
        </button>
      </div>

      <div className="fu fu4" style={{display:"flex",justifyContent:"center",gap:32,marginTop:52}}>
        {[["◆","NFC natif\niOS & Android"],["◇","Profil mis à jour\nen temps réel"],["◈","Design luxe\npersonnalisable"]].map(([ic,txt])=>(
          <div key={txt} style={{textAlign:"center"}}>
            <div style={{fontSize:18,color:"var(--gold)",marginBottom:8}}>{ic}</div>
            <div style={{fontSize:11,color:"var(--t3)",lineHeight:1.5,whiteSpace:"pre-line"}}>{txt}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [screen,    setScreen]    = useState("landing");   // landing | order | success | profile | adminLogin | admin
  const [lastOrder, setLastOrder] = useState(null);
  const [notif,     setNotif]     = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);

  const showNotif = (msg, type="ok") => {
    setNotif({msg,type});
    setTimeout(()=>setNotif(null), 3000);
  };

  const handleOrderSuccess = (order) => {
    setLastOrder(order);
    setScreen("success");
  };

  const goAdmin = () => {
    if(adminAuth) setScreen("admin"); else setScreen("adminLogin");
  };

  return (
    <>
      <G/>
      {screen==="landing"     && <Landing onOrder={()=>setScreen("order")} onAdmin={goAdmin}/>}
      {screen==="order"       && <OrderForm onSuccess={handleOrderSuccess}/>}
      {screen==="success"     && lastOrder && <OrderSuccess order={lastOrder} onViewProfile={()=>setScreen("profile")} onNewOrder={()=>setScreen("order")}/>}
      {screen==="profile"     && lastOrder && <PublicProfile order={lastOrder} onClose={()=>setScreen("success")}/>}
      {screen==="adminLogin"  && <AdminLogin onLogin={()=>{setAdminAuth(true);setScreen("admin");}}/>}
      {screen==="admin"       && <AdminPanel onLogout={()=>{setAdminAuth(false);setScreen("landing");}} showNotif={showNotif}/>}
      {notif && <Notif msg={notif.msg} ok={notif.type==="ok"} onClose={()=>setNotif(null)}/>}
    </>
  );
}
