import { useEffect } from 'react';
export default function usePinkRider() { useEffect(() => {
      const controller = new AbortController();
      const listen = (target, event, handler, options = {}) => target.addEventListener(event, handler, { ...options, signal: controller.signal });
      let frame;
      const hero = document.querySelector('#hero');
      const figure = document.querySelector('#figure');
      const front = document.querySelector('#front');
      const canvas = document.querySelector('#reveal');
      const cursor = document.querySelector('#cursor');
      const hintText = document.querySelector('#hintText');
      const touchMQ = matchMedia('(hover: none), (pointer: coarse)');
      const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
      let visible = true;
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      observer.observe(hero);
      let coarse;
      function syncTouch() {
        coarse = touchMQ.matches;
        hintText.textContent = coarse ? 'Drag to reveal me' : 'Move your cursor to reveal me';
        cursor.classList.remove('on');
      }
      syncTouch();
      listen(touchMQ, 'change', syncTouch);
      const mask = document.createElement('canvas');
      const buf = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const mctx = mask.getContext('2d');
      const bctx = buf.getContext('2d');
      let frontReady = false, backReady = false;
      let W = 0, H = 0, dpr = 1;
      let stamps = [], last = null, lastMove = performance.now();
      let autoT = 0, autoLast = null;
      const LIFE = 1100;
      const back = new Image();
      back.onload = () => { backReady = true; };
      back.src = 'https://i.postimg.cc/RqrTFWKm/901b9737-9ceb-4c5f-8838-8ef80e804649.png';
      function loadedFront() { frontReady = true; canvas.classList.add('ready'); }
      if (front.complete && front.naturalWidth) loadedFront();
      else listen(front, 'load', loadedFront, { once:true });
      function resize() {
        const r = figure.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = r.width; H = r.height;
        for (const c of [canvas, mask, buf]) {
          c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        }
        stamps = []; last = null; autoLast = null;
      }
      resize();
      listen(window, 'load', resize);
      listen(window, 'resize', resize);
      function addStamp(x, y, now) {
        const base = Math.max(W, 260) * (coarse ? 0.15 : 0.12);
        const n = 3 + Math.floor(Math.random() * 3);
        const lobes = [];
        for (let i = 0; i < n; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * base * 0.45;
          lobes.push({ dx:Math.cos(angle)*distance, dy:Math.sin(angle)*distance, r:base*(0.45+Math.random()*0.55) });
        }
        stamps.push({ x, y, t:now, lobes });
      }
      function pointerTo(clientX, clientY, now) {
        const r = figure.getBoundingClientRect();
        const x = clientX - r.left, y = clientY - r.top;
        if (last) {
          const distance = Math.hypot(x-last.x, y-last.y);
          const count = Math.min(40, Math.ceil(distance / (Math.max(W,260)*0.04)));
          for (let i = 1; i < count; i++) {
            addStamp(last.x+(x-last.x)*i/count, last.y+(y-last.y)*i/count, now);
          }
        }
        addStamp(x, y, now);
        last = { x, y }; lastMove = now; autoLast = null;
      }
      listen(hero, 'pointermove', e => {
        pointerTo(e.clientX, e.clientY, performance.now());
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursor.classList.add('on');
      });
      listen(hero, 'pointerleave', () => { last = null; cursor.classList.remove('on'); });
      listen(hero, 'pointerdown', e => pointerTo(e.clientX, e.clientY, performance.now()));
      listen(hero, 'pointercancel', () => { last = null; cursor.classList.remove('on'); });
      listen(hero, 'pointerup', () => { if (coarse) last = null; });
      function autoWander(now) {
        if (now-lastMove < 2500) return;
        autoT += 0.016;
        const x = W*(0.5+Math.sin(autoT*1.3)*0.28);
        const y = H*(0.32+Math.sin(autoT*0.9+1)*0.22);
        if (!autoLast || Math.hypot(x-autoLast.x,y-autoLast.y) > W*0.02) {
          addStamp(x,y,now); autoLast = { x,y };
        }
      }
      function drawCover(c, img) {
        const scale = Math.max(canvas.width/img.naturalWidth,canvas.height/img.naturalHeight);
        const width = img.naturalWidth*scale, height = img.naturalHeight*scale;
        c.drawImage(img,(canvas.width-width)/2,canvas.height-height,width,height);
      }
      function render(now) {
        if (!visible || document.hidden) { frame = requestAnimationFrame(render); return; }
        if (coarse && !reduceMQ.matches) autoWander(now);
        stamps = stamps.filter(s => now-s.t < LIFE);
        mctx.setTransform(dpr,0,0,dpr,0,0);
        mctx.clearRect(0,0,mask.width/dpr,mask.height/dpr);
        mctx.fillStyle = '#000';
        for (const s of stamps) {
          const k = 1-(now-s.t)/LIFE;
          const scale = k < 0.75 ? k/0.75 : 1;
          for (const lobe of s.lobes) {
            mctx.beginPath();
            mctx.arc(s.x+lobe.dx*scale,s.y+lobe.dy*scale,lobe.r*Math.pow(scale,0.8),0,Math.PI*2);
            mctx.fill();
          }
        }
        ctx.setTransform(1,0,0,1,0,0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if (frontReady) drawCover(ctx,front);
        if (stamps.length && backReady) {
          // Erase first: transparent areas of the rider must never expose the front.
          ctx.globalCompositeOperation = 'destination-out';
          ctx.drawImage(mask,0,0);
          ctx.globalCompositeOperation = 'source-over';
          if (backReady) {
            bctx.setTransform(1,0,0,1,0,0);
            bctx.globalCompositeOperation = 'source-over';
            bctx.clearRect(0,0,buf.width,buf.height);
            bctx.drawImage(mask,0,0);
            bctx.globalCompositeOperation = 'source-in';
            drawCover(bctx,back);
            ctx.drawImage(buf,0,0);
          }
        }
        frame = requestAnimationFrame(render);
      }
      frame = requestAnimationFrame(render);
    
return () => { controller.abort(); observer.disconnect(); cancelAnimationFrame(frame); back.onload = null; };
}, []); }
