
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("devfolio-theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("devfolio-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === "dark" ? "light" : "dark");
  };

  return (
    <div className={`min-h-screen ${
      theme === "dark"
        ? "bg-slate-950 text-white"
        : "bg-slate-50 text-slate-900"
    }`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
