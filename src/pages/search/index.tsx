import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { moneyFormatter } from '@/helpers/utils';
import 'moment/locale/ko';

type Props = {
  keyword: string;
  current: string;
  isMatch?: boolean;
  isPrice?: boolean;
  minPrice?: number;
  data: any;
};
export default function Search({
  keyword,
  current,
  isMatch = false,
  isPrice = false,
  minPrice,
  data,
}: Props) {
  const router = useRouter();
  const seoTitle = isPrice
    ? `지금 ${keyword} 최저가 BEST 상품`
    : `지금 제일 잘팔리는 ${keyword} BEST`;
  const [productData, setProductData] = useState<any[]>([]);

  const handlePriceClick = (name: string) => {
    router.push(`/price?keyword=${name.split(' ')[0]}`);
  };

  const landingClickHandler = () => {
    const landingUrl = data?.landingUrl;
    window.open(landingUrl, '_blank');
  };

  const itemClickHandler = (item: any) => {
    const { productUrl } = item;
    window.open(productUrl, '_blank');
  };

  useEffect(() => {
    if (data) {
      let filterData = data.productData.filter(
        (item: any) => minPrice! < item.productPrice
      );

      if (isPrice) {
        filterData = filterData.sort(
          (a: any, b: any) => a.productPrice - b.productPrice
        );
      }

      const wordsToMatch = keyword.split(' ');
      const regexPatterns = wordsToMatch.map((word) => `(?=.*${word})`);
      const combinedRegex = new RegExp(regexPatterns.join(''));
      if (isMatch) {
        filterData = filterData.filter((item: any) => {
          if (combinedRegex.test(item.productName)) {
            return item;
          }
        });
      }

      setProductData(filterData);
    }
  }, [data]);

  return (
    <>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: `${seoTitle}`,
          url: `https://item.drawyourmind.com/search?keyword=${keyword}`,
          description: `${keyword}! 역시 잘 나가는건 이유가 있어!`,
          type: 'article',
          images: [
            {
              url: data.productData[0].productImage,
              alt: data.productData[0].productName,
            },
          ],
        }}
        additionalMetaTags={[
          { name: 'title', content: seoTitle },
          {
            name: 'keywords',
            content: `${seoTitle}`,
          },
        ]}
      />
      <div className="max-w-7xl flex flex-col items-center p-5 min-h-screen mx-auto">
        <div className="flex flex-col text-center">
          {isPrice ? (
            <div className="flex flex-col text-center">
              <span className="text-sm">⏰ {current} 현재</span>
              <span className="text-xl text-purple-600 font-bold">
                "{keyword}"
              </span>
              <span className="text-xl font-bold">
                착한가격 TOP{productData.length}
              </span>
            </div>
          ) : (
            <div className="flex flex-col text-center ">
              <span className="text-sm">⏰ {current} 현재</span>

              <span className="text-xl font-bold break-words">
                제일 잘 팔리는{' '}
                <span
                  className="text-purple-600 text-xl font-bold"
                  onClick={landingClickHandler}
                >
                  "{keyword}"
                </span>{' '}
                BEST
              </span>
            </div>
          )}
        </div>
        {productData && productData.length > 0 && (
          <>
            <div className="flex flex-col flex-grow gap-6 mt-8">
              {productData.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => itemClickHandler(item)}
                >
                  <div className="relative w-20 h-20 min-h-24 min-w-24 rounded-lg overflow-hidden">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-md">
                    <span className="break-words line-clamp-2">
                      {item.productName}
                    </span>
                    <div>
                      <span className="text-xl font-bold text-purple-600">
                        {moneyFormatter(item.productPrice)}
                      </span>
                      <span>원</span>
                    </div>
                    <div className="text-xs mt-1">
                      {item.isRocket && <span>빠른배송</span>}
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
            <div className="mt-10 my-4">
              <span className="text-sm">
                파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있음
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const keyword = query.keyword;
  const isMatch: boolean = query.isMatch ? JSON.parse(query.isMatch) : false;
  const isPrice: boolean = query.isPrice ? JSON.parse(query.isPrice) : false;
  const minPrice: number = query.minPrice ? Number(query.minPrice) : 0;

  // const current = moment().locale('ko').format('MMMM Do YYYY, h:mm:ss a');
  const current = moment().tz('Asia/Seoul').format('M월 D일 h시m분');

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
  // const result: any = await response.json();

  return {
    props: {
      keyword,
      current,
      isMatch,
      isPrice,
      minPrice,
      data: result.data,
    },
  };
};
