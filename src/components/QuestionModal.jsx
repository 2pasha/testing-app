import { useState, useEffect } from "react";

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  question,
  testId,
  pools,
}) {
  const initialQuestionData = {
    questionText: "",
    questionType: "single_choice",
    questionOptions: [],
    correctAnswer: [],
    weight: 1,
    poolId: pools.length ? pools[0].id : 1,
    testId: testId || "",
  };
  const [questionData, setQuestionData] = useState(initialQuestionData);

  const [error, setError] = useState("");

  useEffect(() => {
    if (question) {
      setQuestionData(question);
    } else {
      setQuestionData({
        questionText: "",
        questionType: "single_choice",
        questionOptions: [],
        correctAnswer: [],
        weight: 1,
        poolId: pools.length ? pools[0].id : 1,
        testId: testId || "",
      });
    }
  }, [question, testId, pools]);

  // Update options
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.questionOptions];
    updatedOptions[index] = value;
    setQuestionData({ ...questionData, questionOptions: updatedOptions });
  };

  // Add a new option
  const handleAddOption = () => {
    setQuestionData({
      ...questionData,
      questionOptions: [...questionData.questionOptions, ""],
    });
  };

  // handle multiple correct answers for multiple choise
  const handleMultipleChoiceSelection = (value) => {
    let updatedCorrectAnswers = [...questionData.correctAnswer];

    if (updatedCorrectAnswers.includes(value)) {
      // Remove if already selected
      updatedCorrectAnswers = updatedCorrectAnswers.filter(
        (answer) => answer !== value
      );
    } else {
      // Add new selection
      updatedCorrectAnswers.push(value);
    }

    setQuestionData({ ...questionData, correctAnswer: updatedCorrectAnswers });
  };

  // Update correct answer
  const handleCorrectAnswerChange = (value) => {
    if (questionData.questionType === "multiple_choice") {
      setQuestionData({
        ...questionData,
        correctAnswer: [...questionData.correctAnswer, value],
      });
    } else {
      setQuestionData({ ...questionData, correctAnswer: [value] });
    }
  };

  // Validate fields before saving
  const handleSave = () => {
    if (!questionData.questionText.trim()) {
      setError("Question text is required.");
      return;
    }

    if (!questionData.poolId) {
      setError("Please select a pool.");
      return;
    }

    if (
      questionData.questionType !== "text" &&
      questionData.questionType !== "true_false" &&
      questionData.questionOptions.length === 0
    ) {
      setError("At least one option is required.");
      return;
    }

    if ((questionData.questionType === 'text' || questionData.questionType === 'true_false') && questionData.questionOptions.length > 0) {
      setError("This question type does not require options.");
      return;
    }

    if (questionData.correctAnswer.length === 0) {
      setError("Correct answer is required.");
      return;
    }

    setError("");
    onSave(questionData);
    setQuestionData(initialQuestionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="p-6 rounded-lg w-120 max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto flex-grow px-2">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {question ? "[ edit question ]" : "[ add question ]"}
          </h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <label className="block text-sm mb-1">Question Text</label>
          <input
            type="text"
            value={questionData.questionText}
            onChange={(e) =>
              setQuestionData({ ...questionData, questionText: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
          />

          <label className="block text-sm mb-1">Select Pool</label>
          <select
            value={questionData.poolId}
            onChange={(e) =>
              setQuestionData({ ...questionData, poolId: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
          >
            {pools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                Pool {pool.id}
              </option>
            ))}
          </select>

          <label className="block text-sm mb-1">Question Type</label>
          <select
            value={questionData.questionType}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                questionType: e.target.value,
                questionOptions: [],
                correctAnswer: [],
              })
            }
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
          >
            <option value="single_choice">Single Choice</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="text">Text</option>
            <option value="true_false">True/False</option>
          </select>

          {(questionData.questionType === "single_choice" ||
            questionData.questionType === "multiple_choice") && (
            <div>
              <label className="block text-sm mb-1">Options</label>
              {questionData.questionOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-2"
                />
              ))}
              <button
                onClick={handleAddOption}
                className="bg-white border border-white text-black hover:bg-black hover:text-white px-4 py-2 rounded-md w-full mb-2"
              >
                add option
              </button>
            </div>
          )}

          <label className="block text-sm mb-1">Correct Answer</label>
          {questionData.questionType === "single_choice" ? (
            <select
              value={questionData.correctAnswer[0] || ""}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
            >
              <option value="">Select Correct Answer</option>
              {questionData.questionOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : questionData.questionType === "multiple_choice" ? (
            <div className="mb-4">
              {questionData.questionOptions.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={questionData.correctAnswer.includes(option)}
                    onChange={() => handleMultipleChoiceSelection(option)}
                    className="text-green-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : questionData.questionType === "true_false" ? (
            <select
              value={questionData.correctAnswer[0] || ""}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
            >
              <option value="">Select Correct Answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            <input
              type="text"
              value={questionData.correctAnswer[0] || ""}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
            />
          )}

          <label className="block text-sm mb-1">Question Weight</label>
          <input
            type="number"
            value={questionData.weight}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                weight: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white mb-4"
            min="1"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleSave}
            className="bg-green-700 px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-red-800 px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
