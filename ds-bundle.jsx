/* ============================================================
   TOYMEET DESIGN SYSTEM — runtime bundle
   Exposes the core + media components on
   window.ToymeetDesignSystem_a4eaa3 for the portfolio UI kit.
   Each component injects its own scoped CSS on first use.
   ============================================================ */
(function () {
  /* ---------- Button ---------- */
  if (typeof document !== 'undefined' && !document.getElementById('tm-button-css')) {
    const s = document.createElement('style');
    s.id = 'tm-button-css';
    s.textContent = `
.tm-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-body);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border:var(--border-w) solid var(--ink);background:var(--paper);color:var(--ink);cursor:pointer;border-radius:var(--radius-sm);line-height:1;text-decoration:none;white-space:nowrap;transition:transform var(--dur-fast) var(--ease),box-shadow var(--dur-fast) var(--ease),background var(--dur-fast) var(--ease),color var(--dur-fast) var(--ease);}
.tm-btn:focus-visible{outline:none;box-shadow:var(--focus);}
.tm-btn--sm{padding:9px 15px;font-size:12px;}
.tm-btn--md{padding:14px 22px;font-size:14px;}
.tm-btn--lg{padding:18px 30px;font-size:16px;letter-spacing:0.05em;}
.tm-btn--primary{background:var(--lime);color:var(--lime-ink);box-shadow:var(--shadow-hard);}
.tm-btn--primary:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink);}
.tm-btn--primary:active{transform:translate(2px,2px);box-shadow:0 0 0 var(--ink);background:var(--lime-press);}
.tm-btn--secondary{background:var(--surface);color:var(--text);box-shadow:var(--shadow-hard);}
.tm-btn--secondary:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink);background:var(--lime);color:var(--lime-ink);}
.tm-btn--secondary:active{transform:translate(2px,2px);box-shadow:0 0 0 var(--ink);}
.tm-btn--ghost{border-color:transparent;background:transparent;box-shadow:none;padding-left:4px;padding-right:4px;}
.tm-btn--ghost:hover{color:var(--ink);text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px;}
.tm-btn[disabled],.tm-btn[aria-disabled="true"]{opacity:.38;cursor:not-allowed;box-shadow:none;transform:none;pointer-events:none;}
.tm-btn__arrow{font-weight:400;font-size:1.15em;line-height:0;margin-top:-1px;}
`;
    document.head.appendChild(s);
  }

  function Button({
    children,
    variant = 'primary',
    size = 'md',
    arrow = false,
    as,
    href,
    disabled = false,
    className = '',
    ...rest
  }) {
    const Tag = as || (href ? 'a' : 'button');
    const cls = ['tm-btn', `tm-btn--${variant}`, `tm-btn--${size}`, className]
      .filter(Boolean)
      .join(' ');
    const extra = {};
    if (Tag === 'a') {
      extra.href = href;
      if (disabled) extra['aria-disabled'] = 'true';
    } else {
      extra.disabled = disabled;
      extra.type = rest.type || 'button';
    }
    return (
      <Tag className={cls} {...extra} {...rest}>
        {children}
        {arrow && <span className="tm-btn__arrow" aria-hidden="true">→</span>}
      </Tag>
    );
  }

  /* ---------- Tag ---------- */
  if (typeof document !== 'undefined' && !document.getElementById('tm-tag-css')) {
    const s = document.createElement('style');
    s.id = 'tm-tag-css';
    s.textContent = `
.tm-tag{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-body);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;font-size:12px;line-height:1;padding:7px 12px;border:var(--border-w) solid var(--ink);border-radius:var(--radius-sm);color:var(--ink);background:transparent;white-space:nowrap;}
.tm-tag--solid{background:var(--ink);color:var(--paper);}
.tm-tag--lime{background:var(--lime);color:var(--lime-ink);border-color:var(--lime);}
.tm-tag--ghost{border-color:var(--border-soft);color:var(--text-muted);}
.tm-tag__dot{width:7px;height:7px;border-radius:50%;background:currentColor;}
`;
    document.head.appendChild(s);
  }

  function Tag({ children, variant = 'outline', dot = false, className = '', ...rest }) {
    const cls = ['tm-tag', `tm-tag--${variant}`, className].filter(Boolean).join(' ');
    return (
      <span className={cls} {...rest}>
        {dot && <span className="tm-tag__dot" aria-hidden="true" />}
        {children}
      </span>
    );
  }

  /* ---------- MetaLabel ---------- */
  if (typeof document !== 'undefined' && !document.getElementById('tm-metalabel-css')) {
    const s = document.createElement('style');
    s.id = 'tm-metalabel-css';
    s.textContent = `
.tm-meta{font-family:var(--font-body);font-weight:600;text-transform:uppercase;letter-spacing:var(--track-meta);font-size:var(--text-meta);color:var(--text-muted);display:flex;align-items:center;gap:10px;}
.tm-meta--strong{color:var(--text);}
.tm-meta--rule{border-top:var(--border-w) solid var(--border);padding-top:12px;}
.tm-meta__num{font-variant-numeric:tabular-nums;color:var(--text);}
`;
    document.head.appendChild(s);
  }

  function MetaLabel({ children, strong = false, rule = false, index, className = '', ...rest }) {
    const cls = ['tm-meta', strong && 'tm-meta--strong', rule && 'tm-meta--rule', className]
      .filter(Boolean)
      .join(' ');
    return (
      <span className={cls} {...rest}>
        {index != null && <span className="tm-meta__num">{index}</span>}
        {children}
      </span>
    );
  }

  /* ---------- Marquee ---------- */
  if (typeof document !== 'undefined' && !document.getElementById('tm-marquee-css')) {
    const s = document.createElement('style');
    s.id = 'tm-marquee-css';
    s.textContent = `
.tm-marquee{display:flex;overflow:hidden;width:100%;border-top:var(--border-w) solid var(--border);border-bottom:var(--border-w) solid var(--border);background:var(--surface);user-select:none;}
.tm-marquee--lime{background:var(--lime);}
.tm-marquee__track{display:flex;flex:none;align-items:center;gap:0;padding:14px 0;animation:tm-marquee-scroll linear infinite;}
.tm-marquee:hover .tm-marquee__track{animation-play-state:paused;}
.tm-marquee__item{font-family:var(--font-display);text-transform:uppercase;font-size:30px;line-height:1;letter-spacing:0.02em;color:var(--text);padding:0 28px;display:inline-flex;align-items:center;gap:28px;}
.tm-marquee--lime .tm-marquee__item{color:var(--lime-ink);}
.tm-marquee__sep{font-size:16px;opacity:.55;font-family:var(--font-body);}
@keyframes tm-marquee-scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@media (prefers-reduced-motion: reduce){.tm-marquee__track{animation:none;}}
`;
    document.head.appendChild(s);
  }

  function Marquee({ items = [], sep = '✦', speed = 28, lime = false, className = '', ...rest }) {
    const cls = ['tm-marquee', lime && 'tm-marquee--lime', className].filter(Boolean).join(' ');
    const renderRun = (k) => (
      <div className="tm-marquee__track" key={k} style={{ animationDuration: `${speed}s` }} aria-hidden={k > 0}>
        {items.map((it, i) => (
          <span className="tm-marquee__item" key={i}>
            {it}
            <span className="tm-marquee__sep">{sep}</span>
          </span>
        ))}
      </div>
    );
    return (
      <div className={cls} {...rest}>
        {renderRun(0)}
        {renderRun(1)}
      </div>
    );
  }

  window.ToymeetDesignSystem_a4eaa3 = { Button, Tag, MetaLabel, Marquee };
})();
