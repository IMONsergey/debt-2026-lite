import { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedMenu } from './components/FixedMenu.jsx';
import { VideoDialog } from './components/VideoDialog.jsx';
import { ApplicationModal } from './components/ApplicationModal.jsx';
import { legacyContent } from './content/legacy.js';
import { event, ticker, about, venue, gallery, stages, program, privateZones, services, serviceSteps, participants, organizer, conferences, tariffFeatures, tariffs, links } from './content/site.js';
import BeyondHorizon from './vendor/BeyondHorizonOriginal.tsx';
import { LiquidMetalButton } from './vendor/LiquidMetalButton.tsx';
import { LumenCta } from './vendor/LumenCta.tsx';
import { DragRail, NeonFrame, OrbitMap, PointerGlow, PredictiveArc, ScrollHighlight } from './components/V4FX.jsx';
import { Universe } from './components/Universe.jsx';
import { assetUrl } from './lib/assets.js';
import './vendor/lumen-cta.css';
import './styles/cinema-v4.css';

const A=({children})=><span className="v4-accent">{children}</span>;
const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 18 18 5M6 5h12v12" stroke="currentColor" strokeWidth="1.5"/></svg>;
const SectionLabel=({n,children})=><div className="v4-section-label"><span>{String(n).padStart(2,'0')}</span><b>{children}</b></div>;

function Hero({onRegister,onStand,onVideo}){
 return <section id="top" className="v4-hero v4-scene">
  <div className="v4-hero-shader"><BeyondHorizon background="#01030a" coreColor="#ecf8ff" midColor="#1686ff" deepColor="#071e6b" coreSize={.0105} coreHover={.07} speed={.34} fit={63} horizonY={.67} horizonRadius={.58} rimSpread={.14}/></div>
  <PredictiveArc className="v4-hero-arc" brightness={.6} speed={.54} spacing={8} hue={208}/>
  <PointerGlow/>
  <div className="v4-hero-grid" aria-hidden="true"/>
  <div className="v4-hero-content">
   <div className="v4-kicker">ЕЖЕГОДНАЯ ФОРУМ-ВЫСТАВКА · 13 НОЯБРЯ 2026 · МОСКВА</div>
   <h1><span>DEBT</span><span>TECH</span><em>2026</em></h1>
   <p className="v4-hero-lead">{event.headline}</p>
   <div className="v4-hero-actions">
    <div className="v4-cta"><LumenCta label="Ранняя регистрация" hue={-26} brightness={1.18} onClick={onRegister}/></div>
    <button className="v4-ghost-btn" onClick={onStand}>Забронировать стенд <Arrow/></button>
   </div>
  </div>
  <div className="v4-hero-side">
   <div className="v4-date-orb"><small>ДАТА / ГОРОД</small><strong>13.11.26</strong><span>МОСКВА</span></div>
   <Countdown/>
   <div className="v4-play-cluster"><LiquidMetalButton variant="play" diameter={92} strokeWidth={2.5} rendering="colored" text="Смотреть видео" embedded onClick={onVideo}/><span>Как это было<br/>в 2025</span></div>
  </div>
  <div className="v4-ticker">{ticker.map((x,i)=><span key={i}>{x}</span>)}</div>
 </section>
}
function Countdown(){const [now,setNow]=useState(Date.now());useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);const target=new Date(event.target).getTime(),d=Math.max(0,target-now);const vals=[[Math.floor(d/864e5),'дней'],[Math.floor(d/36e5)%24,'часов'],[Math.floor(d/6e4)%60,'минут'],[Math.floor(d/1e3)%60,'секунд']];return <div className="v4-countdown"><small>{event.countdownLabel}</small><div>{vals.map(([v,l])=><span key={l}><b>{String(v).padStart(2,'0')}</b><i>{l}</i></span>)}</div></div>}

