import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function ProjectDetails() {
  const { slug } = useParams();

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => (await api.get(`projects/${slug}/`)).data,
  });

  if (isLoading) {
    return <p className="p-20">Loading project...</p>;
  }

  if (isError || !project) {
    return <p className="p-20 text-red-400">Project not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/projects" className="text-cyan-400">
        ← Back to Projects
      </Link>

      <h1 className="mt-8 text-4xl font-bold">{project.title}</h1>
      <p className="mt-4 text-xl text-slate-400">{project.summary}</p>

      {project.cover_image && (
        <img
          src={project.cover_image}
          alt={project.title}
          className="mt-10 w-full rounded-xl"
        />
      )}

      <div className="mt-10 whitespace-pre-line leading-8 text-slate-300">
        {project.description}
      </div>

      <div className="mt-10 flex gap-4">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-cyan-400 px-5 py-3 text-cyan-400"
          >
            GitHub
          </a>
        )}

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          >
            Live Demo
          </a>
        )}
      </div>
    </main>
  );
}