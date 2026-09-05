import { useRef, useState } from "react";
function FeatureCards({ setActiveSection }) {
  const fileInputRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);


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

    console.log("Document analysis:", data);

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
      {isAnalyzing && <p>Analyzing...</p>}
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
        <button onClick={() => setActiveSection("compare")}>
          Compare
        </button>
      </div>

      {analysisResult && (
  <div className="analysis-result">
    <h2>📄 Document Analysis Result</h2>
    
    <div className="analysis-text">
  {cleanAnalysis(analysisResult)}
</div>
  </div>
)}

    </div>
  );
}

export default FeatureCards;