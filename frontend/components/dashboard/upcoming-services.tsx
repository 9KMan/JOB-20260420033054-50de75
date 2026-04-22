'use client';

import { Calendar, Clock, Users } from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Sunday Worship',
    date: '2024-01-14',
    time: '9:00 AM',
    type: 'Worship Service',
    expected: 850,
  },
  {
    id: 2,
    name: 'Sunday School',
    date: '2024-01-14',
    time: '10:30 AM',
    type: 'Education',
    expected: 320,
  },
  {
    id: 3,
    name: 'Wednesday Bible Study',
    date: '2024-01-17',
    time: '7:00 PM',
    type: 'Bible Study',
    expected: 180,
  },
  {
    id: 4,
    name: 'Youth Group',
    date: '2024-01-19',
    time: '6:30 PM',
    type: 'Youth',
    expected: 95,
  },
  {
    id: 5,
    name: 'Prayer Meeting',
    date: '2024-01-21',
    time: '6:00 AM',
    type: 'Prayer',
    expected: 45,
  },
];

export function UpcomingServices() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Services</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {services.slice(0, 4).map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{service.name}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  ~{service.expected}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
              {service.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
