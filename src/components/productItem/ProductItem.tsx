import React from 'react';
import { moneyFormatter } from '@/helpers/utils';

type ProductItemType = {
  item: any;
  index: number;
  isRank?: boolean;
};
export default function ProductItem({
  item,
  index,
  isRank = true,
}: ProductItemType) {
  const itemClickHandler = () => {
    const { productUrl } = item;
    window.open(productUrl, '_self');
  };

  const handleDetailClick = () => {
    const { landingUrl } = item;
    window.open(landingUrl, '_self');
  };

  return (
    <div
      key={item.productId}
      className="flex gap-3 items-center cursor-pointer"
      onClick={itemClickHandler}
    >
      {isRank && index < 3 && (
        <img
          src={`/assets/medal${index}.png`}
          alt={item.productName}
          className="w-8 h-8 object-cover absolute z-10 -ml-4 -mt-16"
        />
      )}
      <div className="relative w-20 h-20 min-h-24 min-w-24 rounded-lg overflow-hidden">
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-full h-full object-cover absolute"
        />
      </div>
      <div className="flex flex-col text-md">
        <span className="break-words line-clamp-2">{item.productName}</span>
        <div>
          <span className="text-xl font-bold text-purple-600">
            {moneyFormatter(item.productPrice)}
          </span>
          <span>원</span>
        </div>
        <div>
          <button
            className="border p-1 text-xs bg-purple-200 font-bold"
            onClick={handleDetailClick}
          >
            자세히 보기
          </button>
        </div>
        <div className="text-xs mt-1">
          {item.isRocket && <span>빠른배송</span>}
          {item.isFreeShipping && <span>무료배송</span>}
        </div>
      </div>
    </div>
  );
}
