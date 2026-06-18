const { Button, Tag } = window.ToymeetDesignSystem_a4eaa3;

function Hero({ onNav }) {
  const { profile } = window.TOYMEET_DATA;
  return (
    <section className="tmk-hero" id="top">
      <div className="tmk-hero__top">
        <span>
          Toymeet<span className="tmk-hero__reg">®</span>
        </span>
        <span>
          {profile.role} · {profile.age}
        </span>
      </div>

      <h1 className="tmk-hero__title" aria-label="Every second counts.">
        <span className="tmk-hero__lineclip">
          <span className="tmk-hero__line" style={{ "--d": "0ms" }}>
            Every
          </span>
        </span>
        <span className="tmk-hero__lineclip">
          <span className="tmk-hero__line" style={{ "--d": "85ms" }}>
            second
          </span>
        </span>
        <span className="tmk-hero__lineclip">
          <span className="tmk-hero__line" style={{ "--d": "170ms" }}>
            <em>counts.</em>
          </span>
        </span>
      </h1>

      <div className="tmk-hero__sub">
        <div className="tmk-hero__lead">
          <Tag variant="lime" dot>
            Available for clips
          </Tag>
          <p>{profile.bio}</p>
          <div className="tmk-hero__cta">
            <Button
              variant="primary"
              size="lg"
              arrow
              onClick={() => onNav("work")}
            >
              View the work
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNav("contact")}
            >
              Book Toymeet
            </Button>
          </div>
        </div>
        <div className="tmk-hero__portrait">
          <img
            src="public/images/toymeet.jpg"
            alt="Toymeet"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentNode.classList.add("is-empty");
            }}
          />
          <span className="tmk-hero__portrait-tag">Editor</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
