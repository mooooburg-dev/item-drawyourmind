export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center absolute z-40 h-lvh mt-72">
      <div className="loader" />
      <span className="text-white h-full mt-14">
        방금 본 상품 찾고 있는 중...
      </span>
    </div>
  );
}
