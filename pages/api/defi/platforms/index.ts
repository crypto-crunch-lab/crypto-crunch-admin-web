import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>) {
  if (req.method === 'GET') {
    const { data } = await axios.get('http://server.crypto-crunch-tech.com:8080/api/v1/defi/admin/platforms', req.body)
    res.status(200).json(data)
  }
}
