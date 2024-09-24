import { PrismaClient } from "@prisma/client";

const tokenToUserId: Record<string, string> = {
    "8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3": "66efb1287be83f45f94f28b2",
}

export const getUserIdFromApiKey = (apiKey: string, db: PrismaClient) => {
    return tokenToUserId[apiKey];
}

