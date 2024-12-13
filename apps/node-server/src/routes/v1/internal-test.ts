import { Request, Response, Router } from "express";
import { connectedUsers } from "../../index";
import { db } from "../../db";

const testRouter = Router();

// Route to send message to specific user
testRouter.post("/message/:userId", (req: Request, res: Response) => {
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
testRouter.get("/db", async (_: Request, res: Response) => {
  try {
    const result = await db.testAgent.findMany();
    res.json({ result });
  } catch (error) {
    console.error("Error fetching data from database", error);
    res.status(500).json({
      error,
    });
  }
});

export default testRouter;
