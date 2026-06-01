const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

const User = require("../models/User")

const generateAccessToken = require("../utils/generateAccessToken")
const generateRefreshToken = require("../utils/generateRefreshToken")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },

    async (googleAccessToken, googleRefreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value

        let user = await User.findOne({ email })

        // Create user automatically on first Google login
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            googleId: profile.id,
            isVerified: true,
            welcomeEmailSent: false
          })
        }

        // Generate JWT access token
        const accessToken = generateAccessToken(user._id)

        // Generate JWT refresh token
        const refreshToken = generateRefreshToken(user._id)

        // Save refresh token in DB
        user.refreshToken = refreshToken
        await user.save()

        return done(null, {
          user,
          accessToken,
          refreshToken
        })

      } catch (error) {
        done(error, null)
      }
    }
  )
)