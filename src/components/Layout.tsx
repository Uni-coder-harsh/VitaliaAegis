import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            {/* Fallback to Lucide icon if image fails to load */}
            <div className="h-12 w-12 relative">
              <img 
                src="/images/vitalia-aegis-logo.png" 
                alt="Vitalia Aegis"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-green-500 rounded-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-[#2c3e50]">Vitalia Aegis</span>
          </Link>
          <nav className="flex space-x-4">
            <div className="relative group">
              <button className="px-4 py-2 rounded-md text-gray-500 hover:text-gray-900">Help</button>
              <div className="absolute right-0 hidden group-hover:block w-48 bg-white shadow-lg rounded-md mt-2">
                <Link to="/physical-help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Physical Help</Link>
                <Link to="/mental-help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mental Help</Link>
                <Link to="/emergency" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Emergency</Link>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2c3e50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 relative">
                  <img 
                    src="/images/vitalia-aegis-logo.png" 
                    alt="Vitalia Aegis"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-green-500 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Vitalia Aegis</h3>
              </div>
              <p className="text-gray-300">
                Your AI-powered healthcare companion for personalized wellness
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">Email: contact@vitaliaegis.com</p>
              <p className="text-gray-300">Phone: +91-1234567890</p>
              <p className="text-gray-300">Central University of Karnataka</p>
              <p className="text-gray-300">Kadganchi, Karnataka, India, 585367</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">&copy; 2024 Vitalia Aegis. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}