const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Add axios to make HTTP requests
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
          username: profile.displayName, // Use displayName as the username
          name: profile.displayName, // Save the full name to the 'name' field
          email:
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null, // Added check for emails array
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

        // If user doesn't exist, attempt to fetch emails using GitHub API
        let email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          // Fetch emails using GitHub API if profile.emails is not available
          const emailResponse = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          );

          // Find the primary email from the response
          const primaryEmail = emailResponse.data.find(
            (emailObj) => emailObj.primary && emailObj.verified
          );
          email = primaryEmail ? primaryEmail.email : null;
        }

        // Check if email is still not available
        if (!email) {
          return done(
            new Error("Email is required but not provided by GitHub"),
            null
          );
        }

        // Create a new user
        user = new User({
          githubId: profile.id,
          username: profile.username,
          name: profile.displayName || profile.username, // Use displayName if available, fallback to username
          email, // Use the fetched or available email
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
