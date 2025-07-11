const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this Google ID
    let user = await pool.query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (user.rows.length === 0) {
      // Check if user exists with this email
      const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (emailCheck.rows.length > 0) {
        // Update existing user with Google ID
        user = await pool.query(
          'UPDATE users SET google_id = $1, profile_picture = $2 WHERE email = $3 RETURNING *',
          [profile.id, profile.photos[0]?.value, profile.emails[0].value]
        );
      } else {
        // Create new user
        user = await pool.query(
          'INSERT INTO users (google_id, email, username, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
          [
            profile.id,
            profile.emails[0].value,
            profile.displayName || profile.emails[0].value.split('@')[0],
            profile.photos[0]?.value
          ]
        );
      }
    } else {
      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.rows[0].id]
      );
    }

    return done(null, user.rows[0]);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;