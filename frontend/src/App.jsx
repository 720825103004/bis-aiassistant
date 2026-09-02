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
  const handleSearch = () => {
    if (message.trim() === "") return;

    const dummyResults = [
      {
        title: "IS 1234 - Steel Standard",
        description: "Guidelines for steel materials and usage.",
      },
      {
        title: "IS 5678 - Electrical Safety",
        description: "Safety standards for electrical systems.",
      },
      {
        title: "IS 9101 - Cement Quality",
        description: "Specifications for cement testing.",
      },
    ];

    setResults(dummyResults);

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: message },
      { sender: "bot", text: `Showing results for: ${message}` },
    ]);

    setMessage("");
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
          handleSend={handleSearch}
          chatHistory={chatHistory}
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
