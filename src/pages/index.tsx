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

  const handleItemClick = (url: string) => {
    window.open(url, '_blank');
  };

  const init = () => {
    fetchItems();
  };

  useEffect(init, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-5 ${inter.className}`}
    >
      {/* <h1>item.drawyourmind.com</h1> */}
      <div className="w-full">
        {data &&
          data.map((item) => (
            <div
              className={`item h-20 flex items-center bg-red-400`}
              key={item._id}
              onClick={() => handleItemClick(item.url)}
            >
              <div className="w-20 text-center">{`${String(item.no).padStart(
                4,
                '0'
              )}`}</div>
              <div>
                <Image
                  src={item.image}
                  width={60}
                  height={60}
                  alt={item.name}
                />
              </div>
              <div className="mx-4">{item.name}</div>
            </div>
          ))}
      </div>
    </main>
  );
}
