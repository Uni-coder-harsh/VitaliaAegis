import React from 'react';
import { Activity, Brain, Phone } from 'lucide-react';

export function Home() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            VitaliaAegis
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get personalized health suggestions and emergency assistance powered by advanced AI technology.
          </p>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Physical Help</h2>
              <p className="mt-2 text-center text-gray-500">
                Get immediate assistance for physical health concerns
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Mental Help</h2>
              <p className="mt-2 text-center text-gray-500">
                Access mental health resources and support
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Emergency</h2>
              <p className="mt-2 text-center text-gray-500">
                Quick access to emergency services and contacts
              </p>
            </div>
          </div>
        </div>

        {/* CPR Videos Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Life-Saving Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/2VraVM5GeCg"
                title="How to save lives"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/YEsQ36KeETo"
                title="CPR demonstration"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/2PngCv7NjaI"
                title="Chest compression"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}