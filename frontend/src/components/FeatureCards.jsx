function FeatureCards({ setActiveSection }) {
  return (
    <div className="features">

      {/* Search Card */}
      <div className="card">
        <h3>🔍 Search Standards</h3>
        <p>Find BIS standards easily</p>
        <button onClick={() => setActiveSection("search")}>
          Explore
        </button>
      </div>

      {/* AI Assistant Card */}
      <div className="card">
        <h3>🤖 AI Assistant</h3>
        <p>Ask questions about BIS</p>
        <button onClick={() => setActiveSection("ai")}>
          Ask Now
        </button>
      </div>

      {/* Document Analyze Card */}
      <div className="card">
        <h3>📄 Document Analyze</h3>
        <p>Upload and analyze documents</p>
        <button onClick={() => setActiveSection("upload")}>
          Upload
        </button>
      </div>

      {/* Compare Card */}
      <div className="card">
        <h3>⚖️ Compare</h3>
        <p>Compare multiple standards</p>
        <button onClick={() => setActiveSection("compare")}>
          Compare
        </button>
      </div>

    </div>
  );
}

export default FeatureCards;