"use client";
import { Suspense } from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

/* ------------------ Utils ------------------ */
function normalizeUrl(input) {
  try {
    return new URL(input).href;
  } catch {
    return new URL("https://" + input).href;
  }
}

/* ------------------ Page ------------------ */
function LinkPageInner() {

  /* ---------- Send state ---------- */
  const [url, setUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSending, setIsSending] = useState(false);

  /* ---------- Retrieve state ---------- */
  const [retrieveCode, setRetrieveCode] = useState("");
  const [retrievedUrl, setRetrievedUrl] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  /* Guards */
  const autoTriggeredRef = useRef(false);
  const autoOpenedRef = useRef(false);

  /* ---------- Autofill code from QR ---------- */
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setRetrieveCode(codeFromUrl.toLowerCase());
    }
  }, [searchParams]);

  /* ---------- Auto fetch when QR is used ---------- */
  useEffect(() => {
    const auto = searchParams.get("auto");
    const code = searchParams.get("code");

    if (auto === "1" && code && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      handleRetrieve(code);
    }
  }, [searchParams]);

  /* ---------- Auto open after fetch ---------- */
  useEffect(() => {
    if (retrievedUrl && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      window.location.href = retrievedUrl;
    }
  }, [retrievedUrl]);

  /* ---------- Handlers ---------- */

  async function handleSend() {
    if (!url.trim()) return;

    const cleanUrl = normalizeUrl(url.trim());
    setIsSending(true);

    try {
      const res = await fetch("https://dropshare-server.onrender.com/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();
      setGeneratedCode(data.code);
    } catch {
      alert("Failed to create link");
    } finally {
      setIsSending(false);
    }
  }

  async function handleRetrieve(codeOverride) {
    const codeToUse = (codeOverride || retrieveCode).trim().toLowerCase();
    if (!codeToUse) return;

    setIsRetrieving(true);
    setError("");
    setRetrievedUrl("");

    try {
      const res = await fetch(
        `https://dropshare-server.onrender.com/api/link/${codeToUse}`
      );

      if (!res.ok) throw new Error("Invalid");

      const data = await res.json();
      setRetrievedUrl(data.url);
    } catch {
      setError("Link not found or expired.");
    } finally {
      setIsRetrieving(false);
    }
  }

  function openLinkManually() {
    if (retrievedUrl) {
      window.location.href = retrievedUrl;
    }
  }

  /* ---------- UI ---------- */
  return (
    <main className="main-container">
      {/* Navbar */}
      <header className="navbar">
        <Link href="/" className="logo">
          ← Back to Home
        </Link>
        <div className="badge">Link Share</div>
      </header>

      <div className="split-grid">
        {/* LEFT: SEND LINK */}
        <section className="card-panel">
          <div className="panel-header">
            <div className="icon-badge green-badge">🔗</div>
            <h2>Share a Link</h2>
          </div>

          <input
            type="text"
            placeholder="google.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            className="btn-primary"
            onClick={handleSend}
            disabled={isSending || !url}
          >
            {isSending ? "Generating..." : "Generate Code"}
          </button>

          {generatedCode && (
            <div className="result-box">
              <span>Your Link Code:</span>

              <div className="code-display">
                <h1>{generatedCode}</h1>
              </div>

              <p className="hint">Scan QR to open instantly</p>

              <QRCodeCanvas
                value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/link?code=${generatedCode}&auto=1`}
                size={160}
              />
            </div>
          )}
        </section>

        {/* RIGHT: MANUAL FALLBACK */}
        <section className="card-panel">
          <div className="panel-header">
            <div className="icon-badge blue-badge">📥</div>
            <h2>Open Link Manually</h2>
          </div>

          <div className="input-group">
            <input
              placeholder="Enter code"
              value={retrieveCode}
              onChange={(e) => setRetrieveCode(e.target.value)}
            />
            <button onClick={() => handleRetrieve()} disabled={isRetrieving}>
              {isRetrieving ? "..." : "Get"}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {retrievedUrl && (
            <div className="result-box">
              <p>Ready to open:</p>
              <div className="read-only-box">{retrievedUrl}</div>
              <button className="btn-secondary" onClick={openLinkManually}>
                Open Link
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LinkPageInner />
    </Suspense>
  );
}
