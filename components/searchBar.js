import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      className="searchBar"
      placeholder="Search for birds..."
      value={query}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
