import React from 'react';
import { Activity, Brain, Heart, Scale, User, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "Mental Health Assessment",
      description: "Take our comprehensive mental health assessment to understand your well-being",
      link: "/mental-help"
    },
    {
      icon: Heart,
      title: "Physical Health",
      description: "Access physical health resources and track your fitness journey",
      link: "/physical-help"
    },
    {
      icon: Shield,
      title: "Emergency Services",
      description: "Quick access to emergency services and important contacts",
      link: "/emergency"
    }
  ];

  const healthMetrics = [
    {
      icon: Scale,
      title: "BMI Calculator",
      value: user ? "Calculate Now" : "Login to Access",
      link: "/physical-help"
    },
    {
      icon: Activity,
      title: "Health Score",
      value: user ? "Check Score" : "Login to Access",
      link: "/physical-help"
    },
    {
      icon: Clock,
      title: "Last Assessment",
      value: user ? "View History" : "Login to Access",
      link: "/mental-help"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Experience comprehensive healthcare support with AI-powered assessments, emergency assistance, and personalized health tracking.
              </p>
              {!user && (
                <Link
                  to="/login"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
                alt="Healthcare"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Health Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthMetrics.map((metric, index) => (
              <Link
                key={index}
                to={metric.link}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <metric.icon className="w-10 h-10 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{metric.title}</h3>
                    <p className="text-gray-600">{metric.value}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mental Health Assessment Feature */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Mental Health Assessment</h2>
              <p className="text-lg mb-6">
                Take our comprehensive mental health assessment to understand your well-being. Get personalized insights and recommendations based on your responses.
              </p>
              <Link
                to="/mental-help"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Take Assessment Now
              </Link>
            </div>
            <div className="hidden md:block">
              <Brain className="w-32 h-32 text-white opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us today and get access to all our features including health tracking, assessments, and emergency services.
          </p>
          {!user ? (
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/profile"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              View Your Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}