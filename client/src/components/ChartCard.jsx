const ChartCard = ({ title, children, loading }) => {
  return (
    <div className="chart-wrapper">
      <h3 style={{ marginBottom: '15px' }}>{title}</h3>
      {loading ? <p>Loading chart data...</p> : children}
    </div>
  );
};

export default ChartCard;
