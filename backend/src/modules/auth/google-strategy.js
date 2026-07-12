const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../../prisma');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('--- RAW GOOGLE PROFILE ---');
      console.log(JSON.stringify(profile, null, 2));
      console.log('--------------------------');

      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;

      // 1. Check if user exists with google_id
      let user = await prisma.user.findUnique({ where: { google_id: googleId }, omit: { password_hash: true } });
      if (user) {
        return done(null, user);
      }

      // 2. Check if user exists with email (from local signup)
      user = await prisma.user.findUnique({ where: { email }, omit: { password_hash: true } });
      if (user) {
        // Link Google account to existing local user
        user = await prisma.user.update({
          where: { email },
          data: {
            google_id: googleId,
            auth_provider: 'GOOGLE'
          },
          omit: { password_hash: true }
        });
        return done(null, user);
      }

      // 3. Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          google_id: googleId,
          auth_provider: 'GOOGLE',
          role: 'DRIVER' // Default role
        },
        omit: { password_hash: true }
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
    }
  ));
} else {
  console.warn('[WARN] Google OAuth credentials missing. Google login will be disabled.');
}

// We don't need serializeUser/deserializeUser for session-based auth because we are using JWT.
