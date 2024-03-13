import { moneyFormatter } from '@/helpers/utils';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import 'moment/locale/ko';

type Props = {
  keyword: string;
  current: string;
  data: any;
};
export default function Search({ keyword, current, data }: Props) {
  const router = useRouter();
  const [productData, setProductData] = useState<any[]>([]);

  const handlePriceClick = (name: string) => {
    router.push(`/price?keyword=${name.split(' ')[0]}`);
  };

  useEffect(() => {
    if (data) {
      setProductData(data.productData);
    }
  }, [data]);

  return (
    <div className="max-w-7xl flex flex-col items-center p-5 min-h-screen mx-auto">
      <div className="flex flex-col">
        <span>{current} 기준</span>
        <span className="text-xl font-bold">
          가장 잘 팔리는 "{keyword}" BEST10
        </span>
      </div>
      {productData && productData.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {productData.map((item, index) => (
            <div key={item.productId} className="flex gap-3 items-center">
              {/* <div className="w-9 p-2">
                <span className="text-2xl">{item.rank}</span>
              </div> */}
              <Image
                src={item.productImage}
                alt={item.productName}
                width={120}
                height={120}
              />
              <div className="flex flex-col text-md">
                <span className="break-words line-clamp-2">
                  {item.productName}
                </span>
                <div>
                  <span className="text-xl font-bold">
                    {moneyFormatter(item.productPrice)}
                  </span>
                  <span>원</span>
                </div>
                <div className="text-xs mt-2">
                  {item.isRocket && <span>로켓배송</span>}
                  {item.isFreeShipping && <span>무료배송</span>}
                </div>
                {/* <div>
                  <button onClick={() => handlePriceClick(item.productName)}>
                    최저가 찾아보기
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const keyword = query.keyword;
  const current = moment().locale('ko').format('MMMM Do YYYY, h:mm:ss a');

  const params: any = {
    ...query,
    subId: 'drawyourmind',
  };

  const searchParams: string = new URLSearchParams(params).toString();

  const url: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/search?${searchParams}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const result: any = await response.json();

  return {
    props: {
      keyword: keyword,
      current: current,
      data: result.data,
    },
  };
};
