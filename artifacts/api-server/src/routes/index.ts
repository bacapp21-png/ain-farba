import { Router, type IRouter } from "express";
import healthRouter from "./health";
import articlesRouter from "./articles";
import eventsRouter from "./events";
import notablesRouter from "./notables";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(articlesRouter);
router.use(eventsRouter);
router.use(notablesRouter);
router.use(statsRouter);

export default router;
