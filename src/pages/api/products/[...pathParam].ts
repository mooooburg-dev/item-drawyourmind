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
    'Content-Type': 'application/json',
    'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
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
