import express from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createValidationSchema } from "./validationSchema.js";
import cookieParser, { signedCookie } from "cookie-parser";
import session from "express-session";
import { Strategy as localStrategy } from "passport-local";
import passport from "passport";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
// ---- SESSION MIDDLEWARE ----
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// ---- PASSPORT MIDDLEWARE ----
app.use(passport.initialize());
app.use(passport.session());

// app.use(cookieParser("some"));
// app.use(
//   session({
//     secret: "some the secret key",
//     saveUninitialized: false,
//     resave: false,
//     cookie: { maxAge: 60000 * 10 },
//   })
// );

const users = [
  { id: 1, user_name: "Arun", password: "1234" },
  { id: 2, user_name: "Siva", password: "1234" },
  { id: 3, user_name: "mani", password: "1234" },
  { id: 3, user_name: "Balaji", password: "1234" },
  { id: 4, user_name: "Shan", password: "1234" },
  { id: 5, user_name: "Ajith", password: "1234" },
  { id: 5, user_name: "Kumar", password: "1234" },
];

// ---- STRATEGY ----
passport.use(
  new localStrategy(
    { usernameField: "user_name", passwordField: "password" },
    (user_name, password, done) => {
      const user = users.find((u) => u.user_name === user_name);
      if (!user) return done(null, false, { message: "Incorrect username." });
      if (user.password !== password)
        return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    }
  )
);

// ---- SERIALIZE / DESERIALIZE ----
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

// ---- LOGIN ROUTE ----
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info);

    req.login(user, (err) => {
      if (err) return next(err);
      res.send({ message: "Login successful", data: user });
    });
  })(req, res, next);
});

const getUserIndex = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: "Invalid user id" });
  }
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).send("user not found");
  }
  req.userIndex = userIndex;
  next();
};

app.get("/session", (req, res) => {
  console.log("req.sesion", req.session);
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

app.get("/", (req, res) => {
  // res.cookie("name", "Admin", {
  //   maxAge: 900000 * 3,
  //   signed: true,
  // });
  // console.log(req.session.id);
  // req.sessionStore.get(req.session.id, (err, session) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(session);
  //   }
  // });
  res.send("Hello from Express with ES Modules!");
});

// routers to request query
app.get("/api/users", (req, res) => {
  req.session.visited = true;
  console.log(req.session.id);

  const {
    query: { user_name, value },
  } = req;
  if (req.signedCookies.name && req.signedCookies.name === "Admin") {
    if (user_name && value) {
      return res
        .status(200)
        .send(
          users.filter((user) =>
            user[user_name].toLowerCase().includes(value.toLowerCase())
          )
        );
    }
    return res.status(200).send(users);
  } else {
    return res.status(401).send({ message: "Unauthorized User" });
  }
});

// routers in request params
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: "Invalid user id" });
  }
  const user = users.find((user) => user.id === id);
  if (user) {
    return res.status(200).send(user);
  }
  return res.status(404).send({ message: "user not found" });
});

// post the data
app.post("/api/users", checkSchema(createValidationSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const body = matchedData(req);
  if (!body) {
    return res.status(400).send({ message: "user_name is required" });
  }
  const newUser = { id: users.length + 1, ...body };
  users.push(newUser);
  res.status(201).send(newUser);
});

// PUT (replace)
app.put("/api/users/:id", getUserIndex, (req, res) => {
  const userIndex = req.userIndex;
  const id = parseInt(req.params.id);
  const { user_name } = req.body;

  users[userIndex] = { id, user_name };

  res.status(200).send({ message: "user replaced", user: users[userIndex] });
});

// PATCH (update)
app.patch("/api/users/:id", getUserIndex, (req, res) => {
  const userIndex = req.userIndex;

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  };

  res.status(200).send({ message: "user updated", user: users[userIndex] });
});

// DELETE
app.delete("/api/users/:id", getUserIndex, (req, res) => {
  const userIndex = req.userIndex;

  users.splice(userIndex, 1);

  res.status(200).send({ message: "data is deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
