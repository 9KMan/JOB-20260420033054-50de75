'use client';

import { Users, DollarSign, UserCheck, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

const stats = [
  {
    title: 'Total Members',
    value: '1,284',
    change: '+12%',
    changeType: 'positive' as const,
    icon: <Users className="h-5 w-5 text-blue-600" />,
  },
  {
    title: 'Monthly Giving',
    value: '$48,290',
    change: '+8%',
    changeType: 'positive' as const,
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
  },
  {
    title: 'Avg Attendance',
    value: '847',
    change: '+5%',
    changeType: 'positive' as const,
    icon: <UserCheck className="h-5 w-5 text-purple-600" />,
  },
  {
    title: 'Growth Rate',
    value: '3.2%',
    change: '-1%',
    changeType: 'negative' as const,
    icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
            <span
              className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
