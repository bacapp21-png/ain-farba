import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import {
  ListEventsQueryParams,
  CreateEventBody,
  GetEventParams,
  UpdateEventParams,
  UpdateEventBody,
  DeleteEventParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events", async (req, res) => {
  const query = ListEventsQueryParams.parse(req.query);
  let builder = db.select().from(eventsTable).$dynamic();
  if (query.status) {
    builder = builder.where(eq(eventsTable.status, query.status));
  }
  if (query.limit) {
    builder = builder.limit(query.limit);
  }
  if (query.offset) {
    builder = builder.offset(query.offset);
  }
  const events = await builder.orderBy(eventsTable.date);
  res.json(events.reverse());
});

router.post("/events", async (req, res) => {
  const body = CreateEventBody.parse(req.body);
  const [event] = await db
    .insert(eventsTable)
    .values({
      ...body,
      date: new Date(body.date),
    })
    .returning();
  res.status(201).json(event);
});

router.get("/events/:id", async (req, res) => {
  const { id } = GetEventParams.parse(req.params);
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }
  res.json(event);
});

router.put("/events/:id", async (req, res) => {
  const { id } = UpdateEventParams.parse(req.params);
  const body = UpdateEventBody.parse(req.body);
  const [event] = await db
    .update(eventsTable)
    .set({ ...body, date: new Date(body.date) })
    .where(eq(eventsTable.id, id))
    .returning();
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }
  res.json(event);
});

router.delete("/events/:id", async (req, res) => {
  const { id } = DeleteEventParams.parse(req.params);
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.status(204).send();
});

export default router;
