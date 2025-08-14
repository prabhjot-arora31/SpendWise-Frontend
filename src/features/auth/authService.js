import api from "../../utils/api";

const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  if (res.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return res.data;
};

const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  if (res.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export default { register, login, logout };
