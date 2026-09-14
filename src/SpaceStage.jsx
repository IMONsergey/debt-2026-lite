import {useEffect, useRef} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const PRESETS = [
  {cam:[0,0,5.1], earth:[1.7,-1.15,0], scale:1.72, rings:.22},
  {cam:[0.1,0,5.8], earth:[-2.3,-.15,-1], scale:1.12, rings:.08},
  {cam:[0,0,6.3], earth:[2.7,.25,-2.4], scale:.82, rings:.04},
  {cam:[0,0,5.8], earth:[-2.5,.7,-1.7], scale:.95, rings:.2},
  {cam:[0,0,5.4], earth:[0,-.15,-1.1], scale:1.06, rings:.34},
  {cam:[0,0,6.1], earth:[2.6,-.8,-2.3], scale:.78, rings:.14},
  {cam:[0,0,5.7], earth:[-2.2,-.55,-1.3], scale:.9, rings:.44},
  {cam:[0,0,6.2], earth:[2.3,.25,-2.2], scale:.82, rings:.08},
  {cam:[0,0,5.8], earth:[-2.4,.4,-1.6], scale:.92, rings:.18},
  {cam:[0,0,5.5], earth:[2.05,-.75,-1.3], scale:1.02, rings:.28},
  {cam:[0,0,4.85], earth:[0,-1.5,.1], scale:1.75, rings:.16},
];

function atmosphereMaterial(){
  return new THREE.ShaderMaterial({
    transparent:true,
    side:THREE.BackSide,
    blending:THREE.AdditiveBlending,
    depthWrite:false,
    uniforms:{uColor:{value:new THREE.Color('#4aa7ff')},uStrength:{value:1.15}},
    vertexShader:`varying vec3 vNormal; varying vec3 vWorldPosition;
      void main(){vNormal=normalize(mat3(modelMatrix)*normal);vec4 wp=modelMatrix*vec4(position,1.0);vWorldPosition=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader:`varying vec3 vNormal; varying vec3 vWorldPosition; uniform vec3 uColor; uniform float uStrength;
      void main(){vec3 viewDir=normalize(cameraPosition-vWorldPosition);float fres=pow(1.0-max(dot(normalize(vNormal),viewDir),0.0),3.0);float a=smoothstep(.08,1.0,fres)*uStrength;gl_FragColor=vec4(uColor,a*.78);}`,
  });
}

function starField(count=2600){
  const positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r=7+Math.random()*20;
    const th=Math.random()*Math.PI*2;
    const ph=Math.acos(2*Math.random()-1);
    positions[i*3]=r*Math.sin(ph)*Math.cos(th);
    positions[i*3+1]=r*Math.cos(ph);
    positions[i*3+2]=r*Math.sin(ph)*Math.sin(th);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));
  return new THREE.Points(g,new THREE.PointsMaterial({color:'#d8eaff',size:.022,sizeAttenuation:true,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));
}

function ring(radius, tilt, opacity=.15){
  const geom=new THREE.TorusGeometry(radius,.004,4,220);
  const mat=new THREE.MeshBasicMaterial({color:'#60b8ff',transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false});
  const mesh=new THREE.Mesh(geom,mat);mesh.rotation.set(...tilt);return mesh;
}

export default function SpaceStage(){
  const mount=useRef(null);
  useEffect(()=>{
    const host=mount.current;if(!host)return;
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
    renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);camera.position.set(...PRESETS[0].cam);
    scene.add(new THREE.AmbientLight('#7fa7d8',.62));
    const sun=new THREE.DirectionalLight('#ffffff',3.2);sun.position.set(-4,2,5);scene.add(sun);
    const rim=new THREE.DirectionalLight('#2f7dff',4);rim.position.set(5,-1,-2);scene.add(rim);

    const tex=new THREE.TextureLoader().load('/assets/zero/earth.jpg');tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
    const earthGroup=new THREE.Group();scene.add(earthGroup);
    const earth=new THREE.Mesh(new THREE.SphereGeometry(1.26,96,96),new THREE.MeshStandardMaterial({map:tex,roughness:.82,metalness:.02,color:'#c8def8'}));earthGroup.add(earth);
    const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.31,96,96),atmosphereMaterial());earthGroup.add(atmosphere);
    const darkShell=new THREE.Mesh(new THREE.SphereGeometry(1.267,96,96),new THREE.MeshBasicMaterial({color:'#001022',transparent:true,opacity:.11,blending:THREE.MultiplyBlending}));earthGroup.add(darkShell);
    earthGroup.position.set(...PRESETS[0].earth);earthGroup.scale.setScalar(PRESETS[0].scale);

    const rings=new THREE.Group();
    rings.add(ring(1.9,[Math.PI/2.3,.1,.2],.18));rings.add(ring(2.25,[Math.PI/2.05,.6,-.25],.12));rings.add(ring(2.6,[Math.PI/1.85,-.4,.5],.08));
    earthGroup.add(rings);
    rings.children.forEach(m=>m.material.opacity*=PRESETS[0].rings/.18);

    const stars=starField();scene.add(stars);
    const dust=starField(450);dust.material.size=.06;dust.material.opacity=.18;scene.add(dust);

    let mx=0,my=0,active=0,raf=0,last=performance.now();
    const sections=()=>[...document.querySelectorAll('[data-scene]')];
    const setPreset=(i)=>{
      active=Math.max(0,Math.min(PRESETS.length-1,i));const p=PRESETS[active];
      gsap.to(camera.position,{x:p.cam[0],y:p.cam[1],z:p.cam[2],duration:1.6,ease:'power3.out'});
      gsap.to(earthGroup.position,{x:p.earth[0],y:p.earth[1],z:p.earth[2],duration:1.8,ease:'power3.out'});
      gsap.to(earthGroup.scale,{x:p.scale,y:p.scale,z:p.scale,duration:1.8,ease:'power3.out'});
      rings.children.forEach((m,j)=>gsap.to(m.material,{opacity:p.rings*(1-j*.22),duration:1.4}));
    };
    const onScroll=()=>{
      const arr=sections();let best=0,bestD=Infinity;const cy=innerHeight*.5;
      arr.forEach((el,i)=>{const r=el.getBoundingClientRect();const d=Math.abs((r.top+r.bottom)/2-cy);if(d<bestD){bestD=d;best=i;}});
      if(best!==active)setPreset(best);
      const max=document.documentElement.scrollHeight-innerHeight;const progress=max?scrollY/max:0;
      document.documentElement.style.setProperty('--scroll-progress',String(progress));
    };
    const onPointer=(e)=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)};
    const onResize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};
    addEventListener('scroll',onScroll,{passive:true});addEventListener('pointermove',onPointer,{passive:true});addEventListener('resize',onResize);onScroll();

    const animate=(now)=>{
      const dt=Math.min(.05,(now-last)/1000);last=now;
      earth.rotation.y+=dt*.026;earth.rotation.x=.03*Math.sin(now*.00008);
      rings.rotation.y+=dt*.03;rings.rotation.z+=dt*.012;
      stars.rotation.y+=dt*.004;dust.rotation.y-=dt*.002;
      camera.rotation.y+=(mx*.035-camera.rotation.y)*.025;camera.rotation.x+=(-my*.022-camera.rotation.x)*.025;
      renderer.render(scene,camera);raf=requestAnimationFrame(animate);
    };raf=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',onScroll);removeEventListener('pointermove',onPointer);removeEventListener('resize',onResize);renderer.dispose();tex.dispose();host.innerHTML=''};
  },[]);
  return <div ref={mount} className="space-stage" aria-hidden="true"/>;
}
