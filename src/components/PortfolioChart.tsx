// 投资组合图表组件
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Portfolio } from '../types';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
];

interface PortfolioChartProps {
  portfolio: Portfolio;
}

export function PortfolioChart({ portfolio }: PortfolioChartProps) {
  const data = portfolio.balances
    .filter(b => b.usdValue && b.usdValue > 0)
    .map(b => ({
      name: b.denom.substring(0, 8),
      value: b.usdValue as number,
      fullName: b.denom,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>暂无资产数据</p>
      </div>
    );
  }

  return (
    <div className="portfolio-chart">
      <h3>资产分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `$${(entry.value as number).toLocaleString()}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${(value as number || 0).toLocaleString()}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="chart-details">
        {data.map((item, index) => (
          <div key={index} className="chart-item">
            <span className="color-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            <span className="asset-name">{item.fullName}</span>
            <span className="asset-value">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
