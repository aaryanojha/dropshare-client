"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function GetText() {
  const { code } = useParams();
  const fetchedRef = useRef(false); // 🔥 guard
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code || fetchedRef.current) return;

    fetchedRef.current = true; // prevent double fetch

    fetch(`http://127.0.0.1:5000/api/text/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setText(data.text);
      })
      .catch(() => setError("Failed to fetch"));
  }, [code]);

  if (error) return <p>{error}</p>;
  if (!text) return <p>Loading...</p>;

  return (
    <main style={{ padding: 40 }}>
      <pre>{text}</pre>
      <button onClick={() => navigator.clipboard.writeText(text)}>
        Copy
      </button>
    </main>
  );
}
