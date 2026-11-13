import { useEffect, useState } from "react";

const API = "http://localhost:3000/notes";

function NoteCard({ note, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #888",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        textAlign: "left",
      }}
    >
      <h3 style={{ margin: 0 }}>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note._id)}>Delete</button>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function loadNotes() {
    try {
      const res = await fetch(API);
      setNotes(await res.json());
    } catch {
      setError("Could not reach the API. Is the server running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes([...notes, note]);
      setTitle("");
      setContent("");
    }
  }

  async function deleteNote(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) setNotes(notes.filter((n) => n._id !== id));
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h1>My Notes</h1>

      <form onSubmit={addNote} style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        <button type="submit">Add note</button>
      </form>

      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={deleteNote} />
      ))}
    </div>
  );
}

export default App;
