import { Router, Request, Response } from "express";
import { db } from "../../../db";
import { SearchService } from "@repo/services/src/search";
import { SavedSearchWithIncludesSchema } from "@repo/types/src/index";

const searchRouter = Router();
const searchService = new SearchService(db);
searchRouter.get("/", async (req, res) => {
  try {
    const ownerId = res.locals.orgId;
    const includeDefault = req.query.includeDefault !== "false";
    const searches = await searchService.getAll({ ownerId, includeDefault });
    res.json({ success: true, searches });
  } catch (error) {
    console.error("Error getting searches", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

searchRouter.get("/default", async (req, res) => {
  try {
    const ownerId = res.locals.orgId;
    const search = await searchService.getDefault({ ownerId });
    res.json({ success: true, search });
  } catch (error) {
    console.error("Error getting default search", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

searchRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;
    const search = await searchService.getById({ id, ownerId });
    if (!search) {
      return res
        .status(404)
        .json({ success: false, error: "Search not found" });
    }
    res.json({ success: true, search });
  } catch (error) {
    console.error("Error getting search", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

searchRouter.post("/", async (req, res) => {
  try {
    const ownerId = res.locals.orgId;
    const { name, filter } = req.body;
    const search = await searchService.save({ name, filter, ownerId });
    res.json({ success: true, search });
  } catch (error) {
    console.error("Error creating search", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

searchRouter.put("/:id", async (req, res) => {
  try {
    const ownerId = res.locals.orgId;
    const search = req.body;
    const parsed = SavedSearchWithIncludesSchema.safeParse(search);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, error: parsed.error.message });
    }
    const updatedSearch = await searchService.update({
      search: parsed.data,
      ownerId,
    });
    res.json({ success: true, search: updatedSearch });
  } catch (error) {
    console.error("Error updating search", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

searchRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;
    await searchService.delete({ id, ownerId });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting search", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { searchRouter };
