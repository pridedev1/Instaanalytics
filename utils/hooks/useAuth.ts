import { useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { ADMIN_USER, ADMIN_PASS } from "../constants";

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  // Add other user properties as needed
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userCookie = getCookie("userData");
    if (userCookie) {
      try {
        const userData = JSON.parse(String(userCookie));
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = (userData: Omit<AuthUser, "isAdmin">, password?: string) => {
    const isAdmin = userData.email === ADMIN_USER && password === ADMIN_PASS;
    const fullUserData: AuthUser = {
      ...userData,
      isAdmin,
    };

    setCookie("userData", JSON.stringify(fullUserData), {
      maxAge: 7 * 24 * 60 * 60,
    }); // Cookie expires in 7 days
    setUser(fullUserData);
  };

  const logout = () => {
    deleteCookie("userData");
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
  };
};
