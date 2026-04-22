'use client';

import Link from 'next/link';
import { Bell, Church, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/members', label: 'Members' },
  { href: '/dashboard/giving', label: 'Giving' },
  { href: '/dashboard/services', label: 'Services' },
  { href: '/dashboard/integrations', label: 'Integrations' },
  { href: '/dashboard/reports', label: 'Reports' },
];

export function DashboardNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ChurchTech</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-primary">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 pl-4 border-l">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">Pastor John</span>
              </div>
            </div>
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-4 border-t mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
