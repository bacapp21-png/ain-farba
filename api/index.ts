import express from "express";
import cors from "cors";
import articlesRouter from "../artifacts/api-server/src/routes/articles";
import eventsRouter from "../artifacts/api-server/src/routes/events";
import notablesRouter from "../artifacts/api-server/src/routes/notables";
import statsRouter from "../artifacts/api-server/src/routes/stats";
import healthRouter from "../artifacts/api-server/src/routes/health";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);
app.use("/api", articlesRouter);
app.use("/api", eventsRouter);
app.use("/api", notablesRouter);
app.use("/api", statsRouter);

export default app;
