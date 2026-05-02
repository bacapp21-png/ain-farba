import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, articlesTable, eventsTable, notablesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res) => {
  const [totalArticlesRow] = await db.select({ count: count() }).from(articlesTable);
  const [totalEventsRow] = await db.select({ count: count() }).from(eventsTable);
  const [totalNotablesRow] = await db.select({ count: count() }).from(notablesTable);
  const [upcomingEventsRow] = await db
    .select({ count: count() })
    .from(eventsTable)
    .where(eq(eventsTable.status, "upcoming"));

  const articleCategories = await db
    .select({ category: articlesTable.category, count: count() })
    .from(articlesTable)
    .groupBy(articlesTable.category);

  const notableSpecialties = await db
    .select({ specialty: notablesTable.specialty, count: count() })
    .from(notablesTable)
    .groupBy(notablesTable.specialty);

  res.json({
    totalArticles: totalArticlesRow?.count ?? 0,
    totalEvents: totalEventsRow?.count ?? 0,
    totalNotables: totalNotablesRow?.count ?? 0,
    upcomingEvents: upcomingEventsRow?.count ?? 0,
    articlesByCategory: articleCategories.map((r) => ({
      category: r.category,
      count: r.count,
    })),
    notablesBySpecialty: notableSpecialties.map((r) => ({
      specialty: r.specialty,
      count: r.count,
    })),
  });
});

router.get("/stats/recent", async (_req, res) => {
  const recentArticles = await db
    .select()
    .from(articlesTable)
    .orderBy(articlesTable.createdAt)
    .limit(4);

  const recentEvents = await db
    .select()
    .from(eventsTable)
    .orderBy(eventsTable.createdAt)
    .limit(4);

  const recentNotables = await db
    .select()
    .from(notablesTable)
    .orderBy(notablesTable.createdAt)
    .limit(4);

  res.json({
    recentArticles: recentArticles.reverse(),
    recentEvents: recentEvents.reverse(),
    recentNotables: recentNotables.reverse(),
  });
});

export default router;
