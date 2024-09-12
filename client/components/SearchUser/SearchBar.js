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
        className="bg-[#1E3A8A] text-white px-4 py-2 rounded-full hover:bg-[#1E40AF] transition duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
