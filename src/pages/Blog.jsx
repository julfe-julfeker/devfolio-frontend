import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const PAGE_SIZE = 6;

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.results || [];

const getCategoryId = (item) => {
  const value = item?.category;
  if (value && typeof value === "object") {
    return String(value.id ?? value.slug ?? "");
  }
  return String(value ?? "");
};

const getCategoryName = (post, categoryList) => {
  if (post.category && typeof post.category === "object") {
    return post.category.name || "Uncategorized";
  }
  const matchingCategory = categoryList.find(
    (item) => String(item.id) === getCategoryId(post) ||
      String(item.slug ?? "") === getCategoryId(post)
  );
  return (
    post.category_name ||
    matchingCategory?.name ||
    "Uncategorized"
  );
};

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [ordering, setOrdering] = useState("newest");
  const [page, setPage] = useState(1);

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("posts/", {
        params: { page_size: 1000 },
      });
      return response.data;
    },
    retry: false,
  });

  const categoriesQuery = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const response = await api.get("categories/", {
        params: { page_size: 1000 },
      });
      return response.data;
    },
    retry: false,
  });

  const posts = normalizeList(postsQuery.data);
  const categories = normalizeList(categoriesQuery.data);
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");

  const filteredPosts = publishedPosts
    .filter((post) => {
      const keyword = search.trim().toLowerCase();
      const categoryName = getCategoryName(post, categories);
      const matchesSearch = `
        ${post.title || ""}
        ${post.excerpt || ""}
        ${categoryName}
      `.toLowerCase().includes(keyword);

      const selectedCategory = categories.find(
        (item) => String(item.id) === category
      );
      const postCategory = getCategoryId(post);
      const matchesCategory =
        category === "ALL" ||
        postCategory === category ||
        (selectedCategory &&
          postCategory === String(selectedCategory.slug ?? ""));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (ordering === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (ordering === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      const dateA = new Date(a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.published_at || b.created_at || 0).getTime();
      return ordering === "oldest" ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const visiblePosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, category, ordering]);

  const isLoading = postsQuery.isLoading || categoriesQuery.isLoading;
  const isError = postsQuery.isError || categoriesQuery.isError;

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-6 py-20">
      <p className="mb-3 font-mono text-cyan-400">&gt; devfolio.blog</p>
      <h1 className="text-4xl font-bold md:text-5xl">
        My <span className="text-cyan-400">Blog</span>
      </h1>
      <p className="mt-4 text-slate-400">My latest articles and tutorials.</p>

      {/* SEARCH, CATEGORY FILTER & SORT */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <input
          type="search"
          placeholder="Search blog posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categoriesQuery.isLoading}
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Categories</option>
          {categories.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title_asc">Title A–Z</option>
          <option value="title_desc">Title Z–A</option>
        </select>
      </div>

      {/* CATEGORY SHORTCUTS */}
      {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("ALL")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              category === "ALL"
                ? "border-cyan-400 bg-cyan-400 text-slate-950"
                : "border-slate-700 text-slate-300 hover:border-cyan-400"
            }`}
          >
            All Categories
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(String(item.id))}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === String(item.id)
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-slate-700 text-slate-300 hover:border-cyan-400"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {isLoading && <p className="mt-10 text-slate-400">Loading posts...</p>}
      {isError && (
        <p className="mt-10 text-red-400">
          Failed to load blog posts or categories. Please check the API.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <p className="mt-6 text-sm text-slate-400">
            Showing {visiblePosts.length} of {filteredPosts.length} published posts
          </p>

          {filteredPosts.length === 0 ? (
            <p className="mt-10 text-slate-400">No published posts found.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-cyan-400"
                >
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="mb-3 text-xs uppercase text-cyan-400">
                      {getCategoryName(post, categories)}
                    </p>
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>{post.reading_time || 1} min read</span>
                      {post.published_at && (
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-6 inline-block font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`rounded-lg px-4 py-2 ${
                      page === number
                        ? "bg-cyan-400 font-semibold text-slate-950"
                        : "border border-slate-700 text-white"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
