"use client";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Call the onSearch function passed from the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 mb-4">
      <input
        type="text"
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-full text-black"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-2 px-4 rounded hover:from-purple-600 hover:to-teal-500 w-full"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
