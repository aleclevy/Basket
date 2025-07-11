const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Get today's question
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const question = await pool.query(
      'SELECT * FROM questions WHERE active_date = $1',
      [today]
    );

    if (question.rows.length === 0) {
      return res.status(404).json({ error: 'No question for today' });
    }

    // Check if user has already responded
    const hasResponded = await pool.query(
      'SELECT * FROM responses WHERE user_id = $1 AND question_id = $2',
      [req.userId, question.rows[0].id]
    );

    res.json({
      question: question.rows[0],
      hasResponded: hasResponded.rows.length > 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit response
router.post('/respond', authMiddleware, async (req, res) => {
  try {
    const { questionId, responseText } = req.body;

    // Check if already responded
    const existing = await pool.query(
      'SELECT * FROM responses WHERE user_id = $1 AND question_id = $2',
      [req.userId, questionId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already responded to this question' });
    }

    // Insert response
    const response = await pool.query(
      'INSERT INTO responses (user_id, question_id, response_text) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, questionId, responseText]
    );

    // Get a random response from another user for the same question
    const otherResponse = await pool.query(
      `SELECT r.*, u.username FROM responses r
       JOIN users u ON r.user_id = u.id
       WHERE r.question_id = $1 AND r.user_id != $2
       ORDER BY RANDOM()
       LIMIT 1`,
      [questionId, req.userId]
    );

    if (otherResponse.rows.length > 0) {
      // Record the match
      await pool.query(
        'INSERT INTO response_matches (user_id, response_id) VALUES ($1, $2)',
        [req.userId, otherResponse.rows[0].id]
      );

      res.json({
        myResponse: response.rows[0],
        matchedResponse: {
          id: otherResponse.rows[0].id,
          response_text: otherResponse.rows[0].response_text,
          created_at: otherResponse.rows[0].created_at
        }
      });
    } else {
      res.json({
        myResponse: response.rows[0],
        matchedResponse: null
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my responses
router.get('/my-responses', authMiddleware, async (req, res) => {
  try {
    const responses = await pool.query(
      `SELECT r.*, q.question_text, q.category
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.userId]
    );

    res.json(responses.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;