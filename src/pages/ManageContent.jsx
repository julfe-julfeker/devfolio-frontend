
import { useParams } from "react-router-dom";
import CrudManager from "../components/CrudManager";

const configurations = {
  // ==========================
  // SKILLS MANAGEMENT
  // ==========================
  skills: {
    title: "Manage Skills",
    endpoint: "skills/",
    initialValues: {
      name: "",
      category: "BACKEND",
      proficiency: 80,
      display_order: 0,
      is_featured: false,
    },
    fields: [
      { name: "name", label: "Skill Name", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "FRONTEND", label: "Frontend" },
          { value: "BACKEND", label: "Backend" },
          { value: "DATABASE", label: "Database" },
          { value: "DEVOPS", label: "DevOps" },
          { value: "TOOLS", label: "Tools" },
          { value: "SOFT_SKILL", label: "Soft Skill" },
        ],
      },
      {
        name: "proficiency",
        label: "Proficiency",
        type: "number",
        min: 1,
        max: 100,
        required: true,
      },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
      },
      {
        name: "is_featured",
        label: "Featured",
        type: "checkbox",
      },
    ],
  },

  // ==========================
  // PROJECTS MANAGEMENT
  // ==========================
  projects: {
    title: "Manage Projects",
    endpoint: "projects/",
    initialValues: {
      title: "",
      summary: "",
      description: "",
      category: "WEB",
      cover_image: null,
      completed_date: "",
      tech_stack: [],
      github_url: "",
      live_url: "",
      display_order: 0,
      is_featured: false,
    },
    fields: [
      { name: "title", label: "Project Title", required: true },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "WEB", label: "Web" },
          { value: "MOBILE", label: "Mobile" },
          { value: "API", label: "API" },
          { value: "ML", label: "Machine Learning" },
          { value: "OTHER", label: "Other" },
        ],
      },
      {
        name: "cover_image",
        label: "Cover Image",
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        required: true,
      },
      {
        name: "completed_date",
        label: "Completed Date",
        type: "date",
        required: true,
      },
      {
        name: "tech_stack",
        label: "Technologies / Skills",
        type: "multiselect",
        endpoint: "skills/",
        required: true,
      },
      {
        name: "github_url",
        label: "GitHub URL",
        type: "url",
      },
      {
        name: "live_url",
        label: "Live URL",
        type: "url",
      },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
      },
      {
        name: "is_featured",
        label: "Featured",
        type: "checkbox",
      },
    ],
  },

  // ==========================
  // BLOG POSTS MANAGEMENT
  // ==========================
  posts: {
    title: "Manage Blog Posts",
    endpoint: "posts/",
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      cover_image: null,
      category: "",
      tags: [],
      status: "DRAFT",
      is_featured: false,
    },
    fields: [
      { name: "title", label: "Post Title", required: true },
      {
        name: "excerpt",
        label: "Excerpt",
        type: "textarea",
        required: true,
      },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true,
      },
      {
        name: "cover_image",
        label: "Cover Image",
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "dynamicselect",
        endpoint: "categories/",
        required: true,
      },
      {
        name: "tags",
        label: "Tags",
        type: "multiselect",
        endpoint: "tags/",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "DRAFT", label: "Draft" },
          { value: "PUBLISHED", label: "Published" },
        ],
      },
      {
        name: "is_featured",
        label: "Featured",
        type: "checkbox",
      },
    ],
  },

  // ==========================
  // EXPERIENCE MANAGEMENT
  // ==========================
  experience: {
    title: "Manage Experience",
    endpoint: "experiences/",
    initialValues: {
      company: "",
      role: "",
      employment_type: "FULL_TIME",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      company_url: "",
      display_order: 0,
    },
    fields: [
      { name: "company", label: "Company", required: true },
      { name: "role", label: "Job Role", required: true },
      {
        name: "employment_type",
        label: "Employment Type",
        type: "select",
        required: true,
        options: [
          { value: "FULL_TIME", label: "Full Time" },
          { value: "PART_TIME", label: "Part Time" },
          { value: "INTERNSHIP", label: "Internship" },
          { value: "FREELANCE", label: "Freelance" },
          { value: "CONTRACT", label: "Contract" },
        ],
      },
      { name: "location", label: "Location", required: true },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        name: "end_date",
        label: "End Date",
        type: "date",
      },
      {
        name: "is_current",
        label: "Currently Working",
        type: "checkbox",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "company_url",
        label: "Company Website",
        type: "url",
      },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
      },
    ],
  },

  // ==========================
  // EDUCATION MANAGEMENT
  // ==========================
  education: {
    title: "Manage Education",
    endpoint: "education/",
    initialValues: {
      institution: "",
      degree: "",
      field_of_study: "",
      start_year: "",
      end_year: "",
      grade: "",
      description: "",
    },
    fields: [
      {
        name: "institution",
        label: "Institution",
        required: true,
      },
      { name: "degree", label: "Degree", required: true },
      {
        name: "field_of_study",
        label: "Field of Study",
        required: true,
      },
      {
        name: "start_year",
        label: "Start Year",
        type: "number",
        required: true,
      },
      {
        name: "end_year",
        label: "End Year",
        type: "number",
      },
      { name: "grade", label: "Grade" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
  },

  // ==========================
  // CATEGORY MANAGEMENT - NEW
  // ==========================
  categories: {
    title: "Manage Blog Categories",
    endpoint: "categories/",
    initialValues: {
      name: "",
      description: "",
    },
    fields: [
      {
        name: "name",
        label: "Category Name",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
  },

  // ==========================
  // TAG MANAGEMENT - NEW
  // ==========================
  tags: {
    title: "Manage Blog Tags",
    endpoint: "tags/",
    initialValues: {
      name: "",
    },
    fields: [
      {
        name: "name",
        label: "Tag Name",
        required: true,
      },
    ],
  },
};

// ==========================
// MAIN COMPONENT
// ==========================
export default function ManageContent() {
  const { type } = useParams();

  const config = configurations[type];

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-950 p-10">
        <p className="text-red-400">
          Invalid management module.
        </p>
      </div>
    );
  }

  return <CrudManager key={type} {...config} />;
}
