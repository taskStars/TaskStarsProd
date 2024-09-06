"use client";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Call the onSearch function passed from the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2 w-full"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
