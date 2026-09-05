import { useEffect, useRef } from "react";
import "./ChatBox.css";

function ChatBox({ message, setMessage, handleSend, chatHistory }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <section className="chat-box">
      <h2>🤖 Ask BIS AI</h2>

      {/* Messages */}
      <div className="chat-messages">
  {chatHistory.map((msg, index) => (
    <div
      key={index}
      className={
        msg.sender === "user" ? "chat-bubble user" : "chat-bubble bot"
      }
    >
      {msg.text}
    </div>
  ))}
</div>

      {/* Input */}
    <div className="chat-input-container">

  {/* ➕ LEFT ICON */}
  <button className="icon-btn">➕</button>

  {/* INPUT */}
  <input
    type="text"
    placeholder="Ask anything about BIS standards..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
  />

  {/* MIC ICON */}
  <button className="icon-btn">🎤</button>

  {/* SEND / VOICE BUTTON */}
  <button className="send-btn" onClick={handleSend}>
  ➤
</button>

</div>
    </section>
  );
}

export default ChatBox;