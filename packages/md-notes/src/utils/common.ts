import { isObject, isArray } from "./typeUtil";

export const compose = (...fncs) => {
  fncs = fncs.reverse();
  let result;
  return function (arg) {
    result = arg;
    for (const fnc of fncs) {
      result = fnc(result);
    }
    return result;
  };
};

export const autoSetObjKey = (key: string, value: any, obj: any = {}) => {
  let lastObj = obj;
  const backObj = lastObj;
  const keyMatch = key.match(/(^\w+\b)|(\.\b(\w+)\b)|(\[\d+\])/g);
  if (!keyMatch) {
    return lastObj;
  }
  const regx = new RegExp(/\[\d+\]/);
  const keyLen = keyMatch.length;
  keyMatch.forEach((matKey, index) => {
    let trueKey: string | number = matKey;
    const isArrIndex = regx.test(matKey);
    const isLastKey = index === keyLen - 1;
    const nextKey = keyMatch[index + 1];
    if (!isArrIndex && index !== 0) {
      trueKey = matKey.slice(1, matKey.length);
    } else if (isArrIndex) {
      const arrIndexMatch = matKey.match(/^\[(\d)+\]$/) || [];
      trueKey = parseInt(arrIndexMatch[1], 10);
    }
    if (isLastKey) {
      lastObj[trueKey] = value;
      return;
    }
    if (!regx.test(nextKey) && !isLastKey && !isObject(lastObj[trueKey])) {
      lastObj[trueKey] = {};
    }
    if (regx.test(nextKey) && !isLastKey && !isArray(lastObj[trueKey])) {
      lastObj[trueKey] = [];
    }
    lastObj = lastObj[trueKey];
  });

  return backObj;
};
