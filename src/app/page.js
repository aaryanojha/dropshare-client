import Link from "next/link";

export default function Home() {
  return (
    <main className="main-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          DropShare
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Seamless Transfer</div>
        <h1>
          Instantly share <br />
          <span className="text-gradient">text, links, and files</span>
        </h1>
        <p className="hero-sub">
          No login required. Just drop, share, and go.
        </p>
      </section>

      {/* Action Cards */}
      <section className="cards">
        <div className="card blue">
          <div className="card-content">
            <div className="icon-wrapper">📝</div>
            <h3>Send Text</h3>
            <p>Paste notes or snippets and get a secure code instantly.</p>
          </div>
          {/* Using Link for faster client-side navigation */}
          <Link href="/text" className="card-action">
            Share Text &rarr;
          </Link>
        </div>

        <div className="card green disabled">
          <div className="card-content">
            <div className="icon-wrapper">🔗</div>
            <h3>Share Link</h3>
            <p>Shorten long URLs and share them via QR code.</p>
          </div>
          <Link href="/link" className="card-action">
            Share Link &rarr;
          </Link>
        </div>

        <div className="card orange disabled">
          <div className="card-content">
            <div className="icon-wrapper">📂</div>
            <h3>Transfer File</h3>
            <p>P2P file transfer for documents and images.</p>
          </div>
          <Link href="/file" className="card-action">
            Share File &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}