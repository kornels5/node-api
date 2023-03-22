import express from "express";
import morgan from "morgan";
import { signin, createNewUser } from "./handlers/user";

import { protect } from "./modules/auth";
import router from "./router";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  setTimeout(() => {
    next(new Error("error"));
  }, 1000);
});

app.use("/api", protect, router);

app.post("/user", createNewUser);
app.post("/signin", signin);

app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "Bad request" });
  } else {
    res.status(500).json({ message: "500 Internal server Error" });
  }
});
export default app;
