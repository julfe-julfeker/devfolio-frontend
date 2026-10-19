import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function ProtectedRoute() {
  const token = sessionStorage.getItem("access_token");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["owner-me", token],
    queryFn: async () => (await api.get("auth/me/")).data,
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <p className="p-20 text-center text-slate-400">
        Verifying owner access...
      </p>
    );
  }

  if (isError || !data?.is_superuser) {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}