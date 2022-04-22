import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    const { data } = await axios.post('http://server.crypto-crunch-tech.com:8080/api/v1/defi', req.body)
    res.status(200).json(data)
  }
}
