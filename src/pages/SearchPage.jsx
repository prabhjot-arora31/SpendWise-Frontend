import { useDispatch, useSelector } from "react-redux";
import { searchTransactions } from "../features/transactions/transactionSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaList,
  FaTags,
  FaCalendarAlt,
  FaFilter,
  FaBackward,
  FaTimes,
} from "react-icons/fa";

export default function SearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, isLoading, totalPages, currentPage } = useSelector(
    (s) => s.transactions
  );

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    search: "",
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Dispatch search
  const search = (newFilters) => {
    dispatch(searchTransactions(newFilters));
  };

  // Handle search input change (always visible)
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setFilters((prev) => {
      const updated = { ...prev, search: value, page: 1 };
      search(updated);
      return updated;
    });
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value, page: 1 };
      search(updated);
      return updated;
    });
  };

  // Fetch initial data on mount
  useEffect(() => {
    search(filters);
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6  transition-colors">
        <div
          onClick={() => navigate(-1)}
          className="hover:text-blue-600 cursor-pointer flex items-center gap-2"
        >
          <FaBackward className="text-lg" /> Back
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Search Transactions</h1>
      {/* Search Input + Filter Icon */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={filters.search}
            onChange={handleSearchInput}
            className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {!showFilters && (
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
          >
            <FaFilter />
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-300 shadow rounded-lg p-4 mb-6 ">
          <h2 className="text-lg font-semibold mb-4  items-center gap-2 flex justify-between">
            <div className="flex items-center gap-2">
              {" "}
              <FaFilter className="text-blue-500" /> Filters
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setShowFilters(false)}
            >
              <FaTimes size={22} />
            </div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-1">
                <FaList className="text-gray-500" />
                <span className="leading-none">Type</span>
              </label>

              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1 mb-2">
                <FaTags className="text-gray-500" />
                <span className="leading-none">Category</span>
              </label>

              <input
                name="category"
                placeholder="e.g. electronics, clothes"
                value={filters.category}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium flex items-center gap-1 mb-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="leading-none">Start Date</span>
              </label>

              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-1">
                <FaCalendarAlt className="text-gray-500" />
                <span className="leading-none">End Date</span>
              </label>

              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mt-11"></div>
      ) : searchResults && searchResults.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {searchResults &&
            searchResults.map((t) => (
              <li
                key={t._id}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-gray-500">
                    {t.category} — {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/transaction/${t._id}`)}
                  className="text-blue-500 hover:underline"
                >
                  View More
                </button>
              </li>
            ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setFilters((prev) => {
                  const newFilters = { ...prev, page: i + 1 };
                  search(newFilters);
                  return newFilters;
                });
              }}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
