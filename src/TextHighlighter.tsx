import React, { useState } from 'react';

const TextHighlighter = ({ item }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const text = `${item.PLZ || 'n/a'} ${item.Gemeinde || ''},\u00A0WK: ${item.Wahlkreis || 'n/a'}\nWK Name: ${item.WKName || 'n/a'}`;

  // Function to handle search term input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to highlight text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;

    // Use regex to match the search term, case-insensitive
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ fontWeight: 'bolder', color: 'red' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <h2>Text Highlighter Example</h2>
      
      {/* Input field for search term */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Enter text to highlight"
        style={{ marginBottom: '20px', padding: '8px' }}
      />
      
      {/* Render the text with highlights */}
      <p>{highlightText(text, searchTerm)}</p>
    </div>
  );
};

export default TextHighlighter;
