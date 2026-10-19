
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart, Send, CornerDownRight } from "lucide-react";
import api from "../api/axios";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400";

function getList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function BlogDetails() {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    website: "",
    content: "",
  });

  const [commentMessage, setCommentMessage] = useState("");
  const [likeMessage, setLikeMessage] = useState("");

  // ==============================
  // BLOG DETAILS
  // ==============================
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const response = await api.get(`posts/${slug}/`);
      return response.data;
    },
  });

  // ==============================
  // APPROVED COMMENTS AND REPLIES
  // ==============================
  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async () => {
      const response = await api.get("comments/", {
        params: { post: slug },
      });
      return response.data;
    },
    enabled: Boolean(post?.id),
    refetchOnMount: "always",
  });

  const comments = getList(commentsData).filter(
    (comment) =>
      Number(comment.post?.id ?? comment.post) ===
        Number(post?.id) &&
      comment.is_approved === true &&
      !comment.parent
  );

  // ==============================
  // LIKE / UNLIKE
  // ==============================
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `posts/${slug}/like/`
      );
      return response.data;
    },

    onSuccess: (data) => {
      setLikeMessage(
        data?.liked === false
          ? "Like removed."
          : "Thank you for liking this post!"
      );

      queryClient.invalidateQueries({
        queryKey: ["post", slug],
      });
    },

    onError: (error) => {
      setLikeMessage(
        error.response?.data?.detail ||
          "Unable to update like."
      );
    },
  });

  // ==============================
  // SUBMIT NEW COMMENT
  // ==============================
  const commentMutation = useMutation({
    mutationFn: async (values) => {
      const response = await api.post("comments/", {
        ...values,
        post: post.id,
      });

      return response.data;
    },

    onSuccess: () => {
      setForm({
        name: "",
        email: "",
        website: "",
        content: "",
      });

      setCommentMessage(
        "Comment submitted successfully. It will appear after approval."
      );

      queryClient.invalidateQueries({
        queryKey: ["comments", post?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-comments"],
      });
    },

    onError: (error) => {
      const details = error.response?.data;

      setCommentMessage(
        details
          ? JSON.stringify(details)
          : "Unable to submit comment."
      );
    },
  });

  const handleComment = (event) => {
    event.preventDefault();

    setCommentMessage("");

    commentMutation.mutate(form);
  };

  // ==============================
  // LOADING / ERROR
  // ==============================
  if (isLoading) {
    return (
      <p className="p-20 text-slate-300">
        Loading article...
      </p>
    );
  }

  if (isError || !post) {
    return (
      <p className="p-20 text-red-400">
        Article not found.
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        to="/blog"
        className="text-cyan-400 hover:underline"
      >
        ← Back to Blog
      </Link>

      {/* ==============================
          ARTICLE DETAILS
      ============================== */}
      <article>
        <h1 className="mt-8 text-4xl font-bold leading-tight md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-5 text-lg text-slate-400">
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
          {post.published_at && (
            <span>
              {new Date(
                post.published_at
              ).toLocaleDateString()}
            </span>
          )}

          {post.reading_time && (
            <span>
              {post.reading_time} min read
            </span>
          )}

          {post.views_count !== undefined && (
            <span>
              {post.views_count} views
            </span>
          )}
        </div>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="mt-10 w-full rounded-xl object-cover"
          />
        )}

        <div className="mt-10 whitespace-pre-wrap break-words leading-8 text-slate-300">
          {post.content}
        </div>
      </article>

      {/* ==============================
          LIKE SECTION
      ============================== */}
      <section className="mt-12 border-t border-slate-800 pt-8">
        <button
          type="button"
          onClick={() => {
            setLikeMessage("");
            likeMutation.mutate();
          }}
          disabled={likeMutation.isPending}
          className="inline-flex items-center gap-3 rounded-lg border border-rose-500 px-5 py-3 text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
        >
          <Heart size={20} />

          {likeMutation.isPending
            ? "Please wait..."
            : "Like this post"}
        </button>

        {post.likes_count !== undefined && (
          <span className="ml-4 text-slate-400">
            {post.likes_count} likes
          </span>
        )}

        {likeMessage && (
          <p className="mt-3 text-sm text-slate-300">
            {likeMessage}
          </p>
        )}
      </section>

      {/* ==============================
          COMMENTS AND REPLIES
      ============================== */}
      <section className="mt-12 border-t border-slate-800 pt-10">
        <h2 className="text-2xl font-bold">
          Comments
        </h2>

        {commentsLoading && (
          <p className="mt-5 text-slate-400">
            Loading comments...
          </p>
        )}

        {commentsError && (
          <p className="mt-5 text-red-400">
            Could not load comments.
          </p>
        )}

        {!commentsLoading &&
          !commentsError &&
          comments.length === 0 && (
            <p className="mt-5 text-slate-400">
              No approved comments yet.
            </p>
          )}

        <div className="mt-6 space-y-5">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              {/* Main Comment Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-semibold text-cyan-400">
                  {comment.name}
                </h3>

                {comment.created_at && (
                  <span className="text-xs text-slate-500">
                    {new Date(
                      comment.created_at
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Main Comment Content */}
              <p className="mt-3 whitespace-pre-wrap break-words text-slate-300">
                {comment.content}
              </p>

              {/* ==============================
                  APPROVED REPLIES
              ============================== */}
              {Array.isArray(comment.replies) &&
                comment.replies.length > 0 && (
                  <div className="mt-5 space-y-3 border-l-2 border-cyan-500 pl-4 md:pl-6">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-lg border border-slate-700 bg-slate-800 p-4"
                      >
                        {/* Reply Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <CornerDownRight
                              size={18}
                              className="text-cyan-400"
                            />

                            <h4 className="font-semibold text-cyan-400">
                              {reply.name}
                            </h4>

                            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                              Reply
                            </span>
                          </div>

                          {reply.created_at && (
                            <span className="text-xs text-slate-500">
                              {new Date(
                                reply.created_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Reply Content */}
                        <p className="mt-3 whitespace-pre-wrap break-words text-slate-300">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </section>

      {/* ==============================
          LEAVE A COMMENT
      ============================== */}
      <section className="mt-12 border-t border-slate-800 pt-10">
        <h2 className="text-2xl font-bold">
          Leave a Comment
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Your email address will not be published.
          Comments require approval.
        </p>

        <form
          onSubmit={handleComment}
          className="mt-7 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          {/* Name and Email */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">
                Name
              </label>

              <input
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="mb-2 block text-sm">
              Website (Optional)
            </label>

            <input
              type="url"
              value={form.website}
              onChange={(event) =>
                setForm({
                  ...form,
                  website: event.target.value,
                })
              }
              className={inputClass}
              placeholder="https://example.com"
            />
          </div>

          {/* Comment Text */}
          <div>
            <label className="mb-2 block text-sm">
              Comment
            </label>

            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(event) =>
                setForm({
                  ...form,
                  content: event.target.value,
                })
              }
              className={inputClass}
              placeholder="Write your comment..."
            />
          </div>

          {/* Submission Message */}
          {commentMessage && (
            <p className="break-words text-sm text-cyan-400">
              {commentMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={commentMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
          >
            <Send size={18} />

            {commentMutation.isPending
              ? "Submitting..."
              : "Submit Comment"}
          </button>
        </form>
      </section>
    </main>
  );
}
