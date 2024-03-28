import ProductItem from '@/components/productItem/ProductItem';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import 'moment/locale/ko';
import moment from 'moment-timezone';
import { NextSeo } from 'next-seo';

type Props = {
  data: any;
  current: string;
};
export default function GoldBox({ data, current }: Props) {
  const [productData, setProductData] = useState<any[]>([]);
  const seoTitle = '오늘만 이가격! 최대 80%할인!';

  useEffect(() => {
    if (data) {
      setProductData(data);
    }
  }, [data]);

  return (
    <>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: `${seoTitle}`,
          url: 'https://item.drawyourmind.com/goldbox',
          description: '오늘만 이가격! 나만 모르고 있었어!',
          type: 'article',
          images: [
            {
              url: data[0].productImage,
              alt: data[0].productName,
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
        <div className="flex flex-col text-center font-['JalnanGothic']">
          <span className="text-sm">📆 {current}</span>
          <h1 className={`text-3xl mt-2`}>
            최대 <span className="text-purple-600">80%</span>할인
          </h1>
          <h1 className={`text-3xl`}>오늘만 이 가격!</h1>
        </div>
        {productData && productData.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {productData.map((item, index) => (
              <ProductItem
                item={item}
                index={index}
                key={item.productId}
                isRank={false}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const url: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/goldbox`;
  const current = moment().tz('Asia/Seoul').format('YY년 M월 D일');

  const response = await fetch(url, {
    method: 'GET',
  });

  const result: any = await response.json();
  console.log(result);

  return {
    props: {
      current,
      data: result.data,
    },
  };
};
