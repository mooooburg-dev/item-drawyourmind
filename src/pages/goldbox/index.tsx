import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Props = {
  data: any;
};
export default function GoldBox({ data }: Props) {
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setProductData(data);
    }
  }, [data]);

  return (
    <div className="p-4">
      <h1>GoldBox</h1>
      {productData && productData.length > 0 && (
        <div className="flex flex-col gap-4">
          {productData.map((item, index) => (
            <div key={item.productId} className="flex gap-3 items-center">
              <div className="w-9 p-2">
                <span className="text-2xl">{item.rank}</span>
              </div>
              <Image
                src={item.productImage}
                alt={item.productName}
                width={120}
                height={120}
              />
              <div className="flex flex-col text-md">
                <span className=" line-clamp-2">{item.productName}</span>
                <div>
                  <span className="text-xl">{item.productPrice}</span>
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
  const url: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/goldbox`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const result: any = await response.json();

  return {
    props: {
      data: result.data,
    },
  };
};
