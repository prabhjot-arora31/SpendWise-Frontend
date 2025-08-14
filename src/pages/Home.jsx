import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  addTransaction,
} from "../features/transactions/transactionSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { onLogout } from "../utils/logout";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: transactions,
    isLoading,
    isAdding,
  } = useSelector((s) => s.transactions);
  const { user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    type: "Expense",
    category: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction({ ...form, amount: Number(form.amount) }))
      .unwrap()
      .then(() => {
        setForm({
          title: "",
          amount: "",
          date: "",
          type: "Expense",
          category: "",
          notes: "",
        });
      });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header onLogout={() => onLogout(logout, dispatch, navigate)} />
      {user && (
        <h1 className="text-2xl text-start mb-5 font-bold">
          Hello {user.name.toString().split(" ")[0]}!
        </h1>
      )}
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">₹{totalIncome}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Expense</h2>
          <p className="text-2xl font-bold text-red-600">₹{totalExpense}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Balance</h2>
          <p
            className={`text-2xl font-bold ${
              balance < 0 ? "text-red-600" : "text-blue-600"
            }`}
          >
            ₹{balance}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-4 py-8 bg-gray-100 min-h-screen">
        {/* Add Transaction Form */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add Transaction
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
            />
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
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
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
            />
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-md col-span-full hover:bg-blue-700 transition duration-200 flex justify-center items-center gap-2"
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="w-5 h-5 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Add Transaction"
              )}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Recent Transactions
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions yet</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map(
                (t, i) =>
                  i < 5 && (
                    <li
                      key={t._id}
                      className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-md px-2 transition"
                    >
                      <span className="font-medium text-gray-700">
                        {t.title}
                      </span>
                      <span
                        className={
                          t.type === "Income"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {t.type === "Income" ? "+" : "-"}₹{t.amount}
                      </span>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
