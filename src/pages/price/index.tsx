import { moneyFormatter } from '@/helpers/utils';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Props = {
  keyword: string;
  isMatch?: boolean;
  data: any;
};
export default function Price({ keyword, isMatch = false, data }: Props) {
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const wordsToMatch = keyword.split(' ');
      const regexPatterns = wordsToMatch.map((word) => `(?=.*${word})`);
      const combinedRegex = new RegExp(regexPatterns.join(''));

      const filterData = isMatch
        ? data.productData
            .filter((item: any) => {
              if (combinedRegex.test(item.productName)) {
                console.log(
                  '문자열에 배열에 있는 모든 단어가 포함되어 있습니다.'
                );
                return item;
              } else {
                console.log(
                  '문자열에 배열에 있는 모든 단어가 포함되어 있지 않습니다.'
                );
              }
            })
            .sort((a: any, b: any) => {
              return a.productPrice - b.productPrice;
            })
        : data.productData.sort((a: any, b: any) => {
            return a.productPrice - b.productPrice;
          });
      setProductData(filterData);
    }
  }, [data]);

  return (
    <div className="max-w-7xl flex flex-col items-center p-5 min-h-screen mx-auto">
      <div className="flex flex-col sticky top-0 bg-gray-50">
        <span className="text-2xl font-bold">"{keyword}"</span>
        <span className="text-2xl">착한가격 TOP {productData.length}</span>
      </div>
      {productData && productData.length > 0 && (
        <div className="flex flex-col gap-6 mt-4">
          {productData.map((item, index) => (
            <div
              key={`${item.productId}${index}`}
              className="flex gap-3 items-center"
            >
              {/* <div className="w-9 p-2">
                <span className="text-2xl">{index + 1}</span>
              </div> */}
              <Image
                src={item.productImage}
                alt={item.productName}
                width={100}
                height={100}
              />
              <div className="flex flex-col text-md">
                <span className=" line-clamp-2">{item.productName}</span>
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
  const { keyword } = query;
  const isMatch: boolean = query.isMatch ? JSON.parse(query.isMatch) : false;

  const params: string = new URLSearchParams(query).toString();
  const url: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/search?${params}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const result: any = await response.json();
  // console.log(result);

  return {
    props: {
      keyword,
      isMatch,
      data: result.data,
    },
  };
};
