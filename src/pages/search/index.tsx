import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Props = {
  keyword: string;
  data: any;
};
export default function Search({ keyword, data }: Props) {
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setProductData(data.productData);
    }
  }, [data]);
  return (
    <div>
      <div>
        <span>{keyword}</span>
      </div>
      {productData &&
        productData.length > 0 &&
        productData.map((item, index) => (
          <div key={item.productId}>
            <Image
              src={item.productImage}
              alt={item.productName}
              width={200}
              height={200}
            />
            <div>{item.productName}</div>
          </div>
        ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const keyword = query.q;

  console.log(`keyword: ${keyword}`);

  const response = await fetch(
    `http://localhost:3000/api/products/search?keyword=${keyword}`,
    {
      method: 'GET',
    }
  );

  const result: any = await response.json();
  console.log(result);

  return {
    props: {
      keyword: keyword,
      data: result.data,
    },
  };
};
