import { Router, type IRouter } from "express";
import healthRouter from "./health";
import articlesRouter from "./articles";
import eventsRouter from "./events";
import notablesRouter from "./notables";
import statsRouter from "./stats";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(articlesRouter);
router.use(eventsRouter);
router.use(notablesRouter);
router.use(statsRouter);
router.use(storageRouter);

export default router;
