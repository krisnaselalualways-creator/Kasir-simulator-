(()=>{"use strict";
if(!window.THREE){document.body.innerHTML="<p style='padding:20px'>Butuh internet untuk memuat three.js.</p>";return}
const $=id=>document.getElementById(id),rp=n=>"Rp"+Math.round(n).toLocaleString("id-ID"),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const P=[{id:"mie",n:"Mi instan",p:3500,c:"#f2a23a"},{id:"air",n:"Air mineral",p:3000,c:"#5aa9e6"},{id:"roti",n:"Roti",p:6500,c:"#c98d4f"},{id:"susu",n:"Susu kotak",p:5500,c:"#f5f5f5"},{id:"keripik",n:"Keripik",p:8000,c:"#e05b4f"},{id:"sabun",n:"Sabun",p:12000,c:"#6fbf73"},{id:"teh",n:"Teh botol",p:4500,c:"#d4a017"},{id:"kopi",n:"Kopi sachet",p:2500,c:"#7b4a2d"},{id:"beras",n:"Beras 1kg",p:14000,c:"#e8e2c8"},{id:"minyak",n:"Minyak goreng",p:18000,c:"#f2d24b"}];
const PP={};P.forEach(p=>PP[p.id]=p);
const pr=id=>S.price[id]||PP[id].p;
const def=()=>({money:300000,rating:3,served:0,land:0,stock:{mie:12,air:12,roti:8,susu:0,keripik:0,sabun:0,teh:0,kopi:0,beras:0,minyak:0},shelves:["mie","air","roti"],boxes:[],carry:null,price:{}});
let S;try{S={...def(),...JSON.parse(localStorage.getItem("supermarketV1"))};S.stock={...def().stock,...S.stock}}catch(e){S=def()}
const save=()=>{try{localStorage.setItem("supermarketV1",JSON.stringify(S))}catch(e){}};
let mt;function msg(t){const m=$("msg");m.textContent=t;m.style.display="block";clearTimeout(mt);mt=setTimeout(()=>m.style.display="none",2600)}
const rate=s=>{S.rating=cl(S.rating*.9+s*.1,1,5)};
let AC=null;
function snd(f,d,ty,v,f2){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=ty||"sine";o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const SFX={cash:()=>{snd(1200,.12,"square",.06);setTimeout(()=>snd(1800,.25,"square",.06),90)},bad:()=>snd(160,.3,"sawtooth",.08),pop:()=>snd(500,.08,"triangle",.07,900),bell:()=>{snd(1000,.2,"sine",.06);setTimeout(()=>snd(1500,.3,"sine",.06),150)},step:()=>snd(90+Math.random()*30,.05,"triangle",.05),buy:()=>snd(700,.1,"square",.05,1000)};
addEventListener("pointerdown",()=>{if(AC&&AC.state==="suspended")AC.resume()});
let ev=null,evT=50;
const EVS=[{k:"ramai",n:"🔥 Jam ramai",t:40},{k:"hujan",n:"🌧️ Hujan deras",t:40},{k:"promo",n:"🏷️ Promo pemasok -30%",t:60}];
const cost=p=>Math.round(p.p*.7*12*(ev&&ev.k==="promo"?.7:1)/100)*100;
// ---- three.js ----
const R=new THREE.WebGLRenderer({canvas:$("c"),antialias:false});R.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new THREE.Scene();sc.background=new THREE.Color("#bcd9ee");const NIGHT=new THREE.Color("#0f1a33"),DAY=new THREE.Color("#bcd9ee");
const cam=new THREE.PerspectiveCamera(72,1,.1,60);cam.rotation.order="YXZ";
const hemi=new THREE.HemisphereLight("#ffffff","#8a8a8a",1.05);sc.add(hemi);const dl=new THREE.DirectionalLight("#fff",.45);dl.position.set(5,10,5);sc.add(dl);
function rs(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener("resize",rs);rs();
const MC={},mat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:c}));
function box(w,h,d,c,x,y,z,p){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);p.add(m);return m}
function label(t,s,fl){const c=document.createElement("canvas");c.width=256;c.height=96;const g=c.getContext("2d");g.fillStyle="#fffe";g.fillRect(0,0,256,96);g.fillStyle="#222";g.textAlign="center";const fit=(x,z,b)=>{g.font=(b?"bold ":"")+z+"px sans-serif";while(g.measureText(x).width>236&&z>10){z-=2;g.font=(b?"bold ":"")+z+"px sans-serif"}};
fit(t,34,1);g.fillText(t,128,42);fit(s,28,0);g.fillStyle="#2f6e55";g.fillText(s,128,80);
const tx=new THREE.CanvasTexture(c);if(fl)return new THREE.Mesh(new THREE.PlaneGeometry(1.8,.68),new THREE.MeshBasicMaterial({map:tx}));const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx}));sp.scale.set(1.8,.68,1);return sp}
const IG=new THREE.BoxGeometry(.3,.3,.25),IM={};P.forEach(p=>IM[p.id]=mat(p.c));
const GS={mie:[.3,.14,.22],roti:[.32,.16,.18],susu:[.16,.3,.16],keripik:[.28,.34,.08],sabun:[.2,.12,.14],kopi:[.2,.1,.12],beras:[.3,.32,.14]},GC={air:[.08,.34],teh:[.07,.32],minyak:[.09,.36]},GE={},GH={};
P.forEach(p=>{if(GS[p.id]){const z=GS[p.id];GE[p.id]=new THREE.BoxGeometry(z[0],z[1],z[2]);GH[p.id]=z[1]}else{const c=GC[p.id];GE[p.id]=new THREE.CylinderGeometry(c[0],c[0],c[1],8);GH[p.id]=c[1]}});
const LG=new THREE.BoxGeometry(1.6,.06,.5),LM=new THREE.MeshBasicMaterial({color:"#fffbe8"}),WG=new THREE.BoxGeometry(.06,1.2,1.8),winM=new THREE.MeshBasicMaterial({color:"#bcd9ee"});
const FT=(()=>{const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d");g.fillStyle="#e6e1d2";g.fillRect(0,0,128,128);g.fillStyle="#d7d2c0";g.fillRect(0,0,64,64);g.fillRect(64,64,64,64);g.strokeStyle="#bdb8a4";g.lineWidth=2;g.strokeRect(0,0,128,128);g.strokeRect(0,0,64,64);g.strokeRect(64,64,64,64);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t})();
const trolley=(x,z)=>{box(.7,.08,1,"#9aa3b0",x,.2,z,world);box(.7,.32,1,"#c0504d",x,.45,z,world);box(.7,.05,.05,"#9aa3b0",x,.85,z-.55,world);box(.05,.4,.05,"#9aa3b0",x-.3,.65,z-.55,world);box(.05,.4,.05,"#9aa3b0",x+.3,.65,z-.55,world)};
let world,slots=[],obst=[],shG=[],bxG;
const W=()=>14+6*S.land,slotsN=()=>2*(3+2*S.land);
function refresh(k){const it=shG[k];if(!it)return;while(it.children.length){const o=it.children[0];if(o.material&&o.material.map){o.material.map.dispose();o.material.dispose()}it.remove(o)}const id=S.shelves[k],p=PP[id],n=Math.min(12,S.stock[id]);
for(let i=0;i<n;i++){const m=new THREE.Mesh(GE[id],IM[id]);m.position.set(-1+(i%6)*.4,(i<6?.53:1.03)+GH[id]/2,.3);it.add(m)}
const sp=label(p.n,rp(pr(id))+" • "+S.stock[id]);sp.position.set(0,1.95,.4);it.add(sp)}
function buildStore(){while(S.shelves.length<slotsN())S.shelves.push(null);if(world)sc.remove(world);world=new THREE.Group();sc.add(world);slots=[];obst=[];shG=[];
const w=W(),wl="#e8e2d0";
FT.repeat.set(w/1.5,8);const fl=new THREE.Mesh(new THREE.PlaneGeometry(w,12),new THREE.MeshLambertMaterial({map:FT}));fl.rotation.x=-Math.PI/2;fl.position.set(w/2,0,0);world.add(fl);box(w,.1,12,"#f4f1e8",w/2,3.25,0,world);
box(w,3.2,.2,wl,w/2,1.6,-6,world);box(.2,3.2,12,wl,0,1.6,0,world);box(.2,3.2,12,wl,w,1.6,0,world);
box(w-4,3.2,.2,wl,(w-4)/2,1.6,6,world);box(1,3.2,.2,wl,w-.5,1.6,6,world);box(3,.5,.2,"#4f91b7",w-2.5,2.95,6,world);
box(3,.9,1,"#7c4a2d",3,.45,3.5,world);box(3.1,.08,1.1,"#b8784b",3,.94,3.5,world);box(.5,.35,.4,"#e8eef5",4,1.15,3.5,world);
const ks=label("KASIR","");ks.position.set(3,2.1,3.5);world.add(ks);obst.push({x:3,z:3.5,hx:1.5,hz:.5});bxG=new THREE.Group();world.add(bxG);drawBoxes();
for(let i=0;i<Math.floor(w/4.5);i++)for(const z of[-3,2]){const l=new THREE.Mesh(LG,LM);l.position.set(2.5+i*4.5,3.17,z);world.add(l)}
box(w,.25,.06,"#4f91b7",w/2,.125,-5.88,world);box(.06,.25,12,"#4f91b7",.12,.125,0,world);box(.06,.25,12,"#4f91b7",w-.12,.125,0,world);
const hd=label("MINI SUPERMARKET","Belanja hemat & lengkap",1);hd.scale.set(1.9,1.9,1);hd.position.set(w/2,2.5,-5.85);world.add(hd);
[-2,1].forEach(z=>{const wm=new THREE.Mesh(WG,winM);wm.position.set(.12,1.7,z);world.add(wm)});
[[.9,-5.1],[w-.9,-5.1]].forEach(([x,z])=>{box(.4,.4,.4,"#8a5a3a",x,.2,z,world);const lf=new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),mat("#4a8a4a"));lf.position.set(x,.75,z);world.add(lf)});
trolley(w-.6,2);trolley(w-.6,3.3);obst.push({x:w-.6,z:2.65,hx:.4,hz:1.3});
for(let i=0;i<3+2*S.land;i++)for(let r=0;r<2;r++)slots.push({x:6.5+i*3,z:r?-1.5:-5.3});
S.shelves.forEach((id,k)=>{if(!id)return;const s=slots[k],p=PP[id],g=new THREE.Group();g.position.set(s.x,0,s.z);world.add(g);
box(2.4,1.5,.5,"#8a6a4a",0,.75,0,g);box(2.4,.06,.34,"#c9a57a",0,.5,.3,g);box(2.4,.06,.34,"#c9a57a",0,1,.3,g);box(2.4,.06,.5,"#6e5238",0,1.53,0,g);box(2.4,.14,.5,p.c,0,1.64,0,g);
const it=new THREE.Group();g.add(it);shG[k]=it;obst.push({x:s.x,z:s.z,hx:1.25,hz:.45});refresh(k)})}
function person(col,hair){const g=new THREE.Group();box(.5,.9,.3,col,0,.75,0,g);g.userData.l=[box(.18,.6,.2,"#3b4468",-.12,.3,0,g),box(.18,.6,.2,"#3b4468",.12,.3,0,g)];
const h=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),mat("#f3cfa6"));h.position.y=1.38;g.add(h);box(.34,.12,.34,hair,0,1.5,0,g);box(.3,.16,.22,"#c0504d",.36,.5,.05,g);box(.3,.03,.22,"#8a3a38",.36,.59,.05,g);return g}
// ---- player ----
let px=3,pz=4.8,yaw=0,pitch=0,jv={x:0,y:0},K={};
const cvs=$("c"),joy=$("joy");let lk=null,jp=null;
sc.add(cam);const carryM=new THREE.Group();cam.add(carryM);box(.4,.3,.4,"#c9a06a",0,-.4,-.85,carryM);const cst=box(.42,.05,.14,"#fff",0,-.24,-.85,carryM);cst.material=new THREE.MeshLambertMaterial({color:"#fff"});carryM.visible=false;
const bp=n=>({x:6+(n%5)*.8,z:5.3-Math.floor(n/5)*.8});
function drawBoxes(){while(bxG.children.length)bxG.remove(bxG.children[0]);S.boxes.forEach((b,i)=>{const p=bp(i);box(.6,.45,.6,"#c9a06a",p.x,.225,p.z,bxG);box(.62,.06,.2,PP[b.id].c,p.x,.47,p.z,bxG)})}
function nearBox(){let b=-1,bd=1.9;S.boxes.forEach((x,i)=>{const p=bp(i),d=Math.hypot(px-p.x,pz-p.z);if(d<bd){bd=d;b=i}});return b}
function nearShelf(){if(!S.carry)return -1;const k=S.shelves.indexOf(S.carry.id);if(k<0)return -1;const s=slots[k];return Math.hypot(px-s.x,pz-(s.z+1.2))<2.4?k:-1}
function boxAct(){const c=S.carry;
if(c){const k=nearShelf();
 if(k>=0){const n=Math.min(24-S.stock[c.id],c.q);if(n<=0){msg("Rak sudah penuh (24).");return}S.stock[c.id]+=n;c.q-=n;refresh(k);SFX.pop();msg(`Rak ${PP[c.id].n}: ${S.stock[c.id]}/24`);if(c.q<=0)S.carry=null;save();return}
 if(Math.hypot(px-8,pz-4.8)<3.5&&S.boxes.length<10){S.boxes.push(c);S.carry=null;drawBoxes();SFX.pop();save()}else msg("Taruh di dekat pintu, atau isi rak yang sesuai.");return}
const i=nearBox();if(i>=0){S.carry=S.boxes.splice(i,1)[0];drawBoxes();SFX.pop();save()}}
$("bx").onclick=boxAct;
cvs.onpointerdown=e=>{lk={id:e.pointerId,x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId)};
cvs.onpointermove=e=>{if(lk&&lk.id===e.pointerId){yaw-=(e.clientX-lk.x)*.005;pitch=cl(pitch-(e.clientY-lk.y)*.005,-1.2,1.2);lk.x=e.clientX;lk.y=e.clientY}};
cvs.onpointerup=cvs.onpointercancel=e=>{if(lk&&lk.id===e.pointerId)lk=null};
function jm(e){const r=joy.getBoundingClientRect();let dx=e.clientX-r.left-60,dy=e.clientY-r.top-60;const d=Math.hypot(dx,dy);if(d>40){dx*=40/d;dy*=40/d}jv={x:dx/40,y:dy/40};$("knob").style.transform=`translate(${dx}px,${dy}px)`}
joy.onpointerdown=e=>{jp=e.pointerId;joy.setPointerCapture(e.pointerId);jm(e)};joy.onpointermove=e=>{if(jp===e.pointerId)jm(e)};
joy.onpointerup=joy.onpointercancel=e=>{jp=null;jv={x:0,y:0};$("knob").style.transform=""};
addEventListener("keydown",e=>{const k=e.key.toLowerCase();K[k]=1;if(k==="e")openBill();if(k==="f")boxAct()});addEventListener("keyup",e=>K[e.key.toLowerCase()]=0);
// ---- customers ----
let cs=[],spawnT=3;
const HAIR=["#3b2a20","#6b4a2f","#d9722b","#222"],SH=["#e0a458","#a98ad9","#6fc4d9","#e88a8a","#e8d27a"];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function spawn(){if(cs.length>=4+S.land+(ev&&ev.k==="ramai"?2:0))return;const av=P.filter(p=>S.shelves.includes(p.id)&&S.stock[p.id]>0&&Math.random()<cl(1.6-.6*pr(p.id)/p.p,.15,1));if(!av.length)return;
const wants=av.sort(()=>Math.random()-.5).slice(0,1+Math.floor(Math.random()*3)).map(p=>({pid:p.id,q:1+Math.floor(Math.random()*2)}));
const m=person(pick(SH),pick(HAIR));sc.add(m);SFX.bell();cs.push({m,mv:false,x:W()-2.5,z:8,wants,cart:[],st:"in",i:0,t:0,wait:0,qt:0,sp:1.5+Math.random()*.5,off:(Math.random()-.5)*1.4,rd:false})}
function mvTo(c,tx,tz,dt){const dx=tx-c.x,dz=tz-c.z,d=Math.hypot(dx,dz);if(d<.08){c.mv=false;return true}c.mv=true;const s=Math.min(d,c.sp*dt);c.x+=dx/d*s;c.z+=dz/d*s;c.m.rotation.y=Math.atan2(dx,dz);return false}
function out(c,s){if(c.cm){c.cm.forEach(m=>sc.remove(m));c.cm=null}rate(s);c.st="out";c.rd=false;c.path=[[W()-2.5,4.8],[W()-2.5,8.5]];if(s<=1)msg("Pelanggan kesal dan pergi! Rating turun.")}
function updC(dt,now){
const q=cs.filter(c=>c.st==="queue").sort((a,b)=>a.qt-b.qt);
cs.forEach(c=>{c.rd=false;
if(c.st==="in"){if(mvTo(c,W()-2.5,4.8,dt))c.st="shop"}
else if(c.st==="shop"){const w=c.wants[c.i];
 if(!w){if(c.cart.length){c.st="queue";c.qt=now;c.wait=0}else out(c,1)}
 else{const k=S.shelves.indexOf(w.pid);if(k<0){c.i++}else{const s=slots[k];if(mvTo(c,s.x+c.off,s.z+1.4,dt)){c.t+=dt;if(c.t>1){const n=Math.min(w.q,S.stock[w.pid]);if(n>0){S.stock[w.pid]-=n;c.cart.push({pid:w.pid,q:n});refresh(k);SFX.pop()}c.i++;c.t=0}}}}}
else if(c.st==="queue"){c.wait+=dt;const i=q.indexOf(c);if(mvTo(c,3+i*.9,2.2,dt)&&i===0){c.rd=true;if(!c.cm)placeItems(c)}if(c.wait>75)out(c,1)}
else if(c.st==="out"){const p=c.path[0];if(p&&mvTo(c,p[0],p[1],dt))c.path.shift();if(!c.path.length){sc.remove(c.m);c.dead=true}}
const a=c.mv?Math.sin(now*9+c.off*7):0;c.m.position.set(c.x,Math.abs(a)*.05,c.z);c.m.userData.l[0].rotation.x=a*.6;c.m.userData.l[1].rotation.x=-a*.6});
cs=cs.filter(c=>!c.dead)}
// ---- kasir ----
let B=null;
[500,1000,2000,5000,10000,20000,50000,100000].forEach(n=>{const b=document.createElement("button");b.textContent="+"+n.toLocaleString("id-ID");b.onclick=()=>{if(B){B.give+=n;$("bg").textContent=rp(B.give)}};$("dn").appendChild(b)});
function nearC(){return Math.hypot(px-3,pz-3.5)<3.4}
function openBill(){const c=cs.find(c=>c.st==="queue"&&c.rd);if(!c||!nearC()||B){if(!B)msg("Dekati kasir saat ada pelanggan menunggu di depan meja.");return}
c.st="pay";let tot=0;const units=[];c.cart.forEach(i=>{for(let j=0;j<i.q;j++){units.push(i.pid);tot+=pr(i.pid)}});
const nt=[5000,10000,20000,50000,100000,200000].filter(n=>n>=tot);let paid=nt[0]||Math.ceil(tot/100000)*100000;if(nt[1]&&Math.random()<.45)paid=nt[1];
B={c,tot,paid,give:0,units,si:0};$("bl").innerHTML="";$("pay").hidden=true;$("sc").hidden=false;scLabel();$("bt").textContent=rp(tot);$("bp").textContent=rp(paid);$("bg").textContent=rp(0);$("bill").hidden=false}
function closeBill(back){if(B&&back){B.c.st="queue";if(B.c.cm)B.c.cm.forEach(m=>m.visible=true)}if(B&&!back&&B.c.cm){B.c.cm.forEach(m=>sc.remove(m));B.c.cm=null}B=null;$("bill").hidden=true}
const scLabel=()=>{$("sc").textContent=`📷 Scan barang (${B.si}/${B.units.length})`};
$("sc").onclick=()=>{if(!B||B.si>=B.units.length)return;const p=PP[B.units[B.si]];if(B.c.cm&&B.c.cm[B.si])B.c.cm[B.si].visible=false;B.si++;snd(1500,.08,"square",.05);
const li=document.createElement("li");li.innerHTML=`<span>${p.n}</span><b>${rp(pr(p.id))}</b>`;$("bl").appendChild(li);
if(B.si>=B.units.length){$("sc").hidden=true;$("pay").hidden=false;SFX.pop()}else scLabel()};
function placeItems(c){const u=[];c.cart.forEach(i=>{for(let j=0;j<i.q;j++)u.push(i.pid)});c.cm=u.map((id,k)=>{const m=new THREE.Mesh(GE[id],IM[id]);m.position.set(1.9+k*.4,.98+GH[id]/2,3.5);sc.add(m);return m});SFX.pop()}
$("rs").onclick=()=>{if(B){B.give=0;$("bg").textContent=rp(0)}};
$("bc").onclick=()=>closeBill(true);
$("ok").onclick=()=>{if(!B)return;const exp=B.paid-B.tot,d=B.give-exp,c=B.c;let t;
if(d===0){SFX.cash();S.money+=B.tot;rate(5);t=`Pas! Kembalian ${rp(exp)} benar. +${rp(B.tot)}`}
else if(d>0){SFX.bad();S.money+=B.tot-d;rate(3);t=`Kelebihan ${rp(d)}! Kamu rugi. (seharusnya ${rp(exp)})`}
else{SFX.bad();S.money+=B.tot;rate(1);t=`Kurang ${rp(-d)}! Pelanggan kesal. (seharusnya ${rp(exp)})`}
S.served++;msg(t);c.st="out";c.path=[[W()-2.5,4.8],[W()-2.5,8.5]];closeBill(false);save()};
$("act").onclick=openBill;
// ---- ponsel ----
let tab=0,sel=null;
function phone(){let h="";
if(tab===0)P.forEach(p=>{const on=S.shelves.includes(p.id),c=cost(p);h+=`<div class="row"><span>${p.n}<small>Rak ${S.stock[p.id]}/24 • Kardus ${S.boxes.filter(b=>b.id===p.id).length}</small></span>${on?`<button data-a="stok" data-i="${p.id}" ${S.money<c?"disabled":""}>+1 kardus · ${rp(c)}</button>`:"<small>Belum ada rak</small>"}</div>`});
else if(tab===1){const free=P.filter(p=>!S.shelves.includes(p.id)),full=S.shelves.filter(Boolean).length>=slotsN();h+=`<small>Rak terpakai ${S.shelves.filter(Boolean).length}/${slotsN()}</small>`;
 if(full)h+="<p>Slot penuh. Perluas lahan dulu.</p>";else if(!free.length)h+="<p>Semua produk sudah punya rak.</p>";else free.forEach(p=>h+=`<div class="row"><span>Rak ${p.n}</span><button data-a="rak" data-i="${p.id}" ${S.money<150000?"disabled":""}>${rp(150000)}</button></div>`)}
else if(tab===3){h+="<small>Harga jual per barang (kelipatan Rp500). Terlalu mahal = pelanggan malas beli.</small>";S.shelves.filter(Boolean).forEach(id=>{const p=PP[id],pc=pr(id),bc=Math.round(p.p*.7);h+=`<div class="row"><span>${p.n}<small>Modal ${rp(bc)} • Untung ${rp(pc-bc)}</small></span><span><button data-a="hrg" data-i="${id}" data-d="-500">−</button> <b>${rp(pc)}</b> <button data-a="hrg" data-i="${id}" data-d="500">+</button></span></div>`})}
else if(tab===4){const cols=3+2*S.land;h+=`<small>Pilih rak lalu ketuk tempat tujuan (kosong = pindah, terisi = tukar). Kasir di kiri, pintu di kanan. Baris atas = dekat dinding belakang.</small><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;margin:8px 0">`;
for(let r=0;r<2;r++)for(let i=0;i<cols;i++){const k=i*2+r,id=S.shelves[k];h+=`<button data-a="slot" data-i="${k}" style="min-height:44px;font-size:11px;padding:4px;${sel===k?"background:#6fa86f;color:#fff":id?"":"background:#eee;color:#999"}">${id?PP[id].n:"kosong"}</button>`}
h+="</div>"}
else h+=`<p>Lahan level ${S.land}/2 (lebar ${W()} m)</p>`+(S.land>=2?"<p>Sudah maksimal.</p>":`<div class="row"><span>Perluas toko +6 m<small>+4 slot rak</small></span><button data-a="lahan" ${S.money<1500000?"disabled":""}>${rp(1500000)}</button></div>`);
$("pb").innerHTML=h;$("pm").textContent="💵 "+rp(S.money);document.querySelectorAll("#phone .tabs button").forEach(b=>b.classList.toggle("on",+b.dataset.t===tab))}
$("ph").onclick=()=>{$("phone").hidden=false;phone()};$("pc").onclick=()=>$("phone").hidden=true;
document.querySelectorAll("#phone .tabs button").forEach(b=>b.onclick=()=>{tab=+b.dataset.t;sel=null;phone()});
$("pb").onclick=e=>{const b=e.target.closest("button");if(!b||b.disabled)return;const a=b.dataset.a,i=b.dataset.i;
if(a==="stok"){const c=cost(PP[i]);if(S.money<c)return;if(S.boxes.length>=10){msg("Area kardus penuh! Isi rak dulu.");return}S.money-=c;S.boxes.push({id:i,q:12});drawBoxes();SFX.buy();msg("Kardus "+PP[i].n+" tiba di dekat pintu 📦")}
else if(a==="rak"){if(S.money<150000)return;S.money-=150000;S.shelves[S.shelves.findIndex(x=>!x)]=i;buildStore();msg("Rak "+PP[i].n+" dipasang. Isi stoknya!")}
else if(a==="hrg"){const mx=Math.round(PP[i].p*3/500)*500;S.price[i]=cl(pr(i)+(+b.dataset.d),500,mx);refresh(S.shelves.indexOf(i))}
else if(a==="slot"){const k=+i;if(sel===null){if(S.shelves[k])sel=k;else msg("Pilih rak yang mau dipindah dulu.")}else if(sel===k)sel=null;else{const t=S.shelves[sel];S.shelves[sel]=S.shelves[k]||null;S.shelves[k]=t||null;sel=null;buildStore();msg("Rak dipindah.")}}
else if(a==="lahan"){if(S.money<1500000||S.land>=2)return;S.money-=1500000;S.land++;buildStore();msg("Toko diperluas!")}
save();phone()};
// ---- loop ----
let last=performance.now(),bobT=0,stepT=0,gt=0;
function loop(t){const dt=Math.min((t-last)/1000,.05);last=t;
const kx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),ky=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0);
const mx=jv.x+kx,my=-jv.y+ky,sp=3.2*dt,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
let mvg=false;if(!B&&$("phone").hidden){px+=(fx*my+rx*mx)*sp;pz+=(fz*my+rz*mx)*sp;mvg=Math.abs(mx)+Math.abs(my)>.15}
if(mvg){bobT+=dt*9;stepT+=dt;if(stepT>.42){stepT=0;SFX.step()}}
px=cl(px,.5,W()-.5);pz=cl(pz,-5.5,5.5);
obst.forEach(o=>{const dx=px-o.x,dz=pz-o.z,ox=o.hx+.35-Math.abs(dx),oz=o.hz+.35-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)px+=Math.sign(dx||1)*ox;else pz+=Math.sign(dz||1)*oz}});
spawnT-=dt;if(spawnT<=0){spawnT=cl(9/(S.rating/3),4,18)*(.7+Math.random()*.6)*(ev?ev.k==="ramai"?.5:ev.k==="hujan"?2:1:1);spawn()}
evT-=dt;if(ev){ev.t-=dt;if(ev.t<=0){ev=null;msg("Event selesai.");evT=60+Math.random()*60}}else if(evT<=0){const e=pick(EVS);ev={k:e.k,n:e.n,t:e.t};msg(e.n+"!");SFX.bell()}
updC(dt,t/1000);
gt+=dt;const hh=(8+gt/10)%24,sun=.5+.5*Math.cos(2*Math.PI*(hh-12)/24);sc.background.copy(NIGHT).lerp(DAY,sun);winM.color.copy(sc.background);hemi.intensity=.5+.6*sun;dl.intensity=.08+.4*sun;
$("hc").textContent="🕒 "+String(Math.floor(hh)).padStart(2,"0")+":"+String(Math.floor(hh%1*6)*10).padStart(2,"0")+(sun<.25?" 🌙":" ☀️");
cam.position.set(px,1.6+(mvg?Math.sin(bobT)*.04:0),pz);cam.rotation.set(pitch,yaw,0);R.render(sc,cam);
$("hm").textContent="💵 "+rp(S.money);$("hr").textContent="⭐ "+S.rating.toFixed(1).replace(".",",");$("hs").textContent="👥 "+S.served+" dilayani";
$("act").disabled=!(nearC()&&cs.some(c=>c.st==="queue"&&c.rd));
$("he").style.display=ev?"":"none";if(ev)$("he").textContent=ev.n+" ("+Math.ceil(ev.t)+"d)";
const nb=nearBox(),nk=nearShelf(),bx=$("bx");let lb="";
if(S.carry)lb=nk>=0?"📥 Isi rak "+PP[S.carry.id].n:"📦 Taruh";else if(nb>=0)lb="📦 Angkat "+PP[S.boxes[nb].id].n;
bx.style.display=lb?"":"none";if(bx.textContent!==lb)bx.textContent=lb;
carryM.visible=!!S.carry;if(S.carry)cst.material.color.set(PP[S.carry.id].c);
requestAnimationFrame(loop)}
buildStore();requestAnimationFrame(loop);
setInterval(save,10000);
})();
