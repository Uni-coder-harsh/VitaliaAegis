import React, { useState, useEffect } from 'react';
import { Brain, Heart, Sun, Moon, ArrowRight, ArrowLeft, Download, User, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Question {
  id: number;
  text: string;
  type: 'slider' | 'mcq' | 'boolean' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

const questions: Question[] = [
  {
    id: 1,
    type: 'slider',
    text: 'How would you rate your stress level today?',
    min: 1,
    max: 10,
    step: 1
  },
  {
    id: 2,
    type: 'slider',
    text: 'How many hours do you sleep on average?',
    min: 1,
    max: 12,
    step: 0.5
  },
  {
    id: 3,
    type: 'mcq',
    text: 'How often do you feel overwhelmed by your academic workload?',
    options: ['Never', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 4,
    type: 'mcq',
    text: 'How would you rate your social support system?',
    options: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  {
    id: 5,
    type: 'mcq',
    text: 'How often do you engage in physical exercise?',
    options: ['Daily', 'Few times a week', 'Rarely', 'Never']
  },
  {
    id: 6,
    type: 'boolean',
    text: 'Do you often feel anxious about your future?'
  },
  {
    id: 7,
    type: 'text',
    text: 'What are your main sources of stress? Please describe briefly.'
  }
];

export function MentalHelp() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchPreviousResults();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPreviousResults = async () => {
    try {
      const { data, error } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPreviousResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const calculateScore = () => {
    let score = 0;
    let stressLevel = parseInt(answers[1] || '5');
    let sleepHours = parseFloat(answers[2] || '7');
    let workloadStress = answers[3] ? ['Never', 'Sometimes', 'Often', 'Always'].indexOf(answers[3]) : 2;
    let socialSupport = answers[4] ? ['Excellent', 'Good', 'Fair', 'Poor'].indexOf(answers[4]) : 2;
    let exercise = answers[5] ? ['Daily', 'Few times a week', 'Rarely', 'Never'].indexOf(answers[5]) : 2;
    let futureAnxiety = answers[6] === 'true' ? 3 : 1;

    // Calculate weighted score
    score += (10 - stressLevel) * 2; // Lower stress is better
    score += (sleepHours >= 7 && sleepHours <= 9 ? 10 : 5); // Optimal sleep range
    score += (3 - workloadStress) * 2; // Less workload stress is better
    score += (3 - socialSupport) * 2; // Better social support is better
    score += (3 - exercise) * 2; // More exercise is better
    score += (5 - futureAnxiety); // Less anxiety is better

    return Math.min(100, Math.max(0, score));
  };

  const generateReport = async () => {
    const score = calculateScore();
    const reportElement = document.getElementById('mental-health-report');
    if (!reportElement) return;

    try {
      const canvas = await html2canvas(reportElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VitaliaAegis_Mental_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getAssessmentResult = (score: number) => {
    let result = {
      score,
      status: '',
      recommendations: [] as string[],
      lifestyle: [] as string[]
    };

    if (score >= 80) {
      result.status = 'Excellent Mental Health';
      result.recommendations = [
        'Continue your current healthy practices',
        'Share your wellness strategies with peers',
        'Consider becoming a wellness mentor'
      ];
    } else if (score >= 60) {
      result.status = 'Good Mental Health';
      result.recommendations = [
        'Maintain regular exercise and sleep schedule',
        'Practice stress management techniques',
        'Stay connected with your support system'
      ];
    } else if (score >= 40) {
      result.status = 'Fair Mental Health - Some Attention Needed';
      result.recommendations = [
        'Consider speaking with a counselor',
        'Establish a regular sleep routine',
        'Increase physical activity',
        'Practice mindfulness or meditation'
      ];
    } else {
      result.status = 'Immediate Attention Recommended';
      result.recommendations = [
        'Schedule an appointment with a mental health professional',
        'Talk to a trusted friend or family member',
        'Contact university counseling services',
        'Focus on basic self-care routines'
      ];
    }

    // Add lifestyle recommendations based on specific answers
    if (parseFloat(answers[2] || '7') < 7) {
      result.lifestyle.push('Improve sleep hygiene by maintaining a consistent sleep schedule');
    }
    if (answers[5] === 'Rarely' || answers[5] === 'Never') {
      result.lifestyle.push('Incorporate regular physical activity into your routine');
    }
    if (answers[4] === 'Poor' || answers[4] === 'Fair') {
      result.lifestyle.push('Build stronger social connections through university clubs or study groups');
    }

    return result;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const score = calculateScore();
      const assessmentResult = getAssessmentResult(score);
      
      if (user) {
        const { error } = await supabase
          .from('mental_health_assessments')
          .insert([{
            user_id: user.id,
            name: profile?.full_name || user.email,
            email: user.email,
            score: assessmentResult.score,
            result: JSON.stringify(assessmentResult)
          }]);

        if (error) throw error;
      }

      setResult(JSON.stringify(assessmentResult));
      setShowResult(true);
      fetchPreviousResults();
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Mental Health Assessment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Take our comprehensive mental health assessment to understand your well-being. 
          Your responses are confidential and will help us provide personalized recommendations.
        </p>
      </div>

      {!showResult ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">{questions[currentQuestion].text}</h3>

            {questions[currentQuestion].type === 'slider' && (
              <div className="space-y-4">
                <input
                  type="range"
                  min={questions[currentQuestion].min}
                  max={questions[currentQuestion].max}
                  step={questions[currentQuestion].step}
                  value={answers[questions[currentQuestion].id] || questions[currentQuestion].min}
                  onChange={(e) => setAnswers({ ...answers, [questions[currentQuestion].id]: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Low</span>
                  <span>{answers[questions[currentQuestion].id] || questions[currentQuestion].min}</span>
                  <span>High</span>
                </div>
              </div>
            )}

            {questions[currentQuestion].type === 'mcq' && (
              <div className="space-y-3">
                {questions[currentQuestion].options!.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswers({ ...answers, [questions[currentQuestion].id]: option })}
                    className={`w-full p-4 text-left rounded-lg border ${
                      answers[questions[currentQuestion].id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500'
                    } transition-all duration-200 hover:shadow-md`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {questions[currentQuestion].type === 'boolean' && (
              <div className="flex space-x-4">
                {['true', 'false'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAnswers({ ...answers, [questions[currentQuestion].id]: value })}
                    className={`flex-1 p-4 rounded-lg border ${
                      answers[questions[currentQuestion].id] === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500'
                    } transition-all duration-200 hover:shadow-md`}
                  >
                    {value === 'true' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            )}

            {questions[currentQuestion].type === 'text' && (
              <textarea
                value={answers[questions[currentQuestion].id] || ''}
                onChange={(e) => setAnswers({ ...answers, [questions[currentQuestion].id]: e.target.value })}
                className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                placeholder="Type your answer here..."
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-blue-600 disabled:text-gray-400 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !answers[questions[currentQuestion].id]}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Processing...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!answers[questions[currentQuestion].id]}
                className="flex items-center px-4 py-2 text-blue-600 disabled:text-gray-400 transition-colors duration-200"
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div id="mental-health-report" className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <img
                  src="/images/vitalia-aegis-logo.png"
                  alt="VitaliaAegis Logo"
                  className="h-16 w-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-blue-600">Mental Health Assessment Report</h2>
                <p className="text-gray-600">Generated by VitaliaAegis AI Health System</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-gray-600">Report ID: MH-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Patient Name:</p>
                  <p className="font-medium">{profile?.full_name || user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Age:</p>
                  <p className="font-medium">{profile?.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Assessment Date:</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Referred By:</p>
                  <p className="font-medium">VitaliaAegis Health System</p>
                </div>
              </div>
            </div>

            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Assessment Results</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium">Mental Health Score</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {JSON.parse(result).score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${JSON.parse(result).score}%` }}
                      ></div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-800">
                      Status: {JSON.parse(result).status}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                  <ul className="space-y-3">
                    {JSON.parse(result).recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {JSON.parse(result).lifestyle.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Lifestyle Adjustments</h3>
                    <ul className="space-y-3">
                      {JSON.parse(result).lifestyle.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Activity className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                This report is generated based on your responses to the VitaliaAegis mental health assessment.
                It is not a clinical diagnosis. Please consult with a mental health professional for a comprehensive evaluation.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-all duration-200"
            >
              Take Assessment Again
            </button>
            <button
              onClick={generateReport}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report (PDF)
            </button>
          </div>

          {previousResults.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Previous Assessments</h3>
              <div className="space-y-4">
                {previousResults.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{new Date(assessment.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-600">Score: {assessment.score}/100</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setResult(assessment.result);
                            setShowResult(true);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}