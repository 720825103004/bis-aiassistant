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

const handleSend = async () => {
  if (message.trim() === "") return;

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await res.json();

    if (data.response) {
      setResponse(data.response);
    } else {
      setResponse(data.error || "Something went wrong");
    }
  } catch (error) {
    setResponse("Backend connection failed");
  }

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
