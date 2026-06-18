const { MetaLabel } = window.ToymeetDesignSystem_a4eaa3;

function Nav({ onNav, active }) {
  const { profile } = window.TOYMEET_DATA;
  const link = (id, label) => (
    <button
      className={'tmk-nav__link' + (active === id ? ' is-active' : '')}
      onClick={() => onNav(id)}
    >{label}</button>
  );
  return (
    <header className="tmk-nav">
      <button className="tmk-nav__brand" onClick={() => onNav('top')}>
        TOYMEET<span className="tmk-nav__reg">®</span>
      </button>
      <nav className="tmk-nav__links">
        {link('work', 'Work')}
        {link('about', 'About')}
        {link('contact', 'Contact')}
      </nav>
      <a className="tmk-nav__x" href={profile.x} target="_blank" rel="noreferrer" aria-label="X profile">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span>{profile.xhandle}</span>
      </a>
    </header>
  );
}

Object.assign(window, { Nav });
