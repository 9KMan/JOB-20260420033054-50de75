'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', attendance: 780 },
  { month: 'Feb', attendance: 820 },
  { month: 'Mar', attendance: 795 },
  { month: 'Apr', attendance: 850 },
  { month: 'May', attendance: 830 },
  { month: 'Jun', attendance: 870 },
  { month: 'Jul', attendance: 840 },
  { month: 'Aug', attendance: 890 },
  { month: 'Sep', attendance: 920 },
  { month: 'Oct', attendance: 905 },
  { month: 'Nov', attendance: 880 },
  { month: 'Dec', attendance: 847 },
];

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
