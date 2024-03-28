import Image from 'next/image';
import SearchArea from '../searchArea/SearchArea';

type HeaderType = {
  onSearch: (query: string) => void;
};
export default function Header({ onSearch }: HeaderType) {
  return (
    <>
      <Image src={'/assets/logo.png'} width={80} height={80} alt="logo" />
      {/* <div className=" flex flex-col items-center text-white w-full">
        <span>갓생도 템빨</span>
      </div> */}
      <SearchArea onSearch={onSearch} />
    </>
  );
}
