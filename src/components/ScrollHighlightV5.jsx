import {useEffect,useMemo,useRef,useState} from 'react';

export function ScrollHighlightV5({text,dimColor='rgba(238,246,255,.14)',highlightColor='#F4F8FF',className=''}){
  const ref=useRef(null); const words=useMemo(()=>String(text||'').trim().split(/\s+/).filter(Boolean),[text]); const [p,setP]=useState(0);
  useEffect(()=>{let raf=0;const update=()=>{raf=0;const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const vh=innerHeight||1;const start=vh*.82,end=vh*.22;const prog=Math.max(0,Math.min(1,(start-r.top)/(Math.max(1,r.height+start-end))));setP(prog)};const on=()=>{if(!raf)raf=requestAnimationFrame(update)};update();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(raf)}},[]);
  return <p ref={ref} className={`v5-scroll-highlight ${className}`}>
    {words.map((w,i)=>{const t=(i+1)/words.length;const active=p>=t-.035;return <span key={`${w}-${i}`} style={{color:active?highlightColor:dimColor}}>{w}{i<words.length-1?' ':''}</span>})}
  </p>
}
