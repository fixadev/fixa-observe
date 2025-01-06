import { StripeService } from "@repo/services/src/ee/stripe";
import { db } from "../db";

const stripeService = new StripeService(db);

export default stripeService;
