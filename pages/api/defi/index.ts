import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { DefaultResponse } from '../../../types/DefaultResponse'
import { Defi } from '../../../types/defi/Defi'

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse<Defi[]>>) {
  if (req.method === 'POST') {
    const { data } = await axios.post('http://server.crypto-crunch-tech.com:8080/api/v1/defi/svc', req.body)
    res.status(200).json(data.data)
  }
}
