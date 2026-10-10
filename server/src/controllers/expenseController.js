import Expense from '../models/Expense.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    // Execute query and count concurrently
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip(Number(skip)).limit(Number(limit)),
      Expense.countDocuments(query)
    ]);

    res.json({
      expenses,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;
    
    if (!amount || !category || !description || !date) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description,
      date
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Ensure user owns this expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    next(error);
  }
};
