import React, { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePinkRider from './usePinkRider';
import { profile, projects } from './content';

gsap.registerPlugin(ScrollTrigger);
const Sculpture = lazy(() => import('./Sculpture'));
const Arrow = () => <span aria-hidden="true">↗</span>;
function Reveal({ children, as: Tag = 'h2', className = '' }) {
  return <Tag className={`reveal-text ${className}`} aria-label={children}>{children.split(' ').map((word, i) => <React.Fragment key={i}><span className="word" aria-hidden="true">{word}</span>{' '}</React.Fragment>)}</Tag>;
}
function Hero() {
  usePinkRider();
  return <><section className="hero" id="hero" aria-label="Move your cursor to reveal the portrait beneath the pink rider">
    <h1 className="sr-only">SALMA MIRAT — Full-Stack Web & Mobile Developer</h1>
    <div className="hero-intro"><span className="eyebrow">Code with purpose. Build with personality.</span><p>Full-Stack Developer<span className="pink">.</span><span className="hero-platforms">Web & Mobile</span></p></div>
    <div className="marquees" aria-hidden="true">
      <div className="row ghost">{Array.from({ length: 4 }, (_, i) => <span key={i}>Salma Mirat · Full-Stack Developer</span>)}</div>
      <div className="row solid">{Array.from({ length: 4 }, (_, i) => <span key={i}>Salma Mirat · Web & Mobile</span>)}</div>
    </div>
    <div className="figure" id="figure"><img id="front" alt="Woman wearing a pink motorcycle helmet and racing jacket" src="https://i.postimg.cc/PrTqYtys/2717cfaa-8564-4772-a85b-15f11ff435bd.png" fetchPriority="high" /><canvas id="reveal" aria-hidden="true" /></div>
    <p className="hint"><i aria-hidden="true" /><span id="hintText">Move your cursor to reveal me</span></p>
    <a className="tag" href="#about">Explore my world <span aria-hidden="true">↓</span></a>
  </section><div className="cursor" id="cursor" aria-hidden="true" /></>;
}
function ProjectVisual({ type }) {
  if (type === 'finance') return <div className="project-art finance-art" aria-hidden="true"><div className="art-caption">YOUR BUSINESS, IN BALANCE.</div><div className="phone"><div className="phone-camera" /><div className="app-top">bizpulse <span>✳</span></div><small>A little clarity for your day</small><div className="balance">Your overview <strong>Good things<br />are growing.</strong></div><div className="chart">{[30, 46, 39, 65, 53, 82, 72, 95].map((n, i) => <i key={i} style={{ height: `${n}%` }} />)}</div><div className="phone-bottom">Overview <span>↗</span> Insights</div></div><span className="art-orbit">↗</span></div>;
  if (type === 'agriculture') return <div className="project-art agriculture-art" aria-hidden="true"><div className="art-caption">ROOTED LOCALLY. CONNECTED DIGITALLY.</div><div className="api-window"><div className="window-dots">● ● ● <span>fellahconnect / api</span></div><div className="api-title">From the land.<br /><em>To the market.</em></div><div className="endpoint"><span>GET</span> /api/harvests</div><pre>{'{\n  "community": "connected",\n  "roots": "Morocco",\n  "possibilities": "growing"\n}'}</pre><div className="api-footer">Land · Harvests · Markets <span>✳</span></div></div><div className="leaf leaf-one" /><div className="leaf leaf-two" /></div>;
  return <div className="project-art food-art" aria-hidden="true"><div className="art-caption">FRESH IDEAS. ALWAYS ON THE MENU.</div><div className="menu-card"><div className="menu-brand">snack<br /><em>dyali.</em> <span>✳</span></div><div className="plate"><div className="burger">☰</div></div><div className="menu-row">Made to order.<span>↗</span></div><small>YOUR MENU, EVERYWHERE.</small></div><span className="food-sticker">Fresh<br />& connected</span></div>;
}
function Project({ project }) {
  const [open, setOpen] = useState(false);
  return <article className="project-card" data-enter>
    <ProjectVisual type={project.type} />
    <div className="project-info"><div className="project-meta"><span>{project.id} / {project.category}</span><span>Visual concept</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="chips">{project.stack.map(s => <span key={s}>{s}</span>)}</div>
      <button className="text-link" aria-expanded={open} aria-controls={`project-${project.id}`} onClick={() => { setOpen(!open); requestAnimationFrame(() => ScrollTrigger.refresh()); }}>{open ? 'Close details' : 'Explore project'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
      <div id={`project-${project.id}`} hidden={!open} className="project-details"><p>{project.detail}</p><a href={profile.github} target="_blank" rel="noreferrer">Visit my GitHub <Arrow /></a></div>
    </div>
  </article>;
}
const skills = [
  ['01', 'Web development.', 'Responsive interfaces built for the browser.', ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS']],
  ['02', 'Mobile development.', 'Native experiences that go wherever you do.', ['React Native', 'Expo', 'Expo Router', 'TypeScript', 'Zustand', 'React Query', 'Axios']],
  ['03', 'Behind the screen.', 'Structured data. Connected experiences.', ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'REST APIs', 'JWT / Zod']],
  ['04', 'The finishing touches.', 'Tools that bring ideas into the real world.', ['Git / GitHub', 'Docker', 'Postman', 'Scalar / OpenAPI', 'Figma', 'AI function calling']],
];
export default function App() {
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState('');
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.reveal-text, [data-reveal-technologies]', root.current).forEach(el => {
        gsap.fromTo(el.querySelectorAll('.word, .skill-chip'), { opacity: 0.17, y: 14 }, { opacity: 1, y: 0, stagger: 0.09, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'clamp(bottom 35%)', scrub: 1.1 } });
      });
      gsap.utils.toArray('[data-enter]', root.current).forEach(el => {
        gsap.from(el, { y: 48, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' } });
      });
      gsap.utils.toArray('.section-rule', root.current).forEach(el => gsap.from(el, { scaleX: 0, transformOrigin: 'left', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 55%', scrub: true } }));
      gsap.to('.hero .marquees', { y: 95, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.progress-bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    }, root);
    const context = gsap.context(() => {
      const updateNav = self => document.querySelector('.nav').classList.toggle('scrolled', self.scroll() > 40);
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: updateNav, onRefresh: updateNav });
    }, root);
    let disposed = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); }).catch(() => {});
    }
    return () => { disposed = true; mm.revert(); context.revert(); };
  }, []);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopied('Email copied!'); }
    catch { setCopied(`Copy this address: ${profile.email}`); }
  }
  return <div ref={root}>
    <a className="skip-link" href="#about">Skip to content</a>
    <header className="nav"><a className="brand" href="#hero" onClick={() => setMenuOpen(false)}><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></span>SALMA MIRAT</a>
      <nav className="links" aria-label="Main navigation"><a href="#projects">Projects</a><a href="#about">About</a><a href="#experience">Experience</a><a className="cta" href="#contact">Say hi! <Arrow /></a><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '−' : '☰'}</button></nav>
      {menuOpen && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">{['about', 'skills', 'projects', 'experience', 'contact'].map(id => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{id}<Arrow /></a>)}</nav>}
      <div className="progress-bar" />
    </header>
    <main><Hero />
      <section id="about" className="section about-section"><div className="section-label"><span>01 / A little about me</span><span>Curiosity meets code</span></div><div className="section-rule" />
        <div className="about-grid"><div><Reveal>I connect thoughtful interfaces with what happens behind them.</Reveal><p className="body-copy" data-enter>Hi, I’m Salma. A full-stack web and mobile developer based in Morocco. I build responsive websites and mobile applications with React, React Native, Node.js, and PostgreSQL — turning real needs into useful digital experiences.</p><p className="body-copy" data-enter>My background in accounting and business management brings another perspective: understanding the people, processes, and decisions behind the product.</p><a className="text-link" href="#projects">Meet my projects <Arrow /></a></div><div className="sculpture-wrap"><Suspense fallback={<div className="architecture-placeholder" aria-hidden="true" />}><Sculpture /></Suspense></div></div>
        <div className="about-bottom" data-enter><span><i /> {profile.location}</span><span>Arabic · French · English</span><a href={profile.linkedin} target="_blank" rel="noreferrer">Let’s connect <Arrow /></a></div>
      </section>
      <section id="skills" className="section skills-section"><div className="section-label"><span>02 / My toolkit</span><span>From interface to infrastructure</span></div><div className="section-rule" /><div className="skills-heading"><Reveal>Different layers. One complete experience.</Reveal><p>A practical toolkit for building web and mobile experiences, from the interface to the API and database.</p></div>
        <div className="skill-list">{skills.map(([num, title, subtitle, tags]) => <div className="skill-row" key={num}><span className="skill-num">{num}</span><div><Reveal as="h3">{title}</Reveal><Reveal as="p">{subtitle}</Reveal></div><div className="chips" data-reveal-technologies>{tags.map(t => <span className="skill-chip" key={t}>{t}</span>)}</div></div>)}</div>
        <div className="skill-footer"><span>ALWAYS LEARNING. ALWAYS BUILDING.</span><span aria-hidden="true">✳</span></div>
      </section>
      <section id="projects" className="section projects-section"><div className="section-label"><span>03 / Selected projects</span><span>Ideas made tangible</span></div><div className="section-rule" /><div className="projects-heading"><Reveal>Built with intent. Made to matter.</Reveal><p>Three projects. Three real-world problems.<br />One love for making things work.</p></div><div className="project-list">{projects.map(project => <Project project={project} key={project.id} />)}</div><p className="project-note">Project artwork is illustrative; explore each project for its actual features and technology.</p></section>
      <section id="experience" className="section experience-section"><div className="section-label"><span>04 / The journey</span><span>Business roots. Developer mindset.</span></div><div className="section-rule" /><div className="journey-grid"><div><Reveal>Every chapter adds something.</Reveal><p className="body-copy">From understanding businesses to building the tools they use. A path shaped by curiosity and hands-on learning.</p><a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">Find me on LinkedIn <Arrow /></a></div><div className="timeline">
        <article data-enter><span className="timeline-date">Sep 2026 — Present · Remote</span><h3>Full-Stack / Mobile Developer Intern</h3><h4>TECHNOVIFY</h4><p>Developing websites, web and mobile applications, and contributing to AI tooling. Working independently with defined technical goals and regular progress reviews.</p><div className="chips"><span>React Native</span><span>TypeScript</span><span>Node.js</span></div></article>
        <article data-enter><span className="timeline-date">Apr — Oct 2026</span><h3>AI-Augmented Mobile Development</h3><h4>CCFBS × Simplon Maghreb</h4><p>Mobile development training, with BizPulse as my final project.</p></article>
        <article data-enter><span className="timeline-date">Sep 2023 — Jan 2026</span><h3>Business Management · Accounting & Finance</h3><h4>OFPPT · Fkih Ben Salah</h4><p>Specialized Technician diploma, building a foundation in business needs, accounting, and financial management.</p></article>
        <article data-enter><span className="timeline-date">2022</span><h3>Vocational Baccalaureate in Accounting</h3><h4>Lycée Bir Anzarane · Fkih Ben Salah</h4></article>
      </div></div></section>
      <section id="contact" className="section contact-section"><div className="section-label"><span>05 / Your next idea starts here</span><span>Let’s make it happen</span></div><div className="section-rule" /><span className="contact-star" aria-hidden="true">✳</span><Reveal>Good things start with a hello.</Reveal><p>Have a project in mind, an opportunity to share,<br />or just a good question? I’d love to hear it.</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><div className="contact-actions"><button className="pill-button" onClick={copyEmail}>Copy email <span aria-hidden="true">⧉</span></button><a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div><p className="copy-status" role="status">{copied}</p><footer><span>© {new Date().getFullYear()} Salma Mirat</span><span>Made with code & a little pink.</span><a href="#hero">Back to top ↑</a></footer></section>
    </main>
  </div>;
}
