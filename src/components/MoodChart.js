// MoodChart.js
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';

export default function MoodChart({ moodStream }) {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    if (moodStream === undefined || moodStream === null) return;

    const interval = setInterval(() => {
      setDataPoints(prev => [...prev.slice(-30), moodStream]);
    }, 1000);

    return () => clearInterval(interval);
  }, [moodStream]);

  const data = {
    labels: dataPoints.map((_, i) => `${i}s`),
    datasets: [
      {
        label: 'Mood Trend (Live)',
        data: dataPoints,
        borderWidth: 2,
        borderColor: '#61dafb',
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ width: 640, maxWidth: '100%', margin: '16px auto 0' }}>
      <Line data={data} />
    </div>
  );
}
