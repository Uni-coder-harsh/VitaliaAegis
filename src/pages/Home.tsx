import React from 'react';
import { Activity, Brain, Heart, Scale, User, Clock, Shield, Droplets, Moon, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AIHealthChat } from '../components/AIHealthChat';

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

  const dailyTips = [
    {
      icon: Moon,
      title: "Sleep Well",
      tip: "Maintain 7-8 hours of quality sleep for better academic performance"
    },
    {
      icon: Droplets,
      title: "Stay Hydrated",
      tip: "Drink 8-10 glasses of water daily for optimal brain function"
    },
    {
      icon: Trophy,
      title: "Daily Goals",
      tip: "Set achievable health goals and track your progress"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Mission Statement */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')] opacity-10 bg-center bg-cover"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 animate-fade-in">
                Your AI-Powered Healthcare Companion
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                VitaliAegis provides personalized health recommendations using AI to improve your lifestyle, diet, and fitness. Experience comprehensive healthcare support tailored for university students.
              </p>
              {!user && (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    Start Your Health Journey
                  </Link>
                  <p className="text-sm text-blue-100">
                    Join 1000+ students improving their health with VitaliAegis
                  </p>
                </div>
              )}
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
                alt="Healthcare"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Health Check CTA */}
      {user && (
        <div className="bg-white py-8 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Quick Health Check</h2>
                <p className="text-gray-600">Take a 2-minute assessment to get personalized recommendations</p>
              </div>
              <Link
                to="/mental-help"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-center mb-12">Comprehensive health support designed for university students</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Health Tips */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Daily Health Tips</h2>
          <p className="text-gray-600 text-center mb-12">Simple ways to improve your daily well-being</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dailyTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <tip.icon className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">{tip.title}</h3>
                </div>
                <p className="text-gray-600">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Track Your Health</h2>
          <p className="text-gray-600 text-center mb-12">Monitor your progress and stay motivated</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthMetrics.map((metric, index) => (
              <Link
                key={index}
                to={metric.link}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow p-6 hover:shadow-lg transition-all transform hover:scale-105"
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

      {/* AI Health Assistant */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Health Assistant</h2>
            <p className="text-gray-600">Get instant answers to your health questions</p>
          </div>
          <AIHealthChat />
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Health Community</h2>
            <p className="text-blue-100">Connect with fellow students and support each other's health journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Set Goals', 'Track Progress', 'Share Success', 'Get Support'].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-semibold mb-2">{item}</h3>
                <p className="text-blue-100">Join challenges and achieve your health goals together</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Created with ❤️ by</h2>
            <p className="text-xl text-gray-300">Harsh</p>
            <p className="text-gray-400 mt-2">Special thanks to:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {['Rishab', 'Praveen raj', 'Zohaib khan', 'Rakib hussain'].map((name) => (
                <span key={name} className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            {!user ? (
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Join VitaliaAegis Today
              </Link>
            ) : (
              <Link
                to="/profile"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                View Your Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}