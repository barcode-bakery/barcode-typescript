'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { Surface } from './draw';

export function arraySearch(arr: string[], val: string): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      return i;
    }
  }

  return -1;
}

export function substrCount(haystack: string, needle: string): number {
  let count = -1,
    previousPos = 0;
  while (previousPos >= 0) {
    previousPos = haystack.indexOf(needle, previousPos);
    count++;
    if (previousPos >= 0) {
      previousPos += needle.length;
    }
  }

  return count;
}

export function strRepeat(input: string, multiplier: number): string {
  return Array(multiplier + 1).join(input);
}

export function stringSplit(text: string, splitLength: number): string[] {
  const arr: string[] = [];
  let counter = 0;
  while (counter * splitLength < text.length) {
    arr.push(text.substring(counter * splitLength, counter * splitLength + splitLength));
    counter++;
  }

  return arr;
}

export function setColor(image: Surface, color: { r: number; g: number; b: number }): void {
  image.context.fillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
}

export function setFont(image: Surface, font: string, size: string): void {
  image.context.font = size + ' ' + font;
}

export function regexpQuote(str: string): string {
  return str.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, '\\$1');
}

export function strrev(str: string): string {
  return (str || '').split('').reverse().join('');
}

export const clone = structuredClone;

export function arraySum(array: number[]): number {
  return array.reduce(function (a, b) {
    return a + b;
  });
}

export function isInt(num: number): boolean {
  return num === (num | 0);
}

export function bindec(binary: number | string): number {
  binary = (binary + '').replace(/[^01]/gi, '');
  return parseInt(binary, 2);
}

export function decbin(number: number, bits: number = 0): string {
  return pad((number >>> 0).toString(2), bits, '0', true);
}

export function print_r(): string {
  return '';
}

export function strSplit(str: string, length: number): string[] | null {
  if (str == null || !str.toString() || length < 1) {
    return null;
  }

  return str.toString().match(new RegExp('.{1,' + (length || '1') + '}', 'gs'));
}

export function isNumeric(input: string): boolean {
  return /^[0-9]+[\.,]{0,1}[0-9]*$/i.test(input);
}

export function pad(str: string, length: number, padString: string, left: boolean): string {
  padString = padString || '0';

  if (str.length >= length) {
    return str;
  }

  const repeat = strRepeat(padString, length - str.length);
  if (left) {
    return repeat + str;
  }

  return str + repeat;
}

export function safeSubstring(str: string | null, startIndex: number, length: number | null = null): string {
  if (str == null || str == '') {
    return '';
  }

  if (length === null) {
    length = str.length - startIndex;
  }

  if (startIndex < 0) {
    startIndex = Math.max(0, str.length + startIndex);
  }

  if (length < 0) {
    length = Math.max(0, str.length - startIndex + length);
  }

  if (startIndex > str.length - 1) {
    return '';
  }

  return str.substring(startIndex, startIndex + Math.min(length, str.length - startIndex));
}
