/* ============================================================
   颜可芯 · 我们的故事 — 氛围与放映引擎
   星空 / 尘埃 / 流星 / 光标 / 磁性 / 倾斜 / 揭示 / 视差 / 幕布 / 像素 / 花瓣雨 / 星座 / 流动影片
   ============================================================ */
(function(){
  "use strict";
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover:none),(pointer:coarse)").matches;

  /* ================= 星空 + 金色尘埃 ================= */
  const starsCv = document.getElementById("stars"), dustCv = document.getElementById("dust");
  const sctx = starsCv.getContext("2d"), dctx = dustCv.getContext("2d");
  let W=0,H=0,stars=[],dust=[],shoot=[],px=-9999,py=-9999;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  function resizeSky(){
    W=window.innerWidth; H=window.innerHeight;
    starsCv.width=dustCv.width=W*DPR; starsCv.height=dustCv.height=H*DPR;
    sctx.setTransform(DPR,0,0,DPR,0,0); dctx.setTransform(DPR,0,0,DPR,0,0);
    buildStars(); buildDust();
  }
  function buildStars(){
    const count=Math.min(240,Math.floor(W*H/5200)); stars=[];
    for(let i=0;i<count;i++){
      const layer=Math.random();
      stars.push({x:Math.random()*W,y:Math.random()*H,r:layer<.55?.3+Math.random()*.5:(layer<.85?.5+Math.random()*.7:.9+Math.random()*1.2),a:.25+Math.random()*.6,tw:Math.random()*Math.PI*2,sp:.3+Math.random()*.9,layer});
    }
  }
  function buildDust(){
    const count=Math.min(70,Math.floor(W*H/16000)); dust=[];
    for(let i=0;i<count;i++) dust.push({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*1.8,vx:(Math.random()-.5)*.12,vy:-.04-Math.random()*.22,a:.08+Math.random()*.3,ph:Math.random()*Math.PI*2,sp:.5+Math.random()*1.6,gold:Math.random()<.7});
  }
  function tickSky(t){
    const st=t/1000; sctx.clearRect(0,0,W,H);
    if(!reduceMotion&&Math.random()<.0022&&shoot.length<2) shoot.push({x:Math.random()*W*.8+W*.1,y:Math.random()*H*.35,vx:4+Math.random()*3,vy:1.6+Math.random()*1.2,life:1});
    for(let i=shoot.length-1;i>=0;i--){ const m=shoot[i]; m.x+=m.vx;m.y+=m.vy;m.life-=.018; if(m.life<=0){shoot.splice(i,1);continue;}
      const g=sctx.createLinearGradient(m.x,m.y,m.x-m.vx*12,m.y-m.vy*12); g.addColorStop(0,"rgba(246,232,207,"+(m.life*.9)+")"); g.addColorStop(1,"rgba(246,232,207,0)");
      sctx.strokeStyle=g;sctx.lineWidth=1.2; sctx.beginPath();sctx.moveTo(m.x,m.y);sctx.lineTo(m.x-m.vx*12,m.y-m.vy*12);sctx.stroke();
    }
    const offX=(px-W/2)*.02,offY=(py-H/2)*.02;
    for(const s of stars){
      const depth=.4+s.layer*.6, tw=.55+.45*Math.sin(st*s.sp+s.tw);
      const x=s.x+offX*depth,y=s.y+offY*depth;
      sctx.globalAlpha=s.a*tw; sctx.fillStyle=s.layer>.82?"#f6e8cf":"#e9ddc4";
      sctx.beginPath();sctx.arc(x,y,s.r,0,Math.PI*2);sctx.fill();
      if(s.layer>.85){ sctx.globalAlpha=s.a*tw*.28; sctx.beginPath();sctx.arc(x,y,s.r*2.6,0,Math.PI*2);sctx.fill(); }
    }
    sctx.globalAlpha=1;
    dctx.clearRect(0,0,W,H);
    for(const p of dust){
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-10)p.y=H+10; if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
      const tw=.5+.5*Math.sin(st*p.sp+p.ph);
      dctx.globalAlpha=p.a*tw; dctx.fillStyle=p.gold?"rgba(230,197,107,.9)":"rgba(216,167,177,.8)";
      dctx.beginPath();dctx.arc(p.x,p.y,p.r,0,Math.PI*2);dctx.fill();
      if(p.gold&&p.r>1.4){ dctx.globalAlpha=p.a*tw*.25; dctx.beginPath();dctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);dctx.fill(); }
    }
    dctx.globalAlpha=1;
  }

  /* ================= 光标 ================= */
  const cursor=document.getElementById("cursor");
  let cx=-100,cy=-100,tx=-100,ty=-100;
  if(!touch){
    document.addEventListener("mousemove",e=>{ tx=e.clientX;ty=e.clientY;cursor.classList.add("on");px=tx;py=ty; });
    document.addEventListener("mouseleave",()=>cursor.classList.remove("on"));
    document.addEventListener("mouseover",e=>{ const el=e.target.closest("a,button,[data-magnetic],.media-slot,input,.ticket,.level,.note"); cursor.classList.toggle("hover",!!el); });
  }
  (function tickCursor(){ cx+=(tx-cx)*.16; cy+=(ty-cy)*.16; if(cursor.classList.contains("on")) cursor.style.transform="translate("+cx+"px,"+cy+"px) translate(-50%,-50%)"; requestAnimationFrame(tickCursor); })();

  /* ================= 磁性按钮 ================= */
  if(!touch) Array.from(document.querySelectorAll("[data-magnetic]")).forEach(el=>{
    const str=parseFloat(el.dataset.strength||.28);
    el.addEventListener("mousemove",e=>{ const r=el.getBoundingClientRect(); const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2); el.style.transition="transform .12s ease-out"; el.style.transform="translate("+dx*str+"px,"+dy*str+"px)"; });
    el.addEventListener("mouseleave",()=>{ el.style.transition="transform .6s cubic-bezier(.22,1,.36,1)"; el.style.transform=""; });
  });

  /* ================= 3D 倾斜 ================= */
  if(!touch) Array.from(document.querySelectorAll("[data-tilt]")).forEach(el=>{
    el.addEventListener("mousemove",e=>{ const r=el.getBoundingClientRect(); const rx=((e.clientY-r.top)/r.height-.5)*-7, ry=((e.clientX-r.left)/r.width-.5)*9; el.style.transform="perspective(900px) rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) translateY(-4px)"; });
    el.addEventListener("mouseleave",()=>{ el.style.transform=""; });
  });

  /* ================= 揭示系统 ================= */
  const Reveal={
    io:null, activeScreen:null,
    show(el){ const d=parseInt(el.dataset.delay||0,10); el.style.transitionDelay=(d*.12)+"s"; el.classList.add("in"); this.io.unobserve(el); },
    reset(screenEl){
      if(this.io) this.io.disconnect();
      this.activeScreen=screenEl;
      this.io=new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) this.show(en.target); }); },{root:screenEl,rootMargin:"0px 0px -6% 0px",threshold:.06});
      Array.from(screenEl.querySelectorAll("[data-reveal].in")).forEach(el=>{ el.classList.remove("in"); el.style.transitionDelay=""; });
      Array.from(screenEl.querySelectorAll("[data-reveal]")).forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.top<window.innerHeight*.92 && r.bottom>0) this.show(el); else this.io.observe(el);
      });
    }
  };

  /* ================= 视差 ================= */
  function applyParallax(){
    const sc=document.querySelector(".screen.active"); if(!sc) return;
    const vh=window.innerHeight;
    Array.from(sc.querySelectorAll(".media-slot img,.media-slot video")).forEach(el=>{
      const r=el.getBoundingClientRect(); if(r.bottom<-80||r.top>vh+80) return;
      const center=(r.top+r.height/2)-vh/2, depth=parseFloat(el.dataset.par||.08);
      el.style.transform="translateY("+(center*-depth).toFixed(1)+"px) scale(1.08)";
    });
  }
  let parallaxEl=null;
  function startParallax(){
    if(touch||reduceMotion) return;
    if(parallaxEl&&parallaxEl.classList.contains("active")) return;
    stopParallax();
    parallaxEl=document.querySelector(".screen.active");
    if(parallaxEl) parallaxEl.addEventListener("scroll",applyParallax,{passive:true});
    window.addEventListener("resize",applyParallax);
    applyParallax();
  }
  function stopParallax(){ if(parallaxEl) parallaxEl.removeEventListener("scroll",applyParallax); window.removeEventListener("resize",applyParallax); parallaxEl=null; }

  /* ================= 转场幕布 ================= */
  const curtain=document.getElementById("curtain");
  const Curtain={
    busy:false,
    go(fn,dur){
      if(this.busy) return;
      this.busy=true;
      curtain.style.display="block";
      curtain.classList.remove("open"); curtain.classList.add("play");
      setTimeout(()=>{
        fn&&fn();
        curtain.classList.remove("play"); curtain.classList.add("open");
        setTimeout(()=>{ curtain.classList.remove("open"); curtain.style.display="none"; this.busy=false; },900);
      },dur||640);
    }
  };

  /* ================= 真实花瓣雨 ================= */
  const petalCv=document.getElementById("petals"), pctx=petalCv.getContext("2d");
  let petals=[],petalActive=false,petalOp=0,petalTarget=0,petalAnim=null,petalTimer=null;
  const PETAL_COLORS=[["255,166,182","226,120,150"],["246,143,168","201,96,130"],["255,171,145","226,120,110"],["255,243,224","240,210,170"],["247,217,168","222,178,120"],["255,248,240","242,225,205"]];
  let sprites=[];
  /* 预渲染逼真花瓣精灵 */
  function buildSprites(){
    sprites=PETAL_COLORS.map((c,i)=>{
      const S=96;
      const cv=document.createElement("canvas"); cv.width=S; cv.height=S*1.15;
      const g=cv.getContext("2d");
      const w=S, h=S*1.15, cx=w/2;
      const g1=g.createLinearGradient(0,0,0,h);
      g1.addColorStop(0,"rgba("+c[0]+",1)");
      g1.addColorStop(.72,"rgba("+c[1]+",1)");
      g1.addColorStop(1,"rgba("+c[1]+",.9)");
      g.beginPath();
      g.moveTo(cx, h*1.02);                 /* 花柄尖 */
      g.bezierCurveTo(cx-w*.42, h*.86, cx-w*.5, h*.52, cx-w*.08, h*.16);   /* 左瓣 */
      g.bezierCurveTo(cx, h*.03, cx, h*.03, cx+w*.08, h*.16);              /* 顶部缺口 */
      g.bezierCurveTo(cx+w*.5, h*.52, cx+w*.42, h*.86, cx, h*1.02);        /* 右瓣 */
      g.closePath();
      g.fillStyle=g1; g.fill();
      /* 高光 */
      g.beginPath();
      g.moveTo(cx, h*.92);
      g.bezierCurveTo(cx-w*.18, h*.78, cx-w*.2, h*.55, cx, h*.32);
      g.bezierCurveTo(cx+w*.2, h*.55, cx+w*.18, h*.78, cx, h*.92);
      g.closePath();
      g.fillStyle="rgba(255,255,255,.22)"; g.fill();
      /* 主叶脉 */
      g.beginPath();
      g.moveTo(cx, h*1.0); g.bezierCurveTo(cx, h*.62, cx, h*.4, cx, h*.22);
      g.strokeStyle="rgba(160,60,80,.28)"; g.lineWidth=1.6; g.lineCap="round";
      g.stroke();
      /* 侧叶脉 */
      g.strokeStyle="rgba(160,60,80,.18)"; g.lineWidth=1.2;
      for(let side=-1; side<=1; side+=2){
        g.beginPath(); g.moveTo(cx, h*.55); g.bezierCurveTo(cx+side*w*.16, h*.5, cx+side*w*.26, h*.4, cx+side*w*.24, h*.3); g.stroke();
        g.beginPath(); g.moveTo(cx, h*.72); g.bezierCurveTo(cx+side*w*.18, h*.68, cx+side*w*.3, h*.6, cx+side*w*.27, h*.5); g.stroke();
      }
      return cv;
    });
  }
  function resizePetals(){ petalCv.width=window.innerWidth; petalCv.height=window.innerHeight; pctx.setTransform(DPR,0,0,DPR,0,0); }
  function spawnPetals(n,burstMode){
    const w=petalCv.width/DPR,h=petalCv.height/DPR;
    for(let i=0;i<n;i++){
      const fromTop=!burstMode;
      const depth=Math.random();
      petals.push({
        x:burstMode?w/2+(Math.random()-.5)*w*.2:Math.random()*w,
        y:burstMode?h/2:(-40-Math.random()*h*.5),
        size:(burstMode?14:9)+Math.random()*14,
        depth,
        vy:burstMode?(2.2+Math.random()*3.4)*(Math.random()<.5?1:-1):(1.1+Math.random()*1.7)*(0.7+depth*0.8),
        vx:burstMode?(Math.random()-.5)*3.2:(Math.random()-.5)*.7,
        sway:Math.random()*Math.PI*2,
        swaySp:.012+Math.random()*.03,
        rot:Math.random()*Math.PI*2,
        rotSp:(Math.random()-.5)*.09,
        flip:Math.random()*Math.PI*2,
        flipSp:.02+Math.random()*.07,
        color:Math.floor(Math.random()*PETAL_COLORS.length),
        alpha:.55+Math.random()*.45,
        life:1
      });
    }
  }
  function drawPetal(p){
    const sp=sprites[p.color];
    if(!sp) return;
    const s=p.size*2;
    pctx.save();
    pctx.translate(p.x,p.y);
    pctx.rotate(p.rot);
    pctx.scale(Math.cos(p.flip),1);          /* 3D 翻转 */
    pctx.globalAlpha=p.alpha*p.life;
    pctx.drawImage(sp,-s/2,-s/1.15,s,s*1.15);
    pctx.restore();
  }
  function tickPetals(){
    pctx.clearRect(0,0,petalCv.width/DPR,petalCv.height/DPR);
    if(petalOp<petalTarget) petalOp=Math.min(petalTarget,petalOp+.03);
    if(petalOp<=.001&&petals.length===0){ petalActive=false; return; }
    pctx.globalAlpha=petalOp;
    const w=petalCv.width/DPR,h=petalCv.height/DPR;
    for(let i=petals.length-1;i>=0;i--){
      const p=petals[i];
      p.x+=p.vx+Math.sin(p.sway)*.9;
      p.y+=p.vy;
      p.sway+=p.swaySp; p.rot+=p.rotSp; p.flip+=p.flipSp;
      if(p.y>h+60||p.y<-60||p.x<-80||p.x>w+80){
        if(petalTarget>0 && petalOp>.5){           /* 铺满全屏：从顶部/边缘持续补充 */
          p.x=Math.random()*w; p.y=-40-Math.random()*80;
          p.vy=Math.abs(p.vy)*(0.8+Math.random()*.6);
        } else { petals.splice(i,1); continue; }
      }
      drawPetal(p);
    }
    petalAnim=requestAnimationFrame(tickPetals);
  }
  function petalFadeSoon(){ if(petalTimer) clearTimeout(petalTimer); petalTimer=setTimeout(()=>{ petalTarget=0; },12000); }
  const Petals={
    start(level){ petalTarget=level||.9; resizePetals(); spawnPetals(level>1?140:70,false); if(!petalActive){petalActive=true; petalAnim=requestAnimationFrame(tickPetals);} petalFadeSoon(); },
    burst(n){ resizePetals(); spawnPetals(n||200,true); if(!petalActive){petalActive=true; petalAnim=requestAnimationFrame(tickPetals);} petalTarget=1; petalFadeSoon(); },
    storm(n){ resizePetals(); spawnPetals(n||140,false); if(!petalActive){petalActive=true; petalAnim=requestAnimationFrame(tickPetals);} petalTarget=1; if(petalTimer) clearTimeout(petalTimer); petalTimer=setTimeout(()=>{petalTarget=.7;},20000); },
    stop(){ petalTarget=0; if(petalTimer) clearTimeout(petalTimer); setTimeout(()=>{ if(petalTarget<=0&&petals.length<6) petals=[]; },1500); }
  };

  /* ================= 像素画 ================= */
  const PIXEL={ cv:document.getElementById("pixelCanvas"), hearts:[] };
  if(PIXEL.cv){
    const ctx=PIXEL.cv.getContext("2d"), Wd=320,Hd=240,CELL=4; let frame=0;
    const heartMap=[".xx...xx.","xxxx.xxxx","xxxxxxxxx","xxxxxxxxx",".xxxxxxx.","..xxxxx..","...xxx...","....x...."];
    function px(x,y,c){ ctx.fillStyle=c; ctx.fillRect(x*CELL,y*CELL,CELL,CELL); }
    const catMap=["..XXXXXXXX......",".XXXXXXXXXX.....","XX.XXXXXX.XX....","XXX.XXXX.XXX....","XXXXXXXXXXXXX...","XXXXXXXXXXXXXX..",".XXXXXXXXXXXXXX.",".XXX..XXX..XXX..",".XXX..XXX..XXX..","..X....X....X...",".......X........","......XXX......."];
    function drawCat(ox,oy,color){ for(let yy=0;yy<catMap.length;yy++) for(let xx=0;xx<catMap[0].length;xx++) if(catMap[yy][xx]==="X") px(ox+xx,oy+yy,color); }
    const bikeMap=["......XX.......",".....XXXX......","....XXXXXX..XX.","...XXXXXXX.XXX.","..XXXXXXXXXXX..",".XXXXXXXXXXXX..","..XX...XX...XX.","..XX...XX...XX.","................"];
    function drawBike(ox,oy,color){ for(let yy=0;yy<bikeMap.length;yy++) for(let xx=0;xx<bikeMap[0].length;xx++) if(bikeMap[yy][xx]==="X") px(ox+xx,oy+yy,color); }
    function drawHeart(cx,cy,scale,color){
      const w=heartMap[0].length,h=heartMap.length,sw=w*CELL*scale,sh=h*CELL*scale,ox=cx-sw/2,oy=cy-sh/2;
      for(let yy=0;yy<h;yy++) for(let xx=0;xx<w;xx++) if(heartMap[yy][xx]==="x"){ const x=Math.round(ox/CELL+xx*scale),y=Math.round(oy/CELL+yy*scale); px(x,y,color); }
    }
    function drawScene(){
      const grad=ctx.createLinearGradient(0,0,0,Hd);
      grad.addColorStop(0,"#3a1630"); grad.addColorStop(.5,"#70253d"); grad.addColorStop(.78,"#b05438"); grad.addColorStop(1,"#e0764a");
      ctx.fillStyle=grad; ctx.fillRect(0,0,Wd,Hd);
      /* 地平线暖光 */
      const sun=ctx.createRadialGradient(Wd/2,Hd-70,8,Wd/2,Hd-70,140);
      sun.addColorStop(0,"rgba(255,200,130,.55)"); sun.addColorStop(1,"rgba(255,170,110,0)");
      ctx.fillStyle=sun; ctx.fillRect(0,0,Wd,Hd);
      ctx.fillStyle="#5a2436"; for(let x=0;x<Wd/CELL;x++){ const y=Hd/CELL-34-Math.floor(Math.abs(Math.sin(x*.035))*12); ctx.fillRect(x*CELL,y*CELL,CELL,CELL); }
      ctx.fillStyle="#ffdfa8"; ctx.beginPath(); ctx.arc(246,44,11,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="rgba(110,50,50,.6)"; ctx.beginPath(); ctx.arc(250,42,2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(243,48,1.4,0,Math.PI*2); ctx.fill();
      [[28,26],[52,14],[84,30],[118,18],[150,34],[36,52],[66,44],[196,22],[228,66],[286,20],[120,60],[158,52]].forEach(([x,y],i)=>{ const a=.4+.5*Math.abs(Math.sin(frame*.05+i)); ctx.fillStyle="rgba(255,238,205,"+a.toFixed(2)+")"; ctx.fillRect(x,y,2,2); });
      ctx.fillStyle="#3a1c2a"; ctx.fillRect(0,Hd-34*CELL,Wd,34*CELL);
      drawCat(30,Hd/CELL-20,"#e8a0ad");
      ctx.fillStyle="rgba(232,160,173,.16)"; ctx.beginPath(); ctx.arc(39*CELL,(Hd/CELL-14)*CELL,16,0,Math.PI*2); ctx.fill();
      drawBike(Wd/CELL-17,Hd/CELL-13,"#e8bd6a");
      const fl=2+Math.round(Math.abs(Math.sin(frame*.08))*2);
      ctx.fillStyle="#f0c87a"; ctx.fillRect((Wd/CELL-6)*CELL,(Hd/CELL-15)*CELL,2*CELL,fl*CELL);
      ctx.fillStyle="#ffe8b8"; ctx.fillRect((Wd/CELL-5)*CELL,(Hd/CELL-15)*CELL,CELL,Math.max(1,fl-1)*CELL);
      drawHeart(Wd/2,Hd/2-8,1+.14*Math.abs(Math.sin(frame*.07)),"#ef9aa8");
      [[200,208],[212,202],[224,210],[186,200]].forEach(([x,y],i)=>{ const a=.3+.4*Math.abs(Math.sin(frame*.04+i*1.3)); ctx.fillStyle="rgba(239,154,168,"+a.toFixed(2)+")"; ctx.fillRect(x,y,2,2); });
    }
    function burst(n){ for(let i=0;i<(n||26);i++){ const ang=Math.random()*Math.PI*2,sp=.6+Math.random()*2.2; PIXEL.hearts.push({x:Wd/2,y:Hd/2-8,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-.4,life:1,size:1+Math.random()*2}); } }
    function drawBurst(){ for(let i=PIXEL.hearts.length-1;i>=0;i--){ const hh=PIXEL.hearts[i]; hh.x+=hh.vx;hh.y+=hh.vy;hh.vy+=.08;hh.life-=.018; if(hh.life<=0){PIXEL.hearts.splice(i,1);continue;} ctx.fillStyle="rgba(216,167,177,"+hh.life.toFixed(2)+")"; ctx.fillRect(Math.round(hh.x)*CELL,Math.round(hh.y)*CELL,Math.round(hh.size)*CELL,Math.round(hh.size)*CELL); } }
    (function loop(){ drawScene(); drawBurst(); frame++; requestAnimationFrame(loop); })();
    PIXEL.burst=burst;
  }

  /* ================= 终章 · 星座 ================= */
  const Const=(function(){
    const cv=document.getElementById("constCanvas"); if(!cv) return {};
    const ctx=cv.getContext("2d"), Wc=760,Hc=300; cv.width=Wc; cv.height=Hc;
    const heartPts=[];
    (function(){ const t0=-Math.PI/2,t1=Math.PI*1.5,N=26,cx=Wc/2,cy=Hc/2-6,a=200,b=150; for(let i=0;i<=N;i++){ const t=t0+(t1-t0)*i/N; const x=cx+a*Math.pow(Math.cos(t),3); const y=cy-(b*Math.sin(t)-a*.32*Math.sin(2*t)+a*.12*Math.sin(3*t)-a*.05*Math.sin(4*t)); heartPts.push({x,y}); } })();
    const randStars=[]; for(let i=0;i<70;i++) randStars.push({x:Math.random()*Wc,y:Math.random()*Hc,r:.4+Math.random()*1.1,a:.12+Math.random()*.3,tw:Math.random()*6});
    let lit=0,state="idle",raf=null,constVisible=false;
    function draw(t){
      if(!constVisible){ raf=requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,Wc,Hc);
      for(const s of randStars){ const a=s.a*(.6+.4*Math.sin(t*.001+s.tw)); ctx.globalAlpha=a; ctx.fillStyle="#e9ddc4"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); }
      const target=state==="lit"?1:Math.min(1,lit+.04); state="go"; lit=target; const glow=lit;
      for(let i=0;i<heartPts.length-1;i++){
        const a=heartPts[i],b=heartPts[i+1];
        ctx.globalAlpha=glow*.55; ctx.strokeStyle="#e6c56b"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        ctx.globalAlpha=glow; ctx.fillStyle="#f6e8cf"; ctx.beginPath(); ctx.arc(a.x,a.y,2,0,Math.PI*2); ctx.fill();
        if(glow>.5){ ctx.globalAlpha=glow*.25; ctx.beginPath(); ctx.arc(a.x,a.y,6,0,Math.PI*2); ctx.fill(); }
      }
      if(glow>.2){
        ctx.globalAlpha=Math.min(1,(glow-.2)*1.4); ctx.textAlign="center";
        ctx.fillStyle="#e6c56b"; ctx.font="300 26px 'Songti SC','Noto Serif SC',serif";
        ctx.shadowColor="rgba(230,197,107,.55)"; ctx.shadowBlur=14; ctx.fillText("煊 · 芯",Wc/2,Hc-30); ctx.shadowBlur=0;
        ctx.fillStyle="rgba(242,233,216,.4)"; ctx.font="italic 300 13px 'Cormorant Garamond',Georgia,serif"; ctx.fillText("LIGHT UP OUR NAME",Wc/2,Hc-10);
      }
      ctx.globalAlpha=1; raf=requestAnimationFrame(draw);
    }
    function trigger(){ state="lit"; }
    cv.addEventListener("click",trigger);
    cv.addEventListener("touchstart",e=>{ e.preventDefault(); trigger(); },{passive:false});
    raf=requestAnimationFrame(draw);
    let autoDone=false;
    const obs=new IntersectionObserver(en=>{ const vis=en[0].isIntersecting; constVisible=vis; if(vis&&!autoDone){ autoDone=true; setTimeout(()=>{ if(state!=="lit") state="lit"; },1600); } },{threshold:.15});
    obs.observe(cv);
    return { trigger };
  })();

  /* ================= 流动影片（捌 · 影像） ================= */
  const Cinema=(function(){
    const stage=document.getElementById("cinemaSlides");
    const capEl=document.getElementById("cinemaCaption");
    const bar=document.getElementById("cinemaBar");
    const idxEl=document.getElementById("cinemaIndex");
    const totalEl=document.getElementById("cinemaTotal");
    const toggle=document.getElementById("cinemaToggle");
    const prevBtn=document.getElementById("cinemaPrev");
    const nextBtn=document.getElementById("cinemaNext");
    if(!stage) return { start(){}, stop(){}, isCinemaScreen(){ return false; } };
    const slides=(SITE.cinema||[]).map((s,i)=>{
      const d=document.createElement("div");
      d.className="cinema-slide "+(s.type==="video"?"video":"photo");
      if(s.type==="video"){
        const v=document.createElement("video");
        v.muted=true; v.loop=true; v.playsInline=true;
        v.setAttribute("playsinline",""); v.setAttribute("webkit-playsinline","");
        v.setAttribute("x5-playsinline",""); v.setAttribute("x5-video-player-type","h5");
        v.setAttribute("disablePictureInPicture","");
        v.setAttribute("preload","metadata");
        v.poster="assets/photos/"+s.src.replace(/\.[a-z0-9]+$/i,"")+".poster.jpg";
        v.src="assets/videos/"+s.src;
        d.appendChild(v);
        const sb=document.createElement("button");
        sb.className="slide-sound"; sb.textContent="🔇";
        sb.setAttribute("aria-label","开启声音");
        sb.addEventListener("click",e=>{
          e.stopPropagation();
          v.muted=!v.muted;
          if(!v.muted){
            if(window.AudioEngine && window.AudioEngine.playing){ window.AudioEngine.pause(); window.__bgmPausedByVideo=true; }
            sb.textContent="🔊"; sb.classList.add("on");
            if(v.paused) v.play().catch(()=>{});
          } else {
            if(window.__bgmPausedByVideo){ window.__bgmPausedByVideo=false; if(window.AudioEngine && !window.AudioEngine.playing) window.AudioEngine.start(); }
            sb.textContent="🔇"; sb.classList.remove("on");
          }
        });
        d.appendChild(sb);
      } else {
        const im=document.createElement("img");
        im.src="assets/photos/"+s.src; im.alt=s.cap||"";
        d.appendChild(im);
      }
      stage.appendChild(d);
      return d;
    });
    let cur=-1, playing=true, timer=null, total=slides.length, barRAF=null, barStart=0;
    totalEl.textContent=String(total).padStart(2,"0");
    const SLIDE_MS=6500;
    function stopBar(){ if(barRAF) cancelAnimationFrame(barRAF); barRAF=null; }
    function startBar(){
      stopBar();
      barStart=performance.now();
      const step=(now)=>{
        const pct=Math.min(100,(now-barStart)/SLIDE_MS*100);
        bar.style.width=pct.toFixed(2)+"%";
        if(pct<100) barRAF=requestAnimationFrame(step); else bar.style.width="100%";
      };
      barRAF=requestAnimationFrame(step);
    }
    function showCaption(txt){
      capEl.textContent=txt||"";
      capEl.classList.remove("show"); void capEl.offsetWidth; capEl.classList.add("show");
    }
    function go(i){
      i=((i%total)+total)%total;
      if(cur>=0&&cur<total){
        const old=slides[cur];
        old.classList.remove("active");
        if(old.querySelector("video")) old.querySelector("video").pause();
      }
      cur=i;
      const s=slides[cur];
      s.classList.add("active");
      const v=s.querySelector("video");
      if(v){ v.currentTime=0; v.play().catch(()=>{}); }
      const sb=s.querySelector(".slide-sound");
      if(sb){ v.muted=true; sb.textContent="🔇"; sb.classList.remove("on"); }
      showCaption(SITE.cinema[cur].cap);
      idxEl.textContent=String(cur+1).padStart(2,"0");
      if(playing) startBar();
    }
    function schedule(){
      if(timer) clearTimeout(timer);
      if(playing) timer=setTimeout(()=>{ go(cur+1); schedule(); },SLIDE_MS);
    }
    function start(){
      if(total===0) return;
      stage.style.display="block";
      if(cur<0){ go(0); }
      schedule();
      if(window.Petals) Petals.storm(36);   /* 放映时落花瓣 */
    }
    function stop(){
      if(timer) clearTimeout(timer); stopBar();
      if(cur>=0&&cur<total){ const v=slides[cur].querySelector("video"); if(v) v.pause(); }
      if(window.Petals) Petals.stop();
    }
    function next(){ if(total===0) return; if(!playing) togglePlay(); go(cur+1); schedule(); }
    function prev(){ if(total===0) return; if(!playing) togglePlay(); go(cur-1); schedule(); }
    if(prevBtn) prevBtn.addEventListener("click",e=>{ e.stopPropagation(); prev(); });
    if(nextBtn) nextBtn.addEventListener("click",e=>{ e.stopPropagation(); next(); });
    function togglePlay(){
      playing=!playing;
      if(playing){
        if(cur<0) go(0);
        schedule();
        if(cur>=0){ const v=slides[cur].querySelector("video"); if(v) v.play().catch(()=>{}); startBar(); }
      } else {
        if(timer) clearTimeout(timer); stopBar();
        const v=cur>=0?slides[cur].querySelector("video"):null; if(v) v.pause();
      }
      toggle.textContent=playing?"❚❚":"▶";
    }
    toggle.addEventListener("click",e=>{ e.stopPropagation(); togglePlay(); });
    stage.addEventListener("click",()=>togglePlay());
    return { start, stop, next, prev, isCinemaScreen(){ return true; } };
  })();

  /* ================= 启动 ================= */
  function init(){
    resizeSky();
    buildSprites();
    window.addEventListener("resize",resizeSky);
    if(!reduceMotion) (function loop(t){ tickSky(t); requestAnimationFrame(loop); })(0);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();

  window.Petals=Petals;
  window.PIXELFX=PIXEL;
  window.Reveal=Reveal;
  window.Curtain=Curtain;
  window.Cinema=Cinema;
  window.startParallax=startParallax;
  window.stopParallax=stopParallax;
})();
