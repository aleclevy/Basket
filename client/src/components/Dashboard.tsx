import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  question_text: string;
  category: string;
  active_date: string;
}

interface MatchedResponse {
  id: number;
  response_text: string;
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [matchedResponse, setMatchedResponse] = useState<MatchedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchTodaysQuestion();
  }, []);

  const fetchTodaysQuestion = async () => {
    try {
      const data = await questionsAPI.getTodaysQuestion();
      setQuestion(data.question);
      setHasResponded(data.hasResponded);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    try {
      const data = await questionsAPI.submitResponse(question.id, responseText);
      setHasResponded(true);
      setMatchedResponse(data.matchedResponse);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit response');
    }
  };

  if (loading)
    return (
      <div className='loading-container'>
        <div className='loading'></div>
        <p className='loading-text'>Loading your daily reflection...</p>
      </div>
    );

  return (
    <div className='dashboard'>
      <header>
        <div className='header-content'>
          <h1>Basket</h1>
          <button onClick={logout} className='secondary'>
            Sign Out
          </button>
        </div>
      </header>

      <div className='content'>
        {error && <div className='error'>{error}</div>}

        {question && (
          <div className='question-card fade-in'>
            <h2>Today's Reflection</h2>
            <p className='question-text'>{question.question_text}</p>
            <span className='category'>{question.category}</span>
          </div>
        )}

        {!hasResponded && question ? (
          <form onSubmit={handleSubmit} className='response-form fade-in'>
            <h3>Your Response</h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder='Take a moment to reflect and share your thoughts...'
              required
              rows={4}
            />
            <button type='submit' className='primary'>
              Share Your Response
            </button>
          </form>
        ) : (
          hasResponded && (
            <div className='already-responded fade-in'>
              <div className='check-icon'>✓</div>
              <p>You've already shared your reflection today!</p>
              <p>Come back tomorrow for a new question.</p>
            </div>
          )
        )}

        {matchedResponse && (
          <div className='matched-response'>
            <h3>💫 A Shared Perspective</h3>
            <p>{matchedResponse.response_text}</p>
            <small>
              Shared{' '}
              {new Date(matchedResponse.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};
