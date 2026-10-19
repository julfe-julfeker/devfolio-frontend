
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api/axios";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400";

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function getId(value) {
  if (value && typeof value === "object") {
    return value.id;
  }
  return value;
}

function DynamicMultiSelect({ field, value, onChange }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["field-options", field.endpoint],
    queryFn: async () =>
      (await api.get(field.endpoint)).data,
    enabled: Boolean(field.endpoint),
  });

  const options = field.endpoint
    ? normalizeList(data)
    : field.options || [];

  const selected = Array.isArray(value)
    ? value.map(getId).map(String)
    : [];

  return (
    <div>
      <select
        multiple
        size={Math.min(Math.max(options.length, 3), 8)}
        value={selected}
        required={field.required}
        disabled={isLoading || isError}
        onChange={(e) => {
          const values = Array.from(
            e.target.selectedOptions,
            (option) => Number(option.value)
          );
          onChange(values);
        }}
        className={inputClass}
      >
        {options.map((option) => (
          <option
            key={option.id ?? option.value}
            value={option.id ?? option.value}
          >
            {option.name ?? option.label}
          </option>
        ))}
      </select>

      <p className="mt-1 text-xs text-slate-400">
        Ctrl চেপে একাধিক Skill নির্বাচন করো।
      </p>

      {isLoading && (
        <p className="text-sm text-slate-400">
          Loading skills...
        </p>
      )}

      {isError && (
        <p className="text-sm text-red-400">
          Could not load skills.
        </p>
      )}
    </div>
  );
}

function DynamicSingleSelect({ field, value, onChange }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["field-options", field.endpoint],
    queryFn: async () => (await api.get(field.endpoint)).data,
  });
  const options = normalizeList(data);
  return (
    <select
      className={inputClass}
      value={value ?? ""}
      required={field.required}
      disabled={isLoading || isError}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
    >
      <option value="">{isLoading ? "Loading..." : isError ? "Could not load options" : "Select category"}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}
    </select>
  );
}

export default function CrudManager({
  title,
  endpoint,
  fields,
  initialValues,
}) {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState(null);
  const usesSlug = ["projects/", "posts/", "categories/", "tags/"].includes(endpoint);
  const [form, setForm] = useState(() => ({
    ...initialValues,
  }));
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manage", endpoint],
    queryFn: async () => (await api.get(endpoint)).data,
  });

  const items = normalizeList(data);

  useEffect(() => {
    setEditingId(null);
    setForm({ ...initialValues });
    setMessage("");
    setFormError(null);
  }, [endpoint, initialValues]);

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...initialValues });
    setFormError(null);
  };

  const saveMutation = useMutation({
    mutationFn: async ({ values, id }) => {
      const hasFile = fields.some(
        (field) =>
          field.type === "file" &&
          values[field.name] instanceof File
      );

      const payload = {};

      for (const field of fields) {
        const name = field.name;
        let value = values[name];

        if (field.type === "file") {
          if (value instanceof File) {
            payload[name] = value;
          }
          continue;
        }

        if (field.type === "multiselect") {
          payload[name] = Array.isArray(value)
            ? value.map(getId)
            : [];
          continue;
        }

        if (field.type === "number") {
          value =
            value === "" || value == null
              ? null
              : Number(value);
        }


        if (endpoint === "experiences/" && name === "end_date") {
          payload[name] = values.is_current ? null : (value || null);
        } else if (value !== undefined) {
          payload[name] = value;
        }
      }


      let body = payload;

      if (hasFile) {
        const formData = new FormData();

        for (const [key, value] of Object.entries(payload)) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(key, String(item));
            });
          } else if (value !== null && value !== undefined) {
            formData.append(
              key,
              typeof value === "boolean"
                ? String(value)
                : value
            );
          }
        }

        body = formData;
      }

      const url = id
        ? `${endpoint}${encodeURIComponent(id)}/`
        : endpoint;
      // Axios sets multipart boundary automatically for FormData.
      const config = {};

      if (id) {
        return api.patch(url, body, config);
      }

return api.post(url, body, config);
},

