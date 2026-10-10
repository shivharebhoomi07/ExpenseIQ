import { useExpenses } from '../hooks/useExpenses';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';

const Expenses = () => {
  const { expenses, loading, pagination, params, setParams, reload } = useExpenses({ page: 1, limit: 10 });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <div>
        <ExpenseForm onExpenseAdded={reload} />
      </div>
      <div>
        <FilterBar params={params} setParams={setParams} />
        <ExpenseList 
          expenses={expenses} 
          loading={loading} 
          onExpenseDeleted={reload} 
        />
        <div className="pagination">
          <button 
            disabled={pagination.page <= 1} 
            onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
          >
            Prev
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button 
            disabled={pagination.page >= pagination.pages} 
            onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
