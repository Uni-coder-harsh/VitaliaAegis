import React, { useState } from 'react';
import { Phone, Truck, Heart, Building, Bot, AlertCircle } from 'lucide-react';

export function Emergency() {
  const [aiResponse, setAiResponse] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: Truck },
    { name: 'Police', number: '100', icon: Heart },
    { name: 'Fire', number: '101', icon: Building },
    { name: 'Women Helpline', number: '1091', icon: Phone },
  ];

  const nearbyHospitals = [
    {
      name: 'District Hospital',
      address: 'Main Road, Kalaburagi',
      phone: '+91-8472-123456',
      distance: '2.5 km'
    },
    {
      name: 'University Health Center',
      address: 'CUK Campus, Kadaganchi',
      phone: '+91-8472-654321',
      distance: '0.5 km'
    },
  ];

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleAIAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would integrate with your AI service
      // For now, we'll simulate a response
      setTimeout(() => {
        setAiResponse("Based on your symptoms, please call emergency services immediately. While waiting for help: 1) Stay calm 2) Find a safe location 3) Keep your airways clear 4) If possible, have someone stay with you.");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('Unable to process your request. Please call emergency services if you need immediate assistance.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Emergency Services</h1>
        <p className="text-gray-600">Quick access to emergency services and important contacts</p>
      </div>

      {/* AI Emergency Assistant */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <div className="flex items-center mb-6">
          <Bot className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold">Emergency AI Assistant</h2>
        </div>
        <form onSubmit={handleAIAssistance} className="space-y-4">
          <div>
            <label htmlFor="emergency-query" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your emergency situation
            </label>
            <textarea
              id="emergency-query"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Example: I'm experiencing severe chest pain and shortness of breath..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading || !userQuery.trim()}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Get AI Assistance
              </span>
            )}
          </button>
        </form>
        {aiResponse && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex items-start">
              <Bot className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI Response:</h3>
                <p className="text-blue-800">{aiResponse}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {emergencyContacts.map((contact) => (
          <div key={contact.number} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <contact.icon className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{contact.name}</h3>
            <button
              onClick={() => handleCall(contact.number)}
              className="text-3xl font-bold text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center"
            >
              <Phone className="w-6 h-6 mr-2" />
              {contact.number}
            </button>
          </div>
        ))}
      </div>

      {/* Nearby Hospitals */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Nearby Hospitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearbyHospitals.map((hospital) => (
            <div key={hospital.name} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">{hospital.name}</h3>
              <p className="text-gray-600 mb-2">{hospital.address}</p>
              <button
                onClick={() => handleCall(hospital.phone.replace(/[^0-9]/g, ''))}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-2 flex items-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                {hospital.phone}
              </button>
              <p className="text-gray-600">Distance: {hospital.distance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid Guide */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
          <h2 className="text-2xl font-bold">Basic First Aid Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">CPR Steps</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li className="flex items-center space-x-2">
                <span>Check the scene for safety</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Check for responsiveness</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Call for help (108)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Check for breathing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Begin chest compressions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Give rescue breaths</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Continue CPR until help arrives</span>
              </li>
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Common Emergencies</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Bleeding: Apply direct pressure</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Burns: Cool with running water</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Choking: Perform Heimlich maneuver</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Fractures: Immobilize the area</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Seizures: Protect from injury</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}