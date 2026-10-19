
import { NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur ${
        isDark
          ? "border-slate-800 bg-slate-950/90"
          : "border-slate-200 bg-white/90"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <NavLink to="/" className="text-2xl font-bold text-cyan-500">
          DevFolio
          <span className={isDark ? "text-white" : "text-slate-900"}>
            .
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-500"
                  : isDark
                    ? "text-slate-300 hover:text-cyan-400"
                    : "text-slate-700 hover:text-cyan-600"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className={`rounded-lg p-2 ${
              isDark
                ? "bg-slate-800 text-yellow-400"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className={`space-y-4 border-t px-6 py-5 md:hidden ${
            isDark
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block hover:text-cyan-500"
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
