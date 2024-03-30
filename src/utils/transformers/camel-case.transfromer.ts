import { camelCase } from 'lodash';

export const CAMEL_CASE = (obj) => {
  console.log(obj, 'objek');
  if (Array.isArray(obj)) {
    return obj.map((v) => CAMEL_CASE(v));
  } else if (obj != null && typeof obj === 'object') {
    console.log('objek2');
    const transformedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        transformedObj[camelCase(key)] = obj[key];
      }
    }
    return transformedObj;
  } else {
    return obj;
  }
};
