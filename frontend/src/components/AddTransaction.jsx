import { useState } from "react";
import axios from "axios";

function AddTransaction() {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: "",
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/transactions",
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Added!");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input
        placeholder="Amount"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <select
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Category"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white p-2 rounded w-full"
      >
        Add
      </button>
    </div>
  );
}

export default AddTransaction;