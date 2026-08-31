function FeatureCards() {
  return (
    <section className="cards">
      <div className="card">
        <div className="icon">🔎</div>
        <h3>Search Standards</h3>
        <p>Find relevant BIS standards quickly.</p>
        <button>Search</button>
      </div>

      <div className="card">
        <div className="icon">🤖</div>
        <h3>AI Assistant</h3>
        <p>Ask questions about BIS standards.</p>
        <button>Ask AI</button>
      </div>

      <div className="card">
        <div className="icon">📄</div>
        <h3>Document Analysis</h3>
        <p>Upload documents and check compliance.</p>
        <button>Upload</button>
      </div>

      <div className="card">
        <div className="icon">⚖️</div>
        <h3>Compare Standards</h3>
        <p>Compare two BIS standards easily.</p>
        <button>Compare</button>
      </div>
    </section>
  );
}

export default FeatureCards;