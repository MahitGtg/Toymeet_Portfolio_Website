const { MetaLabel } = window.ToymeetDesignSystem_a4eaa3;

const REDUCE_MOTION = typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const AUTO_MS = 5200;

/* ---------- helpers ---------- */
/* Count-up that fires (and flags reveal) when it scrolls into view */
function useCountUp(target, dur = 1800) {
  const [val, setVal] = React.useState(REDUCE_MOTION ? target : 0);
  const [seen, setSeen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf, started = false;
    const run = () => {
      if (REDUCE_MOTION) { setVal(target); return; }
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !started) { started = true; setSeen(true); run(); } });
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, dur]);
  return [val, ref, seen];
}

/* ---------- one short card ----------
   ONLY the centered (foreground) card mounts a live <iframe>; every other
   card shows the YouTube thumbnail. This structurally guarantees that just
   one clip ever plays, and keeps the reel light (one video, not six). */
function ShortCard({ v, index, active, centered, onActivate }) {
  const src = `https://www.youtube.com/embed/${v.id}`
    + `?autoplay=1&mute=${active ? 0 : 1}&controls=${active ? 1 : 0}`
    + `&loop=1&playlist=${v.id}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`;
  // oardefault = the vertical (original aspect-ratio) Shorts thumbnail
  const thumb = `https://i.ytimg.com/vi/${v.id}/oardefault.jpg`;
  const thumbFallback = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;

  return (
    <article className={'tmk-short' + (centered ? ' is-centered' : '') + (active ? ' is-active' : '')}>
      <div className="tmk-short__media">
        {centered ? (
          <iframe
            className="tmk-short__frame"
            src={src}
            title={v.client}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            className="tmk-short__poster"
            src={thumb}
            alt={`${v.client} short`}
            loading="lazy"
            onError={(e) => { if (e.currentTarget.src !== thumbFallback) e.currentTarget.src = thumbFallback; }}
          />
        )}
        {!active && (
          <button
            className="tmk-short__hit"
            onClick={() => onActivate(v.id, centered)}
            aria-label={centered ? `Turn sound on for ${v.client} short` : `Bring ${v.client} short to front`}
          />
        )}
        <span className="tmk-short__idx">{index}</span>
        {!centered && (
          <span className="tmk-short__peek" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Tap to focus
          </span>
        )}
        {centered && !active && <span className="tmk-short__sound">Muted · tap for sound</span>}
        {centered && active && <span className="tmk-short__sound is-live"><i /> Sound on</span>}
      </div>
      <div className="tmk-short__foot">
        <div className="tmk-short__who">
          <b>{v.client}</b>
          <span>{v.handle}</span>
        </div>
        <span className="tmk-short__badge" aria-hidden="true">{centered ? 'Now playing' : 'Reel'}</span>
      </div>
    </article>
  );
}

