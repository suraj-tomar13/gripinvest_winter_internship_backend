import React, { useEffect, useState } from 'react';
import { investments } from '../../api/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard({ user }) {
  const [portfolio, setPortfolio] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { portfolio, insights } = await investments.getPortfolio(token);
        setPortfolio(portfolio);
        setInsights(insights);
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [token]);

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading portfolio...</div>;
  }

  const chartData = Object.keys(insights.riskDistribution).map(risk => ({
    name: risk,
    value: insights.riskDistribution[risk] * 100,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total Investments</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">${insights.totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Number of Products</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{portfolio.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">AI Insights</h2>
          <p className="text-sm mt-2 text-gray-500">{insights.suggestion || "Your portfolio is well-diversified."}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Portfolio Risk Distribution</h2>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;