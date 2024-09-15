const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// JWT Strategy Options
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Load secret key from environment variable
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id); // Find user by ID
      if (user) {
        return done(null, user); // User found
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false); // Error handling
    }
  })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// Generate JWT Token Function
const generateToken = (user) => {
  const payload = { id: user._id };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Issue JWT token
          const token = generateToken(user);
          return done(null, { user, token });
        }

        // If user doesn't exist, create a new user
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value, // If you need the user's email
        });

        await user.save();
        const token = generateToken(user);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Issue JWT token
          const token = generateToken(user);
          return done(null, { user, token });
        }

        // If user doesn't exist, create a new user
        user = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails[0].value, // If you need the user's email
        });

        await user.save();
        const token = generateToken(user);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
