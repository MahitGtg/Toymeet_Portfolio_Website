const { Marquee } = window.ToymeetDesignSystem_a4eaa3;

function App() {
  const [active, setActive] = React.useState('top');
  const { clients } = window.TOYMEET_DATA;

  const onNav = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : 8);
      window.scrollTo({ top: id === 'top' ? 0 : y, behavior: 'smooth' });
    }
  };

  return (
    <div className="tmk-app">
      <Nav onNav={onNav} active={active} />
      <main>
        <Hero onNav={onNav} />
        <Marquee lime speed={26} items={clients} />
        <Work />
        <About />
      </main>
      <Contact />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
