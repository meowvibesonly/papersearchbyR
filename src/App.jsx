import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [papers, setPapers] = useState([]);
  const [visibleSummary, setVisibleSummary] = useState(null);

  const handleToggle = (index) => {
    setVisibleSummary(visibleSummary === index ? null : index);
  };

  const fetchPapers = async () => {
    const response = await fetch(
      `http://export.arxiv.org/api/query?search_query=all:(blockchain OR web3 OR "smart contracts" OR "decentralized finance" OR "cryptocurrency")&start=0&max_results=25&sortBy=lastUpdatedDate&sortOrder=descending`
    );
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");

    renderPapers(xmlDoc);
  };

  const renderPapers = (xmldoc) => {
    const entries = Array.from(xmldoc.getElementsByTagName("entry"));
    const fetchedPapers = entries.map((entry) => ({
      title: entry.getElementsByTagName("title")[0].textContent,
      published: entry
        .getElementsByTagName("published")[0]
        .textContent.split("T")[0],
      pdfLink:
        entry.getElementsByTagName("id")[0].textContent.replace("abs", "pdf") +
        ".pdf",
      summary: entry.getElementsByTagName("summary")[0].textContent.trim(),
    }));
    setPapers(fetchedPapers);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="title-text">Discover the Latest Web3 Research</h1>
        <p className="info-text">
          Explore the latest research on Blockchain, Web3, DeFi, Crypto and
          more.
        </p>
      </header>
      <hr />
      <div className="content">
        {papers.map((paper, index) => (
          <div key={index} className="paper-card">
            <h2 className="paper-title">{paper.title}</h2>
            <p>Published: {paper.published}</p>
            <button
              className="toggle-button"
              onClick={() => handleToggle(index)}
            >
              {visibleSummary === index ? "Hide Summary" : "Show Summary"}
            </button>

            {visibleSummary === index && (
              <div className="hidden-text">{paper.summary}</div>
            )}
            <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;