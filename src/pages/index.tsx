import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

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
    window.open(url, '_blank');
    window.gtag('event', 'click', {
      event_category: 'Item',
      event_label: name,
      value: no,
    });
  };

  const init = () => {
    fetchItems();
  };

  useEffect(init, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-5 ${inter.className} bg-slate-950`}
    >
      <Image src={'/assets/logo.png'} width={100} height={100} alt="logo" />
      <h1 className="my-5"></h1>
      {/* <h1>item.drawyourmind.com</h1> */}
      <div className="w-full flex flex-col gap-2">
        {data &&
          data.map((item) => (
            <div
              className={`item h-20 w-full flex items-center bg-red-400 rounded-lg`}
              key={item._id}
              onClick={() => handleItemClick(item)}
            >
              <div className="min-w-16 text-center">{`${String(
                item.no
              ).padStart(4, '0')}`}</div>
              <div className="min-w-16">
                <Image
                  src={item.image}
                  width={60}
                  height={60}
                  alt={item.name}
                />
              </div>
              <div className="break-keep ">{item.name}</div>
            </div>
          ))}
      </div>
    </main>
  );
}
