import { useRef, useState } from "react";
function FeatureCards({ setActiveSection }) {
  const fileInputRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const [compareResult, setCompareResult] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const [standard1, setStandard1] = useState("");
  const [standard2, setStandard2] = useState("");
  const [showCompareForm, setShowCompareForm] = useState(false);
  
  const handleUploadClick = () => {
  fileInputRef.current.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setIsAnalyzing(true);
  setAnalysisResult("");

  try {
    const res = await fetch("http://127.0.0.1:8000/analyze-document", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setAnalysisResult(
      data.analysis || data.error || "Document analyzed."
    );
  } catch (error) {
    console.error(error);
    setAnalysisResult("Document analysis failed.");
  } finally {
    setIsAnalyzing(false);
  }
};

const handleCompare = async () => {
  if (!standard1.trim() || !standard2.trim()) {
    setCompareResult("Please enter both BIS standards.");
    return;
  }

  setIsComparing(true);
  setCompareResult("");

  try {
    const res = await fetch("http://127.0.0.1:8000/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        standard1,
        standard2,
      }),
    });

    const data = await res.json();

    setCompareResult(
      data.comparison || data.error || "Comparison failed."
    );
  } catch (error) {
    console.error(error);
    setCompareResult("Compare backend connection failed.");
  } finally {
    setIsComparing(false);
  }
};

const cleanAnalysis = (text) => {
  return text
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*/g, "")
    .replace(/^\*\s*/gm, "• ")
    .replace(/\n{3,}/g, "\n\n");
};

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

    <div className="card">
      <h3>📄 Document Analyze</h3>
      <p>Upload and analyze documents</p>
      {isAnalyzing && (
        <div className="analyzing-box">
          <div className="spinner"></div>
          <span>Analyzing document with AI...</span>
          </div>
        )}

        <button onClick={handleUploadClick}>
          Upload
        </button>

        <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        />
      </div>

      {/* Compare Card */}
      <div className="card">
        <h3>⚖️ Compare</h3>
        <p>Compare multiple standards</p>
        <button onClick={() => setShowCompareForm(true)}>
          Compare
        </button>
      </div>

     {showCompareForm && (
      <div className="compare-panel">
        <div className="compare-header">
          <div>
        <span className="compare-badge">AI COMPARISON</span>
        <h2>⚖️ Compare BIS Standards</h2>
        <p>
          Enter two BIS standards to compare scope, purpose,
          compliance points and key differences.
        </p>
      </div>

      <button
        className="compare-close"
        onClick={() => setShowCompareForm(false)}
      >
        ×
      </button>
    </div>

    <div className="compare-inputs">
      <div className="standard-input-card">
        <span className="standard-number">01</span>
        <label>First Standard</label>

        <input
          type="text"
          placeholder="Example: IS 456"
          value={standard1}
          onChange={(e) => setStandard1(e.target.value)}
        />
      </div>

      <div className="vs-circle">
        VS
      </div>

      <div className="standard-input-card">
        <span className="standard-number">02</span>
        <label>Second Standard</label>

        <input
          type="text"
          placeholder="Example: IS 800"
          value={standard2}
          onChange={(e) => setStandard2(e.target.value)}
        />
      </div>
    </div>

    <button
      className="compare-main-btn"
      onClick={handleCompare}
      disabled={isComparing}
    >
      {isComparing ? "Comparing with AI..." : "✨ Compare Standards"}
    </button>
  </div>
)}
{analysisResult && (
  <div className="analysis-result">
    <h2>📄 Document Analysis Result</h2>

    <div className="analysis-text">
      {cleanAnalysis(analysisResult)}
    </div>
  </div>
)}

{compareResult && (
  <div className="compare-result">

    <div className="compare-result-header">
      <div>
        <span className="compare-badge">AI RESULT</span>
        <h2>⚖️ Standards Comparison</h2>
      </div>

      <div className="compare-title-pills">
        <span>{standard1}</span>
        <b>VS</b>
        <span>{standard2}</span>
      </div>
    </div>

    <div className="compare-result-text">
      {cleanAnalysis(compareResult)}
    </div>

  </div>
)}

</div>
);
}

export default FeatureCards;