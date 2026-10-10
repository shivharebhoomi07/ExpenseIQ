import * as expenseApi from '../api/expenseApi';

const ExpenseItem = ({ expense, onExpenseDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expenseApi.deleteExpense(expense._id);
        onExpenseDeleted();
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div className="expense-item">
      <div>
        <strong>{expense.description}</strong> - {expense.category}
        <br />
        <small>{new Date(expense.date).toLocaleDateString()}</small>
      </div>
      <div>
        <span style={{ fontWeight: 'bold', marginRight: '15px' }}>
          ${expense.amount.toFixed(2)}
        </span>
        <button onClick={handleDelete} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
