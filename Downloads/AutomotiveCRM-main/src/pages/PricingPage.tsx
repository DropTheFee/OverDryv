import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Zap, Crown, Building2 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTrial = (planName: string) => {
    alert(`Starting 14-day free trial for ${planName} plan! Redirecting to setup...`);
    navigate('/admin');
  };

  const handleContactSales = () => {
    alert('Redirecting to sales contact form...');
    // In production, this would open a contact form or redirect to sales
  };

  const handleScheduleDemo = () => {
    alert('Opening demo scheduler...');
    // In production, this would open a calendar booking widget
  };

  const plans = [
    {
      name: 'Starter',
      price: 99,
      icon: Zap,
      color: 'emerald',
      description: 'Perfect for small independent shops',
      features: [
        'Up to 2 technicians',
        'Basic work order management',
        'Customer database (1,000 customers)',
        'Digital check-in process',
        'Basic inventory tracking',
        'Email notifications',
        'Mobile-responsive interface',
        'Basic reporting',
        'Phone support (business hours)'
      ],
      limitations: [
        'No SMS notifications',
        'No advanced analytics',
        'No integrations',
        'No marketing tools'
      ]
    },
    {
      name: 'Professional',
      price: 199,
      icon: Star,
      color: 'blue',
      popular: true,
      description: 'Most popular for growing shops',
      features: [
        'Up to 8 technicians',
        'Advanced work order management',
        'Unlimited customers',
        'Complete parts inventory system',
        'Automated reorder alerts',
        'SMS & email notifications',
        'Digital waiver signatures',
        'Photo documentation',
        'Advanced reporting & analytics',
        'QuickBooks integration',
        'Customer portal',
        'Appointment scheduling',
        'Basic marketing tools',
        'Priority phone support'
      ],
      limitations: [
        'No multi-location support',
        'No advanced marketing automation',
        'No custom integrations'
      ]
    },
    {
      name: 'Growth',
      price: 349,
      icon: Building2,
      color: 'purple',
      description: 'For established multi-bay operations',
      features: [
        'Up to 15 technicians',
        'Multi-location management (up to 3)',
        'Advanced workflow automation',
        'Marketing automation & campaigns',
        'Customer retention tools',
        'Advanced business intelligence',
        'Custom reporting builder',
        'Employee scheduling & tracking',
        'Performance analytics',
        'API access (limited)',
        'Dedicated customer success manager',
        'Priority support with faster response',
        'Advanced inventory forecasting',
        'Loyalty program management'
      ],
      limitations: [
        'Limited to 3 locations',
        'No white-label options',
        'No custom integrations'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      icon: Crown,
      color: 'slate',
      description: 'For large operations & franchises',
      features: [
        'Unlimited technicians & locations',
        'Full white-label customization',
        'Custom integrations & API',
        'Advanced marketing automation',
        'Franchise management tools',
        'Predictive maintenance AI',
        'Custom workflow builder',
        'Advanced security & compliance',
        'Data migration assistance',
        'Custom training programs',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom reporting & dashboards',
        'Multi-brand management',
        'Enterprise SSO integration'
      ],
      limitations: []
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-600 hover:bg-emerald-700',
        text: 'text-emerald-600',
        border: 'border-emerald-500'
      },
      blue: {
        bg: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        border: 'border-blue-500'
      },
      purple: {
        bg: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-purple-600',
        border: 'border-purple-500'
      },
      slate: {
        bg: 'bg-slate-600 hover:bg-slate-700',
        text: 'text-slate-600',
        border: 'border-slate-500'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From startup shops to enterprise operations, OverDryv scales with your business. 
            Join 1,500+ shops already accelerating their success.
          </p>
          <div className="mt-8 inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
            🚀 14-day free trial • No credit card required • Cancel anytime
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? 'border-blue-500 scale-105' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.color === 'emerald' ? 'bg-emerald-100' :
                    plan.color === 'blue' ? 'bg-blue-100' : 
                    plan.color === 'purple' ? 'bg-purple-100' : 'bg-slate-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                        <span className="text-slate-600 ml-2">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    )}
                  </div>
                  {typeof plan.price === 'number' && (
                    <p className="text-sm text-slate-500 mt-2">per location</p>
                  )}
                  {plan.name === 'Enterprise' && (
                    <p className="text-sm text-slate-500 mt-2">Contact for pricing</p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.slice(0, 8).map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 8 && (
                    <div className="text-center">
                      <span className="text-sm text-slate-500">+ {plan.features.length - 8} more features</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => plan.name === 'Enterprise' ? handleContactSales() : handleStartTrial(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${getColorClasses(plan.color, 'bg')}`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                  {plan.name === 'Enterprise' ? 'Custom implementation & training' : '14-day free trial • No credit card required'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Calculate Your ROI
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-emerald-600">25%</div>
              <h3 className="text-xl font-semibold text-slate-900">Increase in Revenue</h3>
              <p className="text-slate-600">Better workflow efficiency and customer retention</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">40%</div>
              <h3 className="text-xl font-semibold text-slate-900">Time Savings</h3>
              <p className="text-slate-600">Automated processes and digital workflows</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-purple-600">$50K+</div>
              <h3 className="text-xl font-semibold text-slate-900">Annual Savings</h3>
              <p className="text-slate-600">Reduced overhead and improved efficiency</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-emerald-600">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">Growth</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-600">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { feature: 'Technicians Included', starter: '2', pro: '8', growth: '15', enterprise: 'Unlimited' },
                  { feature: 'Customer Database', starter: '1,000', pro: 'Unlimited', growth: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Locations', starter: '1', pro: '1', growth: '3', enterprise: 'Unlimited' },
                  { feature: 'Parts Inventory', starter: 'Basic', pro: 'Advanced', growth: 'Advanced + AI', enterprise: 'Custom' },
                  { feature: 'Marketing Tools', starter: false, pro: 'Basic', growth: 'Advanced', enterprise: 'Custom' },
                  { feature: 'Integrations', starter: false, pro: 'QuickBooks', growth: 'Multiple', enterprise: 'Custom API' },
                  { feature: 'Multi-location Support', starter: false, pro: false, growth: true, enterprise: true },
                  { feature: 'White-label Options', starter: false, pro: false, growth: false, enterprise: true },
                  { feature: 'Support Level', starter: 'Phone', pro: 'Priority', growth: 'Dedicated CSM', enterprise: '24/7 + Manager' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-medium text-slate-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-blue-500 mx-auto" /> : <X className="w-5 h-5 text-slate-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? <Check className="w-5 h-5 text-purple-500 mx-auto" /> : <X className="w-5 h-5 text-slate-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.growth}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-5 h-5 text-slate-500 mx-auto" /> : <X className="w-5 h-5 text-slate-400 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees for Starter and Professional. Growth and Enterprise include complimentary setup and data migration."
              },
              {
                q: "What integrations are available?",
                a: "QuickBooks, parts suppliers, payment processors, and more. Enterprise plans include custom API access for any integration."
              },
              {
                q: "Do you offer training?",
                a: "All plans include onboarding training. Growth and Enterprise customers get dedicated training sessions and ongoing support."
              },
              {
                q: "How does Enterprise pricing work?",
                a: "Enterprise pricing is customized based on your specific needs, number of locations, and required integrations. Contact our sales team for a personalized quote."
              },
              {
                q: "Can I get a demo before signing up?",
                a: "Absolutely! We offer personalized demos for all plans. You can also start with our 14-day free trial to explore all features."
              }
            ].map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Accelerate Your Shop's Success?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join 1,500+ shops already using OverDryv to streamline operations and boost profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleStartTrial('Professional')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleScheduleDemo}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Schedule Demo
            </button>
            <button 
              onClick={() => navigate('/admin')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
            >
              View Live Demo
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Trusted by automotive professionals nationwide • SOC 2 Compliant • 99.9% Uptime SLA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;