'use client';

import { Users, DollarSign, Send, Calendar, FileText, Settings, Plug, BarChart3, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { icon: Users, label: 'Add Member', href: '/dashboard/members/new', color: 'bg-blue-500' },
  { icon: DollarSign, label: 'Record Giving', href: '/dashboard/giving/new', color: 'bg-green-500' },
  { icon: Send, label: 'Send Notification', href: '/dashboard/notifications/new', color: 'bg-purple-500' },
  { icon: Calendar, label: 'Schedule Service', href: '/dashboard/services/new', color: 'bg-orange-500' },
  { icon: FileText, label: 'Generate Report', href: '/dashboard/reports/new', color: 'bg-teal-500' },
  { icon: BarChart3, label: 'View Analytics', href: '/dashboard/analytics', color: 'bg-pink-500' },
  { icon: ClipboardList, label: 'Take Attendance', href: '/dashboard/attendance', color: 'bg-indigo-500' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', color: 'bg-gray-500' },
];

export function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-20 flex flex-col gap-2 hover:bg-slate-50"
            asChild
          >
            <a href={action.href}>
              <action.icon className={`h-5 w-5 text-white p-1 rounded ${action.color}`} />
              <span className="text-xs font-medium">{action.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
