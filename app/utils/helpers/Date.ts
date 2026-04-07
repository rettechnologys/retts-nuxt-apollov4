import { APP } from '~/utils/config';
import Moment, { MomentInput } from 'moment';

export function isValidDate(d: MomentInput, format?: string): boolean {
  return Moment(d, format ?? APP.DATE_FORMAT, true).isValid();
}

export function formatMomentDate(
  d: MomentInput,
  format = APP.DATETIME_FORMAT,
  locale = 'id',
) {
  const moment = Moment(d);

  if (locale) {
    moment.locale(locale);
  }

  return moment.format(format);
}

export const objStrDateToDate = (data: any) => {
  const newData: any = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach((key) => {
    if (data[key] === Object(data[key]))
      newData[key] = objStrDateToDate(data[key]);
    else {
      if (/date/i.test(key) && isNaN(data[key]) && isValidDate(data[key])) {
        newData[key] = data[key] ? new Date(data[key]) : undefined;
      } else {
        newData[key] = data[key];
      }

      console.log('objStrDateToDate', key, newData[key], isNaN(data[key]));
    }
  });

  return newData;
};

export const objDateToStrDate = (data: any) => {
  const newData: any = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach((key) => {
    if (data[key] === Object(data[key])) {
      if (/date/i.test(key) && isValidDate(data[key])) {
        newData[key] = formatMomentDate(data[key], APP.BE_DATE_FORMAT);
      } else {
        newData[key] = objDateToStrDate(data[key]);
      }
      // console.log('objDateToStrDate1', key, newData[key]);
    } else {
      newData[key] = data[key];

      //console.log('objDateToStrDate2', key, newData[key]);
    }
  });

  return newData;
};
