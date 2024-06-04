'use strict';

import { beforeEach, describe } from '@jest/globals';
import { BCGqrcode } from '../src/BCGqrcode';

let code = 'QRCode';

describe(code, function () {
  let instance: BCGqrcode;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  beforeEach(function () {
    instance = new BCGqrcode();
  });
});
