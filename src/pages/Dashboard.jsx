import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("dashboard/stats/")).data,
    retry: false,
  });

  const logout = async () => {
    const refresh = sessionStorage.getItem("refresh_token");

    try {
      if (refresh) {
        await api.post("auth/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const stats = [
    { label: "Total Projects", value: data?.total_projects },
    { label: "Total Posts", value: data?.total_posts },
    { label: "Published Posts", value: data?.published_posts },
    { label: "Pending Comments", value: data?.pending_comments },
    { label: "Unread Messages", value: data?.unread_messages },
    
  ];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-cyan-400">
            &gt; admin.dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Owner Dashboard
          </h1>
        </div>

        <button
          onClick={logout}
          className="rounded-lg border border-red-500 px-5 py-3 text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>

      {isLoading && (
        <p className="mt-10 text-slate-400">
          Loading dashboard statistics...
        </p>
      )}

      {isError && (
        <p className="mt-10 text-red-400">
          Dashboard API is unavailable. Check /api/dashboard/stats/.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">
                {item.label}
              </p>

              <p className="mt-4 text-3xl font-bold text-cyan-400">
                {item.value ?? "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-14 text-2xl font-bold">
        Management
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Manage Projects", url: "/dashboard/projects" },
          { title: "Manage Posts", url: "/dashboard/posts" },
          { title: "Manage Skills", url: "/dashboard/skills" },
          { title: "Manage Experience", url: "/dashboard/experience" },
          { title: "Manage Education", url: "/dashboard/education" },
          { title: "Manage Comments", url: "/dashboard/comments" },
          { title: "Contact Messages", url: "/dashboard/messages" },
          { title: "Edit Profile", url: "/dashboard/profile" },
          { title: "Manage Categories", url: "/dashboard/categories" },
          { title: "Manage Tags", url: "/dashboard/tags" },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-400"
          >
            <h3 className="font-semibold">{item.title} →</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}