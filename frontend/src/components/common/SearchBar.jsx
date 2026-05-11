import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#1e293b",
      border: "1px solid #FFD60A",
      borderRadius: "25px",
      padding: "8px 16px",
      width: "350px",
      gap: "8px",
    }}>
      <AiOutlineSearch style={{ color: "#FFD60A", fontSize: "20px" }} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search courses..."
        style={{
          background: "none",
          border: "none",
          outline: "none",
          color: "#ffffff",
          fontSize: "14px",
          width: "100%",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: "#FFD60A",
          border: "none",
          borderRadius: "15px",
          padding: "4px 12px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px",
          color: "#000",
        }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;