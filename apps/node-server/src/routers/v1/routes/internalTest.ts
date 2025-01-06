import { Request, Response, Router } from "express";
import { connectedUsers } from "../../../index";
import { env } from "../../../env";
import { db } from "../../../db";

const internalTestRouter = Router();

internalTestRouter.use((req, res, next) => {
  console.log(`Internal test route hit: ${req.method} ${req.path}`);
  next();
});

internalTestRouter.get("/", (req: Request, res: Response) => {
  res.json({
    dbUrl: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
  });
});

// Route to send message to specific user
internalTestRouter.post("/message/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { event, data } = req.body;
  const userSocket = connectedUsers.get(userId);
  if (userSocket) {
    userSocket.emit(event, data);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not connected" });
  }
});

// Route to test database connection
internalTestRouter.get("/db", async (_: Request, res: Response) => {
  try {
    const result = await db.testAgent.findMany();
    res.json({
      result,
    });
  } catch (error) {
    console.error("Error fetching data from database", error);
    res.status(500).json({
      error,
    });
  }
});

export { internalTestRouter };
