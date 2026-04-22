'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', giving: 42000 },
  { month: 'Feb', giving: 38000 },
  { month: 'Mar', giving: 45000 },
  { month: 'Apr', giving: 52000 },
  { month: 'May', giving: 47000 },
  { month: 'Jun', giving: 51000 },
  { month: 'Jul', giving: 49000 },
  { month: 'Aug', giving: 53000 },
  { month: 'Sep', giving: 48000 },
  { month: 'Oct', giving: 55000 },
  { month: 'Nov', giving: 52000 },
  { month: 'Dec', giving: 48290 },
];

export function GivingChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Giving']}
        />
        <Bar dataKey="giving" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
