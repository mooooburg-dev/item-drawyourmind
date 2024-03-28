import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import ProductList from '@/components/item/productList/ProductList';
import Footer from '@/components/item/footer/Footer';
import Header from '@/components/item/header/Header';
import Loading from '@/components/item/loading/Loading';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const seoTitle = '갓생도 템빨';
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (data: any) => {
    const params: any = {
      query: data,
    };

    fetchItems(params);
  };

  const fetchItems = async (params?: any) => {
    setLoading(true);
    const url = params.query
      ? `/api/items?${new URLSearchParams(params)}`
      : '/api/items';
    const response = await fetch(url);

    const { result } = await response.json();

    setData(result);
    setLoading(false);
  };

  return (
    <>
      <NextSeo
        title={`갓생도 템빨`}
        openGraph={{
          title: `${seoTitle}`,
          url: `https://item.drawyourmind.com/`,
          description: `나만 모르는 잇템은 용납 할 수 없지!`,
          type: 'article',
          images: [
            {
              url: `https://item-drawyourmind.s3.ap-northeast-2.amazonaws.com/assets/logo.png`,
              alt: `${seoTitle} 로고`,
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
      <main className={`items-center w-full ${inter.className} bg-slate-950`}>
        <div className="max-w-7xl flex flex-col items-center p-5 min-h-screen mx-auto">
          <Header onSearch={handleSearch} />
          {loading ? <Loading /> : <ProductList data={data} />}
          {!loading && data && data.length > 0 && <Footer />}
        </div>
      </main>
    </>
  );
}
