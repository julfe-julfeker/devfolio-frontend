
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("auth/login/", {
        username: username.trim(),
        password,
      });

      if (!data.access || !data.refresh) {
        throw new Error("Login API did not return JWT tokens.");
      }

      sessionStorage.setItem("access_token", data.access);
      sessionStorage.setItem("refresh_token", data.refresh);

      // Check whether the logged-in user is the owner
      let user = data.user;

      if (!user) {
        const response = await api.get("auth/me/");
        user = response.data;
      }

      if (!user?.is_superuser) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setError("Owner access only.");
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");

      const status = err.response?.status;

      if (status === 400 || status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Login failed. Please try again."
        );
      }

      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold">Owner Login</h1>

        <input
          className="mt-8 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-cyan-400 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
