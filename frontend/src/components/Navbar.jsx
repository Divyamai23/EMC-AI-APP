export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#">
          0<span className="arrow">→</span>Shipped
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#upload">Score my resume</a>
        </nav>
      </div>
    </header>
  );
}
