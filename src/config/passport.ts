import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/User';

// Setting up a basic email auth flow
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let user = await User.findOne({ email });

        if (!user || !user.validatePassword(password)) {
            return done(null, false, {
                message: "Wrong email or password"
            });
        }
        return done(null, user)
    } catch (error) {
        return done(error.message);
    }
}))