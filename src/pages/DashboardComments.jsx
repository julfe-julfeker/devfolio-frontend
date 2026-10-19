
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquareReply,
  Send,
} from "lucide-react";
import api from "../api/axios";

export default function DashboardComments() {
  const queryClient = useQueryClient();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyName, setReplyName] = useState("Admin");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const response = await api.get("comments/inbox/");
      return response.data;
    },
  });

  const comments = Array.isArray(data)
    ? data
    : data?.results || [];

  const refreshComments = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin-comments"],
    });
    queryClient.invalidateQueries({
      queryKey: ["comments"],
    });
    queryClient.invalidateQueries({
      queryKey: ["dashboard-stats"],
    });
  };

  const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data === "object" && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(", ")
            : String(value);
          return `${key}: ${message}`;
        })
        .join(" | ");
    }

    return fallback;
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, approved }) => {
      const response = await api.patch(
        `comments/${id}/`,
        { is_approved: approved }
      );
      return response.data;
    },
    onSuccess: () => {
      setError("");
      refreshComments();
    },
    onError: (err) => {
      setError(
        getErrorMessage(err, "Failed to update comment.")
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`comments/${id}/`);
    },
    onSuccess: () => {
      setError("");
      refreshComments();
    },
    onError: (err) => {
      setError(
        getErrorMessage(err, "Failed to delete comment.")
      );
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(
        "comments/",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      setError("");
      setSuccess(
        "Reply submitted successfully. It is pending approval."
      );
      setReplyTo(null);
      setReplyContent("");
      refreshComments();
    },
    onError: (err) => {
      setError(
        getErrorMessage(err, "Failed to submit reply.")
      );
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this comment permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  const openReplyForm = (comment) => {
    setError("");
    setSuccess("");
    setReplyContent("");

    if (replyTo === comment.id) {
      setReplyTo(null);
    } else {
      setReplyTo(comment.id);
    }
  };

  const handleReplySubmit = (event, comment) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!replyName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!replyEmail.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!replyContent.trim()) {
      setError("Please write a reply.");
      return;
    }

    replyMutation.mutate({
      post: comment.post,
      parent: comment.id,
      name: replyName.trim(),
      email: replyEmail.trim(),
      website: "",
      content: replyContent.trim(),
    });
  };

  if (isLoading) {
    return (
      <p className="p-8 text-slate-400">
        Loading comments...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="p-8 text-red-400">
        Failed to load comments. Check owner login.
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Comment Management
        </h1>
        <p className="mt-2 text-slate-400">
          Approve, reject, reply to and delete blog comments.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-lg border border-red-700 p-4 text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-5 rounded-lg border border-green-700 p-4 text-green-400">
          {success}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-slate-400">
          No comments found.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-cyan-400">
                    {comment.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Comment #{comment.id} • Post #{comment.post}
                  </p>

                  {comment.parent && (
                    <p className="mt-1 text-xs text-purple-400">
                      Reply to Comment #{comment.parent}
                    </p>
                  )}
                </div>

                <span
                  className={
                    comment.is_approved
                      ? "rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400"
                      : "rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400"
                  }
                >
                  {comment.is_approved
                    ? "Approved"
                    : "Pending"}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap text-slate-300">
                {comment.content}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {!comment.is_approved && (
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: comment.id,
                        approved: true,
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                )}

                {comment.is_approved && (
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: comment.id,
                        approved: false,
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                )}

                {!comment.parent && (
                  <button
                    onClick={() => openReplyForm(comment)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    <MessageSquareReply size={18} />
                    {replyTo === comment.id
                      ? "Cancel Reply"
                      : "Reply"}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>

              {replyTo === comment.id && (
                <form
                  onSubmit={(event) =>
                    handleReplySubmit(event, comment)
                  }
                  className="mt-6 space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5"
                >
                  <h3 className="font-semibold text-white">
                    Reply to {comment.name}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={replyName}
                        onChange={(event) =>
                          setReplyName(event.target.value)
                        }
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={replyEmail}
                        onChange={(event) =>
                          setReplyEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Your Reply
                    </label>
                    <textarea
                      rows={4}
                      value={replyContent}
                      onChange={(event) =>
                        setReplyContent(event.target.value)
                      }
                      placeholder="Write your reply here..."
                      required
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={replyMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                  >
                    <Send size={18} />
                    {replyMutation.isPending
                      ? "Submitting..."
                      : "Submit Reply"}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
