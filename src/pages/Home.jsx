
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.results || [];

function SectionTitle({ label, title, description }) {
  return (
    <div className="mb-10">
      <p className="mb-2 font-mono text-sm text-cyan-400">
        {label}
      </p>
      <h2 className="text-3xl font-bold md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function LoadingMessage() {
  return <p className="text-slate-400">Loading...</p>;
}

function ErrorMessage() {
  return (
    <p className="text-red-400">
      Unable to load data. Please check the API.
    </p>
  );
}

export default function Home() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await api.get("profile/")).data,
    retry: false,
  });

  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: async () => (await api.get("skills/")).data,
  });

  const experienceQuery = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => (await api.get("experiences/")).data,
  });

  const educationQuery = useQuery({
    queryKey: ["education"],
    queryFn: async () => (await api.get("education/")).data,
    retry: false,
  });

  const projectsQuery = useQuery({
    queryKey: ["home-projects"],
    queryFn: async () => (await api.get("projects/")).data,
  });

  const postsQuery = useQuery({
    queryKey: ["home-posts"],
    queryFn: async () => (await api.get("posts/")).data,
  });

  const profile = profileQuery.data;
  const skills = normalizeList(skillsQuery.data);
  const experiences = normalizeList(experienceQuery.data);
  const educations = normalizeList(educationQuery.data);

  const projects = normalizeList(projectsQuery.data)
    .filter((project) => project.is_featured)
    .slice(0, 3);

  const posts = normalizeList(postsQuery.data)
    .filter((post) => post.status === "PUBLISHED")
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at) -
        new Date(a.published_at || a.created_at)
    )
    .slice(0, 3);

  return (
    <div className="text-white">
      {/* HERO SECTION */}
      <section className="mx-auto flex min-h-[75vh] max-w-7xl flex-col justify-center px-6 py-24">
        <p className="mb-5 font-mono text-cyan-400">
          &gt; Hello, World!
        </p>

        {profileQuery.isLoading ? (
          <LoadingMessage />
        ) : profileQuery.isError || !profile ? (
          <div>
            <h1 className="text-5xl font-bold">
              Welcome to DevFolio
            </h1>
            <p className="mt-4 text-slate-400">
              Profile information is not available yet.
            </p>
          </div>
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                I'm{" "}
                <span className="text-cyan-400">
                  {profile.full_name}
                </span>
              </h1>

              <h2 className="mt-6 text-2xl text-slate-300 md:text-3xl">
                {profile.headline}
              </h2>

              <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-slate-400">
                {profile.bio}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  View Projects →
                </Link>

                <Link
                  to="/contact"
                  className="rounded-lg border border-slate-700 px-6 py-3 hover:border-cyan-400"
                >
                  Contact Me
                </Link>

                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-700 px-6 py-3 hover:border-cyan-400"
                  >
                    Download Resume
                  </a>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-slate-400">
                {[
                  ["GitHub", profile.github_url],
                  ["LinkedIn", profile.linkedin_url],
                  ["Website", profile.website_url],
                ].map(([label, url]) =>
                  url ? (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400"
                    >
                      {label}
                    </a>
                  ) : null
                )}
              </div>
            </div>

            {profile.avatar && (
              <div className="flex justify-center">
                <img
                  src={profile.avatar}
                  alt={profile.full_name}
                  className="h-64 w-64 rounded-full border-4 border-cyan-400 object-cover shadow-lg shadow-cyan-900/30 md:h-72 md:w-72"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="01 / ABOUT"
            title="About Me"
            description="A little more about my background and experience."
          />

          {profile ? (
            <>
              <p className="max-w-4xl whitespace-pre-line leading-8 text-slate-300">
                {profile.bio}
              </p>

              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="text-3xl font-bold text-cyan-400">
                    {profile.years_of_experience || 0}+
                  </p>
                  <p className="text-sm text-slate-400">
                    Years of Experience
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-bold text-cyan-400">
                    {profile.location}
                  </p>
                  <p className="text-sm text-slate-400">
                    Location
                  </p>
                </div>

                <div>
                  <p className="text-lg font-semibold text-cyan-400">
                    {profile.is_available_for_hire
                      ? "Available for Hire"
                      : "Currently Unavailable"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-400">
              Profile information is unavailable.
            </p>
          )}

          <Link
            to="/about"
            className="mt-8 inline-block text-cyan-400 hover:underline"
          >
            More About Me →
          </Link>
        </div>
      </section>

      {/* SKILLS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="02 / SKILLS"
            title="My Skills"
            description="Technologies and tools I work with."
          />

          {skillsQuery.isLoading ? (
            <LoadingMessage />
          ) : skillsQuery.isError ? (
            <ErrorMessage />
          ) : skills.length === 0 ? (
            <p className="text-slate-400">
              No skills added yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
                >
                  <div className="mb-3 flex justify-between gap-3">
                    <h3 className="font-semibold">
                      {skill.name}
                    </h3>

                    <span className="text-cyan-400">
                      {skill.proficiency}%
                    </span>
                  </div>

                  <p className="mb-4 text-xs text-slate-500">
                    {skill.category}
                  </p>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, skill.proficiency)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="03 / EXPERIENCE"
            title="Work Experience"
          />

          {experienceQuery.isLoading ? (
            <LoadingMessage />
          ) : experienceQuery.isError ? (
            <ErrorMessage />
          ) : experiences.length === 0 ? (
            <p className="text-slate-400">
              No experience added yet.
            </p>
          ) : (
            <div className="space-y-8 border-l-2 border-cyan-400/40 pl-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <span className="absolute -left-[41px] top-2 h-4 w-4 rounded-full bg-cyan-400" />

                  <p className="text-sm text-cyan-400">
                    {exp.start_date} —{" "}
                    {exp.is_current
                      ? "Present"
                      : exp.end_date || "N/A"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {exp.role}
                  </h3>

                  <p className="mt-1 text-slate-300">
                    {exp.company} • {exp.location}
                  </p>

                  <p className="mt-3 whitespace-pre-line text-slate-400">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="04 / EDUCATION"
            title="My Education"
            description="My academic background and qualifications."
          />

          {educationQuery.isLoading ? (
            <LoadingMessage />
          ) : educationQuery.isError ? (
            <ErrorMessage />
          ) : educations.length === 0 ? (
            <p className="text-slate-400">No education added yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
                >
                  <p className="mb-3 font-mono text-sm text-cyan-400">
                    {edu.start_year || "N/A"} — {edu.end_year || "Present"}
                  </p>
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="mt-2 font-semibold text-cyan-400">
                    {edu.institution}
                  </p>
                  {edu.field_of_study && (
                    <p className="mt-3 text-slate-300">{edu.field_of_study}</p>
                  )}
                  {edu.grade && (
                    <p className="mt-3 text-sm text-slate-400">Grade: {edu.grade}</p>
                  )}
                  {edu.description && (
                    <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="05 / PROJECTS"
            title="Featured Projects"
          />

          {projectsQuery.isLoading ? (
            <LoadingMessage />
          ) : projectsQuery.isError ? (
            <ErrorMessage />
          ) : projects.length === 0 ? (
            <p className="text-slate-400">
              No featured projects yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-cyan-400"
                >
                  {project.cover_image && (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <p className="text-xs text-cyan-400">
                      {project.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-400">
                      {project.summary}
                    </p>

                    <span className="mt-5 inline-block text-cyan-400">
                      View Project →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/projects"
            className="mt-8 inline-block text-cyan-400 hover:underline"
          >
            View All Projects →
          </Link>
        </div>
      </section>

      {/* LATEST BLOG POSTS */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            label="06 / BLOG"
            title="Latest Blog Posts"
          />

          {postsQuery.isLoading ? (
            <LoadingMessage />
          ) : postsQuery.isError ? (
            <ErrorMessage />
          ) : posts.length === 0 ? (
            <p className="text-slate-400">
              No published posts yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 transition hover:border-cyan-400"
                >
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-400">
                      {post.excerpt}
                    </p>

                    <p className="mt-4 text-xs text-cyan-400">
                      {post.reading_time || 1} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/blog"
            className="mt-8 inline-block text-cyan-400 hover:underline"
          >
            Read All Posts →
          </Link>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-cyan-400">
            07 / CONTACT
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Let's Work Together
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            Have a project in mind or want to collaborate?
            I'd love to hear from you.
          </p>

          <Link
            to="/contact"
            className="mt-10 inline-block rounded-lg bg-cyan-400 px-8 py-4 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Get In Touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
