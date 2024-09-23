import express from 'express';

const BEARER_TOKEN = "8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3";

export function checkBearerToken(req: express.Request) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (!token || token !== BEARER_TOKEN) {
        return false;
    }
    return true;
}
