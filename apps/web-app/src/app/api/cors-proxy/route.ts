import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'URL must be a string' })
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    res.setHeader('Content-Type', 'application/pdf')
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDF' })
  }
}