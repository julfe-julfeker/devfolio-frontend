
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Mail, MailOpen, Trash2, ArrowLeft } from "lucide-react";
import api from "../api/axios";

export default function DashboardMessages() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const response = await api.get("messages/");
      return response.data;
    },
  });

  const messages = Array.isArray(data)
    ? data
    : data?.results || [];

  const refreshData = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin-messages"],
    });
    queryClient.invalidateQueries({
      queryKey: ["dashboard-stats"],
    });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, is_read }) => {
      const response = await api.patch(`messages/${id}/`, {
        is_read,
      });
      return response.data;
    },
    onSuccess: () => {
      setError("");
      refreshData();
    },
    onError: (err) => {
      setError(
        err.response?.data?.detail ||
        "Failed to update message."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`messages/${id}/`);
    },
    onSuccess: () => {
      setError("");
      refreshData();
    },
    onError: (err) => {
      setError(
        err.response?.data?.detail ||
        "Failed to delete message."
      );
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this message permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-cyan-400 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Contact Messages
          </h1>
          <p className="mt-2 text-slate-400">
            Manage visitor messages and enquiries.
          </p>
        </div>

        <span className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Total: {messages.length}
        </span>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-700 bg-red-950/30 p-4 text-red-400">
          {error}
        </div>
      )}

      {isLoading && (
        <p className="mt-8 text-slate-400">
          Loading messages...
        </p>
      )}

      {isError && (
        <p className="mt-8 text-red-400">
          Failed to load messages. Check your owner login.
        </p>
      )}

      {!isLoading && !isError && messages.length === 0 && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          No contact messages found.
        </div>
      )}

      <div className="mt-8 space-y-5">
        {messages.map((message) => {
          const busy =
            updateMutation.isPending ||
            deleteMutation.isPending;

          return (
            <article
              key={message.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {message.subject || "Contact Enquiry"}
                  </h2>

                  <p className="mt-2 text-cyan-400">
                    {message.name}
                  </p>

                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 inline-block text-sm text-slate-400 hover:text-cyan-400"
                  >
                    {message.email}
                  </a>
                </div>

                <span
                  className={
                    message.is_read
                      ? "rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400"
                      : "rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400"
                  }
                >
                  {message.is_read ? "Read" : "Unread"}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap break-words text-slate-300">
                {message.message}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                {message.created_at
                  ? new Date(message.created_at).toLocaleString()
                  : ""}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    updateMutation.mutate({
                      id: message.id,
                      is_read: !message.is_read,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  {message.is_read ? (
                    <>
                      <Mail size={18} />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <MailOpen size={18} />
                      Mark Read
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleDelete(message.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
