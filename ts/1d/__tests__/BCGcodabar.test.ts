'use strict';

import { beforeEach, describe, it } from '@jest/globals';
import { BCGLabel } from '@barcode-bakery/barcode-common';
import { deepStrictEqual, strictEqual } from 'assert';
import { BCGcodabar } from '../src/BCGcodabar';

const defaultText = 'A12345B',
  secondText = 'C67890D';

describe('Codabar', function () {
  let instance: BCGcodabar;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  beforeEach(function () {
    instance = new BCGcodabar();
  });

  describe('#__fields', function () {
    it('should contain the same amount of data', function () {
      strictEqual(getProtectedField('keys').length, getProtectedField('code').length);
    });
  });

  describe('#label', function () {
    it('should behave properly with some text', function () {
      instance.parse(defaultText);
      strictEqual(instance.getLabel(), defaultText);

      instance.setLabel(secondText);
      strictEqual(instance.getLabel(), secondText);
    });

    it('should behave properly with other text', function () {
      instance.parse(secondText);
      strictEqual(instance.getLabel(), secondText);

      instance.setLabel(defaultText);
      strictEqual(instance.getLabel(), defaultText);
    });
  });

  describe('#maxSize', function () {
    const textLength = 8 + 3 /*A*/ + (8 + 2) /*1*/ + (8 + 2) /*2*/ + (8 + 2) /*3*/ + (8 + 2) /*4*/ + (8 + 2) /*5*/ + (8 + 3); /*B*/

    describe('with no label', function () {
      it('should work with scale=1', function () {
        const scale = 1;
        instance.setLabel(null);
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        deepStrictEqual(instance.getDimension(0, 0), [textLength * scale, 30 * scale]);
      });

      it('should work with scale=2 and extra positioning', function () {
        const scale = 2,
          left = 5,
          top = 10;
        instance.setLabel(null);
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        deepStrictEqual(instance.getDimension(left, top), [(textLength + left) * scale, (30 + top) * scale]);
      });

      it('should work with scale=2 and extra positioning and offset', function () {
        const scale = 2,
          left = 5,
          top = 10,
          offsetX = 20,
          offsetY = 30;
        instance.setLabel(null);
        instance.setScale(scale);
        instance.setThickness(30);
        instance.setOffsetX(offsetX);
        instance.setOffsetY(offsetY);
        instance.parse(defaultText);
        deepStrictEqual(instance.getDimension(left, top), [(textLength + left + offsetX) * scale, (30 + top + offsetY) * scale]);
      });
    });

    describe('with one label', function () {
      it('should work with scale=1', function () {
        const scale = 1;
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        const label: BCGLabel = getProtectedField('defaultLabel');
        strictEqual(label.getPosition(), BCGLabel.Position.Bottom);
      });

      it('should work with scale=2', function () {
        const scale = 2;
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        const label: BCGLabel = getProtectedField('defaultLabel');
        strictEqual(label.getPosition(), BCGLabel.Position.Bottom);
      });
    });
  });
});
