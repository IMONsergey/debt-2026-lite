import { useEffect, useRef } from 'react';
/** One atmospheric layer for the entire site. Native scroll; bounded particle budget. */
export function Universe() {
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let w=0,h=0,dpr=1,raf=0,last=0,clock=0,px=0,py=0,tx=0,ty=0;
    let active=!motion.matches,hidden=document.hidden;
    const stars=Array.from({length:130},(_,i)=>({x:((Math.sin(i*83.72)*43758)%1+1)%1,y:((Math.sin(i*17.32+3)*15273)%1+1)%1,z:.15+(i%7)/9,r:i%19===0?1.6:.5+(i%4)*.17}));
    function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(0);}
    function draw(delta){
      clock+=delta;px+=(tx-px)*.018;py+=(ty-py)*.018;ctx.clearRect(0,0,w,h);
      for(const s of stars){const x=(s.x*w+px*s.z+clock*s.z*1.7+w)%w,y=(s.y*h+py*s.z-clock*s.z*.6+h)%h;
        const a=.14+s.z*.29+Math.sin(clock*.35+s.x*23)*.10;
        ctx.fillStyle=`rgba(177,217,255,${a})`;ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill();
        if(s.r>1.5){ctx.strokeStyle=`rgba(102,183,255,${a*.33})`;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
      }
    }
    function frame(t){raf=0;if(!active||hidden)return;const dt=Math.min((t-last)/1000,.06);if(t-last>31){draw(dt);last=t;}raf=requestAnimationFrame(frame);}
    function sync(){active=!motion.matches&&document.documentElement.dataset.motion!=='paused';hidden=document.hidden;cancelAnimationFrame(raf);raf=0;last=performance.now();if(active&&!hidden)raf=requestAnimationFrame(frame);else draw(0);}
    const move=e=>{tx=(e.clientX/w-.5)*24;ty=(e.clientY/h-.5)*18;};
    resize();sync();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',sync);document.addEventListener('debt:motion',sync);motion.addEventListener('change',sync);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',sync);document.removeEventListener('debt:motion',sync);motion.removeEventListener('change',sync);};
  },[]);
  return <div className="universe" aria-hidden="true"><div className="universe__nebula"/><canvas ref={ref}/><div className="universe__grain"/></div>;
}
/** Small scene camera movement; suspended outside the hero or when the user pauses. */
export function useSceneCamera(ref){
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,inside=true;
  const io=new IntersectionObserver(([entry])=>{inside=entry.isIntersecting;},{threshold:0});io.observe(el);
  const track=e=>{if(!inside||reduced.matches||document.documentElement.dataset.motion==='paused')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=el.getBoundingClientRect();el.style.setProperty('--camera-x',`${(e.clientX-r.left-r.width/2)/r.width*15}px`);el.style.setProperty('--camera-y',`${(e.clientY-r.top-r.height/2)/r.height*11}px`);});};
  el.addEventListener('pointermove',track,{passive:true});return()=>{io.disconnect();cancelAnimationFrame(frame);el.removeEventListener('pointermove',track);};
 },[ref]);
}
