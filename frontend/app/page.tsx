import Link from 'next/link';
import { Church, Users, TrendingUp, CreditCard, Bell, BarChart3, Shield } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Track members, groups, and visitor follow-up with ease.',
    },
    {
      icon: CreditCard,
      title: 'Online Giving',
      description: 'Accept tithes, offerings, and donations with integrated payment processing.',
    },
    {
      icon: BarChart3,
      title: 'Attendance Tracking',
      description: 'Monitor attendance trends and get AI-powered insights.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Send targeted messages via SMS, email, and push notifications.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Visualize your church health with comprehensive dashboards.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'SOC 2 compliant with end-to-end encryption for all data.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ChurchTech</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Modern Church<br />
            <span className="text-primary">Management Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Streamline operations, grow engagement, and focus on ministry.
            Everything you need to manage your church in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-md text-lg font-medium"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful tools designed specifically for churches of all sizes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Church?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of churches already using ChurchTech to grow their ministry.
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ChurchTech SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
