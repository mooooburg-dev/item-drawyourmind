import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import * as gtag from '../helpers/gtag';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const fetchItems = async () => {
    const response = await fetch('/api/items');

    const { result } = await response.json();

    setData(result);
  };

  const handleItemClick = (item: any) => {
    const { no, name, url } = item;

    // GA
    gtag.event('view_item', {
      event_category: 'Item',
      event_label: name,
      value: no,
    });

    window.open(url, '_blank');
  };

  const init = () => {
    fetchItems();
  };

  useEffect(init, []);

  return (
    <main className={`items-center w-full ${inter.className} bg-slate-950`}>
      <div className="max-w-7xl flex flex-col items-center p-5 min-h-screen mx-auto">
        <Image src={'/assets/logo.png'} width={100} height={100} alt="logo" />
        <div className="my-5 flex flex-col items-center text-white">
          <span>갓생도 템빨</span>
          <span>item.drawyourmind.com</span>
        </div>
        {data && data.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.map((item) => (
              <div
                className={`item h-20 w-full flex items-center bg-red-400 text-white cursor-pointer rounded-lg p-2 gap-2`}
                key={item._id}
                onClick={() => handleItemClick(item)}
              >
                <div className="relative min-h-16 min-w-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="60px, 60px"
                  />
                </div>
                <div className="items-start flex flex-col ">
                  <div className="min-w-16">{`[${String(item.no).padStart(
                    4,
                    '0'
                  )}]`}</div>
                  <div className="break-keep line-clamp-2 leading-5 font-bold">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-28">
            <div className="loader" />
            <span className="text-white h-full mt-14">
              상품 정보를 불러오고 있습니다..
            </span>
          </div>
        )}

        <div className="mt-8">
          {data && data.length > 0 && (
            <p className="text-sm text-gray-300">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
              수수료를 제공받습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
