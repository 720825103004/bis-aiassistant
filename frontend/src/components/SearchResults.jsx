function SearchResults({ results, setSelectedItem }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results-container">
      <h3>🔍 Results</h3>

      <div className="results-grid">
        {results.map((item, index) => (
          <div key={index} className="result-card">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <button onClick={() => setSelectedItem(item)}>
  View
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;