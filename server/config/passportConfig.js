const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const axios = require("axios"); 
const User = require("../models/User"); 

// JWT Strategy Options
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, 
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id); 
      if (user) {
        return done(null, user); 
      } else {
        return done(null, false); 
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

const generateToken = (user) => {
  const payload = { id: user._id };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://taskstars.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          const token = generateToken(user);
          return done(null, { user, token });
        }

        user = new User({
          googleId: profile.id,
          username: profile.displayName, 
          name: profile.displayName, 
          email:
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null, 
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

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://taskstars.onrender.com/api/auth/github/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Issue JWT token
          const token = generateToken(user);
          return done(null, { user, token });
        }

        let email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          const emailResponse = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          );

          const primaryEmail = emailResponse.data.find(
            (emailObj) => emailObj.primary && emailObj.verified
          );
          email = primaryEmail ? primaryEmail.email : null;
        }

        if (!email) {
          return done(
            new Error("Email is required but not provided by GitHub"),
            null
          );
        }

        user = new User({
          githubId: profile.id,
          username: profile.username,
          name: profile.displayName || profile.username, 
          email, 
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
