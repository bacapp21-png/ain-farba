import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, notablesTable } from "@workspace/db";
import {
  ListNotablesQueryParams,
  CreateNotableBody,
  GetNotableParams,
  UpdateNotableParams,
  UpdateNotableBody,
  DeleteNotableParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notables", async (req, res) => {
  const query = ListNotablesQueryParams.parse(req.query);
  let builder = db.select().from(notablesTable).$dynamic();
  if (query.specialty) {
    builder = builder.where(eq(notablesTable.specialty, query.specialty));
  }
  if (query.limit) {
    builder = builder.limit(query.limit);
  }
  if (query.offset) {
    builder = builder.offset(query.offset);
  }
  const notables = await builder.orderBy(notablesTable.name);
  res.json(notables);
});

router.post("/notables", async (req, res) => {
  const body = CreateNotableBody.parse(req.body);
  const [notable] = await db.insert(notablesTable).values(body).returning();
  res.status(201).json(notable);
});

router.get("/notables/:id", async (req, res) => {
  const { id } = GetNotableParams.parse(req.params);
  const [notable] = await db
    .select()
    .from(notablesTable)
    .where(eq(notablesTable.id, id))
    .limit(1);
  if (!notable) {
    res.status(404).json({ message: "Notable not found" });
    return;
  }
  res.json(notable);
});

router.put("/notables/:id", async (req, res) => {
  const { id } = UpdateNotableParams.parse(req.params);
  const body = UpdateNotableBody.parse(req.body);
  const [notable] = await db
    .update(notablesTable)
    .set(body)
    .where(eq(notablesTable.id, id))
    .returning();
  if (!notable) {
    res.status(404).json({ message: "Notable not found" });
    return;
  }
  res.json(notable);
});

router.delete("/notables/:id", async (req, res) => {
  const { id } = DeleteNotableParams.parse(req.params);
  await db.delete(notablesTable).where(eq(notablesTable.id, id));
  res.status(204).send();
});

export default router;
