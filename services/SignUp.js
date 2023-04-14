const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user, err) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }).then((user, err) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, "Invalid Credentials");
      }
      if (user.password == password) {
        return done(null, user);
      } else {
        return done(null, false, "Invalid Credentials");
      }
    });
  })
);

const signUp = ({ email, password, req }) => {
  const user = new User({ email, password });

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email already exist");
      } else {
        return user.save();
      }
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    });
};

const logIn = ({ email, password, req }) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user) => {
      if (!user) {
        reject("Invalid credentials.");
      }
      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
};

module.exports = { signUp, logIn };
