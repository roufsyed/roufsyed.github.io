import { useEffect, useMemo, useState } from 'react';
import WorkScene from './components/WorkScene';
import { portfolioData } from './data';

const THEME_KEY = 'portfolio-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const { identity, focusAreas, career, projects, articles } = portfolioData;
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], [projects]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [theme, setTheme] = useState(getInitialTheme);
  const resumeUrl = `${import.meta.env.BASE_URL}Profile.pdf`;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const visibleProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#home">
          {identity.name}
        </a>
        <div className="topbar-tools">
          <nav className="nav">
            <a href="#career">Career</a>
            <a href="#projects">Projects</a>
            <a href="#articles">Articles</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className="theme-icon" aria-hidden="true">
              💡
            </span>
            <span className="sr-only">{theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">{identity.title}</p>
            <h1>{identity.headline}</h1>
            <p className="subtitle">{identity.subtitle}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Projects
              </a>
              <a className="btn btn-ghost" href="#contact">
                Contact Me
              </a>
              <a className="btn btn-resume" href={resumeUrl} download="Rouf-Syed-Resume.pdf">
                Download Resume
              </a>
            </div>
            <ul className="pill-list">
              {focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <WorkScene theme={theme} />
        </section>

        <section className="section" id="career">
          <div className="section-head">
            <h2>Career</h2>
          </div>
          <div className="timeline">
            {career.map((item) => (
              <article className="timeline-item" key={`${item.role}-${item.period}`}>
                <h3>{item.role}</h3>
                <div className="timeline-meta">
                  <span>{item.org}</span>
                  <span>{item.period}</span>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-head">
            <h2>Projects</h2>
          </div>
          <div className="chips">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <small>{project.category}</small>
                <h3>{project.title}</h3>
                <p>{project.impact}</p>
                <div className="stack">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="articles">
          <div className="section-head">
            <h2>Publications</h2>
          </div>
          <div className="article-list">
            {articles.map((article) => (
              <article className="article-card" key={article.title}>
                <div>
                  <h3>{article.title}</h3>
                  <small>{article.platform}</small>
                </div>
                <a href={article.url} target="_blank" rel="noreferrer noopener">
                  Read
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="contact-head">
            <h2>Contact Me</h2>
            <p>Open to collaboration on Android platforms and backend systems.</p>
          </div>
          <div className="contact-grid">
            <a className="contact-item" href={`mailto:${identity.contact.email}`}>
              <small>Email</small>
              <span>{identity.contact.email}</span>
            </a>
            <a className="contact-item" href={`tel:${identity.contact.phone.replace(/\s+/g, '')}`}>
              <small>Phone</small>
              <span>{identity.contact.phone}</span>
            </a>
            <a className="contact-item" href={identity.contact.linkedin} target="_blank" rel="noreferrer noopener">
              <small>LinkedIn</small>
              <span>linkedin.com/in/roufsyed</span>
            </a>
            <a className="contact-item" href={identity.contact.github} target="_blank" rel="noreferrer noopener">
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
