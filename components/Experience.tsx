'use client';
import dynamic from 'next/dynamic';import {useEffect,useRef,useState} from 'react';import {motion,useReducedMotion} from 'framer-motion';import Link from 'next/link';import {ArrowDown,ArrowUpRight,RotateCcw,Maximize} from 'lucide-react';import {defaults,type Controls} from './scene-config';import {parts} from '../data/products';
const Scene=dynamic(()=>import('./Scene'),{ssr:false,loading:()=> <img className="fallback" src="/images/laptop.svg" alt="Laptop preview"/>});
const stages=[{n:'01 / ARRIVAL',title:'THIN BY DESIGN.\nBUILT TO PLAY.',text:'Meet the MSI Thin GF63. Gaming hardware in a streamlined chassis.'},{n:'02 / OPEN',title:'UNFOLD YOUR POTENTIAL.',text:'A physical hinge reveals the red-backlit keyboard and Full HD display.'},{n:'03 / EXPLODE',title:'BEYOND THE SURFACE.',text:'Discover the layers of engineering inside the laptop.'},{n:'04 / INSPECT',title:'POWER, PIECE BY PIECE.',text:'Select a component to discover its role.'},{n:'05 / COOL',title:'KEEP YOUR COOL.',text:'Explore an illustrative airflow and cooling fan visualization.'},{n:'06 / REASSEMBLE',title:'READY FOR THE NEXT LEVEL.',text:'All the pieces come together again.'}];
const stagePositions=[0,.299,.499,.60,.76,1];
function stageFor(p:number){return p<.15?0:p<.30?1:p<.50?2:p<.70?3:p<.85?4:5}
export function Story(){
 const host=useRef<HTMLDivElement>(null), sticky=useRef<HTMLDivElement>(null);
 const progress=useRef(0);const [stage,setStage]=useState(0);const [part,setPart]=useState('');const reduced=useReducedMotion();
 useEffect(()=>{
   if(!host.current||!sticky.current)return;
   let frame=0;let last=-1;
   const read=()=>{frame=0;const h=host.current, panel=sticky.current;if(!h||!panel)return;
     if(reduced)return;
     const top=parseFloat(getComputedStyle(panel).top)||0;
     const distance=Math.max(1,h.offsetHeight-panel.offsetHeight);
     const p=Math.min(1,Math.max(0,(top-h.getBoundingClientRect().top)/distance));
     progress.current=p;const next=stageFor(p);if(next!==last){last=next;setStage(next)}
   };
   const schedule=()=>{if(!frame)frame=requestAnimationFrame(read)};
   if(reduced){progress.current=1;setStage(5)}else read();
   window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
   const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(schedule):null;observer?.observe(host.current);observer?.observe(sticky.current);
   return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer?.disconnect();if(frame)cancelAnimationFrame(frame)};
 },[reduced]);
 const jump=(i:number)=>{const h=host.current,panel=sticky.current;if(!h||!panel)return;
   const p=stagePositions[i];if(reduced){progress.current=p;setStage(i);return;}
   const top=parseFloat(getComputedStyle(panel).top)||0;
   const distance=Math.max(1,h.offsetHeight-panel.offsetHeight);
   window.scrollTo({top:window.scrollY+h.getBoundingClientRect().top-top+distance*p,behavior:'instant'});
 };
 const s=stages[stage];
 return <div ref={host} className="story-track"><div ref={sticky} className="story"><div className="storycopy"><motion.div key={s.n} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}}><div className="eyebrow"><span/> {s.n} — GF63 SERIES</div><h1>{s.title}</h1><p>{s.text}</p>{stage===3&&<div className="chips">{Object.keys(parts).map(p=><button key={p} onClick={()=>setPart(p)}>{p}</button>)}</div>}{part&&stage===3&&<p className="partinfo">{parts[part]}</p>}<div className="actions"><Link className="btn" href="/experience">Explore in 3D <ArrowUpRight size={18}/></Link><Link className="btn ghost" href="/products">View products</Link></div></motion.div><div className="storybottom"><span>SCROLL TO EXPLORE <ArrowDown size={14}/></span><div className="story-stage-buttons" aria-label="Animation stages">{['Arrival','Open','Expand','Inspect','Cool','Reassemble'].map((label,i)=><button key={label} aria-pressed={stage===i} onClick={()=>jump(i)}>{label}</button>)}</div></div></div><div className="storyscene"><span className="sceneindex">GF / 63<br/>ENGINEERING SERIES</span><Scene controls={{...defaults,focus:stage===3?part:''}} progress={progress} onPart={setPart}/><span className="scenehint">INTERACTIVE MODEL · ILLUSTRATIVE GEOMETRY</span></div></div></div>
}
export function Configurator(){const [c,setC]=useState<Controls>(defaults);const panel=useRef<HTMLDivElement>(null);const update=(v:Partial<Controls>)=>setC(s=>({...s,...v}));return <section className="section"><div className="eyebrow">INTERACTIVE LAB / 01</div><h1>Explore every angle<span className="red">.</span></h1><p className="lead">Drag to rotate. Scroll or pinch to zoom. Select a component to inspect it.</p><div className="config" ref={panel}><div className="configscene" data-lenis-prevent><Scene controls={c} interactive onPart={focus=>update({focus})}/><button className="fullscreen" aria-label="Toggle fullscreen" onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen();else void panel.current?.requestFullscreen?.().catch(()=>{})}}><Maximize size={20}/></button></div><aside className="controls"><h2>Control panel</h2><label>Hinge angle <b>{c.hinge}°</b><input type="range" min="0" max="135" value={c.hinge} onChange={e=>update({hinge:+e.target.value})}/></label><label>Explosion <b>{Math.round(c.explode*100)}%</b><input type="range" min="0" max="1" step=".01" value={c.explode} onChange={e=>update({explode:+e.target.value})}/></label><div className="chips"><button onClick={()=>update({explode:c.explode?0:1})}>{c.explode?'Assemble':'Explode'}</button><button onClick={()=>update({hinge:c.hinge?0:110})}>{c.hinge?'Close lid':'Open lid'}</button></div><label className="toggle"><input type="checkbox" checked={c.light} onChange={e=>update({light:e.target.checked})}/> Red keyboard lighting</label><label className="toggle"><input type="checkbox" checked={c.air} onChange={e=>update({air:e.target.checked})}/> Illustrative airflow</label><label>Camera view<select value={c.view} onChange={e=>update({view:e.target.value})}>{['front','side','rear','top'].map(x=><option key={x}>{x}</option>)}</select></label><label>Inspect component<select value={c.focus} onChange={e=>update({focus:e.target.value,explode:e.target.value?1:c.explode})}><option value="">Select component</option>{Object.keys(parts).map(x=><option key={x}>{x}</option>)}</select></label>{c.focus&&<p className="partinfo">{parts[c.focus]}</p>}<button className="btn ghost" onClick={()=>setC({...defaults,reset:c.reset+1})}><RotateCcw size={17}/> Reset view</button></aside></div><p className="muted">Original procedural model. Internal placement and airflow are illustrative, not an official MSI service diagram.</p></section>}
