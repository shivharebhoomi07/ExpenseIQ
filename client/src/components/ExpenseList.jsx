import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, loading, onExpenseDeleted }) => {
  if (loading) return <p>Loading expenses...</p>;
  if (!expenses.length) return <p>No expenses found.</p>;

  return (
    <div className="card">
      <h3>Expense List</h3>
      {expenses.map(exp => (
        <ExpenseItem 
          key={exp._id} 
          expense={exp} 
          onExpenseDeleted={onExpenseDeleted} 
        />
      ))}
    </div>
  );
};

export default ExpenseList;
