import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        background: "none",
        border: "2px solid #FFD60A",
        borderRadius: "20px",
        padding: "4px 12px",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#FFD60A",
        transition: "all 0.3s ease",
      }}>
      {darkMode ? "☀️" : "🌙"}
      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
        {darkMode ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;