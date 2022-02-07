import React, { useState, useEffect } from "react";
import Logo from "../assets/icons/logo.svg";
import Moon from "../assets/icons/icon-moon.svg";
import Sun from "../assets/icons/icon-sun.svg";
import Avatar from "../assets/icons/image-avatar.jpg";
import "./Nav.css";
import "../index.css";

interface props {
  modal: boolean;
}

const Nav: React.FC<props> = ({ modal }) => {
  const [theme, setTheme] = useState<string>("light-theme");

  const toggleTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      const useLocalStorageTheme = localStorage.getItem("theme") || "";
      setTheme(useLocalStorageTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className={modal ? "posFixed" : ""}>
      <div className="logo">
        <img src={Logo} alt="logo" />
        <div className="div-bottom-bg">
          <div className="bottom-bg"></div>
        </div>
      </div>

      <div className="dark-light-mode">
        <button onClick={toggleTheme} className="dark-light-btn">
          <img
            src={`${theme === "dark-theme" ? Sun : Moon}`}
            alt="dark-light"
          />
        </button>
        <div className="avatar">
          <img src={Avatar} alt="avatar" />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
