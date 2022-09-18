const express = require("express");
const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/add-expense", expenseController.addExpense);

router.put("/edit-expense/:expenseId", expenseController.editExpense);

router.delete("/delete-expense/:expenseId", expenseController.deleteExpense);

router.get("/get-expenses", expenseController.getExpenses);

module.exports = router;
