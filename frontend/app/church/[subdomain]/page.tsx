import { Church, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface ChurchPageProps {
  params: { subdomain: string };
}

export default function ChurchPage({ params }: ChurchPageProps) {
  // In production, fetch church data from API
  const church = {
    name: 'Grace Community Church',
    subdomain: params.subdomain,
    description: 'Welcome to Grace Community Church! We are a vibrant community dedicated to sharing God\'s love and making disciples.',
    address: '123 Church Street',
    city: 'Nashville',
    state: 'TN',
    zip: '37201',
    phone: '(615) 555-0123',
    email: 'hello@gracecommunity.com',
    serviceTimes: [
      { day: 'Sunday', time: '9:00 AM & 11:00 AM', name: 'Worship Services' },
      { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study' },
      { day: 'Saturday', time: '6:00 PM', name: 'Youth Group' },
    ],
    leader: 'Pastor John Smith',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Church className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">{church.name}</span>
          </div>
          <Link
            href="/login"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
          >
            Church Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{church.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {church.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium">
              Join Us This Sunday
            </button>
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-md text-lg font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Service Times</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {church.serviceTimes.map((service) => (
              <div key={service.day} className="bg-white p-6 rounded-lg border shadow-sm text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-muted-foreground mt-2">{service.day}</p>
                <p className="text-lg font-medium mt-1">{service.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  {church.address}, {church.city}, {church.state} {church.zip}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">{church.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{church.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {church.name}. All rights reserved.</p>
          <p className="mt-2">Powered by ChurchTech SaaS</p>
        </div>
      </footer>
    </div>
  );
}
