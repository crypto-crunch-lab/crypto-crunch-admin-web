import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { DefaultResponse } from '../../../../types/DefaultResponse'

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse<string[]>>) {
  if (req.method === 'GET') {
    const { data } = await axios.get('http://server.crypto-crunch-tech.com:8080/api/v1/defi/svc/networks')
    res.status(200).json(data.data)
  }
}
