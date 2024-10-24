const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport")
const bcrypt = require('bcrypt');
const {userModel} = require("../models/user"); // Make sure to adjust the path

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        // If all checks pass, return the user
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


module.exports = passport;