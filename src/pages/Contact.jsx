
import { useState } from "react";
import api from "../api/axios";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await api.post("contact/", form);

      setSuccess("Your message has been sent successfully!");
      setForm(initialForm);
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto min-h-screen max-w-4xl px-6 py-20">
      <p className="mb-3 font-mono text-cyan-400">
        &gt; contact.send_message
      </p>

      <h1 className="text-4xl font-bold md:text-5xl">
        Get in <span className="text-cyan-400">Touch</span>
      </h1>

      <p className="mt-4 text-slate-400">
        Have a project or question? Send me a message.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6 md:p-10"
      >
        {[
          { name: "name", label: "Your Name", type: "text" },
          { name: "email", label: "Email Address", type: "email" },
          { name: "subject", label: "Subject", type: "text" },
        ].map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm text-slate-300"
            >
              {field.label}
            </label>

            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
              maxLength={field.name === "subject" ? 200 : undefined}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm text-slate-300"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        {success && (
          <p role="status" className="text-green-400">
            {success}
          </p>
        )}

        {error && (
          <p role="alert" className="text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-400 px-8 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
