import { moneyFormatter } from '@/helpers/utils';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import 'moment/locale/ko';

type Props = {
  keyword: string;
  current: string;
  isMatch?: boolean;
  isPrice?: boolean;
  data: any;
};
export default function Search({
  keyword,
  current,
  isMatch = false,
  isPrice = false,
  data,
}: Props) {
  const router = useRouter();
  const seoTitle = isPrice
    ? `현재 ${keyword} 최저가 BEST 상품`
    : `현재 가장 잘나가는 ${keyword} BEST10`;
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
      const wordsToMatch = keyword.split(' ');
      const regexPatterns = wordsToMatch.map((word) => `(?=.*${word})`);
      const combinedRegex = new RegExp(regexPatterns.join(''));

      let filterData = data.productData;

      if (isPrice) {
        filterData = data.productData.sort((a: any, b: any) => {
          return a.productPrice - b.productPrice;
        });
      }

      if (isMatch) {
        filterData = data.productData.filter((item: any) => {
          if (combinedRegex.test(item.productName)) {
            console.log('문자열에 배열에 있는 모든 단어가 포함되어 있습니다.');
            return item;
          } else {
            console.log(
              '문자열에 배열에 있는 모든 단어가 포함되어 있지 않습니다.'
            );
          }
        });
      }

      setProductData(filterData);

      // setProductData(data.productData);
    }
  }, [data]);

  return (
    <>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: `${seoTitle}`,
          url: `https://item.drawyourmind.com/search?keyword=${keyword}`,
          description: `${seoTitle}`,
          type: 'article',
          images: [
            {
              url: data.productData[0].productUrl,
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
              <span className="text-xl text-purple-600 font-bold">
                "{keyword}"
              </span>
              <span className="text-xl font-bold">
                착한가격 TOP{productData.length}
              </span>
            </div>
          ) : (
            <div className="flex flex-col text-center">
              <span className="text-sm">{current} 현재</span>
              <span
                className="text-purple-600 font-bold"
                onClick={landingClickHandler}
              >
                "{keyword}"
              </span>
              <span className="text-xl font-bold break-words">
                가장 잘 나가는 BEST10
              </span>
            </div>
          )}
        </div>
        {productData && productData.length > 0 && (
          <div className="flex flex-col gap-6 mt-8">
            {productData.map((item, index) => (
              <div
                key={item.productId}
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => itemClickHandler(item)}
              >
                {/* <div className="w-9 p-2">
                <span className="text-2xl">{item.rank}</span>
              </div> */}
                <div className="relative min-h-24 min-w-24 rounded-lg overflow-hidden">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="180px, 180px"
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
            <div className="mt-10 my-4">
              <span className="text-sm">
                파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있음
              </span>
            </div>
          </div>
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

  // const current = moment().locale('ko').format('MMMM Do YYYY, h:mm:ss a');
  const current = moment().locale('ko').format('MMMM Do a h시mm분');

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
      keyword,
      current,
      isMatch,
      isPrice,
      data: result.data,
    },
  };
};
