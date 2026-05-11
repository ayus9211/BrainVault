import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? "dark" : "light"}
        style={{
          minHeight: "100vh",
          backgroundColor: darkMode ? "#000814" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          transition: "all 0.3s ease"
        }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);