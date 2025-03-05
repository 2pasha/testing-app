import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // Handle errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center p-6">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        {loading ? (
          <p className="text-center text-gray-400">Loading user data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">[ profile ]</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold">name: </span>
                <span>{user.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">email: </span>
                <span>{user.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">role: </span>
                <span>{user.role}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">joined: </span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
