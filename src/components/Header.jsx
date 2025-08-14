import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../SpendWiseLogo.png";
const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
      <img
        src={img}
        width={140}
        className="cursor-pointer"
        onClick={() => navigate("/home")}
      />

      <div className="flex gap-3">
        {window.location.pathname !== "/search" && (
          <button
            onClick={() => navigate("/search")}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            🔍 Search
          </button>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
