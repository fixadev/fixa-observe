import express from 'express';

const BEARER_TOKEN = "8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3";

export function checkBearerToken(req: express.Request) {
    const token = req.headers["Authorization"];
    console.log('TOKEN', token);
    if (!token || token !== BEARER_TOKEN) {
        return false;
    }
    return true;
}
