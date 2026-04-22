'use client';

import { DashboardNav } from '@/components/layout/dashboard-nav';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { GivingChart } from '@/components/dashboard/giving-chart';
import { UpcomingServices } from '@/components/dashboard/upcoming-services';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>

        <div className="grid gap-8">
          {/* Stats Cards */}
          <StatsCards />

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
              <AttendanceChart />
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Giving Overview</h3>
              <GivingChart />
            </div>
          </div>

          {/* Upcoming Services & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <UpcomingServices />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
