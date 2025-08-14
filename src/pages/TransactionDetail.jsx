import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTags,
  FaStickyNote,
  FaBackward,
} from "react-icons/fa";
import api from "../utils/api";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    api
      .get(`/transactions/${id}`)
      .then((res) => setTransaction(res.data))
      .catch(() => navigate("/search"));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Delete this transaction?")) {
      await api.delete(`/transactions/${id}`);
      navigate("/search");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-transaction/${id}`);
  };

  if (!transaction)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex items-center gap-3 mb-6  transition-colors">
          <div
            onClick={() => navigate(-1)}
            className="hover:text-blue-600 cursor-pointer flex items-center gap-2"
          >
            <FaBackward className="text-lg" /> Back
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaMoneyBillWave /> {transaction.title}
        </h2>

        <div className="mb-2 flex items-center gap-2">
          <strong>Amount:</strong> ₹{transaction.amount}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <strong>Type:</strong> {transaction.type}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <FaTags /> <strong>Category:</strong> {transaction.category}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <FaCalendarAlt /> <strong>Date:</strong>{" "}
          {new Date(transaction.date).toLocaleDateString()}
        </div>
        <div className="mb-4 flex items-start gap-2 items-center">
          <FaStickyNote /> <strong>Notes:</strong> {transaction.notes || "-"}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
