import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import TransactionDetail from "./pages/TransactionDetail";
import EditTransaction from "./pages/EditTransactions";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaction/:id"
        element={
          <ProtectedRoute>
            <TransactionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-transaction/:id"
        element={
          <ProtectedRoute>
            <EditTransaction />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
