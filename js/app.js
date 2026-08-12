/* ============================================================
   主程序：加载 / 路由 / 密钥 / 像素 / 媒体 / 影片
   ============================================================ */
(function(){
  "use strict";
  const $=(s,r)=>(r||document).querySelector(s);
  const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
  const screens=$$(".screen");
  const progress=$("#progress");
  const musicBtn=$("#musicBtn"), menuBtn=$("#menuBtn"), menu=$("#menu");

  let storyUnlocked=false, gateTries=0, noEscapes=0;

  /* ---------- 天数 ---------- */
  function dayCount(){
    const start=new Date(SITE.startDate+"T00:00:00");
    const now=new Date(); now.setHours(0,0,0,0);
    return Math.max(1, Math.round((now-start)/86400000));
  }
  const days=dayCount();
  $("#dayCountOpening").textContent=days;
  $("#dayCountFinal").textContent=days;

  /* ---------- 路由 ---------- */
  const ORDER=["pixel","home","gate","opening","timeline","distance","meeting","game","quotes","about","food","cinema","finale"];
  const storyIds=ORDER.slice(4);
  function screenById(id){ return $("#screen-"+id); }

  function showScreen(id){
    const target=screenById(id); if(!target) return;
    screens.forEach(s=>s.classList.remove("active"));
    target.classList.add("active");
    if(window.Reveal) requestAnimationFrame(()=>window.Reveal.reset(target));
    if(window.stopParallax) window.stopParallax();
    if(window.startParallax) window.startParallax();
    /* 影片放映厅 */
    if(window.Cinema){
      if(id==="cinema") window.Cinema.start(); else window.Cinema.stop();
    }
    /* 离开放映厅：若因视频出声而暂停的背景音乐恢复 */
    if(id!=="cinema" && window.__bgmPausedByVideo){
      window.__bgmPausedByVideo = false;
      if(window.AudioEngine && !window.AudioEngine.playing) window.AudioEngine.start();
    }
    playVideosIn(target);
    if(target.scrollTo) target.scrollTo(0,0);
    window.scrollTo(0,0);
    const idx=ORDER.indexOf(id);
    if(idx>=0){ progress.style.width=((idx+1)/ORDER.length*100)+"%"; progress.classList.add("show"); }
    musicBtn.classList.add("show");
    if(storyUnlocked && storyIds.includes(id)) menuBtn.classList.add("show");
    $$(".menu a",menu).forEach(a=>a.classList.toggle("on",a.dataset.nav===id));
    closeMenu();
  }

  function goTo(id,animate){
    if(animate){
      if(window.Sfx) window.Sfx.whoosh();
      window.Curtain.go(()=>showScreen(id));
    } else showScreen(id);
    try{ history.pushState(null,"","#/"+id); }catch(e){}
  }

  function unlockStory(){ storyUnlocked=true; menuBtn.classList.add("show"); }
  function closeMenu(){ menu.classList.remove("open"); }
  function initialScreen(){
    const h=location.hash.replace(/^#\/?/,"");
    if(ORDER.includes(h) && h!=="pixel") return h;
    return "pixel";
  }

  /* ---------- 加载页 ---------- */
  function finishPreloader(){
    const pre=$("#preloader");
    setTimeout(()=>pre.classList.add("done"),1500);
    setTimeout(()=>{ pre.style.display="none"; goTo(initialScreen()); },2600);
  }

  /* ---------- 像素 ---------- */
  const btnYes=$("#btnYes"), btnNo=$("#btnNo"), pixelMsg=$("#pixelMsg");
  const ESCAPES=["诶！别跑～","我在这儿呢～","抓不到我～","嘻嘻，再想想嘛","哎呀，不要躲啦","我跑我跑我跑～","好啦好啦，我知道你愿意的"];
  let lastDodge=0;
  function fleeNo(){
    const r=btnNo.getBoundingClientRect(), w=r.width||120, h=r.height||46;
    const vw=window.innerWidth, vh=window.innerHeight, safeTop=Math.max(70,window.scrollY||0);
    let x,y,tries=0;
    /* 逃得远远的：至少离开当前/光标位置一大截 */
    do{ x=8+Math.random()*(vw-w-16); y=safeTop+Math.random()*(vh-h-24); tries++; }
    while(tries<18 && Math.hypot(x+w/2-(r.left+r.width/2), y+h/2-(r.top+r.height/2)) < Math.min(vw,vh)*.38);
    /* 锚点 + transform 移动（GPU 加速，手机上更顺滑） */
    if(!btnNo.dataset.anchored){
      btnNo.dataset.anchored="1";
      btnNo.style.position="fixed";
      btnNo.style.left="0px";
      btnNo.style.top="0px";
    }
    btnNo.classList.add("fleeing");
    btnNo.style.transition="transform .28s cubic-bezier(.3,1.4,.4,1)";
    btnNo.style.willChange="transform";
    const scale=noEscapes>5?Math.max(.7,1-(noEscapes-5)*.05):1;
    btnNo.style.transform="translate("+Math.max(8,Math.min(vw-w-8,x))+"px,"+Math.max(safeTop,Math.min(vh-h-8,y))+"px) scale("+scale+")";
    noEscapes++;
    pixelMsg.textContent=ESCAPES[Math.min(noEscapes-1,ESCAPES.length-1)];
    if(noEscapes>=7){ btnNo.textContent="愿 意"; btnNo.classList.add("pixel-yes"); btnNo.classList.remove("pixel-no"); }
  }
  /* 惊慌乱跑：碰到后连续高速移动，不消失、点不到 */
  let panicTimer=null;
  function panicRun(){
    if(noEscapes>=7||btnYes.disabled) return;
    fleeNo();
    if(panicTimer) clearInterval(panicTimer);
    panicTimer=setInterval(()=>{
      if(noEscapes>=7||btnYes.disabled){ clearInterval(panicTimer); return; }
      fleeNo();
    },250);
    setTimeout(()=>{ if(panicTimer) clearInterval(panicTimer); },2600);
  }
  /* 光标追着它跑，它就躲 */
  document.addEventListener("pointermove",e=>{
    if(noEscapes>=7||btnYes.disabled) return;
    const r=btnNo.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const now=Date.now();
    if(Math.hypot(e.clientX-cx,e.clientY-cy) < Math.max(r.width,r.height)+46 && now-lastDodge>320){
      lastDodge=now; fleeNo();
    }
  },{passive:true});
  btnNo.addEventListener("mouseenter",()=>{ lastDodge=Date.now(); panicRun(); });
  btnNo.addEventListener("touchstart",e=>{ e.preventDefault(); lastDodge=Date.now(); panicRun(); },{passive:false});
  btnNo.addEventListener("click",e=>{ e.preventDefault(); if(noEscapes>=7){ btnYes.click(); return; } panicRun(); });
  btnYes.addEventListener("click",()=>{
    if(window.PIXELFX&&window.PIXELFX.burst) window.PIXELFX.burst(34);
    if(window.Sfx) window.Sfx.chime();
    pixelMsg.textContent="那，我们开始吧。";
    btnYes.disabled=true; btnNo.style.pointerEvents="none";
    setTimeout(()=>goTo("home",true),950);
  });

  /* ---------- 片头 → 密钥 ---------- */
  $("#btnEnter").addEventListener("click",()=>{ if(window.Sfx) window.Sfx.click(); goTo("gate",true); });

  /* ---------- 密钥 ---------- */
  const gateForm=$("#gateForm"), gateInput=$("#gateInput"), gateMsg=$("#gateMsg");
  const HINTS=["再想想～是二月的某一天哦","二月 · 二十五日","答案是 2 月 25 日呀～（输入 2月25日 试试）"];
  function pad2(n){ return String(n).padStart(2,"0"); }
  function checkBirthday(raw){
    const digits=String(raw).replace(/[^\d]/g,"");
    const b=SITE.her.birthday;
    const f1=String(b.year)+pad2(b.month)+pad2(b.day), f2=pad2(b.month)+pad2(b.day), f3=String(b.month)+String(b.day), f4=String(b.year)+String(b.month)+String(b.day);
    if([f1,f2,f3,f4].includes(digits)) return true;
    if(/0225$/.test(digits)) return true;
    if(/225$/.test(digits) && !/1225$/.test(digits)) return true;
    return false;
  }
  gateForm.addEventListener("submit",e=>{
    e.preventDefault();
    const val=gateInput.value.trim();
    if(!val){ gateMsg.textContent="悄悄告诉我吧，我不会告诉别人的～"; gateMsg.classList.add("shake"); return; }
    if(checkBirthday(val)){
      gateMsg.textContent="答对啦。门，为你打开了。";
      gateMsg.style.color="var(--gold-soft)";
      gateInput.disabled=true;
      /* 花瓣炸开 */
      if(window.Petals) Petals.burst(80);
      if(window.Sfx) window.Sfx.chime();
      setTimeout(()=>goTo("opening",true),1500);
    } else {
      gateTries++;
      gateMsg.style.color="var(--rose)";
      gateMsg.textContent=HINTS[Math.min(gateTries-1,HINTS.length-1)];
      gateMsg.classList.remove("shake"); void gateMsg.offsetWidth; gateMsg.classList.add("shake");
      gateInput.select();
    }
  });

  /* ---------- 选歌：二选一 ---------- */
  let songChosen=false;
  $$(".song-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const key=btn.dataset.song;
      if(songChosen) return;
      songChosen=true;
      if(window.AudioEngine) window.AudioEngine.playSong(key);
      if(window.Petals) Petals.burst(40);
      if(window.Sfx) window.Sfx.chime();
      $$(".song-btn").forEach(b=>b.classList.toggle("dim",b!==btn));
      btn.classList.add("chosen");
      const note=document.querySelector("#songPick .song-chosen-note");
      if(note) note.textContent="好，就听这一首 ♪";
    });
  });

  /* ---------- 开场 → 正片 ---------- */
  $("#btnToStory").addEventListener("click",()=>{
    unlockStory();
    if(window.Petals) Petals.storm(52);   /* 开幕词花瓣雨持续 */
    if(window.Sfx) window.Sfx.click();
    goTo("timeline",true);
  });

  /* ---------- 章节跳转 ---------- */
  $$("[data-next]").forEach(btn=>{
    btn.addEventListener("click",()=>{ if(window.Sfx) window.Sfx.click(); goTo(btn.dataset.next,true); });
  });
  menuBtn.addEventListener("click",()=>{ menu.classList.toggle("open"); if(window.Sfx) window.Sfx.click(); });
  $$(".menu a",menu).forEach(a=>{ a.addEventListener("click",e=>{ e.preventDefault(); goTo(a.dataset.nav,true); }); });
  $$("a[data-nav]").forEach(a=>{ a.addEventListener("click",e=>{ e.preventDefault(); goTo(a.dataset.nav,true); }); });
  document.addEventListener("click",e=>{ if(menu.classList.contains("open") && !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });

  /* ---------- 重新开始 ---------- */
  $("#btnRestart").addEventListener("click",()=>{
    if(window.Petals) Petals.stop();
    gateInput.disabled=false; gateInput.value="";
    gateMsg.textContent=""; gateMsg.style.color="var(--rose)";
    noEscapes=0;
    btnYes.disabled=false;
    btnNo.style.pointerEvents="";
    btnNo.classList.remove("fleeing","pixel-yes"); btnNo.classList.add("pixel-no");
    btnNo.textContent="不 愿 意";
    btnNo.style.position=""; btnNo.style.left=""; btnNo.style.top=""; btnNo.style.transform="";
    btnNo.style.willChange=""; delete btnNo.dataset.anchored;
    pixelMsg.textContent="";
    if(window.Sfx) window.Sfx.click();
    goTo("pixel",true);
  });

  /* ---------- 媒体填充 ---------- */
  function isVideoFile(n){ return /\.(mp4|mov|m4v|webm|ogg)$/i.test(n); }
  function makeVideo(slot,path){
    const el=document.createElement("video");
    el.muted=true; el.loop=true; el.playsInline=true;
    /* 安卓 / 微信浏览器兼容 */
    el.setAttribute("playsinline","");
    el.setAttribute("webkit-playsinline","");
    el.setAttribute("x5-playsinline","");
    el.setAttribute("x5-video-player-type","h5");
    el.setAttribute("disablePictureInPicture","");
    el.setAttribute("preload","metadata");
    /* 封面图（有则显示，避免空黑屏） */
    const base=path.replace(/\.[a-z0-9]+$/i,"");
    const poster="assets/photos/"+base.split("/").pop()+".poster.jpg";
    const hasPoster = SITE.media && Object.keys(SITE.media).some(k=>SITE.media[k] && path.indexOf(SITE.media[k])>=0);
    el.poster=poster;
    el.src=path;
    slot.appendChild(el); slot.classList.add("has-media");
    const hint=document.createElement("span");
    hint.className="video-hint"; hint.textContent="轻触 开启声音";
    slot.appendChild(hint);
    const isFinale = slot.dataset.slot==="finale_video";
    /* 播放遮罩：结尾语音显示"播放语音"，其他显示播放 */
    const playBtn=document.createElement("div");
    playBtn.className="video-playbtn";
    playBtn.innerHTML='<span class="pb-core">▶</span><span class="pb-label">'+(isFinale?"播放语音":"播放")+'</span>';
    slot.appendChild(playBtn);
    playBtn.addEventListener("click",e=>{
      e.stopPropagation();
      el.muted=false;
      if(el.error) el.load();
      el.play().catch(()=>{});
      playBtn.classList.add("hidden");
      if(window.AudioEngine && window.AudioEngine.playing){ window.AudioEngine.pause(); window.__bgmPausedByVideo=true; }
      hint.textContent="♪ 声音已开启"; hint.classList.add("shown");
      setTimeout(()=>hint.classList.remove("shown"),2200);
    });
    el.addEventListener("error",()=>{
      hint.textContent="加载失败 · 轻触重试";
      hint.classList.add("shown");
    });
    el.addEventListener("click",e=>{
      e.stopPropagation();
      if(playBtn && !playBtn.classList.contains("hidden")) return;
      el.muted=!el.muted;
      if(!el.muted){
        if(window.AudioEngine && window.AudioEngine.playing){ window.AudioEngine.pause(); window.__bgmPausedByVideo=true; }
      } else if(window.__bgmPausedByVideo){
        window.__bgmPausedByVideo=false;
        if(window.AudioEngine && !window.AudioEngine.playing) window.AudioEngine.start();
      }
      hint.textContent=el.muted?"轻触 开启声音":"♪ 声音已开启";
      if(!el.muted && el.paused) el.play().catch(()=>{});
      hint.classList.add("shown");
      setTimeout(()=>hint.classList.remove("shown"),1800);
    });
  }
  function playVideosIn(root){
    $$("video",root).forEach(v=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); });
  }
  function fillMedia(){
    const media=SITE.media||{};
    Object.keys(media).forEach(key=>{
      const src=media[key]; if(!src) return;
      const slot=$('[data-slot="'+key+'"]'); if(!slot) return;
      const folder=isVideoFile(src)?"assets/videos/":"assets/photos/";
      const path=src.indexOf("/")>=0?src:folder+src;
      if(isVideoFile(src)) makeVideo(slot,path);
      else{
        const el=document.createElement("img"); el.src=path; el.alt=key;
        el.loading="lazy"; el.decoding="async";
        let tries=0;
        el.addEventListener("error",function onErr(){
          tries++;
          if(tries<=2){ setTimeout(()=>{ el.src=path; }, 1200*tries); }
          else { el.removeEventListener("error",onErr); slot.classList.remove("has-media"); }
        });
        slot.appendChild(el); slot.classList.add("has-media");
      }
    });
  }

  /* ---------- 聊天记录光箱 ---------- */
  const exhibitChat=document.getElementById("exhibitChat");
  const lightbox=document.getElementById("lightbox");
  const lightboxImg=document.getElementById("lightboxImg");
  function closeLightbox(){ lightbox.classList.remove("open"); }
  if(exhibitChat){
    exhibitChat.addEventListener("click",()=>{
      const im=exhibitChat.querySelector("img");
      if(im) lightboxImg.src=im.src;
      lightbox.classList.add("open");
      if(window.Sfx) window.Sfx.click();
    });
  }
  if(document.getElementById("lightboxScrim")) document.getElementById("lightboxScrim").addEventListener("click",closeLightbox);
  if(document.getElementById("lightboxX")) document.getElementById("lightboxX").addEventListener("click",closeLightbox);

  /* ---------- 键盘 ---------- */
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeMenu(); closeLightbox(); } });

  /* ---------- 启动 ---------- */
  fillMedia();
  finishPreloader();

})();
