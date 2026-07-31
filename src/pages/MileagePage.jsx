import MileageChart from '../components/MileageChart.jsx';

export default function MileagePage({ logs, vehicles, premium }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <MileageChart logs={logs} vehicles={vehicles} isPremium={premium} />
    </div>
  );
}
