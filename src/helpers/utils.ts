const _ = require('lodash');

export const moneyFormatter = (number: number) => {
  return _.toNumber(number).toLocaleString('en-US');
};

// const amount = 1000000; // 예시로 100만원을 사용합니다.
// const formattedAmount = numberWithCommas(amount);

// console.log(formattedAmount); // 출력: 1,000,000
