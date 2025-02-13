import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './earnings.css';
import Loading from '../loading/loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Earnings = ({ userId, month, year }) => {
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchWeeklyEarnings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backUrl}/revenue/weekly/${userId}/${month}/${year}`);
        setWeeklyEarnings(response.data);
      } catch (err) {
        setError('Erro ao carregar os dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyEarnings();
  }, [userId, month, year]);

  const data = {
    labels: weeklyEarnings.map((week) => `Semana ${week.week}`),
    datasets: [
      {
        label: 'Ganhos Semanais (R$)',
        data: weeklyEarnings.map((week) => week.earnings),
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Ganhos Semanais - ${month}/${year}`,
      },
    },
  };

  if (isLoading) {
    if (isLoading) return <div><Loading /></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div id='earning-container'>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Earnings;
