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
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        {data &&
          data.map((item) => (
            <div
              className={`item w-full h-7 flex items-center gap-3`}
              key={item._id}
              onClick={() => handleItemClick(item.url)}
            >
              <div>{item.no}</div>
              <div>
                <Image
                  src={item.image}
                  width={60}
                  height={60}
                  alt={item.name}
                />
              </div>
              <div>{item.name}</div>
            </div>
          ))}
      </div>
    </main>
  );
}
