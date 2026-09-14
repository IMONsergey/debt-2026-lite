import { useEffect, useMemo, useRef, useState } from 'react';
import NeonBorder from '../vendor/NeonBorderOriginal.tsx';
import { createPredictiveArcRenderer, PREDICTIVE_ARC_DEFAULTS } from '../vendor/predictiveArcRenderer.ts';

export function PointerGlow({ className='' }) {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const move=e=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--px', `${((e.clientX-r.left)/r.width)*100}%`);
      el.style.setProperty('--py', `${((e.clientY-r.top)/r.height)*100}%`);
    };
    el.addEventListener('pointermove',move,{passive:true});
    return()=>el.removeEventListener('pointermove',move);
  },[]);
  return <div ref={ref} className={`v4-pointer-glow ${className}`} />;
}

export function NeonFrame({children, active=true, radius=28, className=''}){
  return <div className={`v4-neon-frame ${className}`}>
    {active && <div className="v4-neon-edge"><NeonBorder color="#4ca6ff" rounded={radius} thickness={1.25} borderSize={30} glow={42} speed={9}/></div>}
    {children}
  </div>
}

export function PredictiveArc({className='', brightness=.72, speed=.7, spacing=6, hue=198}){
  const host=useRef(null), canvas=useRef(null);
  useEffect(()=>{
    const h=host.current,c=canvas.current;if(!h||!c)return;
    const options={...PREDICTIVE_ARC_DEFAULTS,mode:'dark',brightness,speed,spacing,dotSize:3.2,archHeight:.75,thickness:.75,hue,saturation:1};
    const renderer=createPredictiveArcRenderer(c,()=>options);if(!renderer)return;
    let raf=0,visible=true;
    const resize=()=>{const r=h.getBoundingClientRect();renderer.resize(r.width,r.height)};
    const tick=()=>{renderer.render();raf=visible&&!document.hidden?requestAnimationFrame(tick):0};
    const ro=new ResizeObserver(resize),io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(tick);if(!visible&&raf){cancelAnimationFrame(raf);raf=0}});
    ro.observe(h);io.observe(h);resize();raf=requestAnimationFrame(tick);
    return()=>{if(raf)cancelAnimationFrame(raf);ro.disconnect();io.disconnect()};
  },[brightness,speed,spacing,hue]);
  return <div ref={host} className={`v4-predictive ${className}`} aria-hidden="true"><canvas ref={canvas}/></div>
}

export function ScrollHighlight({children,className=''}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    let raf=0;
    const update=()=>{raf=0;const r=el.getBoundingClientRect(),vh=innerHeight;const p=Math.max(0,Math.min(1,(vh*.82-r.top)/(vh*.62+r.height)));el.style.setProperty('--reveal',String(p));};
    const on=()=>{if(!raf)raf=requestAnimationFrame(update)};
    update();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(raf)};
  },[]);
  return <div ref={ref} className={`v4-scroll-highlight ${className}`}>{children}</div>
}

export function DragRail({items, renderItem, className='', ariaLabel}){
  const ref=useRef(null);const drag=useRef({down:false,x:0,left:0,v:0,last:0,lastX:0,raf:0});
  useEffect(()=>()=>cancelAnimationFrame(drag.current.raf),[]);
  const down=e=>{const el=ref.current;if(!el)return;drag.current.down=true;drag.current.x=e.clientX;drag.current.left=el.scrollLeft;drag.current.lastX=e.clientX;drag.current.last=performance.now();drag.current.v=0;el.setPointerCapture?.(e.pointerId);el.classList.add('is-dragging')};
  const move=e=>{const el=ref.current,d=drag.current;if(!el||!d.down)return;const now=performance.now(),dt=Math.max(1,now-d.last);const dx=e.clientX-d.lastX;d.v=dx/dt;d.last=now;d.lastX=e.clientX;el.scrollLeft=d.left-(e.clientX-d.x)};
  const up=e=>{const el=ref.current,d=drag.current;if(!el)return;d.down=false;el.classList.remove('is-dragging');el.releasePointerCapture?.(e.pointerId);let v=-d.v*22;const coast=()=>{if(Math.abs(v)<.15)return;el.scrollLeft+=v;v*=.92;d.raf=requestAnimationFrame(coast)};cancelAnimationFrame(d.raf);d.raf=requestAnimationFrame(coast)};
  return <div className={`v4-grain-rail ${className}`}><div className="v4-grain" aria-hidden="true"/><div ref={ref} className="v4-drag-rail" aria-label={ariaLabel} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>{items.map((it,i)=>renderItem(it,i))}</div></div>
}

export function OrbitMap({items,onSelect}){
  const ref=useRef(null), [active,setActive]=useState(0);
  const points=useMemo(()=>items.map((_,i)=>{const a=(i/items.length)*Math.PI*2-.65;const ring=i%3;const r=.26+ring*.115;return{x:.5+Math.cos(a)*r,y:.5+Math.sin(a)*r*.66,ring}}),[items]);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext('2d');let w=0,h=0,dpr=1,raf=0,t=0;const resize=()=>{const r=c.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.5);c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};const draw=()=>{ctx.clearRect(0,0,w,h);t+=.004;const cx=w*.5,cy=h*.5;for(let j=0;j<3;j++){ctx.strokeStyle=`rgba(71,149,255,${.12+j*.035})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,w*(.26+j*.115),h*(.17+j*.075),-.18,0,Math.PI*2);ctx.stroke()}points.forEach((p,i)=>{const pulse=.5+.5*Math.sin(t*18+i);const x=p.x*w,y=p.y*h;ctx.beginPath();ctx.arc(x,y,i===active?6:3.2,0,Math.PI*2);ctx.fillStyle=i===active?'#dff4ff':`rgba(70,160,255,${.62+pulse*.28})`;ctx.shadowBlur=i===active?24:12;ctx.shadowColor='#3b9cff';ctx.fill();ctx.shadowBlur=0;if(i===active){ctx.strokeStyle='rgba(116,196,255,.45)';ctx.beginPath();ctx.arc(x,y,16+pulse*4,0,Math.PI*2);ctx.stroke()}});const g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.18);g.addColorStop(0,'rgba(197,236,255,.58)');g.addColorStop(.08,'rgba(45,147,255,.33)');g.addColorStop(.45,'rgba(19,65,170,.13)');g.addColorStop(1,'rgba(2,4,10,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);raf=requestAnimationFrame(draw)};const ro=new ResizeObserver(resize);ro.observe(c);resize();raf=requestAnimationFrame(draw);return()=>{ro.disconnect();cancelAnimationFrame(raf)}},[active,points]);
  const click=e=>{const c=ref.current,r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=0,dist=Infinity;points.forEach((p,i)=>{const d=Math.hypot(p.x*r.width-x,p.y*r.height-y);if(d<dist){dist=d;best=i}});if(dist<70){setActive(best);onSelect?.(best)}};
  return <div className="v4-orbit-map"><canvas ref={ref} onClick={click}/><div className="v4-orbit-label"><b>{String(active+1).padStart(2,'0')}</b><span>{items[active]}</span></div></div>
}
