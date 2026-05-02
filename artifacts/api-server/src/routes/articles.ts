import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, articlesTable } from "@workspace/db";
import {
  ListArticlesQueryParams,
  CreateArticleBody,
  GetArticleParams,
  UpdateArticleParams,
  UpdateArticleBody,
  DeleteArticleParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/articles", async (req, res) => {
  const query = ListArticlesQueryParams.parse(req.query);
  let builder = db.select().from(articlesTable).$dynamic();
  if (query.category) {
    builder = builder.where(eq(articlesTable.category, query.category));
  }
  if (query.limit) {
    builder = builder.limit(query.limit);
  }
  if (query.offset) {
    builder = builder.offset(query.offset);
  }
  const articles = await builder.orderBy(articlesTable.publishedAt);
  res.json(articles.reverse());
});

router.post("/articles", async (req, res) => {
  const body = CreateArticleBody.parse(req.body);
  const [article] = await db
    .insert(articlesTable)
    .values({
      ...body,
      publishedAt: new Date(body.publishedAt),
    })
    .returning();
  res.status(201).json(article);
});

router.get("/articles/:id", async (req, res) => {
  const { id } = GetArticleParams.parse(req.params);
  const [article] = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, id))
    .limit(1);
  if (!article) {
    res.status(404).json({ message: "Article not found" });
    return;
  }
  res.json(article);
});

router.put("/articles/:id", async (req, res) => {
  const { id } = UpdateArticleParams.parse(req.params);
  const body = UpdateArticleBody.parse(req.body);
  const [article] = await db
    .update(articlesTable)
    .set({ ...body, publishedAt: new Date(body.publishedAt) })
    .where(eq(articlesTable.id, id))
    .returning();
  if (!article) {
    res.status(404).json({ message: "Article not found" });
    return;
  }
  res.json(article);
});

router.delete("/articles/:id", async (req, res) => {
  const { id } = DeleteArticleParams.parse(req.params);
  await db.delete(articlesTable).where(eq(articlesTable.id, id));
  res.status(204).send();
});

export default router;
