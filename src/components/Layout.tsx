import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setHelpMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
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
          <nav className="flex items-center space-x-4">
            <div className="relative" ref={helpMenuRef}>
              <button 
                className="px-4 py-2 rounded-md text-gray-500 hover:text-gray-900"
                onClick={() => setHelpMenuOpen(!helpMenuOpen)}
              >
                Help
              </button>
              {helpMenuOpen && (
                <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md mt-2 py-1 z-50">
                  <Link 
                    to="/physical-help" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setHelpMenuOpen(false)}
                  >
                    Physical Help
                  </Link>
                  <Link 
                    to="/mental-help" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setHelpMenuOpen(false)}
                  >
                    Mental Help
                  </Link>
                  <Link 
                    to="/emergency" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setHelpMenuOpen(false)}
                  >
                    Emergency
                  </Link>
                </div>
              )}
            </div>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-teal-500">
                    <img 
                      src={user.user_metadata.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-700">{user.user_metadata.full_name || 'User'}</span>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md mt-2 py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={async () => {
                        await signOut();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600"
              >
                Login
              </button>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/physical-help" className="text-gray-300 hover:text-white">Physical Help</Link></li>
                <li><Link to="/mental-help" className="text-gray-300 hover:text-white">Mental Help</Link></li>
                <li><Link to="/emergency" className="text-gray-300 hover:text-white">Emergency</Link></li>
                <li><Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link></li>
              </ul>
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