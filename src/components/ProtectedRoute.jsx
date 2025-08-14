import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Try Redux first, then fall back to localStorage
  const accessToken =
    useSelector((state) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

  if (!accessToken) {
    // No token → redirect to login/register page
    return (
      <>
        <Navigate to="/" replace />;
      </>
    );
  }

  return children;
}
