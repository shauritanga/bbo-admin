import React, { useState } from "react";
import "./search.css";
import { FiSearch } from "react-icons/fi";

function Search({ query, setQuery }) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className="search"
      style={{
        border: focus
          ? "1px solid hsl(243deg 50% 21%)"
          : "1px solid hsl(0deg 0% 70%)",
      }}
    >
      <FiSearch size={18} color="gray" />
      <input
        type="search"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search here..."
      />
    </div>
  );
}

export default Search;
