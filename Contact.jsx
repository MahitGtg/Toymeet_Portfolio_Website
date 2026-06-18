const { Button } = window.ToymeetDesignSystem_a4eaa3;

function Contact() {
  const { profile } = window.TOYMEET_DATA;
  return (
    <footer className="tmk-contact theme-invert" id="contact">
      <div className="tmk-contact__head">
        <span className="tmk-contact__klabel">Got a channel that needs edits?</span>
        <h2 className="tmk-contact__title">Let&rsquo;s make<br />every second <em>count.</em></h2>
        <Button variant="primary" size="lg" arrow as="a" href={`mailto:${profile.email}`}>Start a project</Button>
      </div>

      <div className="tmk-contact__details">
        <a href={`mailto:${profile.email}`}>
          <span>Email</span><b>{profile.email}</b>
        </a>
        <a href={profile.x} target="_blank" rel="noreferrer">
          <span>X / Twitter</span><b>{profile.xhandle}</b>
        </a>
      </div>

      <div className="tmk-contact__base">
        <span>© Toymeet</span>
        <span>Short-form video editor</span>
        <a className="tmk-contact__credit" href="https://www.mahitg.com/" target="_blank" rel="noreferrer">
          Site by mahitg <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}

Object.assign(window, { Contact });
