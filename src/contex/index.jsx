import React, { createContext, useState, useEffect, useContext } from "react";
import { check } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isSubAdminAuthenticated, setisSubAdminAuthenticated] = useState(false);
  const [subAdminData, setsubAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("subAdminToken");

      if (!token) {
        setisSubAdminAuthenticated(false);
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const { data } = await check();
        if (data?.status !== "success") throw new Error(data?.message);
        setisSubAdminAuthenticated(true);
        setsubAdminData(data?.data?.subAdmin);
      } catch (error) {
        console.log("Token validation failed:", error.toString());
        setisSubAdminAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (
      location.pathname === "/login" &&
      localStorage.getItem("subAdminToken")
    ) {
      validateToken();
    }

    // Validate token only if not on the login page
    if (location.pathname !== "/login") {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [location.pathname, navigate]);

  const logoutSubAdmin = () => {
    localStorage.removeItem("subAdminToken");
    setisSubAdminAuthenticated(false);
    navigate("/login"); // Redirect to login on logout
  };

  const value = {
    isSubAdminAuthenticated,
    logoutSubAdmin,
    loading,
    setisSubAdminAuthenticated,
    subAdminData,
    setsubAdminData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
