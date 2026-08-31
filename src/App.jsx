import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import ChatBox from "./components/ChatBox";
import Footer from "./components/Footer";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;

    setResponse(
      `You asked: "${message}". This is a demo BIS AI response.`
    );

    setMessage("");
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <Hero />

        <FeatureCards />

        <ChatBox
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />

        {/* Response Display */}
        {response && (
          <div className="response-box">
            <p>{response}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
