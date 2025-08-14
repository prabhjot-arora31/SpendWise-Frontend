import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const accessToken =
    useSelector((state) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

  if (!accessToken) {
    return (
      <>
        <Navigate to="/" replace />;
      </>
    );
  }

  return children;
}
