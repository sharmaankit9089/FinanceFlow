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
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    });
    
    pipeline.push({ $sort: { "_id": 1 } });

    const data = await Transaction.aggregate(pipeline);
    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};