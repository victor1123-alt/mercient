import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * RequireAdmin
 * - Simple client-side guard that checks for an `admin_token` in localStorage.
 * - Optionally validates token by calling GET /api/admin/me (eg).
 * - If not authorized, redirects to /admin/login.
 */
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        // Example verification endpoint - replace with real API
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // invalid token
          localStorage.removeItem("admin_token");
          navigate("/admin/login", { replace: true });
          return;
        }
        // optionally set global admin state here
      } catch (err) {
        console.error("Admin verification failed", err);
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [navigate]);

  if (loading) return <div className="p-6">Checking admin permissions…</div>;
  return <>{children}</>;
};

export default RequireAdmin;
