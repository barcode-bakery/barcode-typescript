'use strict';

import { beforeEach, describe } from '@jest/globals';
import { BCGdatabarexpanded } from '../src/BCGdatabarexpanded';

let code = 'DatabarExpanded';

describe(code, function () {
  let instance: BCGdatabarexpanded;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  beforeEach(function () {
    instance = new BCGdatabarexpanded();
  });
});
