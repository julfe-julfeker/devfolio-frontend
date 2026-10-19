
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const MAX_AVATAR_SIZE = 10 * 1024 * 1024;
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const emptyProfile = {
  full_name: "",
  headline: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  github_url: "",
  linkedin_url: "",
  x_url: "",
  website_url: "",
  years_of_experience: 0,
  is_available_for_hire: true,
};

const fields = [
  ["full_name", "Full Name", "text", true],
  ["headline", "Headline", "text", true],
  ["email", "Email", "email", true],
  ["phone", "Phone", "text", false],
  ["location", "Location", "text", true],
  ["github_url", "GitHub URL", "url", false],
  ["linkedin_url", "LinkedIn URL", "url", false],
  ["x_url", "X / Twitter URL", "url", false],
  ["website_url", "Website URL", "url", false],
  [
    "years_of_experience",
    "Years of Experience",
    "number",
    false,
  ],
];

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400";

export default function ProfileEdit() {
  const [form, setForm] = useState(emptyProfile);

  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);

  const [existingAvatar, setExistingAvatar] = useState("");
  const [existingResume, setExistingResume] = useState("");

  const [avatarPreview, setAvatarPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await api.get("profile/");

        if (!active) return;

        const data = response.data;

        setForm({
          ...emptyProfile,
          ...data,
        });

        setExistingAvatar(data.avatar || "");
        setExistingResume(data.resume || "");
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load profile."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Generate preview and release object URL
  useEffect(() => {
    if (!avatar) {
      setAvatarPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(avatar);

    setAvatarPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [avatar]);

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Validate profile picture
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setAvatar(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WebP images are allowed."
      );

      setAvatar(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError(
        "Profile picture must not exceed 10 MB."
      );

      setAvatar(null);
      e.target.value = "";
      return;
    }

    setAvatar(file);
  };

  // Validate resume
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setResume(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      file.type !== ""
    ) {
      setError("Only PDF files are allowed.");
      setResume(null);
      e.target.value = "";
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Resume must be a PDF file.");
      setResume(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setError(
        "Resume must not exceed 5 MB."
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();

      Object.keys(emptyProfile).forEach((key) => {
        let value = form[key];

        if (key === "years_of_experience") {
          value =
            value === "" || value == null
              ? 0
              : Number(value);
        }

        if (key === "is_available_for_hire") {
          value = value ? "true" : "false";
        }

        payload.append(key, value ?? "");
      });

      if (avatar) {
        payload.append("avatar", avatar);
      }

      if (resume) {
        payload.append("resume", resume);
      }

      const response = await api.patch(
        "profile/",
        payload
      );

      const updatedProfile = response.data;

      setForm({
        ...emptyProfile,
        ...updatedProfile,
      });

      setExistingAvatar(
        updatedProfile.avatar || ""
      );

      setExistingResume(
        updatedProfile.resume || ""
      );

      setAvatar(null);
      setResume(null);

      setSuccess(
        "Profile updated successfully!"
      );
    } catch (err) {
      const data = err.response?.data;

      setError(
        data
          ? JSON.stringify(data, null, 2)
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-10 text-white">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 text-white">
      <Link
        to="/dashboard"
        className="text-cyan-400 hover:underline"
      >
        ← Dashboard
      </Link>

      <h1 className="mt-6 text-4xl font-bold">
        Edit Profile
      </h1>

      <p className="mt-2 text-slate-400">
        Update your portfolio information.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        {/* PROFILE FIELDS */}
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map(
            ([name, label, type, required]) => (
              <div key={name}>
                <label className="mb-2 block text-sm text-slate-300">
                  {label}
                </label>

                <input
                  type={type}
                  value={form[name] ?? ""}
                  required={required}
                  min={
                    type === "number"
                      ? 0
                      : undefined
                  }
                  onChange={(e) =>
                    updateField(
                      name,
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            )
          )}
        </div>

        {/* BIOGRAPHY */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Biography
          </label>

          <textarea
            rows={7}
            required
            value={form.bio ?? ""}
            onChange={(e) =>
              updateField(
                "bio",
                e.target.value
              )
            }
            className={inputClass}
          />
        </div>

        {/* AVAILABILITY */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(
                form.is_available_for_hire
              )}
              onChange={(e) =>
                updateField(
                  "is_available_for_hire",
                  e.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-400"
            />

            Available for Hire
          </label>
        </div>

        {/* AVATAR AND RESUME */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* AVATAR */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Profile Picture (Max 10 MB)
            </label>

            {(avatarPreview || existingAvatar) && (
              <div className="mb-4">
                <img
                  src={
                    avatarPreview ||
                    existingAvatar
                  }
                  alt="Profile Avatar"
                  className="h-32 w-32 rounded-full border-2 border-cyan-400 object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleAvatarChange}
              className={inputClass}
            />

            {avatar && (
              <p className="mt-2 text-sm text-cyan-400">
                Selected: {avatar.name}
                {" ("}
                {(
                  avatar.size /
                  (1024 * 1024)
                ).toFixed(2)}
                {" MB)"}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Supported formats: JPG, PNG,
              WebP. Maximum 10 MB.
            </p>
          </div>

          {/* RESUME */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Resume PDF (Max 5 MB)
            </label>

            {existingResume && (
              <a
                href={existingResume}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 block text-cyan-400 underline"
              >
                View Current Resume
              </a>
            )}

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              className={inputClass}
            />

            {resume && (
              <p className="mt-2 text-sm text-cyan-400">
                Selected: {resume.name}
                {" ("}
                {(
                  resume.size /
                  (1024 * 1024)
                ).toFixed(2)}
                {" MB)"}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Only PDF files. Maximum 5 MB.
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <pre className="whitespace-pre-wrap rounded-lg bg-red-950/40 p-4 text-sm text-red-400">
            {error}
          </pre>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="text-green-400">
            {success}
          </p>
        )}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-cyan-400 px-8 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Update Profile"}
        </button>
      </form>
    </main>
  );
}
