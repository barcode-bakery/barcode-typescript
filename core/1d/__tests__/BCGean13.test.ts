'use strict';

import { BCGLabel } from '@barcode-bakery/barcode-common';
import { beforeEach, describe, it } from '@jest/globals';
import { deepStrictEqual, strictEqual } from 'assert';
import { BCGean13 } from '../src/BCGean13';

const defaultText = '123456789012',
  secondText = '210987654321';
describe('Ean13', function () {
  let instance: BCGean13;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  beforeEach(function () {
    instance = new BCGean13();
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
    describe('with no label', function () {
      it('should work with scale=1', function () {
        const scale = 1;
        instance.setLabel(null);
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        deepStrictEqual(instance.getDimension(0, 0), [(7 * 12 + 3 + 5 + 3) * scale, 30 * scale]);
      });

      it('should work with scale=2 and extra positioning', function () {
        const scale = 2,
          left = 5,
          top = 10;
        instance.setLabel(null);
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        deepStrictEqual(instance.getDimension(left, top), [(7 * 12 + 3 + 5 + 3 + left) * scale, (30 + top) * scale]);
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
        deepStrictEqual(instance.getDimension(left, top), [(7 * 12 + 3 + 5 + 3 + left + offsetX) * scale, (30 + top + offsetY) * scale]);
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
        // We should test Y
      });

      it('should work with scale=2', function () {
        const scale = 2;
        instance.setScale(scale);
        instance.setThickness(30);
        instance.parse(defaultText);
        const label: BCGLabel = getProtectedField('defaultLabel');
        strictEqual(label.getPosition(), BCGLabel.Position.Bottom);
        // We should test Y
      });
    });
  });
});
