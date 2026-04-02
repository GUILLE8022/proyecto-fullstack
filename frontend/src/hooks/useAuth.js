import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");

  const login = (token) => {
    localStorage.setItem("token", token);
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};