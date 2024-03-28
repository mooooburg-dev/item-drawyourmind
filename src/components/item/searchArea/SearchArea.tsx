import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoCloseCircleSharp } from 'react-icons/io5';

type SearchAreaType = {
  onSearch: (query: string) => void;
};
export default function SearchArea({ onSearch }: SearchAreaType) {
  const [keyword, setKeyword] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeywordChange = (e: any) => {
    const value = e?.target?.value;
    setKeyword(value);
  };

  const handleSearchClickHandler = () => {
    // setTv(false);
    // setSortType('popularity_score_desc');
    setQuery(keyword);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      e.stopPropagation();
    }

    if (e.key === 'Enter') {
      // setTv(false);
      // setSortType('popularity_score_desc');
      setQuery(keyword);
    }
  };

  const handleClearClick = () => {
    setKeyword('');
  };

  useEffect(() => {
    onSearch && onSearch(query);
  }, [query]);

  return (
    <>
      <div className="flex p-2 gap-2 sticky top-0 z-10 w-lvw max-w-7xl">
        {/* <button>
      <I oIosArrowBack size={24} />
    </button> */}
        <div className="rounded-full bg-gray-200 flex w-full items-center">
          <input
            name="keyword"
            ref={inputRef}
            type="number"
            value={keyword}
            className="m-2 bg-transparent w-full h-7 text-sm p-2 outline-none"
            placeholder="제품번호를 입력해주세요."
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
          />
          {keyword && (
            <IoCloseCircleSharp
              className="text-gray-400"
              size={28}
              onClick={handleClearClick}
            />
          )}
          <FaSearch
            className="text-gray-700 mr-4 ml-1"
            size={24}
            onClick={handleSearchClickHandler}
          />
        </div>
      </div>
    </>
  );
}
