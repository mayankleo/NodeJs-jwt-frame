const express = require("express");
const jwt = require("jsonwebtoken");
// const date = require('date-and-time');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started at", port));

const key = "AS1uZmnrmuCLTRFG0p8CT4nqqtT062Pq";
const author = { username: "abc", passwd: "123" };

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/home.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/pages/login.html");
});

app.post("/login", (req, res) => {
  console.log(req.body)
  if (
    req.body.username == author.username &&
    req.body.password == author.passwd
  ) {
    usertoken = {
      username: req.body.username,
      useragent: req.headers["user-agent"],
    };
    token = jwt.sign(usertoken, key, { expiresIn: "30d" });
    return res
      .cookie("access_token", token, { httpOnly: true, secure: true })
      .json({ user: true, url: Buffer.from(req.body.directo, 'hex').toString('ascii') || "/" });
  } else {
    res.json({ user: false });
  }
});

app.get("/logout", authenticator, (req, res) => {
  return res.clearCookie("access_token").redirect("/");
});

function authenticator(req, res, next) {
  var header = req.cookies.access_token;
    try {
      data = jwt.verify(header, key);
      //   data.iat=date.format(new Date(data.iat*1000), 'DD/MM/YYYY hh:mm A')
      //   data.exp=date.format(new Date(data.exp*1000), 'DD/MM/YYYY hh:mm A')
      //   console.log(data);
      if (data.useragent == req.headers["user-agent"]) {
        return next();
      } else {
        return res.clearCookie("access_token").redirect(`/login?cf=${Buffer.from(req.originalUrl).toString('hex')}`);
      }
    } catch (err) {
      return res.clearCookie("access_token").redirect(`/login?cf=${Buffer.from(req.originalUrl).toString('hex')}`);
    }
}

app.get("/data", authenticator, (req, res) => {
  res.sendFile(__dirname + "/pages/data.html");
});

app.get("/t", authenticator, (req, res) => {
  res.send("<h1>welcome t</h1>");
});
app.get("/a", authenticator, (req, res) => {
  res.send("<h1>welcome a</h1>");
});
app.get("/b", authenticator, (req, res) => {
  res.send("<h1>welcome b</h1>");
});
app.get("/c", authenticator, (req, res) => {
  res.send("<h1>welcome c</h1>");
});