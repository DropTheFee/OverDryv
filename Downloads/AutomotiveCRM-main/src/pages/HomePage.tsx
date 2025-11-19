import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, Shield, Star, Phone, MapPin, Calendar } from 'lucide-react';

const HomePage: React.FC = () => {
  const services = [
    { name: 'Oil Changes', icon: Wrench, description: 'Quick and professional oil change service' },
    { name: 'Brake Repair', icon: Shield, description: 'Complete brake system inspection and repair' },
    { name: 'Engine Diagnostics', icon: Wrench, description: 'Advanced computer diagnostics' },
    { name: 'Tire Services', icon: Wrench, description: 'Tire installation, rotation, and balancing' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Excellent service! They fixed my brake issue quickly and the price was very fair.',
    },
    {
      name: 'Mike Chen',
      rating: 5,
      text: 'Professional team and great communication throughout the repair process.',
    },
    {
      name: 'Lisa Rodriguez',
      rating: 5,
      text: 'I trust them with all my vehicle maintenance. Honest and reliable!',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Accelerate Your Shop's Success
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Streamline operations, boost efficiency, and drive profitability with intelligent workflow management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/check-in"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Service
              </Link>
              <Link 
                to="/pricing"
                className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                View Pricing
              </Link>
              <Link 
                to="/admin"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-secondary-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Professional automotive care with digital precision and transparency</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <service.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose OverDryv?</h2>
          <p className="text-lg text-gray-600">Experience the difference of intelligent automotive service management</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning-Fast Turnaround</h3>
              <p className="text-gray-600">Optimized processes and real-time tracking ensure your vehicle is serviced quickly and efficiently</p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Uncompromising Quality</h3>
              <p className="text-gray-600">Every service backed by comprehensive digital documentation and rigorous quality control</p>
            </div>
            <div className="text-center">
              <Star className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certified Excellence</h3>
              <p className="text-gray-600">ASE-certified technicians using cutting-edge diagnostic tools and proven repair methods</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real experiences from satisfied customers who trust OverDryv</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-blue-100">Ready to experience the OverDryv difference? Contact us today.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-accent-400" />
              <h3 className="text-lg font-semibold mb-2">Call Today</h3>
              <p className="text-lg">(555) 123-4567</p>
              <p className="text-sm text-blue-200">24/7 Emergency Service Available</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-accent-400" />
              <h3 className="text-lg font-semibold mb-2">Visit Our Shop</h3>
              <p>123 Main Street<br />Anytown, ST 12345</p>
              <p className="text-sm text-blue-200">Convenient Downtown Location</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-4 text-accent-400" />
              <h3 className="text-lg font-semibold mb-2">Service Hours</h3>
              <p>Mon-Fri: 8AM-6PM<br />Sat: 8AM-4PM</p>
              <p className="text-sm text-blue-200">Sunday: Emergency Only</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;