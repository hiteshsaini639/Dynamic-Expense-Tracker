const { JSON } = require("sequelize");
const { cp } = require("fs");
const Expense = require("../models/expense");

exports.addExpense = (req, res, next) => {
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;
  Expense.create({
    amount: amount,
    category: category,
    description: description,
  })
    .then((expense) => res.send(expense))
    .catch((err) => console.log(err));
};

exports.getExpenses = (req, res, next) => {
  Expense.findAll()
    .then((expenses) => {
      res.send(expenses);
    })
    .catch((err) => console.log(err));
};

exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  Expense.findByPk(expenseId)
    .then((expense) => {
      return expense.destroy();
    })
    .then(() => res.send())
    .catch((err) => console.log(err));
};

exports.editExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  const updatedAmount = req.body.amount;
  const updatedCategory = req.body.category;
  const updatedDesc = req.body.description;
  Expense.findByPk(expenseId)
    .then((expense) => {
      expense.amount = updatedAmount;
      expense.category = updatedCategory;
      expense.description = updatedDesc;
      return expense.save();
    })
    .then(() => res.send())
    .catch((err) => console.log(err));
};
