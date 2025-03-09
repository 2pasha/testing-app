import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QuestionModal from "@/components/QuestionModal";
import { Check, ClipboardCopy, Edit3, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";
import PoolConfigModal from "@/components/PoolConfigModal";

export default function TestDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [test, setTest] = useState(null);
  const [testCode, setTestCode] = useState(null);
  const [error, setError] = useState("");
  const [pools, setPools] = useState([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`/api/tests/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load test details");

        const data = await response.json();
        setTest(data.test);
        setPools(
          data.test.TestConfigs || [{ poolId: 1, numberOfQuestions: 1 }]
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTestDetails();
  }, [id]);

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (questionData) => {
    if (!questionData.testId) {
      console.error("Error: Missing test ID in handleSaveQuestion");
      alert("Error: Test ID is missing. Cannot save question.");
      return;
    }

    if (questionData.id) {
      // ✅ Update existing question (PUT request)
      const response = await fetch(`/api/questions/update/${questionData.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        setTest((prevTest) => ({
          ...prevTest,
          questions: prevTest.questions.map((q) =>
            q.id === questionData.id ? questionData : q
          ),
        }));
      } else {
        alert("Failed to update question.");
      }
    } else {
      // ✅ Create new question (POST request)
      const response = await fetch(`/api/questions/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();

      if (response.ok) {
        setTest((prevTest) => ({
          ...prevTest,
          questions: [...prevTest.questions, data], // ✅ Add new question to list
        }));
      } else {
        alert("Failed to add question.");
      }
    }

    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = async () => {
    const response = await fetch(`/api/questions/delete/${questionToDelete}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setTest((prevTest) => ({
        ...prevTest,
        questions: prevTest.questions.filter((q) => q.id !== questionToDelete),
      }));
    } else {
      alert("Failed to delete question");
    }

    setQuestionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveConfig = async (poolConfigs) => {
    const testId = test.id;

    if (!testId) {
      alert("Error: Test ID is missing");
      console.error("Missing testId:", testId);
      return;
    }

    const responce = await fetch("/api/test/test-config", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId, poolConfigs }),
    });

    const data = await responce.json();

    if (responce.ok) {
      setPools(data.configs);
      setTest((prevTest) => ({
        ...prevTest,
        TestConfigs: data.configs, // ✅ Add new pool to list
      }));
      setIsConfigModalOpen(false);
    } else {
      console.error(data.message || "Failed to save test configuration.");
    }
  };

  const handleGenerateTest = async () => {
    const { questions, id: testId } = test;

    if (questions.length === 0) {
      alert("Error: You must add at least one question to test");
      return;
    }

    const response = await fetch("/api/test/generate-test", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId }),
    });

    const data = await response.json();

    if (response.ok) {
      setTestCode(data.testCode);
    } else {
      alert(data.message);
    }
  };

  const testLink = `${window.location.origin}/test/${testCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(testLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

  if (!test) {
    return (
      <div className="text-center text-white p-6">Loading test details...</div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">{test.testName}</h1>
      <p className="text-center text-gray-400 mb-6">{test.testDescription}</p>

      <h2 className="max-w-4xl mx-auto text-2xl font-semibold mb-4">
        [ test pools ]
      </h2>
      {pools.length === 0 ? (
        <p className="text-gray-400">No pools found.</p>
      ) : (
        <ul className="max-w-4xl mx-auto">
          {pools.map((pool) => (
            <li
              key={pool.poolId}
              className="border border-white p-4 rounded-lg shadow-md mb-4"
            >
              <p className="font-semibold">Pool {pool.poolId}</p>
              <p className="text-gray-400">
                Number of Questions: {pool.numberOfQuestions}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
        >
          configure test
        </button>
      </div>

      <h2 className="max-w-4xl mx-auto text-2xl font-semibold mb-4 mt-6">
        [ questions ]
      </h2>
      {test.questions.length === 0 ? (
        <p className="max-w-4xl mx-auto text-gray-400">No questions found.</p>
      ) : (
        <>
          <ul className="max-w-4xl mx-auto">
            {test.questions.map((question) => (
              <li
                key={question.id}
                className="border border-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{question.questionText}</p>
                  <div>
                    <p className="text-gray-300">
                      Type: {question.questionType.split("_").join(" ")}
                    </p>
                    <p className="text-gray-300">
                      Pool:{" "}
                      {test.TestConfigs.find(
                        (conf) => conf.id === question.poolId
                      )?.poolId || "Unknown"}
                    </p>
                  </div>

                  <div className="mt-2">
                    <strong>Options:</strong>
                    {Array.isArray(question.questionOptions) ? (
                      <ul className="ml-4">
                        {question.questionOptions.map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No options (Text-based question)
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <strong>Correct Answer(s):</strong>
                    {Array.isArray(question.correctAnswer) ? (
                      <ul className="ml-4">
                        {question.correctAnswer.map((answer, index) => (
                          <li key={index} className="text-green-400">
                            {answer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">{question.correctAnswer}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="cursor-pointer"
                  >
                    <Edit3 size={25} />
                  </button>
                  <button
                    onClick={() => {
                      setQuestionToDelete(question.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 size={25} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="max-w-4xl mx-auto flex flex-col">
        <button
          onClick={() => setIsQuestionModalOpen(true)}
          className="border border-white text-white hover:bg-white hover:text-black mt-3 px-6 py-3 rounded-md"
        >
          add question
        </button>

        <button
          onClick={handleGenerateTest}
          className="mt-6 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white px-6 py-3"
        >
          generate test
        </button>

        {testCode && (
          <>
            <p className="text-gray-400 mt-4 mb-2">share this test link:</p>
            <div className="relative w-full">
              {/* ✅ Input with copy icon */}
              <input
                type="text"
                value={testLink}
                readOnly
                className="w-full bg-gray-700 text-center py-2 pr-10 rounded-md text-white"
              />

              {/* ✅ Copy Icon */}
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {copySuccess ? (
                  <Check size={20} />
                ) : (
                  <ClipboardCopy size={20} />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <h2 className="max-w-4xl mx-auto text-2xl font-semibold mt-6 mb-4">
        [ test results ]
      </h2>
      <p className="max-w-4xl mx-auto text-gray-400">
        Results will be displayed here...
      </p>

      {/* Question Edit Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        question={editingQuestion}
        testId={test.id}
        pools={pools}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteQuestion}
      />
      <PoolConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConfig}
        initialPools={pools}
      />
    </div>
  );
}
