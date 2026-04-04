const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getSummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    data.forEach(item => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCategoryData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let match = {};
    if (startDate && endDate) {
      match.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }
    
    pipeline.push({
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        type: { $first: "$type" }
      },
    });
    
    pipeline.push({ $sort: { total: -1 } });

    const data = await Transaction.aggregate(pipeline);
    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyTrends = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let match = {};
    if (startDate && endDate) {
      match.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    if (category) {
      match.category = category;
    }

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }
    
    pipeline.push({
      $group: {
        _id: { 
           month: { $month: "$date" },
           type: "$type" 
        },
        total: { $sum: "$amount" },
      },
    });
    
    pipeline.push({ $sort: { "_id.month": 1 } });

    const rawData = await Transaction.aggregate(pipeline);

    // Format for easier frontend use: { month: 1, income: 100, expense: 50 }
    const months = {};
    rawData.forEach(item => {
      const m = item._id.month;
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0 };
      if (item._id.type === "income") months[m].income = item.total;
      if (item._id.type === "expense") months[m].expense = item.total;
    });

    res.json(Object.values(months));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};