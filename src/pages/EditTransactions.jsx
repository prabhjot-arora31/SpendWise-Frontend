import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaBackward } from "react-icons/fa";
import Header from "../components/Header";
import { onLogout } from "../utils/logout";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    type: "Expense",
    category: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/transactions/${id}`)
      .then((res) => {
        const t = res.data;
        setForm({
          title: t.title,
          amount: t.amount,
          date: t.date.split("T")[0], // format for input[type=date]
          type: t.type,
          category: t.category,
          notes: t.notes || "",
        });
        setLoading(false);
      })
      .catch(() => {
        navigate("/search");
      });
  }, [id, navigate]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    api
      .put(`/transactions/${id}`, form)
      .then(() => {
        setIsSubmitting(false);
        navigate(`/search`);
      })
      .catch((err) => {
        setIsSubmitting(false);
        alert(err.response?.data?.message || "Update failed");
      });
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header onLogout={() => onLogout(logout, dispatch, navigate)} />

      <div className="flex  items-center justify-center bg-gray-100">
        <div className="p-4 w-full max-w-xl bg-white shadow rounded">
          <div className="flex items-center gap-3 mb-6  transition-colors">
            <div
              onClick={() => navigate(-1)}
              className="hover:text-blue-600 cursor-pointer flex items-center gap-2"
            >
              <FaBackward className="text-lg" /> Back
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-2 rounded"
            />
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="border p-2 rounded"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="border p-2 rounded"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
