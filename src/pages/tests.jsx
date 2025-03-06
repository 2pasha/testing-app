import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Edit3 } from "lucide-react";

export default function Tests() {
  const { user, loading } = useAuth(); // Get user info from context
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchTests = async () => {
      try {
        const response = await fetch("/api/tests/user-tests", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load tests");

        const data = await response.json();
        setTests(data.tests);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTests();
  }, [user]);

  if (loading) {
    return <div className="text-center text-white p-6">Loading tests...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-6">
        you must be logged in to view tests :(
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        {user.role === "teacher"
          ? "[ created tests by me ]"
          : "[ completed tests ]"}
      </h1>

      {error && <p className="text-red-700 text-center">{error}</p>}

      {user.role === "teacher" && (
        <div className="text-center mb-6">
          <Link
            href="/tests/create"
            className="px-4 py-2 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white"
          >
            + new test
          </Link>
        </div>
      )}

      {tests.length === 0 ? (
        <p className="text-center text-gray-400">No tests found.</p>
      ) : (
        <ul className="max-w-3xl mx-auto">
          {tests.map((test) => (
            console.log(test),
            
            <li
              key={test.id}
              className="border border-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{test.testName || test.Test.testName}</h2>
                <p className="text-gray-400">{test.testDescription || test.Test.testDescription}</p>
              </div>
              {user.role === "teacher" ? (
                <Link
                  href={`/tests/${test.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  <Edit3 size={24} />
                </Link>
              ) : (
                <p className="text-lg font-bold">
                  {test.score}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
