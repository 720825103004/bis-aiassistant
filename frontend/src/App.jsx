import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import ChatBox from "./components/ChatBox";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🔍 Search Function
  const handleSearch = async () => {
    if (message.trim() === "") return;

    try {
      const res = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      const data = await res.json();

      setResults(data.results || []);

      setChatHistory((prev) => [
        ...prev,
        { sender: "user", text: message },
        {
          sender: "bot",
          text:
            data.results && data.results.length > 0
              ? `Found ${data.results.length} matching standard(s).`
              : "No matching BIS standards found.",
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Search backend connection failed.",
        },
      ]);
    }
  };

  // 🤖 Chat Function
  const handleChat = async () => {
    if (message.trim() === "") return;

    const userMessage = message;

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || data.error || "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "AI backend connection failed.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="app">
        <Header />
        <Hero />

        {/* 🔍 Feature Cards */}
        <FeatureCards />

        {/* 🔍 SEARCH RESULTS */}
        <div className="results-section">
          <h2>🔎 Results</h2>

          <div className="results-grid">
            {results.map((item, index) => (
              <div className="card" key={index}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <button onClick={() => setSelectedItem(item)}>
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🤖 CHAT */}
        <ChatBox
          message={message}
          setMessage={setMessage}
          handleSend={handleChat}
          chatHistory={chatHistory}
          isTyping={isTyping}
        />
      </div>

      {/* 🔥 MODAL POPUP */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              className="close-btn"
              onClick={() => setSelectedItem(null)}
            >
              ❌
            </button>

            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;