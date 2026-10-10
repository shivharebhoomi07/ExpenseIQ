const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Health', 'Other'];

const FilterBar = ({ params, setParams }) => {
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setParams(prev => ({ ...prev, category: val === 'All' ? '' : val, page: 1 }));
  };

  return (
    <div className="filter-bar">
      <select onChange={handleCategoryChange} value={params.category || 'All'}>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input 
        type="date" 
        value={params.startDate || ''} 
        onChange={e => setParams(prev => ({ ...prev, startDate: e.target.value, page: 1 }))} 
        title="Start Date"
      />
      <input 
        type="date" 
        value={params.endDate || ''} 
        onChange={e => setParams(prev => ({ ...prev, endDate: e.target.value, page: 1 }))} 
        title="End Date"
      />
    </div>
  );
};

export default FilterBar;
