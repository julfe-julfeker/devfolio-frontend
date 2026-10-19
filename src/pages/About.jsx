import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function About() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await api.get("profile/")).data,
  });

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => (await api.get("skills/")).data,
  });

  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => (await api.get("experiences/")).data,
  });

  const skillList = Array.isArray(skills) ? skills : skills?.results || [];
  const experienceList = Array.isArray(experiences)
    ? experiences
    : experiences?.results || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-cyan-400">&gt; about.me</p>
      <h1 className="mt-4 text-5xl font-bold">About Me</h1>

      {isLoading ? (
        <p className="mt-8">Loading profile...</p>
      ) : profile ? (
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-cyan-400">
            {profile.full_name}
          </h2>
          <p className="mt-3 text-xl text-slate-300">{profile.headline}</p>
          <p className="mt-6 whitespace-pre-line leading-8 text-slate-400">
            {profile.bio}
          </p>
          <p className="mt-5 text-slate-400">
            Location: {profile.location}
          </p>
        </section>
      ) : (
        <p className="mt-8 text-slate-400">Profile unavailable.</p>
      )}

      <section className="mt-16">
        <h2 className="mb-6 text-3xl font-bold">Technical Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skillList.map((skill) => (
            <span
              key={skill.id}
              className="rounded-lg border border-cyan-900 bg-slate-900 px-4 py-2 text-cyan-400"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-8 text-3xl font-bold">Work Experience</h2>
        <div className="space-y-6">
          {experienceList.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-bold">{item.role}</h3>
              <p className="mt-2 text-cyan-400">{item.company}</p>
              <p className="mt-3 whitespace-pre-line text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}