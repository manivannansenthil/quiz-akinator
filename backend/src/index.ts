import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRouter from "./routes/generate";
import gradeRouter from "./routes/grade";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Quiz backend 🧠 ready"));

app.use("/generate", generateRouter);
app.use("/grade", gradeRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
);
