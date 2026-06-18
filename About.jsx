const { MetaLabel, Tag } = window.ToymeetDesignSystem_a4eaa3;

function About() {
  const { profile } = window.TOYMEET_DATA;
  return (
    <section className="tmk-about" id="about">
      <div className="tmk-sec-head">
        <MetaLabel rule strong index="02">About</MetaLabel>
        <h2 className="tmk-sec-title">Storytelling,<br />frame by frame.</h2>
      </div>

      <div className="tmk-about__grid">
        <div className="tmk-about__col">
          <span className="tmk-about__klabel">What I do</span>
          <p className="tmk-about__copy">
            Short-form is its own craft — pacing, punch, and retention from the
            first frame. I build edits that hook in the first second and hold to
            the last.
          </p>
        </div>

        <div className="tmk-about__col">
          <span className="tmk-about__klabel">Specialties</span>
          <div className="tmk-about__tags">
            <Tag>Game highlights</Tag>
            <Tag>Promo videos</Tag>
            <Tag>Guide videos</Tag>
            <Tag>Short-form / Shorts</Tag>
            <Tag>TFT / gaming</Tag>
          </div>
        </div>

        <div className="tmk-about__col">
          <span className="tmk-about__klabel">Editor</span>
          <div className="tmk-about__row">
            <b>{profile.alias}</b>
            <span>{profile.role}</span>
            <em>{profile.age} years old · {profile.xhandle}</em>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { About });
