
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-bold text-cyan-400">
        404
      </h1>

      <h2 className="mt-6 text-3xl font-bold text-white">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-slate-400">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
