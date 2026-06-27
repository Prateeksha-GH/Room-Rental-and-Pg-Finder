// UI-only chat interface; persistence/realtime can be added later.
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

export default function ChatBox({ peerName = "Owner" }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { from: "peer", text: `Hi! Thanks for your interest. Feel free to ask anything about the property.` },
  ]);
  const [draft, setDraft] = useState("");

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "me", text: draft }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "peer", text: "Thanks! I'll get back to you shortly." }]);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden flex flex-col h-[420px]">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <p className="font-semibold">Chat with {peerName}</p>
        <p className="text-xs opacity-80">Online · responds in minutes</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
              m.from === "me" ? "bg-primary-600 text-white rounded-br-sm" : "bg-white border rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="p-3 border-t flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? "Type a message..." : "Login to chat"}
          disabled={!user}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-primary-500" />
        <button type="submit" disabled={!user}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white disabled:opacity-50">
          <FiSend />
        </button>
      </form>
    </div>
  );
}
