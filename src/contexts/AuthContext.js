import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Custom Hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        });

        if (!response.ok) throw new Error("Not authenticated");

        const userData = await response.json();
        setUser(userData); // Set user data globally
      } catch {
        setUser(null); // Clear user if error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function that updates auth state immediately
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // Send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      // Fetch user profile immediately after login
      const userProfile = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!userProfile.ok) throw new Error("Failed to get user profile");

      const userData = await userProfile.json();
      setUser(userData); // Update auth state immediately
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout function that clears auth state
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null); // Remove user from state
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
