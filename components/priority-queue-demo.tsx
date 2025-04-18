import React, { useState, useEffect } from "react";

// Simple UI to interact with backend priority queue endpoints
const API_BASE = "/api/queue";

export default function PriorityQueueDemo() {
  const [queue, setQueue] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the current queue
  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      setMessage("Failed to fetch queue");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Add an item to the queue
  const addToQueue = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: input,
      });
      setInput("");
      setMessage("Added to queue!");
      fetchQueue();
    } catch (err) {
      setMessage("Failed to add to queue");
    }
    setLoading(false);
  };

  // Poll (remove) the highest-priority item
  const pollQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/poll`);
      const text = await res.text();
      setMessage(text);
      fetchQueue();
    } catch (err) {
      setMessage("Failed to poll queue");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Priority Queue Demo</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter value (e.g. urgent case)"
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button onClick={addToQueue} disabled={loading} style={{ padding: 8 }}>
          Add
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={pollQueue} disabled={loading || queue.length === 0} style={{ padding: 8, width: "100%" }}>
          Poll (Remove Highest Priority)
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Current Queue:</strong>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul style={{ marginTop: 8 }}>
            {queue.map((item, idx) => (
              <li key={idx} style={{ padding: 4, borderBottom: "1px solid #eee" }}>{item}</li>
            ))}
            {queue.length === 0 && <li>No items in queue</li>}
          </ul>
        )}
      </div>
      {message && <div style={{ color: "#a855f7", marginTop: 12 }}>{message}</div>}
    </div>
  );
}
