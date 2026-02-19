"use client";
import { Suspense } from "react";
import { Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

function FilePageInner() {
  /* ---------- Upload state ---------- */
  const [file, setFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* ---------- Download state ---------- */
  const [retrieveCode, setRetrieveCode] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const inputRef = useRef(null);

  /* ---------- Autofill code from QR ---------- */
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setRetrieveCode(codeFromUrl.toLowerCase());
    }
  }, [searchParams]);

  /* ---------- Upload ---------- */
  async function handleUpload() {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "https://dropshare-server.onrender.com/api/file",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setGeneratedCode(data.code);
    } catch {
      setError("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  /* ---------- Download (IMPORTANT) ---------- */
  function handleDownload() {
    if (!retrieveCode.trim()) return;

    // 🔥 THIS triggers browser download
    window.location.href = `https://dropshare-server.onrender.com/api/file/${retrieveCode
      .trim()
      .toLowerCase()}`;
  }

  /* ---------- UI ---------- */
  return (
    <main className="main-container">
      {/* Navbar */}
      <header className="navbar">
        <Link href="/" className="logo">
          <Home size={24} />
        </Link>
        <div className="badge">File Share</div>
      </header>

      <div className="split-grid">
        {/* LEFT: UPLOAD */}
        <section className="card-panel">
          <div className="panel-header">
            <span className="icon">📂</span>
            <h2>Upload File</h2>
          </div>

          <div className="input-group">
          <input
            type="file"
            multiple
            className="mm"
            onChange={(e) => setFiles([...e.target.files])}/>
          </div>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Generate Code"}
          </button>

          {generatedCode && (
            <div className="result-box">
              <p>Your file code:</p>
              <h1 className="code">{generatedCode}</h1>

              <p className="hint">Scan or share this code</p>

              <QRCodeCanvas
                value={`${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/file?code=${generatedCode}`}
                size={160}
              />
            </div>
          )}
        </section>

        {/* RIGHT: DOWNLOAD */}
        <section className="card-panel">
          <div className="panel-header">
            <span className="icon">📥</span>
            <h2>Download File</h2>
          </div>

          <div className="input-group">
            <input
              placeholder="Enter code"
              value={retrieveCode}
              onChange={(e) => setRetrieveCode(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleDownload}>
            Download
          </button>

          {error && <p className="error-msg">{error}</p>}

          <p className="hint">
            File downloads immediately and is deleted after.
          </p>
        </section>
      </div>
    </main>
  );
}
export default function FilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FilePageInner />
    </Suspense>
  );
}
