import { generateHmac } from '@/helpers/generateHmac';
import { NextApiRequest, NextApiResponse } from 'next';
import Error from 'next/error';

const ACCESS_KEY: string = 'adb8681c-41ba-477b-9840-19daec90333c';
const SECRET_KEY: string = '344ab4dead272126a075b5a8b002ca08b85348fa';
const DOMAIN: string = 'https://api-gateway.coupang.com';
const BASE_URL: string = '/v2/providers/affiliate_open_api/apis/openapi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const { pathParam } = query;
  const params: any = { ...query };
  delete params['pathParam'];

  const requestUrl = BASE_URL + req.url?.split('/api')[1];
  let url: string = DOMAIN + requestUrl;

  const init: any = { headers: {} };

  if (req.method === 'GET') {
  } else {
    init.method = method;
    init.body = req.body;
  }

  const authorization = await generateHmac(
    method!,
    requestUrl,
    SECRET_KEY,
    ACCESS_KEY
  );

  init.headers = {
    ...init.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authorization,
  };

  try {
    const response: any = await fetch(url, init);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
