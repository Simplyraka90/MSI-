'use client';
import {Canvas,useFrame,useThree} from '@react-three/fiber';import {OrbitControls} from 'three/addons/controls/OrbitControls.js';import {Component,useRef,useEffect,useState,type ReactNode} from 'react';import * as T from 'three';
import type {Controls} from './scene-config';
type Props={controls:Controls;progress?:{current:number};interactive?:boolean;onPart?:(s:string)=>void};
function Box({size,pos=[0,0,0],color='#24252a',metal=.35,name,glow=false}:{size:[number,number,number];pos?:[number,number,number];color?:string;metal?:number;name?:string;glow?:boolean}){return <mesh position={pos} name={name}><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metal} roughness={.38} emissive={glow?color:'#000000'} emissiveIntensity={glow ? .65 : 0}/></mesh>}
function Laptop({controls,progress,interactive,onPart}:Props){const root=useRef<T.Group>(null!);const hinge=useRef<T.Group>(null!);const deck=useRef<T.Group>(null!);const bottom=useRef<T.Group>(null!);const board=useRef<T.Group>(null!);const battery=useRef<T.Group>(null!);const fan=useRef<T.Group>(null!);const blades=useRef<T.Group>(null!);const ram=useRef<T.Group>(null!);const ssd=useRef<T.Group>(null!);const keys=useRef<T.Group>(null!);const air=useRef<T.Group>(null!);const [pressed,setPressed]=useState<string>('');const [reduced,setReduced]=useState(false);useEffect(()=>{setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches);const down=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement|| (e.target instanceof HTMLElement && e.target.isContentEditable))return;setPressed(e.key.toUpperCase())};const up=()=>setPressed('');window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',up)}},[]);const smooth=(a:number,b:number,p:number)=>T.MathUtils.smoothstep(p,a,b);useFrame((s,dt)=>{if(!root.current||!hinge.current||!deck.current||!bottom.current||!board.current||!battery.current||!fan.current||!blades.current||!ram.current||!ssd.current||!air.current)return;const p=progress?.current;const opening=p===undefined?controls.hinge/110:smooth(.10,.29,p);const ex=p===undefined?controls.explode:smooth(.30,.49,p)*(1-smooth(.82,1,p));const k=1-Math.exp(-dt*9);hinge.current.rotation.x=T.MathUtils.lerp(hinge.current.rotation.x,-opening*1.92,reduced?1:k);deck.current.position.y=.17+ex*1.05;bottom.current.position.y=-.12-ex*.65;board.current.position.y=.015+ex*.27;battery.current.position.z=.67+ex*.72;battery.current.position.y=.02-ex*.12;fan.current.position.x=1.12+ex*.65;fan.current.position.y=.04+ex*.55;ram.current.position.y=.07+ex*.65;ssd.current.position.x=.4+ex*.45;ssd.current.position.y=.06+ex*.55;const cooling=controls.air||(p!==undefined&&p>.69&&p<.86);air.current.visible=cooling;blades.current.rotation.y+=reduced?0:dt*(cooling?15:3);air.current.children.forEach((o,i)=>{o.position.z=-.9+((s.clock.elapsedTime*.7+i*.12)%1.8);o.position.x=1.3+Math.sin(i)*.17});if(!interactive){root.current.rotation.y=T.MathUtils.lerp(root.current.rotation.y,reduced?0:s.pointer.x*.23,k);root.current.rotation.z=T.MathUtils.lerp(root.current.rotation.z,reduced?0:-s.pointer.y*.08,k);root.current.position.y=reduced?0:Math.sin(s.clock.elapsedTime*1.3)*.045;}if(!interactive){const target=new T.Vector3(3.8,3.1+(ex*.5),5.8+ex*1.5);s.camera.position.lerp(target,k);s.camera.lookAt(0,.35,0)}});const hit=(name:string)=>(e:any)=>{e.stopPropagation();onPart?.(name)};return <group ref={root} scale={.87}><group ref={bottom}><Box name="Bottom_chassis" size={[3.4,.16,2.25]} color="#17181b"/>{[-1,1].map(side=><group key={side} position={[side*1.7,.04,-.2]} onClick={hit('Ports')}>{[0,1,2].map(i=><Box key={i} size={[.035,.075,.17]} pos={[0,0,i*.25]} color="#050505"/>)}</group>)}</group><group ref={board} onClick={hit('Motherboard')}><Box name="Motherboard" size={[3.03,.055,1.14]} pos={[0,0,-.45]} color="#21463b"/><group position={[-.65,.07,-.47]} onClick={hit('CPU')}><Box name="CPU" size={[.43,.08,.42]} color="#aeb4bd"/></group><group position={[.03,.07,-.46]} onClick={hit('GPU')}><Box name="GPU" size={[.48,.08,.44]} color="#6a737e"/></group>{Array.from({length:22},(_,i)=><Box key={i} size={[.075,.025,.11]} pos={[-1.4+(i%11)*.22,.045,-.94+Math.floor(i/11)*.19]} color="#13181b"/>)}<Box name="Copper_heatpipe" size={[1.9,.055,.095]} pos={[.12,.16,-.65]} color="#b57945" metal={.85}/><Box name="Copper_heatpipe_2" size={[1.5,.05,.08]} pos={[.3,.16,-.82]} color="#c38b59" metal={.85}/></group><group ref={battery} onClick={hit('Battery')}><Box name="Battery" size={[2.35,.11,.58]} color="#303238"/>{[-.77,0,.77].map(x=><Box key={x} size={[.71,.025,.49]} pos={[x,.067,0]} color="#4b4e55"/>)}</group><group ref={ram} position={[-.6,.07,.05]} onClick={hit('RAM')}><Box name="RAM" size={[.94,.06,.22]} color="#1b6b4a"/>{Array.from({length:5},(_,i)=><Box key={i} size={[.12,.045,.14]} pos={[-.35+i*.17,.04,0]} color="#111317"/>)}</group><group ref={ssd} position={[.4,.06,.05]} onClick={hit('SSD')}><Box name="SSD" size={[.68,.05,.19]} color="#275541"/><Box size={[.43,.035,.14]} pos={[0,.04,0]} color="#b7b7b9"/></group><group ref={fan} position={[1.12,.04,-.55]} onClick={hit('Fan')}><mesh><cylinderGeometry args={[.37,.37,.11,32]}/><meshStandardMaterial color="#24272d"/></mesh><group ref={blades} position={[0,.08,0]}>{Array.from({length:9},(_,i)=><group key={i} rotation={[0,i*Math.PI*2/9,0]}><Box size={[.12,.03,.28]} pos={[0,0,.15]} color="#73757c"/></group>)}</group><mesh position={[0,.1,0]}><cylinderGeometry args={[.09,.09,.04,16]}/><meshStandardMaterial color="#27282d"/></mesh></group><group ref={deck} onClick={hit('Keyboard')}><Box name="Keyboard_deck" size={[3.4,.1,2.25]}/><group ref={keys} position={[0,.065,-.23]}>{Array.from({length:75},(_,i)=>{const row=Math.floor(i/15),col=i%15;const label=['Q','W','E','R','T','Y','U','I','O','P'][col]||'';const key=row===3?['Z','X','C','V','B','N','M'][col]:row===2?['A','S','D','F','G','H','J','K','L'][col]:row===1?label:'';return <Box key={i} name={`Key_${i}`} size={[.172,.035,.145]} pos={[-1.35+col*.193,key&&key===pressed?-.017:0,-.41+row*.18]} color={controls.light?'#701426':'#292a2e'} glow={controls.light}/>})}</group><Box name="Trackpad" size={[1.13,.012,.49]} pos={[0,.059,.68]} color="#3c3d42"/><Box name="Hinge_left" size={[.42,.14,.15]} pos={[-1.2,.05,-1.06]}/><Box name="Hinge_right" size={[.42,.14,.15]} pos={[1.2,.05,-1.06]}/></group><group ref={hinge} position={[0,.27,-1.08]} onClick={hit('Display')}><Box name="Display_lid" size={[3.4,.075,2.16]} pos={[0,0,1.08]} color="#202126"/><Box name="Display_panel" size={[3.13,.012,1.87]} pos={[0,-.045,1.08]} color="#9d092c" glow/><Box size={[2.5,.014,.48]} pos={[0,-.054,.8]} color="#e60026" glow/><Box size={[.08,.015,.045]} pos={[0,-.05,2.08]} color="#080808"/></group><group ref={air}>{Array.from({length:22},(_,i)=><mesh key={i}><sphereGeometry args={[.025,6,6]}/><meshBasicMaterial color={i%2?'#ff2442':'#56bfff'}/></mesh>)}</group></group>}
const positions:Record<string,[number,number,number]>={front:[3.8,3.1,5.8],side:[6,2.4,0],rear:[0,2.4,-6],top:[0,7,.01]};
const cameraConfig={position:positions.front,fov:42};
function CameraControls({view,reset}:{view:string;reset:number}) {
  const {camera,gl}=useThree();
  const controls=useRef<OrbitControls|null>(null);
  useEffect(()=>{
    const instance=new OrbitControls(camera,gl.domElement);
    instance.enablePan=false; instance.enableDamping=true;
    instance.minDistance=3; instance.maxDistance=12;
    instance.target.set(0,.35,0); instance.update(); controls.current=instance;
    return ()=>{controls.current=null;instance.dispose();};
  },[camera,gl]);
  useEffect(()=>{
    camera.position.set(...(positions[view]||positions.front));
    controls.current?.target.set(0,.35,0);controls.current?.update();
  },[camera,view,reset]);
  useFrame(()=>controls.current?.update());
  return null;
}
function StaticPreview({reason}:{reason:string}) {
  return <div className="scene-fallback" role="status"><img className="fallback" src="/images/laptop.svg" alt="Illustrative laptop"/><p>{reason}</p></div>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<StaticPreview reason="3D rendering unavailable. Static preview shown."/>:this.props.children;}
}
export default function Scene(props:Props){
  const [capability,setCapability]=useState<'checking'|'ready'|'unavailable'>('checking');
  const [visible,setVisible]=useState(true);
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let supported=false;
    try{
      const canvas=document.createElement('canvas');
      const context=canvas.getContext('webgl2');
      supported=!!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    }catch{supported=false;}
    setCapability(supported?'ready':'unavailable');
  },[]);
  useEffect(()=>{
    if(!host.current||typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'100px'});
    observer.observe(host.current);return ()=>observer.disconnect();
  },[]);
  return <div ref={host} className="scene-host"><SceneBoundary>{capability==='ready'?<Canvas frameloop={props.progress||visible?'always':'never'} dpr={[1,1.5]} camera={cameraConfig} gl={{antialias:true}} fallback={<StaticPreview reason="WebGL unavailable."/>}>
    <ambientLight intensity={1.4}/><directionalLight position={[3,6,4]} intensity={3}/><directionalLight position={[-3,2,-2]} color="#e60026" intensity={2.5}/><directionalLight position={[0,3,-5]} color="#b5caff" intensity={1.6}/><Laptop {...props}/>{props.interactive&&<CameraControls view={props.controls.view} reset={props.controls.reset}/>}
  </Canvas>:<StaticPreview reason={capability==='checking'?'Preparing 3D experience…':'WebGL 2 unavailable. Static preview shown.'}/>}</SceneBoundary></div>;
}