onSuccess: () => {
  queryClient.invalidateQueries();
  resetForm();
  setMessage("Saved successfully.");
  window.scrollTo({ top: 0, behavior: "smooth" });
},

    onError: (error) => {
      setFormError(
        error.response?.data || {
          detail: error.message,
        }
      );
    },
  });

  const deleteMutation = useMutation({
  mutationFn: async (id) =>
    api.delete(`${endpoint}${encodeURIComponent(id)}/`),

    onSuccess: () => {
      queryClient.invalidateQueries();
      setMessage("Deleted successfully.");
      setFormError(null);
    },

    onError: (error) => {
      setFormError(
        error.response?.data || {
          detail: error.message,
        }
      );
    },
  });

  const handleEdit = (item) => {
    setEditingId(usesSlug ? item.slug : item.id);

    const values = { ...initialValues };

    fields.forEach((field) => {
      if (field.type === "file") {
        values[field.name] = null;
      } else if (field.type === "multiselect") {
        const current = item[field.name];

        values[field.name] = Array.isArray(current)
          ? current.map(getId)
          : [];
      } else {
        values[field.name] =
          item[field.name] ??
          initialValues[field.name] ??
          "";
      }
    });

    setForm(values);
    setMessage("");
    setFormError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setFormError(null);

    saveMutation.mutate({
      values: form,
      id: editingId,
    });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this item?"
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <Link
        to="/dashboard"
        className="text-cyan-400"
      >
        ← Dashboard
      </Link>

      <h1 className="mt-6 text-4xl font-bold">
        {title}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <h2 className="text-xl font-semibold">
          {editingId
            ? "Edit Item"
            : "Add New Item"}
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm text-slate-300">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={form[field.name] ?? ""}
                  required={field.required}
                  onChange={(e) =>
                    updateField(
                      field.name,
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  value={form[field.name] ?? ""}
                  required={field.required}
                  onChange={(e) =>
                    updateField(
                      field.name,
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select
                  </option>

                  {field.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "dynamicselect" ? (
                <DynamicSingleSelect
                  field={field}
                  value={form[field.name]}
                  onChange={(value) => updateField(field.name, value)}
                />
              ) : field.type === "multiselect" ? (
                <DynamicMultiSelect
                  field={field}
                  value={form[field.name]}
                  onChange={(value) =>
                    updateField(
                      field.name,
                      value
                    )
                  }
                />
              ) : field.type === "file" ? (
                <div>
                  <input
                    type="file"
                    accept={field.accept}
                    required={
                      Boolean(field.required) &&
                      !editingId
                    }
                    onChange={(e) =>
                      updateField(
                        field.name,
                        e.target.files?.[0] || null
                      )
                    }
                    className={inputClass}
                  />

                  {editingId && (
                    <p className="mt-1 text-xs text-slate-400">
                      নতুন File না দিলে আগের File থাকবে।
                    </p>
                  )}
                </div>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(
                    form[field.name]
                  )}
                  onChange={(e) =>
                    updateField(
                      field.name,
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-cyan-400"
                />
              ) : (
                <input
  type={field.type || "text"}
  value={form[field.name] ?? ""}
  required={field.required}
  min={field.min}
  max={field.max}
  onChange={(e) =>
    updateField(field.name, e.target.value)
  }
  className={inputClass}
/>
                
              )}
            </div>
          ))}
        </div>

        {message && (
          <p className="text-green-400">
            {message}
          </p>
        )}

        {formError && (
          <pre className="overflow-auto whitespace-pre-wrap text-sm text-red-400">
            {JSON.stringify(
              formError,
              null,
              2
            )}
          </pre>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {saveMutation.isPending
              ? "Saving..."
              : editingId
              ? "Update"
              : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-700 px-6 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-bold">
          Existing Items
        </h2>

        {isLoading && <p>Loading...</p>}

        {isError && (
          <p className="text-red-400">
            Unable to load items.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div>
                <h3 className="font-semibold">
                  {item.title ||
                    item.name ||
                    `Item #${item.id}`}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.summary ||
                    item.excerpt ||
                    item.category ||
                    ""}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(item)
                  }
                  className="rounded-lg border border-cyan-400 px-4 py-2 text-cyan-400"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(usesSlug ? item.slug : item.id)
                  }
                  disabled={deleteMutation.isPending}
                  className="rounded-lg border border-red-500 px-4 py-2 text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!isLoading &&
            !isError &&
            items.length === 0 && (
              <p className="text-slate-400">
                No items found.
              </p>
            )}
        </div>
      </section>
    </main>
  );
}