function About(){return <section id="about" className="v4-section v4-about">
 <SectionLabel n={1}>О ФОРУМЕ</SectionLabel>
 <ScrollHighlight className="v4-manifesto"><h2>DEBT TECH — это <A>технологии</A>, <A>люди</A> и <A>решения</A>, которые уже меняют рынок долговых активов.</h2></ScrollHighlight>
 <div className="v4-about-layout">
  <NeonFrame className="v4-about-card" radius={30}><div className="v4-glass-card"><small>DEBT TECH 2026</small><h3>{about.lead}</h3><ul>{about.features.map(x=><li key={x}>{x}</li>)}</ul></div></NeonFrame>
  <div className="v4-about-field"><PredictiveArc brightness={.88} speed={.36} spacing={7} hue={208}/><div className="v4-about-stats">{about.stats.map(s=><div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div></div>
 </div>
 <div className="v4-topic-rail">{about.topics.map((t,i)=><span key={`${t}-${i}`}>{t}</span>)}</div>
 </section>}

function Venue(){const [img,setImg]=useState(0);return <section id="venue" className="v4-section v4-venue">
 <SectionLabel n={2}>МЕСТО ПРОВЕДЕНИЯ</SectionLabel>
 <div className="v4-venue-stage">
  <img src={venue.images[img]} alt={venue.name}/><div className="v4-venue-vignette"/>
  <div className="v4-venue-copy"><span>13 НОЯБРЯ 2026</span><h2>{venue.name}</h2><p>{venue.address}</p><a className="v4-line-btn" href={venue.route} target="_blank" rel="noreferrer">Смотреть на карте <Arrow/></a></div>
  <div className="v4-venue-switch">{venue.images.map((src,i)=><button key={src} onClick={()=>setImg(i)} className={i===img?'active':''}><img src={src} alt=""/><span>0{i+1}</span></button>)}</div>
 </div>
 </section>}

function Gallery({onVideo}){return <section id="gallery" className="v4-section v4-gallery"><SectionLabel n={3}>КАДРЫ С DEBT TECH 2025</SectionLabel><div className="v4-gallery-head"><h2>Событие, которое ощущается <A>вживую</A></h2><div className="v4-gallery-play"><LiquidMetalButton variant="play" diameter={82} strokeWidth={2} rendering="colored" text="Видео 2025" embedded onClick={onVideo}/><span>Смотреть видео</span></div></div><DragRail items={gallery} ariaLabel="Фотографии DEBT TECH 2025" className="v4-gallery-rail" renderItem={(it,i)=><figure key={it.src} className="v4-photo"><img src={it.src} alt={it.alt}/><figcaption>{String(i+1).padStart(2,'0')} / 20</figcaption></figure>}/></section>}

function Program(){const [active,setActive]=useState(0);return <section id="program" className="v4-section v4-program"><SectionLabel n={4}>ЧТО ЖДЁТ УЧАСТНИКОВ</SectionLabel><div className="v4-program-title"><h2>Три сцены. Один <A>центр притяжения</A>.</h2><p>Деловая программа, выставка решений, тематические и private-зоны.</p></div><div className="v4-stage-deck">{stages.map((s,i)=>{const img=gallery[(i*6+2)%gallery.length].src;return <button key={s.title} className={`v4-stage-panel ${active===i?'active':''}`} onClick={()=>setActive(i)} onPointerEnter={()=>setActive(i)}><img src={img} alt=""/><div className="v4-stage-glow"/><span>0{i+1}</span><h3>{s.title}</h3><p>{s.label}</p>{active===i&&<div className="v4-stage-live">ACTIVE SCENE</div>}</button>})}</div><div className="v4-program-grid">{program.map((p,i)=><NeonFrame key={p.id} active={i===1} radius={26} className="v4-program-card"><div><small>0{i+1}</small><h3>{p.title}</h3><ul>{p.items.map(x=><li key={x}>{x}</li>)}</ul></div></NeonFrame>)}{privateZones.map((p,i)=><div className="v4-private" key={p.title}><small>PRIVATE 0{i+1}</small><h3>{p.title}</h3><p>{p.text}</p></div>)}</div></section>}

function Services({onStand}){const [active,setActive]=useState(0);const s=services[active];return <section id="services" className="v4-section v4-services"><SectionLabel n={5}>СЕРВИСЫ НА БОРТУ</SectionLabel><div className="v4-service-shell"><nav>{services.map((x,i)=><button key={x.title} className={i===active?'active':''} onClick={()=>setActive(i)}><span>0{i+1}</span><b>{x.title}</b></button>)}</nav><NeonFrame className="v4-service-panel" radius={32}><div className="v4-service-content"><PredictiveArc brightness={.42} speed={.5} spacing={8} hue={205}/><div className="v4-service-copy"><small>СЕРВИС 0{active+1}</small><h2>{s.title}</h2><p>{s.lead}</p><ul>{s.items.map(x=><li key={x}>{x}</li>)}</ul>{active===1&&<ol>{serviceSteps.map(x=><li key={x}>{x}</li>)}</ol>}<div className="v4-cta"><LumenCta label={active===2?'Записаться на интервью':'Связаться с менеджером'} hue={-25} brightness={1.1} onClick={onStand}/></div></div></div></NeonFrame></div></section>}

function Participants(){const [active,setActive]=useState(0);return <section id="participants" className="v4-section v4-participants"><SectionLabel n={6}>ОБ УЧАСТНИКАХ</SectionLabel><div className="v4-participants-layout"><div><h2>Вся экосистема рынка <A>в одной орбите</A></h2><p>Выберите сектор — интерфейс покажет его положение в общей карте участников.</p><div className="v4-participant-list">{participants.map((p,i)=><button key={p} className={i===active?'active':''} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{p}</button>)}</div></div><NeonFrame className="v4-orbit-card" radius={999}><OrbitMap items={participants} onSelect={setActive}/></NeonFrame></div></section>}

function Organizer(){return <section id="organizer" className="v4-section v4-organizer"><SectionLabel n={7}>ОРГАНИЗАТОР ФОРУМА</SectionLabel><div className="v4-organizer-stage"><PredictiveArc brightness={.64} speed={.35} spacing={7} hue={214}/><div className="v4-organizer-copy"><span>{organizer.license}</span><h2>{organizer.title}</h2><p>{organizer.lead}</p><div className="v4-organizer-stats">{organizer.stats.map(s=><div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div></div><div className="v4-organizer-modules"><NeonFrame radius={26}><article><small>01</small><h3>{organizer.rating.title}</h3><p>{organizer.rating.text}</p></article></NeonFrame><NeonFrame radius={26}><article><small>02</small><h3>{organizer.navigator.title}</h3><p>{organizer.navigator.text}</p></article></NeonFrame></div></div></section>}

function Conferences(){return <section id="conferences" className="v4-section v4-conferences"><SectionLabel n={8}>ДРУГИЕ КОНФЕРЕНЦИИ 2021–2026</SectionLabel><DragRail items={conferences} ariaLabel="Другие конференции" className="v4-conf-rail" renderItem={(c,i)=><a className="v4-conf" key={c.id} href={c.href} target="_blank" rel="noreferrer"><div className="v4-conf-media">{c.image?<img src={c.image} alt=""/>:<img src={gallery[(i*2)%gallery.length].src} alt=""/>}<div/></div><span>{c.year}</span><h3>{c.title}</h3><i><Arrow/></i></a>}/></section>}

function Tariffs({onSelect}){const [active,setActive]=useState(1);return <section id="tariffs" className="v4-section v4-tariffs"><SectionLabel n={9}>ТАРИФЫ</SectionLabel><div className="v4-tariff-head"><h2>Выберите свой <A>уровень доступа</A></h2><p>Стоимость актуальна до 25 сентября</p></div><div className="v4-tariff-grid">{tariffs.map((t,i)=><NeonFrame key={t.id} active={active===i} radius={30} className={`v4-tariff ${active===i?'active':''}`}><button className="v4-tariff-inner" onClick={()=>setActive(i)}><small>0{i+1}</small><h3>{t.title}</h3><ul>{tariffFeatures.map(x=><li key={x}>{x}</li>)}</ul><div className="v4-price"><span>СТОИМОСТЬ</span><b>{t.price}</b></div><div className="v4-line-btn" onClick={e=>{e.stopPropagation();onSelect(t)}}>Принять участие <Arrow/></div></button></NeonFrame>)}</div></section>}

function Contacts(){return <section id="contacts" className="v4-section v4-contacts"><div className="v4-contact-shader"><BeyondHorizon background="#01030a" coreColor="#f2fbff" midColor="#117cff" deepColor="#061d63" coreSize={.009} coreHover={.06} speed={.25} fit={58} horizonY={.83} horizonRadius={.7} rimSpread={.12}/></div><SectionLabel n={10}>КОНТАКТЫ</SectionLabel><h2>До встречи <A>13 ноября</A><br/>в Москве.</h2><div className="v4-contact-grid"><div><small>Аккредитация СМИ</small><a href="mailto:org@rvzrus.ru">org@rvzrus.ru</a></div><div><small>Приобрести билет участника</small><a href="mailto:a.fefilova@rvzrus.ru">a.fefilova@rvzrus.ru</a><a href="tel:+79657868846">+7 965 786 88 46</a></div><div><small>Партнерство и выступления</small><a href="mailto:org@rvzrus.ru">org@rvzrus.ru</a><a href="tel:+79252236707">+7 925 223 67 07</a></div></div><footer><span>© 2026 DEBT TECH</span><a href={links.privacy}>Политика конфиденциальности</a></footer></section>}

export default function App(){const[form,setForm]=useState(null),[video,setVideo]=useState(false);const open=useCallback(v=>setForm(typeof v==='string'?{kind:v}:v),[]);const close=useCallback(()=>setForm(null),[]);const onSelect=useCallback(t=>open({kind:'early-registration',tariff:t}),[open]);return <><Universe/><a href="#main" className="skip-link">К содержанию</a><div className="hero-only-view v4-shell"><FixedMenu site={legacyContent.site} menu={legacyContent.menu} video={legacyContent.heroVideo} onOpenApplication={open}/><main id="main" className="v4-main"><Hero onRegister={()=>open('early-registration')} onStand={()=>open('stand-booking')} onVideo={()=>setVideo(true)}/><About/><Venue/><Gallery onVideo={()=>setVideo(true)}/><Program/><Services onStand={()=>open('stand-booking')}/><Participants/><Organizer/><Conferences/><Tariffs onSelect={onSelect}/><Contacts/></main></div>{video&&<VideoDialog video={legacyContent.heroVideo} onClose={()=>setVideo(false)}/>} {form&&<ApplicationModal key={`${form.kind}-${form.tariff?.id||''}`} kind={form.kind} selectedTariff={form.tariff} config={legacyContent.forms} privacyHref={links.privacy} onClose={close}/>}</>}
