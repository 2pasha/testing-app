import { useState } from "react";

export default function PoolConfigModal({
  isOpen,
  onClose,
  onSave,
  initialPools,
}) {
  const [pools, setPools] = useState(
    initialPools || [{ poolId: 1, numberOfQuestions: 1 }]
  );

  const handleAddPool = () => {
    setPools([...pools, { poolId: pools.length + 1, numberOfQuestions: 1 }]);
  };

  const handleUpdatePool = (index, field, value) => {
    const updatedPools = [...pools];
    updatedPools[index][field] = value;
    setPools(updatedPools);
  };

  const handleSave = () => {
    onSave(pools);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="border border-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          [ configure test pools ]
        </h2>

        {pools.map((pool, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm mb-1">
              pool {index + 1} - number of questions
            </label>
            <input
              type="number"
              value={pool.numberOfQuestions}
              onChange={(e) =>
                handleUpdatePool(
                  index,
                  "numberOfQuestions",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
              min="1"
            />
          </div>
        ))}

        <button
          onClick={handleAddPool}
          className="border border-white text-white hover:bg-white hover:text-black px-4 py-2 rounded-md w-full mb-4"
        >
          add pool
        </button>

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-white border border-white text-black rounded-md hover:bg-black hover:text-white px-4 py-2"
          >
            /save
          </button>
          <button onClick={onClose} className="bg-red-700 px-4 py-2 rounded-md">
            /cancel
          </button>
        </div>
      </div>
    </div>
  );
}
