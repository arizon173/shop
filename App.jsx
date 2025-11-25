import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MapPin, ChevronRight, Home as HomeIcon, Calendar as CalendarIcon, User as UserIcon, ListOrdered, X, Star, Shield, Check, ArrowLeft, LogOut, MapPin as MapPinIcon } from 'lucide-react'

/* --- FIREBASE --- */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzjaoG4jyD1pjBH9Z0XhL6ZzAp_WT4Ep4",
  authDomain: "happyfoot-lviv.firebaseapp.com",
  projectId: "happyfoot-lviv",
  storageBucket: "happyfoot-lviv.firebasestorage.app",
  messagingSenderId: "825936740538",
  appId: "1:825936740538:web:7aa5fa34a1a5f020f04283",
  measurementId: "G-CCXGKHW5BR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* --- STYLES --- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
:root {
  --primary: #04273b; --primary-hover: #063d5e; --accent-light: #E0F2FE;
  --white: #ffffff; --bg: #F5F7FA; --border: #D1D8E0;
  --text-main: #04273b; --text-light: #64748B;
  --radius: 20px; --radius-sm: 14px; --radius-btn: 60px;
  --shadow-deep: 0 12px 30px rgba(4, 39, 59, 0.15);
  --nav-height: 80px; 
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg); color: var(--text-main); -webkit-font-smoothing: antialiased; }
.app-container { min-height: 100dvh; padding-bottom: calc(var(--nav-height) + 20px); width: 100%; max-width: 600px; margin: 0 auto; background: var(--bg); position: relative; }
.app-header { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; border-bottom: 1px solid rgba(0,0,0,0.05); padding: 0.8rem 1.5rem; display: flex; justify-content: space-between; align-items: center; height: 65px; }
.logo { font-size: 1.3rem; font-weight: 800; color: var(--primary); line-height: 1; }
.logo span { color: #38BDF8; }
.subtitle { font-size: 0.65rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
.call-btn { background: var(--primary); color: var(--white); border-radius: var(--radius-btn); padding: 0.6rem 1rem; display: flex; gap: 0.5rem; align-items: center; font-size: 0.8rem; font-weight: 600; text-decoration: none; }
.hero-section { padding: 1.5rem; }
.hero-banner { background: linear-gradient(135deg, var(--primary) 0%, #063854 100%); border-radius: var(--radius); padding: 2rem 1.5rem; color: var(--white); box-shadow: var(--shadow-deep); position: relative; overflow: hidden; }
.hero-title { font-size: 1.6rem; line-height: 1.2; margin-top: 1rem; font-weight: 800; }
.hero-btn { background: var(--white); color: var(--primary); border: none; padding: 0.9rem 2rem; border-radius: var(--radius-btn); font-weight: 700; margin-top: 1.5rem; font-size: 0.95rem; cursor: pointer; }
.reel-container { width: 100%; display: flex; justify-content: center; padding: 0 1.5rem; margin-bottom: 2rem; }
.video-wrapper { position: relative; width: 100%; max-width: 380px; background: #000; border-radius: 16px; box-shadow: var(--shadow-deep); overflow: hidden; aspect-ratio: 9 / 16; }
.video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
.section-title { font-size: 1.3rem; font-weight: 800; margin: 2rem 1.5rem 1rem; color: var(--primary); display: flex; align-items: center; gap: 12px; }
.section-title::before { content: ''; display: block; width: 5px; height: 24px; background: #38BDF8; border-radius: 4px; }
.grid-menu { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; padding: 0 1.5rem 1.5rem; }
.menu-item { background: var(--white); padding: 10px; min-height: 90px; border-radius: 16px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.menu-item.active { background: var(--primary); color: var(--white); border-color: var(--primary); box-shadow: 0 8px 20px rgba(4, 39, 59, 0.3); transform: translateY(-2px); }
.services-list { padding: 0 1.5rem; display: flex; flex-direction: column; gap: 12px; }
.service-card { background: var(--white); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--border); cursor: pointer; }
.s-title { font-weight: 700; font-size: 1.05rem; color: var(--primary); margin-bottom: 0.4rem; }
.s-desc { font-size: 0.85rem; color: var(--text-light); margin-bottom: 1rem; line-height: 1.4; }
.s-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 0.8rem; }
.s-price { font-weight: 800; font-size: 1.1rem; color: var(--primary); }
.s-btn { width: 32px; height: 32px; background: var(--accent-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.btm-nav { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 450px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 10px 40px rgba(4, 39, 59, 0.15); padding: 0.5rem 1rem; z-index: 100; }
.nav-item { background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 4px; color: #94A3B8; font-size: 0.65rem; font-weight: 600; cursor: pointer; flex: 1; padding: 0.5rem 0; }
.nav-item.active { color: var(--primary); transform: translateY(-2px); }
.modal-overlay { position: fixed; inset: 0; background: rgba(4, 39, 59, 0.5); z-index: 200; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.modal-content { background: var(--white); width: 100%; max-width: 500px; border-radius: 28px 28px 0 0; padding: 2rem 1.5rem; max-height: 85dvh; overflow-y: auto; }
@media (min-width: 500px) { .modal-overlay { align-items: center; } .modal-content { border-radius: 28px; margin: 20px; } }
.input-field { width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border); border-radius: 14px; font-size: 1rem; background: #F8FAFC; outline: none; }
.input-field:focus { border-color: var(--primary); background: var(--white); box-shadow: 0 0 0 3px rgba(4, 39, 59, 0.1); }
.main-btn { width: 100%; background: var(--primary); color: var(--white); padding: 1rem; border-radius: 16px; border: none; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; }
.time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 1rem; }
.time-slot { background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 12px 0; font-size: 0.9rem; font-weight: 600; color: var(--primary); cursor: pointer; }
.time-slot:hover:not(.disabled) { background: var(--accent-light); border-color: var(--primary); }
.time-slot.disabled { opacity: 0.5; cursor: not-allowed; background: #f1f5f9; text-decoration: line-through; }
.adv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 0 1.5rem; }
.adv-card { background: var(--white); padding: 1.2rem; border-radius: 16px; text-align: center; border: 1px solid var(--border); }
`;

/* --- FULL DEFAULT DATA (FALLBACK) --- */
const DEFAULT_SERVICES = {
  'podo': { title: 'Подологія', icon: '🦶', items: [ 
    { name: 'Базовий догляд', desc: 'Апаратний медичний педикюр, комплексний догляд та рефлексомасаж', price: '1100 ₴' }, 
    { name: 'Корекція врослого нігтя', desc: 'Безопераційна корекція, встановлення ортоніксії', price: '900 ₴' }, 
    { name: 'Обробка грибкових нігтів', desc: 'Професійна чистка та підготовка до лікування', price: '1000 ₴' }, 
    { name: 'Проблематика стоп', desc: 'Тріщини, натоптиші, мозолі, діабетична стопа', price: '800 ₴' }, 
    { name: 'Виготовлення ортезів', desc: 'Індивідуальні розвантажувальні системи', price: '500 ₴' } 
  ]},
  'manicure': { title: 'Манікюр', icon: '💅', items: [ 
    { name: 'Апаратний манікюр', desc: 'Делікатна обробка кутикули', price: '600 ₴' }, 
    { name: 'Японський манікюр', desc: 'Глибоке відновлення та глянцевий блиск', price: '800 ₴' }, 
    { name: 'Лікувальний манікюр', desc: 'Вирішення проблем ламкості та розшарування', price: '700 ₴' }, 
    { name: 'SPA-манікюр', desc: 'Поживні маски та олії для шкіри рук', price: '850 ₴' } 
  ]},
  'diagnostics': { title: 'Діагностика', icon: '🔬', items: [ 
    { name: 'Консультація подолога', desc: 'Огляд, план лікування, дорослі та діти', price: '500 ₴' }, 
    { name: 'Забір аналізу', desc: 'Лабораторне дослідження на грибок', price: '550 ₴' }, 
    { name: 'Онлайн консультація', desc: 'Попередній огляд по фото/відео', price: '300 ₴' } 
  ]},
  'hands': { title: 'Догляд', icon: '🤲', items: [ 
    { name: 'Парафінотерапія', desc: 'Глибоке зволоження шкіри', price: '300 ₴' }, 
    { name: 'Рефлексомасаж', desc: 'Точковий масаж стоп', price: '400 ₴' } 
  ]}
};

const WORK_HOURS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

/* --- COMPONENTS --- */

const Header = () => (
  <header className="app-header">
    <div><div className="logo">Happy<span>Foot</span></div><div className="subtitle">Центр подології</div></div>
    <a href="tel:+380993794338" className="call-btn"><Phone size={16} /> <span>Дзвінок</span></a>
  </header>
);

const HeroSection = ({ onOpenModal }) => (
  <div className="hero-section">
    <div className="hero-banner">
      <div style={{position:'relative', zIndex:2}}>
        <div style={{display:'inline-block', background:'rgba(255,255,255,0.15)', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.7rem', fontWeight:600, border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)'}}>Львів, вул. Київська 21</div>
        <h1 className="hero-title">Здорові ноги — ключ до активного життя!</h1>
        <button className="hero-btn" onClick={onOpenModal}>Записатись</button>
      </div>
    </div>
  </div>
);

const VideoSection = () => (
  <div className="reel-container">
    <div className="video-wrapper">
      <iframe src="https://www.instagram.com/reel/DNV22LRMd6U/embed" scrolling="no" allowTransparency="true" allow="encrypted-media" title="Instagram Reel"></iframe>
    </div>
  </div>
);

const HomeTab = ({ onOpenModal }) => (
  <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
    <HeroSection onOpenModal={onOpenModal} />
    <div className="section-title">Про Happy Foot</div>
    <div style={{padding:'0 1.5rem', color:'var(--text-light)', lineHeight:'1.6', fontSize:'0.95rem'}}>
      <p style={{marginBottom:'10px'}}>Happy Foot — це місце, яке створювалось із любов’ю до справи та бажанням допомагати людям.</p>
      <p>Наша мета — поширення культури подології, усунення болю та дискомфорту.</p>
    </div>
    <div className="section-title">Відео-презентація</div>
    <VideoSection />
    <div className="section-title">Наші переваги</div>
    <div className="adv-grid">
      <div className="adv-card"><Shield size={28} className="mx-auto text-[#04273b] mb-2"/><div style={{fontWeight:700, fontSize:'0.9rem', color:'var(--primary)'}}>Стерильність</div><div style={{fontSize:'0.75rem', color:'var(--text-light)'}}>Автоклав класу В</div></div>
      <div className="adv-card"><Star size={28} className="mx-auto text-[#04273b] mb-2"/><div style={{fontWeight:700, fontSize:'0.9rem', color:'var(--primary)'}}>Професіоналізм</div><div style={{fontSize:'0.75rem', color:'var(--text-light)'}}>Досвідчені подологи</div></div>
    </div>
  </motion.div>
);

const ServicesMenu = ({ services, activeCat, onSelectCat }) => (
  <div className="grid-menu">
    {Object.entries(services).map(([key, val]) => (
      <motion.div key={key} className={`menu-item ${activeCat === key ? 'active' : ''}`} onClick={() => onSelectCat(key)} whileTap={{ scale: 0.95 }}>
        <div style={{fontSize:'1.8rem'}}>{val.icon || '✨'}</div>
        <div style={{fontWeight:600, fontSize:'0.75rem', textAlign:'center', lineHeight:1.2}}>{val.title}</div>
      </motion.div>
    ))}
  </div>
);

const ServicesList = ({ categoryData, onOpenModal }) => (
  <div className="services-list">
    {(categoryData?.items || []).map((item, i) => (
      <motion.div key={i} className="service-card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}} onClick={onOpenModal}>
        <div className="s-title">{item.name}</div>
        <div className="s-desc">{item.desc}</div>
        <div className="s-footer">
          <div className="s-price">{item.price}</div>
          <div className="s-btn"><ChevronRight size={18}/></div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ServicesTab = ({ services, activeCat, onSelectCat, onOpenModal }) => {
  // Ensure activeCat exists in services, if not switch to first available
  const keys = Object.keys(services);
  const currentCat = (services[activeCat]) ? activeCat : (keys.length > 0 ? keys[0] : null);
  
  // Update parent state if mismatch occurred
  if(currentCat !== activeCat && currentCat) onSelectCat(currentCat);

  return (
    <motion.div key="services" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
      <div className="section-title">Категорії</div>
      {keys.length === 0 ? (
        <div style={{textAlign:'center', padding:'2rem', color:'#999'}}>Послуги завантажуються...</div>
      ) : (
        <>
           <ServicesMenu services={services} activeCat={currentCat} onSelectCat={onSelectCat} />
           {currentCat && (
             <>
                <div className="section-title" style={{marginTop:'0.5rem'}}>{services[currentCat].title}</div>
                <ServicesList categoryData={services[currentCat]} onOpenModal={onOpenModal} />
             </>
           )}
        </>
      )}
    </motion.div>
  );
};

// Profile & Auth
const ProfileCard = ({ user, onLogout }) => (
  <div style={{background:'white', padding:'2rem', margin:'1.5rem', borderRadius:'20px', textAlign:'center', border:'1px solid var(--border)'}}>
    <div style={{width:80, height:80, background:'var(--accent-light)', color:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', fontWeight:800, margin:'0 auto 1rem'}}>{user.name[0]}</div>
    <div style={{fontSize:'1.5rem', fontWeight:800, marginBottom:'0.2rem'}}>{user.name}</div>
    <div style={{color:'var(--text-light)', fontSize:'0.9rem'}}>{user.phone}</div>
    <button onClick={onLogout} style={{marginTop:'1.5rem', color:'#EF4444', background:'none', border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', fontSize:'0.9rem', cursor:'pointer'}}><LogOut size={16}/> Вийти</button>
  </div>
);

const LoginForm = ({ onLogin, loginName, setLoginName, loginPhone, setLoginPhone }) => (
  <div style={{padding:'2rem 1.5rem'}}>
    <div style={{textAlign:'center', marginBottom:'2rem'}}>
      <UserIcon size={50} style={{margin:'0 auto 1rem', color:'var(--primary)'}}/>
      <h3 style={{fontWeight:800, fontSize:'1.5rem', marginBottom:'0.5rem'}}>Вхід</h3>
      <p style={{color:'var(--text-light)', fontSize:'0.9rem'}}>Введіть дані для перегляду своїх записів</p>
    </div>
    <input type="text" className="input-field" placeholder="Ваше Ім'я" value={loginName} onChange={e => setLoginName(e.target.value)} />
    <input type="tel" className="input-field" placeholder="Номер телефону" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
    <button className="main-btn" onClick={onLogin}>Увійти</button>
  </div>
);

const ProfileTab = ({ user, appointments, onLogout, onLogin, loginName, setLoginName, loginPhone, setLoginPhone }) => (
  <motion.div key="profile" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
    {user ? (
      <>
        <div className="section-title">Мій кабінет</div>
        <ProfileCard user={user} onLogout={onLogout} />
        <div className="section-title" style={{marginTop:'1rem'}}>Мої записи</div>
        {appointments.length === 0 ? <div className="text-center" style={{padding:'2rem', color:'#9CA3AF'}}>Історія записів порожня</div> : (
          <div style={{padding:'0 1.5rem 2rem'}}>
            {appointments.map(app => (
              <div key={app.id} style={{background:'white', padding:'1rem', marginBottom:'10px', borderRadius:'14px', borderLeft:'4px solid var(--primary)', boxShadow:'0 2px 5px rgba(0,0,0,0.03)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div><div style={{fontWeight:600}}>📅 {app.date}</div><div style={{fontWeight:600, color:'var(--primary)'}}>⏰ {app.time}</div></div>
                  <div style={{padding:'4px 10px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:600, background: app.status==='confirmed' ? '#DCFCE7' : '#F1F5F9', color: app.status==='confirmed' ? '#166534' : '#64748B'}}>{app.status === 'confirmed' ? 'ПІДТВЕРДЖЕНО' : 'ОЧІКУЄ'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    ) : ( <LoginForm onLogin={onLogin} loginName={loginName} setLoginName={setLoginName} loginPhone={loginPhone} setLoginPhone={setLoginPhone} /> )}
  </motion.div>
);

const ContactsTab = () => (
  <motion.div key="contacts" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
    <div className="section-title">Контакти</div>
    <div style={{padding:'0 1.5rem'}}>
      <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}><div className="s-btn"><MapPinIcon size={20}/></div><div><div style={{fontSize:'0.8rem', color:'#666'}}>Адреса</div><div style={{fontWeight:600}}>Львів, вул. Київська 21</div></div></div>
      <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.5rem'}}><div className="s-btn"><Phone size={20}/></div><div><div style={{fontSize:'0.8rem', color:'#666'}}>Телефон</div><a href="tel:+380993794338" style={{fontWeight:600, color:'inherit', textDecoration:'none'}}>+38 099 379 4338</a></div></div>
      <div style={{borderRadius:'20px', overflow:'hidden', height:'250px', boxShadow:'var(--shadow-deep)'}}><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.0858852373327!2d24.00499697686708!3d49.840789071482855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add7c3bd29419%3A0x10a2693895315843!2z0LLRg9C70LjRhtGPIEjQuNGX0LLRgdGM0LrQsCwgMjEsINCb0YzQstGW0LIsINCb0YzQstGW0LLRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgNzkwMDA!5e0!3m2!1suk!2sua" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe></div>
    </div>
  </motion.div>
);

const BottomNav = ({ activeTab, onSetTab, onOpenModal }) => (
  <nav className="btm-nav">
    <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => onSetTab('home')}><HomeIcon size={24}/><span>Головна</span></button>
    <button className={`nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => onSetTab('services')}><ListOrdered size={24}/><span>Послуги</span></button>
    <button className="nav-item" onClick={onOpenModal}><div style={{background:'var(--primary)', color:'white', borderRadius:'50%', width:45, height:45, display:'flex', alignItems:'center', justifyContent:'center', marginTop:-15, boxShadow:'0 4px 10px rgba(4,39,59,0.3)'}}><CalendarIcon size={22}/></div></button>
    <button className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => onSetTab('contacts')}><MapPinIcon size={24}/><span>Контакти</span></button>
    <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => onSetTab('profile')}><UserIcon size={24}/><span>Профіль</span></button>
  </nav>
);

const BookingModal = ({ isOpen, onClose, step, success, onBack, formData, onChangeForm, onNextStep, loadingSlots, busySlots, onBook, user }) => {
  if (!isOpen) return null;
  return (
    <motion.div className="modal-overlay" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{y:100}} animate={{y:0}} transition={{type:"spring", damping:25}}>
        {success ? (
          <div className="text-center" style={{padding:'2rem 0'}}>
            <div style={{width:80, height:80, background:'#04273b', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem'}}><Check size={40} color="#fff"/></div>
            <h3 style={{fontSize:'1.5rem', fontWeight:800}}>Вас записано!</h3>
            <p style={{color:'#666', marginTop:'0.5rem'}}>Адміністратор зателефонує вам найближчим часом.</p>
          </div>
        ) : (
          <>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem', alignItems:'center'}}>
              {step === 2 ? <button onClick={onBack} style={{background:'none', border:'none', padding:0}}><ArrowLeft size={24}/></button> : <h3 style={{fontSize:'1.3rem', fontWeight:800}}>Онлайн запис</h3>}
              <button onClick={onClose} style={{background:'none', border:'none', color:'#94A3B8'}}><X/></button>
            </div>
            {step === 1 && (
              <div className="step-container">
                <input type="text" className="input-field" placeholder="Ваше ім'я" value={formData.name || (user ? user.name : '')} onChange={(e) => onChangeForm({...formData, name: e.target.value})}/>
                <input type="tel" className="input-field" placeholder="Номер телефону" value={formData.phone || (user ? user.phone : '')} onChange={(e) => onChangeForm({...formData, phone: e.target.value})}/>
                <label style={{fontSize:'0.85rem', fontWeight:600, color:'var(--text-light)', marginLeft:'4px', marginTop:'10px', display:'block'}}>Оберіть дату</label>
                <input type="date" className="input-field" style={{marginTop:'4px'}} value={formData.date} onChange={(e) => onChangeForm({...formData, date: e.target.value})}/>
                <button className="main-btn" onClick={onNextStep}>Далі: Вибрати час</button>
              </div>
            )}
            {step === 2 && (
              <div className="step-container">
                <h4 style={{marginBottom:'1rem', textAlign:'center', fontWeight:600}}>Вільний час на <span style={{color:'var(--primary)'}}>{formData.date}</span>:</h4>
                {loadingSlots ? <div className="text-center" style={{padding:'2rem', color:'#999'}}>Перевіряємо графік...</div> : (
                  <div className="time-grid">
                    {WORK_HOURS.map((time) => {
                      const isBusy = busySlots.includes(time);
                      return <button key={time} disabled={isBusy} className={`time-slot ${isBusy ? 'disabled' : ''}`} onClick={() => onBook(time)}>{time}</button>
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

/* --- APP --- */
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [services, setServices] = useState({});
  const [activeCat, setActiveCat] = useState('');
  
  // Modals & Auth States
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busySlots, setBusySlots] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });

  // 1. Fetch Services
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      if (snapshot.empty) {
        setServices(DEFAULT_SERVICES);
        setActiveCat('podo');
      } else {
        const srv = {};
        snapshot.forEach(doc => srv[doc.id] = doc.data());
        setServices(srv);
        // If active cat not set or invalid, set to first
        setActiveCat(prev => srv[prev] ? prev : Object.keys(srv)[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Auth & Appointments
  useEffect(() => {
    const saved = localStorage.getItem('happyUser');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      setFormData(prev => ({ ...prev, name: user.name, phone: user.phone }));
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "appointments"), where("phone", "==", currentUser.phone));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => a.date > b.date ? 1 : -1);
      setUserAppointments(apps);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleLogin = useCallback(() => {
    if (!loginPhone || loginPhone.length < 10) return alert('Введіть коректний номер');
    if (!loginName) return alert('Введіть ім\'я');
    const user = { name: loginName, phone: loginPhone };
    setCurrentUser(user);
    localStorage.setItem('happyUser', JSON.stringify(user));
    setFormData(prev => ({ ...prev, name: user.name, phone: user.phone }));
  }, [loginName, loginPhone]);

  const handleLogout = useCallback(() => { localStorage.removeItem('happyUser'); setCurrentUser(null); setUserAppointments([]); }, []);

  const handleNextStep = useCallback(async () => {
    if (!formData.name || !formData.phone || !formData.date) return alert("Заповніть всі поля!");
    setLoadingSlots(true); setStep(2);
    try {
      const q = query(collection(db, "appointments"), where("date", "==", formData.date));
      const querySnapshot = await getDocs(q);
      setBusySlots(querySnapshot.docs.map(doc => doc.data().time));
    } catch (e) { console.error(e); } finally { setLoadingSlots(false); }
  }, [formData]);

  const handleBooking = useCallback(async (selectedTime) => {
    try {
      await addDoc(collection(db, "appointments"), { ...formData, time: selectedTime, status: "new", createdAt: serverTimestamp() });
      setSuccess(true);
      setTimeout(() => { setModalOpen(false); setSuccess(false); setStep(1); setFormData({ ...formData, date: '', time: '' }); }, 2500);
    } catch (e) { alert("Помилка запису."); }
  }, [formData]);

  return (
    <div className="app-container">
      <style>{styles}</style>
      <Header />
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeTab onOpenModal={() => setModalOpen(true)} />}
          {activeTab === 'services' && <ServicesTab services={services} activeCat={activeCat} onSelectCat={setActiveCat} onOpenModal={() => setModalOpen(true)} />}
          {activeTab === 'profile' && <ProfileTab user={currentUser} appointments={userAppointments} onLogout={handleLogout} onLogin={handleLogin} loginName={loginName} setLoginName={setLoginName} loginPhone={loginPhone} setLoginPhone={setLoginPhone} />}
          {activeTab === 'contacts' && <ContactsTab />}
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onSetTab={setActiveTab} onOpenModal={() => setModalOpen(true)} />
      <AnimatePresence>
        {modalOpen && <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} step={step} success={success} onBack={() => setStep(1)} formData={formData} onChangeForm={setFormData} onNextStep={handleNextStep} loadingSlots={loadingSlots} busySlots={busySlots} onBook={handleBooking} user={currentUser} />}
      </AnimatePresence>
    </div>
  )
}
export default App
