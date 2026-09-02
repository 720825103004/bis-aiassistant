function ChatBox({ message, setMessage, handleSend }) {
  return (
    <section className="chat-box">
      <h2>🤖 Ask BIS AI</h2>

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask something about BIS standards..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </section>
  );
}

export default ChatBox;