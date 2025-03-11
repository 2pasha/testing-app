import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function TestPage() {
  const router = useRouter();
  const { testCode } = router.query;
  const { user, loading } = useAuth();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/login?redirectTo=/tests/pass/${testCode}`);
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/test/${testCode}`);
        if (!response.ok) throw new Error("Failed to fetch test");
        const data = await response.json();
        setTest(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (testCode) fetchTest();
  }, [user, testCode, loading]);

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers((prev) => {
      if (type === "multiple_choice") {
        const currentAnswers = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: currentAnswers.includes(value)
            ? currentAnswers.filter((v) => v !== value) // Remove if unchecked
            : [...currentAnswers, value], // Add if checked
        };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId), // Ensure questionId is a number
          studentAnswer: Array.isArray(answer) ? answer : [answer], // Always send an array
        })
      );
      
      console.log("Submitting answers:", JSON.stringify(formattedAnswers, null, 2));
      
      const response = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.testId,
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit test");

      const result = await response.json();
      setScore(result.score);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!test) return <p>Loading test...</p>;

  return (
    <div className="p-4">
      <h1 className="max-w-6xl mx-auto text-2xl font-bold mb-4">
        {test.testName}
      </h1>
      <p className="max-w-6xl mx-auto text-gray-400 mb-4">
        {test.testDescription}
      </p>

      {score !== null ? (
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Your Score: {score}</h2>
          <button
            className="mt-4 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => router.push("/profile")}
          >
            Back to Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-4">
          {test.questions.map((q, index) => (
            <div key={q.id} className="border p-3 rounded-md">
              <p className="font-semibold">
                <span className="font-bold">{index + 1}) </span>{" "}
                {q.questionText}
              </p>

              {/* Single Choice */}
              {q.questionType === "single_choice" && q.questionOptions.length
                ? q.questionOptions.map((option) => (
                    <label key={option} className="block">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        onChange={() =>
                          handleAnswerChange(q.id, option, "single_choice")
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))
                : null}

              {/* Multiple Choice */}
              {q.questionType === "multiple_choice" && q.questionOptions.length
                ? q.questionOptions.map((option) => (
                    <label key={option} className="block">
                      <input
                        type="checkbox"
                        value={option}
                        onChange={() =>
                          handleAnswerChange(q.id, option, "multiple_choice")
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))
                : null}

              {/* True/False */}
              {q.questionType === "true_false" ? (
                <div>
                  <label className="block">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value="True"
                      onChange={() =>
                        handleAnswerChange(q.id, "True", "true_false")
                      }
                      className="mr-2"
                    />
                    True
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value="False"
                      onChange={() =>
                        handleAnswerChange(q.id, "False", "true_false")
                      }
                      className="mr-2"
                    />
                    False
                  </label>
                </div>
              ) : null}

              {/* Text Input */}
              {q.questionType === "text" ? (
                <textarea
                  className="w-full px-2 py-1 mt-2 rounded-md bg-gray-700 text-white"
                  placeholder="Enter your answer..."
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value, "text")
                  }
                />
              ) : null}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 mt-4 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </form>
      )}
    </div>
  );
}