/* ---------- the carousel ---------- */
function Carousel({ videos }) {
  const rootRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [centerId, setCenterId] = React.useState(videos[0] && videos[0].id);
  const [activeId, setActiveId] = React.useState(null);
  const [paused, setPaused] = React.useState(false);
  // Reveal lives in React state (not an external class) so frequent
  // re-renders can't clobber it the way an imperatively-added class would.
  const [inView, setInView] = React.useState(REDUCE_MOTION);

  const n = videos.length;
  const idx = Math.max(0, videos.findIndex((v) => v.id === centerId));
  const idxRef = React.useRef(idx);
  idxRef.current = idx;

  // smooth-scroll a card to the centre of the viewport
  const goTo = React.useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    const cells = el.querySelectorAll('[data-id]');
    const cell = cells[(i + n) % n];
    if (!cell) return;
    const target = cell.offsetLeft - (el.clientWidth - cell.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [n]);

  // auto-advance the reel — pauses on hover, while a clip has sound, or reduced-motion
  React.useEffect(() => {
    if (paused || activeId || REDUCE_MOTION) return;
    const t = setInterval(() => goTo(idxRef.current + 1), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, activeId, goTo]);

  // vertical wheel -> step ONE clip at a time (with cooldown), release to page at edges
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let cooldown = false, accum = 0, accTimer;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // let native horizontal pass
      const dir = e.deltaY > 0 ? 1 : -1;
      const i = idxRef.current;
      if ((i <= 0 && dir < 0) || (i >= n - 1 && dir > 0)) return; // at edge -> page scrolls
      e.preventDefault();
      if (cooldown) return;
      accum += e.deltaY;
      clearTimeout(accTimer);
      accTimer = setTimeout(() => { accum = 0; }, 140);
      if (Math.abs(accum) >= 22) {
        accum = 0;
        cooldown = true;
        goTo(i + dir);
        setTimeout(() => { cooldown = false; }, 640);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(accTimer); };
  }, [goTo, n]);

  // detect centered card while dragging/scrolling the track
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const update = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = null, bestD = Infinity;
      el.querySelectorAll('[data-id]').forEach((card) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = card.getAttribute('data-id'); }
      });
      if (best) setCenterId((cur) => (cur === best ? cur : best));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [videos]);

  // reveal the carousel once when it scrolls into view
  React.useEffect(() => {
    if (inView) return;
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  // moving to a new foreground clip cancels the unmuted state
  React.useEffect(() => { setActiveId((cur) => (cur === centerId ? cur : null)); }, [centerId]);

  const onActivate = (id, isCentered) => {
    if (isCentered) {
      setActiveId((cur) => (cur === id ? null : id)); // toggle sound on foreground
    } else {
      const i = videos.findIndex((v) => v.id === id);
      if (i >= 0) goTo(i); // promote a side clip to the front
    }
  };

  const cls = 'tmk-carousel' + (inView ? ' is-in' : '') + (paused ? ' is-paused' : '') + (activeId ? ' is-manual' : '');

  return (
    <div
      className={cls}
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="tmk-carousel__track" ref={trackRef} onPointerDown={() => setPaused(true)}>
        {videos.map((v, i) => (
          <div className="tmk-carousel__cell" data-id={v.id} key={v.id}>
            <ShortCard
              v={v}
              index={String(i + 1).padStart(2, '0')}
              centered={centerId === v.id}
              active={activeId === v.id}
              onActivate={onActivate}
            />
          </div>
        ))}
        <div className="tmk-carousel__pad" aria-hidden="true" />
      </div>

      <div className="tmk-carousel__nav">
        <div className="tmk-carousel__arrows">
          <button className="tmk-cbtn" aria-label="Previous clip" onClick={() => goTo(idx - 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button className="tmk-cbtn" aria-label="Next clip" onClick={() => goTo(idx + 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="tmk-cdots">
          {videos.map((v, i) => (
            <button
              key={v.id}
              className={'tmk-cdot' + (i === idx ? ' is-on' : '')}
              aria-label={`Go to clip ${i + 1}`}
              aria-current={i === idx ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="tmk-cmeta">
          <span className="tmk-cindex">{String(idx + 1).padStart(2, '0')}<em> / {String(n).padStart(2, '0')}</em></span>
          <div className="tmk-cprogress" aria-hidden="true">
            <div className="tmk-cprogress__bar" key={centerId} />
          </div>
        </div>
      </div>

      <div className="tmk-carousel__hint">↕ scroll to move through the reel · tap the front clip for sound</div>
    </div>
  );
}

/* ---------- section ---------- */
function Work() {
  const { workingWith, workedWith, totalViews } = window.TOYMEET_DATA;
  const [count, countRef, revealed] = useCountUp(totalViews / 1_000_000);

  return (
    <section className="tmk-work" id="work">
      <div className="tmk-sec-head tmk-work__head">
        <div>
          <MetaLabel rule strong index="01">Selected work</MetaLabel>
          <h2 className="tmk-sec-title">The shorts</h2>
        </div>
        <div className={'tmk-work__total' + (revealed ? ' is-revealed' : '')} ref={countRef}>
          <b>{Math.round(count)}M<span>+</span></b>
          <span>combined views</span>
        </div>
      </div>

      <div className="tmk-work__sub">
        <MetaLabel strong>Currently working with</MetaLabel>
        <span className="tmk-work__count">{workingWith.length} clients</span>
      </div>
      <Carousel videos={workingWith} />

      <div className="tmk-work__sub tmk-work__sub--prev">
        <MetaLabel strong>Previously worked with</MetaLabel>
      </div>
      <div className="tmk-work__prev">
        {workedWith.map((c) => (
          <a
            className="tmk-prev"
            key={c.client}
            href={c.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label={`${c.client} on YouTube`}
          >
            {c.image && (
              <img
                className="tmk-prev__avatar"
                src={c.image}
                alt={`${c.client} channel avatar`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <span className="tmk-prev__text">
              <b>{c.client}</b>
              <span>{c.handle}</span>
            </span>
            <svg className="tmk-prev__yt" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/>
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Work, Carousel, ShortCard });
