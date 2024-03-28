import ProductItem from '../productItem/ProductItem';

type ProductListType = {
  data: any;
};

export default function ProductList({ data }: ProductListType) {
  return (
    <div className="flex-grow w-full">
      {data && data.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          {data.map((item: any) => (
            <ProductItem item={item} key={item.name} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-28">
          <span className="text-white h-full mt-14">검색 결과가 없습니다.</span>
        </div>
      )}
    </div>
  );
}
