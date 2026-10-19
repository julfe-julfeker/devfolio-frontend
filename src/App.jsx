
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import ManageContent from "./pages/ManageContent";
import DashboardComments from "./pages/DashboardComments";
import DashboardMessages from "./pages/DashboardMessages";
import ProfileEdit from "./pages/ProfileEdit";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/dashboard/comments"
            element={<DashboardComments />}
          />

          <Route
            path="/dashboard/messages"
            element={<DashboardMessages />}
          />

          <Route
            path="/dashboard/profile"
            element={<ProfileEdit />}
          />

          <Route
            path="/dashboard/:type"
            element={<ManageContent />}
          />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
