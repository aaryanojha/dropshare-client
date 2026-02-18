"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function TextPage() {
  // Send State
  const [text, setText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Retrieve State
  const [retrieveCode, setRetrieveCode] = useState("");
  const [retrievedText, setRetrievedText] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setRetrieveCode(codeFromUrl.toLowerCase());
    }
  }, [searchParams]);

  // --- Handlers ---

  async function handleSend() {
    if (!text.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("https://dropshare-server.onrender.com/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setGeneratedCode(data.code);
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setIsSending(false);
    }
  }

  async function handleRetrieve() {
    if (!retrieveCode.trim()) return;
    setIsRetrieving(true);
    setError("");
    setRetrievedText(""); // Clear previous

    try {
      // Assuming GET endpoint structure matches: /api/text/:code
      const res = await fetch(`https://dropshare-server.onrender.com/api/text/${retrieveCode}`);

      if (!res.ok) throw new Error("Code not found");

      const data = await res.json();
      setRetrievedText(data.text);
    } catch (err) {
      setError("Drop not found or expired.");
    } finally {
      setIsRetrieving(false);
    }
  }

const [copied, setCopied] = useState(false);

const copyToClipboard = (txt) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(txt);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = txt;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};


  return (
    <main className="main-container">
      {/* Navbar with Back Navigation */}
      <header className="navbar">
        <Link href="/" className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Home
        </Link>
        <div className="badge">Text Share</div>
      </header>

      <div className="split-grid">
        {/* LEFT: SEND TEXT */}
        <section className="card-panel">
          <div className="panel-header">
            <div className="icon-badge blue-badge">📝</div>
            <h2>Share New Text</h2>
          </div>

          <textarea
            className="styled-textarea"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="action-row">
            <button
              className="btn-primary"
              onClick={handleSend}
              disabled={isSending || !text}
            >
              {isSending ? "Generating..." : "Generate Code"}
            </button>
          </div>

          {generatedCode && (
            <div className="result-box">
              <span>Your Drop Code:</span>

              <div className="code-display">
                <h1>{generatedCode}</h1>
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  aria-label="Copy"
                >
                  📋
                </button>
              </div>
              {copied && <span style={{ marginLeft: "8px", color: "green" }}>Copied!</span>}

              <p className="hint">
                Share this code or scan the QR on another device.
              </p>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <QRCodeCanvas
                  value={`http://localhost:3000/text?code=${generatedCode}`}
                  size={160}
                />
              </div>
            </div>
          )}
        </section>

        {/* RIGHT: RETRIEVE TEXT */}
        <section className="card-panel">
          <div className="panel-header">
            <div className="icon-badge green-badge">📥</div>
            <h2>Retrieve Text</h2>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Enter 4-digit Code"
              value={retrieveCode}
              onChange={(e) => setRetrieveCode(e.target.value)}
              maxLength={10}
            />
            <button onClick={handleRetrieve} disabled={isRetrieving}>
              {isRetrieving ? "..." : "Get"}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {retrievedText && (
            <div className="retrieved-area">
              <label>Content:</label>
              <div className="read-only-box">{retrievedText}</div>
              <button
                className="btn-secondary"
                onClick={() => copyToClipboard(retrievedText)}
              >
                Copy Content
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
