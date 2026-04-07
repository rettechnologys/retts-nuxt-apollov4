import type { IFormField, IMessage, IOptionSelect } from '@/utils/types/Form';
import { replaceBracketStr, formatMessageStr, IFormatMessage } from './String';
import { isValidDate } from './Date';

export function getTextAndValueFromEnum(val: any): IOptionSelect[] {
  const arr: IOptionSelect[] = [];
  for (const key in val) {
    // const isValueProperty = Number(key) >= 0;

    if (isNaN(parseFloat(key))) {
      arr.push({ value: val[key].toString(), text: key.toString() });
    }
  }

  return arr;
}

export function parseFailureMessageFromFields(
  message: IMessage,
  fields: IFormField[],
  format?: IFormatMessage,
) {
  if (message) {
    //console.log('parseFailureMessageFromFields', Array.isArray(message));
    if (Array.isArray(message)) {
      return formatMessageStr(
        message.map(function (msg) {
          fields.forEach((field) => {
            if (msg.includes(field.name)) {
              msg = replaceBracketStr({
                fullStr: msg,
                findStr: field.name,
                replaceStr: field.label || field.name,
                symbol: 'round',
              });
            }
          });

          return msg;
        }),
        format,
      );
    } else {
      let msg = message;
      fields.forEach((field) => {
        if (msg.includes(field.name)) {
          msg = replaceBracketStr({
            fullStr: msg,
            findStr: field.name,
            replaceStr: field.label || field.name,
            symbol: 'round',
          });
        }
      });

      return formatMessageStr(msg, format);
    }
  }
  return undefined;
}

export const sanitizeData = (data: any) => {
  const newData: any = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof File) {
      newData[key] = data[key];
    } else if (data[key] instanceof Date) {
      newData[key] = data[key];
    } else if (data[key] === Object(data[key])) {
      newData[key] = sanitizeData(data[key]);
    } else if (
      data[key] !== undefined &&
      data[key] !== null &&
      data[key] !== ''
    ) {
      newData[key] = data[key];
    }
  });

  return newData;
};
