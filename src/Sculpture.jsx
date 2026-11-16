import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const layers = [
  { number: '01', title: 'Web experience', stack: 'React / JavaScript / HTML & CSS', icon: 'web' },
  { number: '02', title: 'Mobile experience', stack: 'React Native / Expo / TypeScript', icon: 'mobile' },
  { number: '03', title: 'Application & API', stack: 'Node.js / Express / REST', icon: 'server' },
  { number: '04', title: 'Data & persistence', stack: 'PostgreSQL / Sequelize', icon: 'database' },
];

function LayerIcon({ type }) {
  if (type === 'web') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="15" rx="2" /><path d="M2 7h20M9 22h6M12 18v4M5 5h.01M8 5h.01" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'mobile' ? <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 5h4M11 19h2" /></> : type === 'server' ? <><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01M12 7h5M12 17h5" /></> : <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>}
  </svg>;
}

export default function Sculpture() {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 3;
    const geometry = new THREE.PlaneGeometry(0.025, 0.025);
    const material = new THREE.MeshBasicMaterial({ color: '#ad6d83' });
    const packets = Array.from({ length: 3 }, () => {
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh); return mesh;
    });
    const paint = () => renderer.render(scene, camera);
    const resize = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height); paint();
    });
    resize.observe(el);
    let visible = false;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const animate = time => {
      packets.forEach((mesh, i) => { mesh.position.y = 1 - ((time / 5500 + i / 3) % 1) * 2; });
      paint();
    };
    const sync = () => {
      renderer.setAnimationLoop(visible && !document.hidden && !mq.matches ? animate : null);
      packets.forEach(mesh => { mesh.visible = !mq.matches; });
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(el);
    mq.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect(); resize.disconnect(); mq.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync); renderer.setAnimationLoop(null);
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div className="architecture-panel">
    <div className="architecture-heading"><span>FULL-STACK · WEB & MOBILE</span><span className="architecture-symbol" aria-hidden="true">&lt;/&gt;</span></div>
    <div className="architecture-flow">
      <div className="architecture-signals" ref={host} aria-hidden="true" />
      {layers.map(layer => <div className="architecture-layer" key={layer.number}>
        <div className="architecture-icon"><LayerIcon type={layer.icon} /></div>
        <div><h3>{layer.title}</h3><p>{layer.stack}</p></div><span className="architecture-number">{layer.number}</span>
      </div>)}
    </div>
    <div className="architecture-footer"><span>Interface → logic → data</span><span>One connected system.</span></div>
  </div>;
}
