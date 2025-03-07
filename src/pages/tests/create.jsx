import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import PoolConfigModal from "@/components/PoolConfigModal";
import QuestionModal from "@/components/QuestionModal";
import { Edit3, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";

export default function CreateTest() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [test, setTest] = useState({ testName: "", testDescription: "" });
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [pools, setPools] = useState([{ id: 1 }]);
  const [testCode, setTestCode] = useState(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Create test
  const handleCreateTest = async () => {
    const response = await fetch("/api/tests/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(test),
    });

    const data = await response.json();

    if (response.ok) {
      setTestId(data.test.id);
      setStep(2);
    } else {
      alert(data.message);
    }
  };

  // Configure Test Pools
  const handleSaveConfig = async (poolConfigs) => {
    setPools(poolConfigs);
    setIsConfigModalOpen(false);
  };

  // Add or Edit a Question
  const handleSaveQuestion = async (newQuestion) => {
    const questionWithTestId = { ...newQuestion, testId };
    let updatedQuestions;

    if (editingQuestion) {
      updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? newQuestion : q
      );
    } else {
      const response = await fetch("/api/questions/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionWithTestId),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      updatedQuestions = [...questions, data];
    }

    setQuestions(updatedQuestions);
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    const response = await fetch(`/api/questions/delete/${questionToDelete}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setQuestions(questions.filter((q) => q.id !== questionToDelete));
    } else {
      alert("Failed to delete question.");
    }

    setQuestionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Generate Test
  const handleGenerateTest = async () => {
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

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        [ create new test ]
      </h1>

      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <label className="block text-sm mb-2">test name</label>
          <input
            type="text"
            value={test.testName}
            onChange={(e) => setTest({ ...test, testName: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white mb-4"
          />

          <label className="block text-sm mb-2">test description</label>
          <textarea
            value={test.testDescription}
            onChange={(e) =>
              setTest({ ...test, testDescription: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white mb-4"
          />

          <button
            onClick={handleCreateTest}
            className="px-4 py-2 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white"
          >
            next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{test.testName}</h2>
          <p className="text-gray-400 mb-6">{test.testDescription}</p>

          <div className="flex justify-center items-center space-x-3">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
            >
              configure test
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white"
            >
              add questions
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">manage questions</h2>

          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-md w-full"
          >
            add question
          </button>

          <ul className="mt-6">
            {questions.map((q) => (
              <li
                key={q.id}
                className="bg-zinc-700 p-4 rounded-md mb-4 flex items-center justify-between"
              >
                <p>{q.questionText}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingQuestion(q);
                      setIsQuestionModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Edit3 size={24} />
                  </button>
                  <button
                    onClick={() => {
                      console.log(q);
                      setQuestionToDelete(q.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 border border-white text-white rounded-md hover:bg-white hover:text-black"
            >
              configure test
            </button>

            <button
              onClick={() => setStep(4)}
              title={
                questions.length === 0 ? "add some question" : "generate test"
              }
              disabled={questions.length === 0}
              className={`bg-white border border-white text-black hover:bg-black hover:text-white px-4 py-3 rounded-md ${
                questions.length === 0 ? "cursor-not-allowed" : ""
              }`}
            >
              generate test
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Test Ready!</h2>
          {testCode ? (
            <>
              <p className="text-gray-400 mb-4">Share this test link:</p>
              <input
                type="text"
                value={`${window.location.origin}/tests/${testCode}`}
                readOnly
                className="w-full bg-gray-700 text-center py-2 rounded-md"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/tests/${testCode}`
                  )
                }
                className="bg-blue-500 px-6 py-3 rounded-md w-full mt-4"
              >
                Copy Link
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerateTest}
              className="bg-green-500 px-6 py-3 rounded-md w-full"
            >
              Generate Test
            </button>
          )}
        </div>
      )}

      <PoolConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConfig}
      />
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        question={editingQuestion}
        testId={testId}
        pools={pools}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteQuestion}
      />
    </div>
  );
}
