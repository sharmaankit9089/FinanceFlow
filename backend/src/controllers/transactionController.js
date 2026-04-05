const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // --- INPUT VALIDATION ---
    if (!amount || !type || !category || !date) {
       return res.status(400).json({ message: "All fields are required (amount, type, category, date)" });
    }

    if (amount <= 0) {
       return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    if (!["income", "expense"].includes(type)) {
       return res.status(400).json({ message: "Invalid type. Must be 'income' or 'expense'" });
    }
    // ------------------------

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      user: req.user.id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    if (error.name === "ValidationError") {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { 
      type, 
      category, 
      startDate, 
      endDate, 
      search, 
      sortBy = "date", 
      order = -1, 
      page = 1, 
      limit = 10 
    } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      filter.$or = [
        { notes: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const skipIdx = (page - 1) * limit;

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ [sortBy]: parseInt(order) })
      .skip(skipIdx)
      .limit(parseInt(limit))
      .populate("user", "name email");

    res.json({
      transactions,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};