import React, { useState, useEffect } from 'react';
import { Brain, Heart, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'boolean' | 'text';
  options?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    text: 'How often do you feel overwhelmed by your academic workload?',
    options: ['Never', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 2,
    type: 'mcq',
    text: 'How would you rate your sleep quality in the past week?',
    options: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  {
    id: 3,
    type: 'boolean',
    text: 'Do you often feel anxious about your future?'
  },
  {
    id: 4,
    type: 'mcq',
    text: 'How often do you engage in activities you enjoy?',
    options: ['Daily', 'Few times a week', 'Rarely', 'Never']
  },
  {
    id: 5,
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

  useEffect(() => {
    if (user) {
      fetchPreviousResults();
    }
  }, [user]);

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

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question?.type === 'mcq') {
        score += question.options!.indexOf(answer as string) * 2;
      } else if (question?.type === 'boolean') {
        score += answer === 'true' ? 3 : 1;
      }
    });
    return score;
  };

  const getAssessmentResult = (score: number) => {
    if (score <= 5) return 'Your mental health appears to be in a good state. Keep maintaining your healthy habits!';
    if (score <= 10) return 'You\'re experiencing mild stress. Consider incorporating more relaxation techniques into your routine.';
    return 'You might be experiencing significant stress. We recommend speaking with a mental health professional.';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const score = calculateScore();
      const assessmentResult = getAssessmentResult(score);
      setResult(assessmentResult);

      if (user) {
        const { error } = await supabase
          .from('mental_health_assessments')
          .upsert({
            user_id: user.id,
            name: user.user_metadata.full_name || user.email,
            email: user.email,
            score,
            result: assessmentResult
          });

        if (error) throw error;
      }

      setShowResult(true);
      fetchPreviousResults();
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Keep existing content */}
      
      {/* Mental Health Assessment */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Mental Health Assessment</h2>
        
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

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h3>
              
              {questions[currentQuestion].type === 'mcq' && (
                <div className="space-y-3">
                  {questions[currentQuestion].options!.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        answers[questions[currentQuestion].id] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
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
                      onClick={() => handleAnswer(value)}
                      className={`flex-1 p-4 rounded-lg border ${
                        answers[questions[currentQuestion].id] === value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {value === 'true' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              )}

              {questions[currentQuestion].type === 'text' && (
                <textarea
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Type your answer here..."
                ></textarea>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center px-4 py-2 text-blue-600 disabled:text-gray-400"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !answers[questions[currentQuestion].id]}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Submit Assessment'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="flex items-center px-4 py-2 text-blue-600 disabled:text-gray-400"
                >
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Your Assessment Result</h3>
              <p className="text-gray-700 mb-6">{result}</p>
              <button
                onClick={resetAssessment}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Take Assessment Again
              </button>
            </div>

            {previousResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Previous Results</h3>
                <div className="space-y-4">
                  {previousResults.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{new Date(assessment.created_at).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Score: {assessment.score}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{assessment.result}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}