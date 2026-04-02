import { useEffect, useMemo, useRef, useState } from 'react';
import { portfolioData } from './data';

const THEME_KEY = 'portfolio-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ChipGroup({ options, active, onChange, label }) {
  const chipRefs = useRef([]);

  function handleKeyDown(e, index) {
    let next = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = (index + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      next = (index - 1 + options.length) % options.length;
    } else {
      return;
    }
    onChange(options[next].label);
    chipRefs.current[next]?.focus();
  }

  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      {options.map((opt, i) => (
        <button
          key={opt.label}
          ref={el => (chipRefs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={active === opt.label}
          className={`chip ${active === opt.label ? 'active' : ''}`}
          tabIndex={active === opt.label ? 0 : -1}
          onClick={() => onChange(opt.label)}
          onKeyDown={e => handleKeyDown(e, i)}
        >
          {opt.label}
          <span className="chip-count">{opt.count}</span>
        </button>
      ))}
    </div>
  );
}

function App() {
  const { identity, focusAreas, career, projects, openSource, articles } = portfolioData;
  const [activeWork, setActiveWork] = useState('All');
  const [activeOS, setActiveOS] = useState('All');
  const [theme, setTheme] = useState(getInitialTheme);
  const resumeUrl = `${import.meta.env.BASE_URL}Profile.pdf`;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const workCategories = useMemo(() => {
    const cats = ['All', ...new Set(projects.map(p => p.category))];
    return cats.map(c => ({
      label: c,
      count: c === 'All' ? projects.length : projects.filter(p => p.category === c).length
    }));
  }, [projects]);

  const osCategories = useMemo(() => {
    const cats = ['All', ...new Set(openSource.map(p => p.category))];
    return cats.map(c => ({
      label: c,
      count: c === 'All' ? openSource.length : openSource.filter(p => p.category === c).length
    }));
  }, [openSource]);

  const visibleWork =
    activeWork === 'All' ? projects : projects.filter(p => p.category === activeWork);
  const visibleOS =
    activeOS === 'All' ? openSource : openSource.filter(p => p.category === activeOS);

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#home">
          {identity.name}
        </a>
        <div className="topbar-tools">
          <nav className="nav" aria-label="Site navigation">
            <a href="#career">Career</a>
            <a href="#projects">Work</a>
            <a href="#open-source">Open Source</a>
            <a href="#articles">Publications</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '🌙'}</span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="section hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              {identity.title}&nbsp;&nbsp;·&nbsp;&nbsp;{identity.location}
            </p>
            <h1>{identity.name}</h1>
            <p className="headline">{identity.headline}</p>
            <p className="personality">{identity.personality}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Work
              </a>
              <a className="btn btn-ghost" href={resumeUrl} download="Rouf-Syed-Resume.pdf">
                Download Resume
              </a>
              <a className="btn btn-ghost" href="#contact">
                Contact
              </a>
            </div>
            <ul className="pill-list" aria-label="Focus areas">
              {focusAreas.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hero-photo">
            <img
              className="avatar"
              src={`${import.meta.env.BASE_URL}rouf_pic.jpg`}
              alt="Rouf Syed"
            />
          </div>
        </section>

        {/* Career */}
        <section className="section" id="career">
          <h2 className="section-title">Career</h2>
          <div className="timeline">
            {career.map(item => (
              <article className="timeline-item" key={`${item.role}-${item.period}`}>
                <div className="timeline-header">
                  <div>
                    <h3>{item.role}</h3>
                    <span className="timeline-org">{item.org}</span>
                  </div>
                  <span className="timeline-period">{item.period}</span>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Professional Work */}
        <section className="section" id="projects">
          <h2 className="section-title">Professional Work</h2>
          <p className="section-sub">Built at Pine Labs, XPayBack, Novo Cabs and beyond.</p>
          <ChipGroup
            options={workCategories}
            active={activeWork}
            onChange={setActiveWork}
            label="Filter professional work by category"
          />
          <div className="project-grid">
            {visibleWork.map(project => (
              <article className="project-card" key={project.title}>
                <div className="project-card-top">
                  <small className="project-category">{project.category}</small>
                  <h3>{project.title}</h3>
                  <p>{project.impact}</p>
                </div>
                <div className="stack">
                  {project.stack.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Open Source */}
        <section className="section" id="open-source">
          <h2 className="section-title">Open Source</h2>
          <p className="section-sub">Side projects and tools, publicly available on GitHub.</p>
          <ChipGroup
            options={osCategories}
            active={activeOS}
            onChange={setActiveOS}
            label="Filter open source projects by category"
          />
          <div className="os-grid">
            {visibleOS.map(project => (
              <article className="os-card" key={project.title}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="os-thumb-link"
                  aria-label={`View ${project.title} on GitHub`}
                  tabIndex={-1}
                >
                  {project.thumbnail ? (
                    <img
                      className="os-thumb"
                      src={project.thumbnail}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`os-thumb os-thumb-placeholder thumb-${project.category.toLowerCase()}`}
                    >
                      <span>{project.category}</span>
                    </div>
                  )}
                </a>
                <div className="os-body">
                  <div className="os-header">
                    <h3>
                      <a href={project.url} target="_blank" rel="noreferrer noopener">
                        {project.title}
                      </a>
                    </h3>
                    <span className="os-stars" aria-label={`${project.stars} stars`}>
                      ★ {project.stars}
                    </span>
                  </div>
                  <p>{project.description}</p>
                  <div className="stack">
                    {project.stack.map(tech => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section className="section" id="articles">
          <h2 className="section-title">Publications</h2>
          <div className="article-list">
            {articles.map(article => (
              <article className="article-card" key={article.title}>
                <div>
                  <h3>{article.title}</h3>
                  <small>{article.platform}</small>
                </div>
                <a href={article.url} target="_blank" rel="noreferrer noopener">
                  Read →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="section" id="contact">
          <h2 className="section-title">Contact</h2>
          <p className="section-sub">Open to collaboration on Android platforms and backend systems.</p>
          <div className="contact-grid">
            <a className="contact-item" href={`mailto:${identity.contact.email}`}>
              <small>Email</small>
              <span>{identity.contact.email}</span>
            </a>
            <a
              className="contact-item"
              href={`tel:${identity.contact.phone.replace(/\s+/g, '')}`}
            >
              <small>Phone</small>
              <span>{identity.contact.phone}</span>
            </a>
            <a
              className="contact-item"
              href={identity.contact.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              <small>LinkedIn</small>
              <span>linkedin.com/in/roufsyed</span>
            </a>
            <a
              className="contact-item"
              href={identity.contact.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              <small>GitHub</small>
              <span>github.com/roufsyed</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {identity.name}.</p>
      </footer>
    </>
  );
}

export default App;
