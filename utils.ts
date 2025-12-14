import { CURRENCIES, RATES } from './constants';

export const formatMoney = (amount: number | string | undefined, currencyCode: string | undefined) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const val = typeof amount === 'number' ? amount : 0;
  return `${currency.symbol}${val.toLocaleString()}`;
};

export const convertToILS = (amount: number | string | undefined, currencyCode: string | undefined) => {
  const val = typeof amount === 'number' ? amount : 0;
  const rate = RATES[currencyCode || 'ILS'] || 1;
  return val * rate;
};