const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
  expenseItem: {
    type: String,
    required: true
  },
  expensePrice: {
    type: Number,
    required: true
  },
  expenseType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expenses', ExpenseSchema);
