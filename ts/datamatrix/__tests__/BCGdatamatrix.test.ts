'use strict';

import { Utility } from '@barcode-bakery/barcode-common';
import { beforeEach, describe, it } from '@jest/globals';
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { BCGdatamatrix } from '../src/BCGdatamatrix';

let code = 'DataMatrix';

describe(code, function () {
  let instance: BCGdatamatrix;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function invokeMethod(methodName: string, ...parameters: any[]): any {
    return (instance as any)[methodName].apply(instance, parameters);
  }

  function getSymbol() {
    var symbolIndex = getProtectedField('currentSymbolIndex') as number;
    var symbols = getProtectedField('symbols');
    return symbols[symbolIndex];
  }

  beforeEach(function () {
    instance = new BCGdatamatrix();
    instance.setSize(BCGdatamatrix.Size.Smallest);
  });

  it('TestSortSymbol', function () {
    // Symbol is supposed to be sorted right now.
    let symbols = getProtectedField('symbols');

    let previousDataSize = 0;
    let c = symbols.Length;
    for (let i = 0; i < c; i++) {
      let nextDataSize = symbols[i].getDataSize();
      ok(previousDataSize <= nextDataSize);
      previousDataSize = nextDataSize;
    }
  });

  it('TestAccomodateSymbolSquare', function () {
    instance.setSize(BCGdatamatrix.Size.Square);
    strictEqual(getProtectedField('currentSymbolIndex'), 0);

    invokeMethod('accomodateSymbol', 49);
    strictEqual(getProtectedField('currentSymbolIndex'), 15);

    invokeMethod('accomodateSymbol', 144);
    strictEqual(getProtectedField('currentSymbolIndex'), 18);

    invokeMethod('accomodateSymbol', 280);
    strictEqual(getProtectedField('currentSymbolIndex'), 21);

    invokeMethod('accomodateSymbol', 280);
    strictEqual(getProtectedField('currentSymbolIndex'), 21);

    invokeMethod('accomodateSymbol', 5);
    strictEqual(getProtectedField('currentSymbolIndex'), 21);

    try {
      invokeMethod('accomodateSymbol', 999999);
    } catch (tie) {
      strictEqual(tie.message, 'There is no valid symbol that can fit your data.');
    }
  });

  it('TestGetAccomodateSymbolSquare', function () {
    instance.setSize(BCGdatamatrix.Size.Square);
    strictEqual(getProtectedField('currentSymbolIndex'), 0);

    strictEqual(invokeMethod('getAccomodatedSymbolIndex', 49), 15);

    // Field is not changing
    strictEqual(getProtectedField('currentSymbolIndex'), 0);

    strictEqual(invokeMethod('getAccomodatedSymbolIndex', 144), 18);

    strictEqual(invokeMethod('getAccomodatedSymbolIndex', 280), 21);
    strictEqual(invokeMethod('getAccomodatedSymbolIndex', 280), 21);
    strictEqual(invokeMethod('getAccomodatedSymbolIndex', 5), 1);

    try {
      invokeMethod('getAccomodatedSymbolIndex', 999999);
    } catch (tie) {
      strictEqual(tie.message, 'There is no valid symbol that can fit your data.');
    }
  });

  it('TestAccomodateSymbolRectangle', function () {
    instance.setSize(BCGdatamatrix.Size.Rectangle);
    strictEqual(getProtectedField('currentSymbolIndex'), 0);

    invokeMethod('accomodateSymbol', 10);
    strictEqual(getProtectedField('currentSymbolIndex'), 4);

    invokeMethod('accomodateSymbol', 49);
    strictEqual(getProtectedField('currentSymbolIndex'), 14);

    invokeMethod('accomodateSymbol', 10);
    strictEqual(getProtectedField('currentSymbolIndex'), 14);

    try {
      invokeMethod('accomodateSymbol', 999999);
    } catch (tie) {
      strictEqual(tie.message, 'There is no valid symbol that can fit your data.');
    }
  });

  it('TestAccomodateSymbolSmallest', function () {
    instance.setSize(BCGdatamatrix.Size.Smallest);
    strictEqual(getProtectedField('currentSymbolIndex'), 0);

    invokeMethod('accomodateSymbol', 7);
    strictEqual(getProtectedField('currentSymbolIndex'), 3);

    invokeMethod('accomodateSymbol', 16);
    strictEqual(getProtectedField('currentSymbolIndex'), 6);

    invokeMethod('accomodateSymbol', 49);
    strictEqual(getProtectedField('currentSymbolIndex'), 14);

    invokeMethod('accomodateSymbol', 144);
    strictEqual(getProtectedField('currentSymbolIndex'), 18);

    invokeMethod('accomodateSymbol', 280);
    strictEqual(getProtectedField('currentSymbolIndex'), 21);
  });

  it('TestSetStructuredAppend1', function () {
    instance.setStructuredAppend(3, 7, 1);

    let codewords = invokeMethod('getStructuredAppendOrMacroCodewords') as number[];
    strictEqual(codewords.length, 4);
    strictEqual(codewords[0], 233);
    strictEqual(codewords[1], 42);
    strictEqual(codewords[2], 1);
    strictEqual(codewords[3], 1);
  });

  it('TestSetStructuredAppend2', function () {
    instance.setStructuredAppend(1, 16, 45685);

    let codewords = invokeMethod('getStructuredAppendOrMacroCodewords') as number[];
    strictEqual(codewords.length, 4);
    strictEqual(codewords[0], 233);
    strictEqual(codewords[1], 1);
    strictEqual(codewords[2], 180);
    strictEqual(codewords[3], 219);
  });

  it('TestSetStructuredAppend3', function () {
    instance.setStructuredAppend(16, 16, 64516);

    let codewords = invokeMethod('getStructuredAppendOrMacroCodewords') as number[];
    strictEqual(codewords.length, 4);
    strictEqual(codewords[0], 233);
    strictEqual(codewords[1], 241);
    strictEqual(codewords[2], 254);
    strictEqual(codewords[3], 254);
  });

  it('TestMacro5', function () {
    instance.setMacro(BCGdatamatrix.Macro._05);

    let codewords = invokeMethod('getStructuredAppendOrMacroCodewords') as number[];
    strictEqual(codewords.length, 1);
    strictEqual(codewords[0], 236);
  });

  it('TestMacro6', function () {
    instance.setMacro(BCGdatamatrix.Macro._06);

    let codewords = invokeMethod('getStructuredAppendOrMacroCodewords') as number[];
    strictEqual(codewords.length, 1);
    strictEqual(codewords[0], 237);
  });

  it('TestSetSize', function () {
    instance.setSize(BCGdatamatrix.Size.Smallest);
    strictEqual(getProtectedField('size'), BCGdatamatrix.Size.Smallest);
    instance.setSize(BCGdatamatrix.Size.Square);
    strictEqual(getProtectedField('size'), BCGdatamatrix.Size.Square);
    instance.setSize(BCGdatamatrix.Size.Rectangle);
    strictEqual(getProtectedField('size'), BCGdatamatrix.Size.Rectangle);
  });

  it('TestGetSize', function () {
    strictEqual(BCGdatamatrix.Size.Smallest, instance.getSize());

    instance.setSize(BCGdatamatrix.Size.Square);
    strictEqual(BCGdatamatrix.Size.Square, instance.getSize());
  });

  it('TestGetQuietZoneSize', function () {
    strictEqual(instance.getQuietZoneSize(), 1);

    instance.setQuietZoneSize(2);
    strictEqual(instance.getQuietZoneSize(), 2);
  });

  it('TestGetAcceptECI', function () {
    strictEqual(instance.getAcceptECI(), false);

    instance.setAcceptECI(true);
    strictEqual(instance.getAcceptECI(), true);
  });

  it('TestGetTilde', function () {
    strictEqual(instance.getTilde(), false);

    instance.setTilde(true);
    strictEqual(instance.getTilde(), true);
  });

  it('TestGetMacro', function () {
    strictEqual(instance.getMacro(), BCGdatamatrix.Macro.None);

    instance.setMacro(BCGdatamatrix.Macro._05);
    strictEqual(instance.getMacro(), BCGdatamatrix.Macro._05);
  });

  it('TestGetEncoding', function () {
    strictEqual(instance.getEncoding(), BCGdatamatrix.Encoding.Unknown);

    instance.setEncoding(BCGdatamatrix.Encoding.C40);
    strictEqual(instance.getEncoding(), BCGdatamatrix.Encoding.C40);
  });

  it('TestGetDimensionSquare', function () {
    instance.setSize(BCGdatamatrix.Size.Square);
    invokeMethod('accomodateSymbol', 49);
    let symbol = getSymbol();
    strictEqual(symbol.row, 32);
    strictEqual(symbol.col, 32);
    let ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 136);
    strictEqual(ret[1], 136);

    invokeMethod('accomodateSymbol', 144);
    symbol = getSymbol();
    strictEqual(symbol.row, 44);
    strictEqual(symbol.col, 44);
    ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 184);
    strictEqual(ret[1], 184);

    invokeMethod('accomodateSymbol', 280);
    symbol = getSymbol();
    strictEqual(symbol.row, 64);
    strictEqual(symbol.col, 64);
    ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 264);
    strictEqual(ret[1], 264);
    instance.setQuietZoneSize(2);
    ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 272);
    strictEqual(ret[1], 272);
  });

  it('TestGetDimensionRectangle', function () {
    instance.setSize(BCGdatamatrix.Size.Rectangle);

    invokeMethod('accomodateSymbol', 10);
    let symbol = getSymbol();
    strictEqual(symbol.row, 8);
    strictEqual(symbol.col, 32);
    let ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 136);
    strictEqual(ret[1], 40);

    invokeMethod('accomodateSymbol', 49);
    symbol = getSymbol();
    strictEqual(symbol.row, 16);
    strictEqual(symbol.col, 48);
    ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 200);
    strictEqual(ret[1], 72);
    instance.setQuietZoneSize(2);
    ret = invokeMethod('getDimension', 0, 0);
    strictEqual(ret[0], 208);
    strictEqual(ret[1], 80);
  });

  it('TestGetSequence', function () {
    let ret = invokeMethod('getSequence', '30Q324343430794<OQQ') as number[];

    strictEqual(ret.length, 12);
    strictEqual(ret[0], 160); // 30
    strictEqual(ret[1], 82); // Q
    strictEqual(ret[2], 162); // 32
    strictEqual(ret[3], 173); // 43
    strictEqual(ret[4], 173); // 43
    strictEqual(ret[5], 173); // 43
    strictEqual(ret[6], 137); // 07
    strictEqual(ret[7], 224); // 94
    strictEqual(ret[8], 61); //
    strictEqual(ret[9], 80);
    strictEqual(ret[10], 82);
    strictEqual(ret[11], 82);
  });

  it('TestGetSequenceWithECI', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', '¶\\000007¶') as number[]; // TODO, support better ISO-8859-5

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 235);
    strictEqual(ret[1], 55);
    strictEqual(ret[2], 241);
    strictEqual(ret[3], 8);
    strictEqual(ret[4], 235);
    strictEqual(ret[5], 55);
    strictEqual(ret[6], 129); // PADDING
    strictEqual(ret[7], 56);
  });

  it('TestGetSequenceWithECITable2', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', '¶\\000130¶') as number[];

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 235);
    strictEqual(ret[1], 55);
    strictEqual(ret[2], 241);
    strictEqual(ret[3], 128);
    strictEqual(ret[4], 4);
    strictEqual(ret[5], 235);
    strictEqual(ret[6], 55);
    strictEqual(ret[7], 129);
  });

  it('TestGetSequenceWithECITable3', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', '¶\\493854¶') as number[];

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 235);
    strictEqual(ret[1], 55);
    strictEqual(ret[2], 241);
    strictEqual(ret[3], 199);
    strictEqual(ret[4], 102);
    strictEqual(ret[5], 206);
    strictEqual(ret[6], 235);
    strictEqual(ret[7], 55);
  });

  it('TestGetSequenceWithECIDoubleBackslash', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', '¶\\\\¶') as number[];

    strictEqual(ret.length, 5);
    strictEqual(ret[0], 235);
    strictEqual(ret[1], 55);
    strictEqual(ret[2], 93);
    strictEqual(ret[3], 235);
    strictEqual(ret[4], 55);
  });

  it('TestCreateBinaryStream', function () {
    let text = '30Q324343430794<OQQ';
    let seq = invokeMethod('getSequence', text) as number[];
    let ret = invokeMethod('createBinaryStream', text, seq) as number[];

    strictEqual(ret.length, 24);
    strictEqual(ret[0], 160);
    strictEqual(ret[1], 82);
    strictEqual(ret[2], 162);
    strictEqual(ret[3], 173);
    strictEqual(ret[4], 173);
    strictEqual(ret[5], 173);
    strictEqual(ret[6], 137);
    strictEqual(ret[7], 224);
    strictEqual(ret[8], 61);
    strictEqual(ret[9], 80);
    strictEqual(ret[10], 82);
    strictEqual(ret[11], 82);
    strictEqual(ret[12], 51);
    strictEqual(ret[13], 206);
    strictEqual(ret[14], 8);
    strictEqual(ret[15], 156);
    strictEqual(ret[16], 167);
    strictEqual(ret[17], 231);
    strictEqual(ret[18], 228);
    strictEqual(ret[19], 207);
    strictEqual(ret[20], 129);
    strictEqual(ret[21], 78);
    strictEqual(ret[22], 82);
    strictEqual(ret[23], 164);
  });

  it('TestCalculateX12C40TextPad0', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26], '\0', false, false) as number[];
    strictEqual(ret.length, 3);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 254);

    strictEqual(getSymbol().getDataSize(), 5);
  });

  it('TestCalculateX12C40TextPad1', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14], '\0', false, false) as number[];

    strictEqual(ret.length, 5);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 87);
    strictEqual(ret[3], 129);
    strictEqual(ret[4], 254);

    strictEqual(getSymbol().getDataSize(), 8);
  });

  it('TestCalculateX12C40TextPad2', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14, 22], '\0', false, false) as number[];
    strictEqual(ret.length, 5);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 90);
    strictEqual(ret[3], 241);
    strictEqual(ret[4], 254);

    strictEqual(getSymbol().getDataSize(), 8);
  });

  it('TestCalculateX12C40TextOptionA0', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26], 'M', true, true) as number[];

    strictEqual(ret.length, 2);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);

    strictEqual(getSymbol().getDataSize(), 3);
  });

  it('TestCalculateX12C40TextOptionA1', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14, 22, 26], 'M', true, true) as number[];

    strictEqual(ret.length, 5);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 91);
    strictEqual(ret[3], 11);
    strictEqual(ret[4], 254);

    strictEqual(getSymbol().getDataSize(), 8);
  });

  it('TestCalculateX12C40TextOptionB', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14, 22], 'I', true, true) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 90);
    strictEqual(ret[3], 241);

    strictEqual(getSymbol().getDataSize(), 5);
  });

  it('TestCalculateX12C40TextOptionC', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14], 'A', true, true) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 254);
    strictEqual(ret[3], 66);

    strictEqual(getSymbol().getDataSize(), 5);
  });

  it('TestCalculateX12C40TextOptionCAllTheTime', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14], 'A', true, false) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 254);
    strictEqual(ret[3], 66);

    strictEqual(getSymbol().getDataSize(), 5);
  });

  it('TestCalculateX12C40TextOptionD', function () {
    let ret = invokeMethod('calculateX12C40Text', [14, 22, 26, 14, 22, 26, 14, 22, 26, 14], 'A', true, true) as number[];

    strictEqual(ret.length, 7);
    strictEqual(ret[0], 91);
    strictEqual(ret[1], 11);
    strictEqual(ret[2], 91);
    strictEqual(ret[3], 11);
    strictEqual(ret[4], 91);
    strictEqual(ret[5], 11);
    strictEqual(ret[6], 66);

    strictEqual(getSymbol().getDataSize(), 8);
  });

  it('TestParseAsciiNormalAscii', function () {
    let ret = invokeMethod('parseAscii', 'abcDEF') as number[];

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 98);
    strictEqual(ret[1], 99);
    strictEqual(ret[2], 100);
    strictEqual(ret[3], 69);
    strictEqual(ret[4], 70);
    strictEqual(ret[5], 71);
  });

  it('TestParseAsciiNormalAscii_FNC1', function () {
    instance.setTilde(true);
    let ret = invokeMethod('parseAscii', '~FabcDEF~F') as number[];

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 232);
    strictEqual(ret[1], 98);
    strictEqual(ret[2], 99);
    strictEqual(ret[3], 100);
    strictEqual(ret[4], 69);
    strictEqual(ret[5], 70);
    strictEqual(ret[6], 71);
    strictEqual(ret[7], 232);
  });

  it('TestParseAsciiExtendedAscii', function () {
    let ret = invokeMethod('parseAscii', '¥éè') as number[];

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 235);
    strictEqual(ret[1], 38);
    strictEqual(ret[2], 235);
    strictEqual(ret[3], 106);
    strictEqual(ret[4], 235);
    strictEqual(ret[5], 105);
  });

  it('TestParseAsciiGroupedNumber', function () {
    let ret = invokeMethod('parseAscii', '00097499') as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 130);
    strictEqual(ret[1], 139);
    strictEqual(ret[2], 204);
    strictEqual(ret[3], 229);
  });

  it('TestParseAsciiUnGroupedNumber', function () {
    let ret = invokeMethod('parseAscii', '0A1B2C3') as number[];

    strictEqual(ret.length, 7);
    strictEqual(ret[0], 49);
    strictEqual(ret[1], 66);
    strictEqual(ret[2], 50);
    strictEqual(ret[3], 67);
    strictEqual(ret[4], 51);
    strictEqual(ret[5], 68);
    strictEqual(ret[6], 52);
  });

  it('TestParseC40', function () {
    let ret = invokeMethod('parseC40', 'AIM', false) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 230);
    strictEqual(ret[1], 91);
    strictEqual(ret[2], 11);
    strictEqual(ret[3], 254);
  });

  it('TestParseC40_FNC1', function () {
    instance.setTilde(true);
    let ret = invokeMethod('parseC40', 'A~F', false) as number[];
    // 14 1 27

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 230);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 196);
    strictEqual(ret[3], 254);
  });

  it('TestParseC40Shift1', function () {
    let ret = invokeMethod('parseC40', 'A' + String.fromCharCode(13) + String.fromCharCode(10), false) as number[];
    // 14 0 13 0 10

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 230);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 142);
    strictEqual(ret[3], 1);
    strictEqual(ret[4], 145);
    strictEqual(ret[5], 254);
  });

  it('TestParseC40Shift2', function () {
    let ret = invokeMethod('parseC40', 'A!@éI', false) as number[];
    // 14 1 0 1 21 1 30 2 9 ||| 22(ASCII=73+1)

    strictEqual(ret.length, 9);
    strictEqual(ret[0], 230);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 169);
    strictEqual(ret[3], 9);
    strictEqual(ret[4], 138);
    strictEqual(ret[5], 187);
    strictEqual(ret[6], 218);
    strictEqual(ret[7], 254);
    strictEqual(ret[8], 74);
  });

  it('TestParseC40Shift3', function () {
    let ret = invokeMethod('parseC40', 'aim', false) as number[];
    // 2 1 2 9 2 13

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 230);
    strictEqual(ret[1], 12);
    strictEqual(ret[2], 171);
    strictEqual(ret[3], 56);
    strictEqual(ret[4], 158);
    strictEqual(ret[5], 254);
  });

  it('TestParseText', function () {
    let ret = invokeMethod('parseText', 'aim', false) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 91);
    strictEqual(ret[2], 11);
    strictEqual(ret[3], 254);
  });

  it('TestParseFNC1', function () {
    instance.setTilde(true);
    let ret = invokeMethod('parseText', 'a~F', false) as number[];

    strictEqual(ret.length, 4);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 196);
    strictEqual(ret[3], 254);
  });

  it('TestParseTextShift1', function () {
    let ret = invokeMethod('parseText', 'a' + String.fromCharCode(13) + String.fromCharCode(10), false) as number[];
    // 14 0 13 0 10

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 142);
    strictEqual(ret[3], 1);
    strictEqual(ret[4], 145);
    strictEqual(ret[5], 254);
  });

  it('TestParseTextShift2', function () {
    let ret = invokeMethod('parseText', 'a!@éi', false) as number[];
    // 14 1 0 1 21 1 30 22 22

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 87);
    strictEqual(ret[2], 169);
    strictEqual(ret[3], 9);
    strictEqual(ret[4], 138);
    strictEqual(ret[5], 191);
    strictEqual(ret[6], 7);
    strictEqual(ret[7], 254);
  });

  it('TestParseTextShift3', function () {
    let ret = invokeMethod('parseText', 'AIM', false) as number[];
    // 2 1 2 9 2 13

    strictEqual(ret.length, 6);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 12);
    strictEqual(ret[2], 171);
    strictEqual(ret[3], 56);
    strictEqual(ret[4], 158);
    strictEqual(ret[5], 254);
  });

  it('TestParseX12', function () {
    let ret = invokeMethod('parseX12', '0129HELLO A*>' + String.fromCharCode(13) + 'Z', false) as number[];
    // 4 5 6 13 21 18 25 25 28 3 14 1 2 0 39

    strictEqual(ret.length, 12);
    strictEqual(ret[0], 238);
    strictEqual(ret[1], 25);
    strictEqual(ret[2], 207);
    strictEqual(ret[3], 84);
    strictEqual(ret[4], 155);
    strictEqual(ret[5], 160);
    strictEqual(ret[6], 69);
    strictEqual(ret[7], 20);
    strictEqual(ret[8], 242);
    strictEqual(ret[9], 12);
    strictEqual(ret[10], 168);
    strictEqual(ret[11], 254);
  });

  it('TestParseEdifact1Flush4', function () {
    let unlatchNeeded = '';

    let arg1 = 'DATA';
    let ret = invokeMethod('parseEdifact', arg1, unlatchNeeded) as { value: number[]; lastCharacters: string };
    unlatchNeeded = ret.lastCharacters;

    strictEqual(ret.value.length, 4);
    strictEqual(ret.value[0], 240);
    strictEqual(ret.value[1], 16);
    strictEqual(ret.value[2], 21);
    strictEqual(ret.value[3], 1);
    strictEqual(unlatchNeeded, '\x1f');
  });

  it('TestParseEdifact2Flush4Plus1Alone', function () {
    let lastCharacters = '';

    let arg1 = 'DATAD';
    let ret = invokeMethod('parseEdifact', arg1, lastCharacters) as { value: number[]; lastCharacters: string };
    lastCharacters = ret.lastCharacters;

    strictEqual(ret.value.length, 4);
    strictEqual(ret.value[0], 240);
    strictEqual(ret.value[1], 16);
    strictEqual(ret.value[2], 21);
    strictEqual(ret.value[3], 1);
    strictEqual(lastCharacters[0], 'D');
    strictEqual(lastCharacters[1], '\x1f');
  });

  it('TestParseEdifact3Flush4Plus12Alone', function () {
    let lastCharacters = '';

    let arg1 = 'DATADA';
    let ret = invokeMethod('parseEdifact', arg1, lastCharacters) as { value: number[]; lastCharacters: string };
    lastCharacters = ret.lastCharacters;

    strictEqual(ret.value.length, 4);
    strictEqual(ret.value[0], 240);
    strictEqual(ret.value[1], 16);
    strictEqual(ret.value[2], 21);
    strictEqual(ret.value[3], 1);
    strictEqual(lastCharacters[0], 'D');
    strictEqual(lastCharacters[1], 'A');
    strictEqual(lastCharacters[2], '\x1f');
  });

  it('TestParseEdifact4Flush4Plus3Alone', function () {
    let lastCharacters = '';

    let arg1 = 'DATADAT';
    let ret = invokeMethod('parseEdifact', arg1, lastCharacters) as { value: number[]; lastCharacters: string };
    lastCharacters = ret.lastCharacters;

    strictEqual(ret.value.length, 7);
    strictEqual(ret.value[0], 240);
    strictEqual(ret.value[1], 16);
    strictEqual(ret.value[2], 21);
    strictEqual(ret.value[3], 1);
    strictEqual(ret.value[4], 16);
    strictEqual(ret.value[5], 21);
    strictEqual(ret.value[6], 31);
    strictEqual(lastCharacters, '');
  });

  it('TestParseBase256Small', function () {
    let ret = invokeMethod('parseBase256', '0123456789qwertyuiopasdfghjklzxcvbnm', false) as number[];
    strictEqual(ret.length, 38);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (36 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (48 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (49 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (50 + ((149 * 5) % 255) + 1) % 256);
  });

  it('TestParseBase256Big', function () {
    let ret = invokeMethod(
      'parseBase256',
      '0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm',
      false
    ) as number[];
    strictEqual(ret.length, 291);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (250 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (38 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (48 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (49 + ((149 * 5) % 255) + 1) % 256);
    strictEqual(ret[5], (50 + ((149 * 6) % 255) + 1) % 256);
  });

  it('TestParseBase256DoubleMaking2Base256', function () {
    let ret = invokeMethod(
      'parseBase256',
      '0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklzxcvbnm0123456' +
        //2nd part
        '0123456789qwertyuiopasdfghjklzxcvbnm',
      false
    ) as number[];

    strictEqual(ret.length, 1596);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (255 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (55 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (48 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (49 + ((149 * 5) % 255) + 1) % 256);
    strictEqual(ret[5], (50 + ((149 * 6) % 255) + 1) % 256);

    strictEqual(ret[1558], 231);
    strictEqual(ret[1559], (36 + ((149 * (1558 + 2)) % 255) + 1) % 256);
    strictEqual(ret[1560], (48 + ((149 * (1558 + 3)) % 255) + 1) % 256);
    strictEqual(ret[1561], (49 + ((149 * (1558 + 4)) % 255) + 1) % 256);
    strictEqual(ret[1562], (50 + ((149 * (1558 + 5)) % 255) + 1) % 256);
  });

  it('TestParseBase256FullFill', function () {
    let ret = invokeMethod('parseBase256', '0123456789qwertyuiopasdfghjklzxcvbnm', true) as number[];
    strictEqual(ret.length, 38);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (0 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (48 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (49 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (50 + ((149 * 5) % 255) + 1) % 256);
  });

  it('TestGetNumberOfBase256Codewords', function () {
    // Latch, length, text
    strictEqual(invokeMethod('getNumberOfBase256Codewords', Utility.strRepeat('A', 3)), 5);

    // Latch, length, text (fullfill = on)
    strictEqual(invokeMethod('getNumberOfBase256Codewords', Utility.strRepeat('A', 1555)), 1557);

    // Latch, length * 2, text, latch, length, text
    strictEqual(invokeMethod('getNumberOfBase256Codewords', Utility.strRepeat('A', 1556)), 1560);

    // Latch, length * 2, text, latch, length, text
    strictEqual(invokeMethod('getNumberOfBase256Codewords', Utility.strRepeat('A', 3100)), 3104);
  });

  it('TestParseBase256WithRealFullFill', function () {
    let ret = invokeMethod('getSequence', 'éééééé') as number[];

    // This sequence should arrive flush
    strictEqual(ret.length, 8);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (0 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (233 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (233 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (233 + ((149 * 5) % 255) + 1) % 256);
  });

  it('TestParseBase256WithFakeFullFill', function () {
    let ret = invokeMethod('getSequence', 'ééééé') as number[];

    // This sequence should arrive flush BUT we have padding
    strictEqual(ret.length, 8);
    strictEqual(ret[0], 231);
    strictEqual(ret[1], (5 + ((149 * 2) % 255) + 1) % 256);
    strictEqual(ret[2], (233 + ((149 * 3) % 255) + 1) % 256);
    strictEqual(ret[3], (233 + ((149 * 4) % 255) + 1) % 256);
    strictEqual(ret[4], (233 + ((149 * 5) % 255) + 1) % 256);
    strictEqual(ret[7], 129); // Padding
  });

  it('TestRandomize255', function () {
    let position = 5;
    let input: number[] = [50, 51, 52, 53, 255, 254];
    let ret = invokeMethod('randomize255', input, position) as number[];
    strictEqual(ret.length, input.length);
    strictEqual(ret[0], (50 + ((149 * (position + 0)) % 255) + 1) % 256);
    strictEqual(ret[1], (51 + ((149 * (position + 1)) % 255) + 1) % 256);
    strictEqual(ret[2], (52 + ((149 * (position + 2)) % 255) + 1) % 256);
    strictEqual(ret[3], (53 + ((149 * (position + 3)) % 255) + 1) % 256);
    strictEqual(ret[4], (255 + ((149 * (position + 4)) % 255) + 1) % 256);
    strictEqual(ret[5], (254 + ((149 * (position + 5)) % 255) + 1) % 256);
  });

  it('TestRandomize253', function () {
    let input: number[] = [50, 51, 52, 53, 255, 254];
    let position = 5;
    let ret = invokeMethod('randomize253', input, position) as number[];
    strictEqual(ret.length, input.length);
    strictEqual(ret[0], (50 + ((149 * (position + 0)) % 253) + 1) % 254);
    strictEqual(ret[1], (51 + ((149 * (position + 1)) % 253) + 1) % 254);
    strictEqual(ret[2], (52 + ((149 * (position + 2)) % 253) + 1) % 254);
    strictEqual(ret[3], (53 + ((149 * (position + 3)) % 253) + 1) % 254);
    strictEqual(ret[4], (255 + ((149 * (position + 4)) % 253) + 1) % 254);
    strictEqual(ret[5], (254 + ((149 * (position + 5)) % 253) + 1) % 254);
  });

  it('TestPadWithCode', function () {
    let input: number[] = [1, 2, 3, 4];
    let ret = invokeMethod('padWithCode', input, 3, 99) as number[];
    strictEqual(ret.length, 6);
    strictEqual(ret[4], 99);
    strictEqual(ret[5], 99);
  });

  it('TestBackslash', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', 'datamat\\\\r') as number[];

    strictEqual(ret.length, 8);
    strictEqual(ret[0], 239);
    strictEqual(ret[1], 108);
    strictEqual(ret[2], 146);
    strictEqual(ret[3], 91);
    strictEqual(ret[4], 159);
    strictEqual(ret[5], 206);
    strictEqual(ret[6], 128);
    strictEqual(ret[7], 115);
  });

  it('TestSanitizeText', function () {
    instance.setAcceptECI(true);
    instance.setTilde(true);
    let ret = invokeMethod('sanitizeText', 'AB\\\\CDEF~~GH~Ftest') as string;

    strictEqual(ret, 'AB\\CDEF~GH~Ftest');
  });

  it('TestSanitizeTextException1', function () {
    instance.setAcceptECI(true);
    instance.setTilde(true);

    try {
      let ret = invokeMethod('sanitizeText', 'AB\\CDEF~~GH') as string;
    } catch (tie) {
      strictEqual(
        tie.message,
        'Incorrect ECI code detected. ECI code must contain a backslash followed by 6 digits or double the backslash to write one backslash.'
      );
    }
  });

  it('TestSanitizeTextException2', function () {
    instance.setAcceptECI(true);
    instance.setTilde(true);

    try {
      let ret = invokeMethod('sanitizeText', 'AB\\\\CDEF~GH') as string;
    } catch (tie) {
      strictEqual(tie.message, 'Incorrect tilde code detected. Tilde code must be ~~ or ~F.');
    }
  });

  it('TestSetFNC1Valid', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.None);
    strictEqual(getProtectedField('fnc1') as BCGdatamatrix.Fnc1, BCGdatamatrix.Fnc1.None);

    instance.setFNC1(BCGdatamatrix.Fnc1.GS1);
    strictEqual(getProtectedField('fnc1') as BCGdatamatrix.Fnc1, BCGdatamatrix.Fnc1.GS1);

    instance.setFNC1(BCGdatamatrix.Fnc1.AIM);
    strictEqual(getProtectedField('fnc1') as BCGdatamatrix.Fnc1, BCGdatamatrix.Fnc1.AIM);
  });

  it('TestGetSequenceFNC1_GS1', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.GS1);
    let ret = invokeMethod('getSequence', 'AB') as number[];

    strictEqual(ret[0], 232);
    strictEqual(ret[1], 66);
    strictEqual(ret[2], 67);
  });

  it('TestGetSequenceFNC1_AIM', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.AIM);
    let ret = invokeMethod('getSequence', 'AB') as number[];

    strictEqual(ret[0], 66);
    strictEqual(ret[1], 232);
    strictEqual(ret[2], 67);
  });

  it('TestGetSequenceFNC1_GS1_StructureAppend_Symbol1', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.GS1);
    instance.setStructuredAppend(1, 7, 1);
    let ret = invokeMethod('getSequence', 'AB') as number[];

    strictEqual(ret[0], 233);
    strictEqual(ret[1], 10);
    strictEqual(ret[2], 1);
    strictEqual(ret[3], 1);
    strictEqual(ret[4], 232);
    strictEqual(ret[5], 66);
    strictEqual(ret[6], 67);
  });

  it('TestGetSequenceFNC1_AIM_StructureAppend_Symbol1', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.AIM);
    instance.setStructuredAppend(1, 7, 1);
    let ret = invokeMethod('getSequence', 'AB') as number[];

    strictEqual(ret[0], 233);
    strictEqual(ret[1], 10);
    strictEqual(ret[2], 1);
    strictEqual(ret[3], 1);
    strictEqual(ret[4], 66);
    strictEqual(ret[5], 232);
    strictEqual(ret[6], 67);
  });

  it('TestGetSequenceFNC1_GS1_StructureAppend_Symbol3', function () {
    instance.setFNC1(BCGdatamatrix.Fnc1.GS1);
    instance.setStructuredAppend(3, 7, 1);
    let ret = invokeMethod('getSequence', 'AB') as number[];

    strictEqual(ret[0], 233);
    strictEqual(ret[1], 42);
    strictEqual(ret[2], 1);
    strictEqual(ret[3], 1);
    strictEqual(ret[4], 66);
    strictEqual(ret[5], 67);
  });

  it('TestGetSequenceEncoding_ASCII_FNC1', function () {
    instance.setTilde(true);
    let ret = invokeMethod('getSequence', 'ABCDE') as number[];

    strictEqual(ret[0], 66);
    strictEqual(ret[1], 67);
    strictEqual(ret[2], 68);
    strictEqual(ret[3], 69);
    strictEqual(ret[4], 70);
  });

  it('TestGetSequenceEncoding_ASCII_FNC1_2', function () {
    instance.setTilde(true);
    let ret = invokeMethod('getSequence', 'AB~FDE') as number[];

    strictEqual(ret[0], 66);
    strictEqual(ret[1], 67);
    strictEqual(ret[2], 232);
    strictEqual(ret[3], 69);
    strictEqual(ret[4], 70);
  });

  it('TestMultipleEncoding', function () {
    // ASCII
    let ret = invokeMethod('getSequence', 'ABCDE') as number[];

    // X12
    ret = invokeMethod('getSequence', 'ABCDEF') as number[];

    // Edifact
    ret = invokeMethod('getSequence', 'ABCDEF?') as number[];

    // C40
    ret = invokeMethod('getSequence', 'ABCDEFGHIJKLM?') as number[];

    // Text
    ret = invokeMethod('getSequence', 'abcdefghijklm?') as number[];

    // Base 256 - Not readable with FNC1 - GS1/AIM
    ret = invokeMethod('getSequence', 'é½¼¾±¤¢') as number[];

    // ASCII FNC1
    instance.setTilde(true);
    ret = invokeMethod('getSequence', 'ABC~FD') as number[];

    // X12 -> Transformed to C40
    ret = invokeMethod('getSequence', 'ABCD~FE') as number[];

    // Text
    ret = invokeMethod('getSequence', 'abcde~Fghijklm?') as number[];
  });

  it('TestEncodingASCII', function () {
    // X12
    let ret = invokeMethod('getSequence', 'ABCDEF') as number[];
    strictEqual(ret[0], 238);

    instance.setEncoding(BCGdatamatrix.Encoding.Ascii);
    ret = invokeMethod('getSequence', 'ABCDEF') as number[];
    strictEqual(ret[0], 66);
  });

  it('TestEncodingC40', function () {
    // X12
    let ret = invokeMethod('getSequence', 'ABCDEF') as number[];
    strictEqual(ret[0], 238);

    instance.setEncoding(BCGdatamatrix.Encoding.C40);
    ret = invokeMethod('getSequence', 'ABCDEF') as number[];
    strictEqual(ret[0], 230);
  });

  it('TestEncodingX12', function () {
    // ASCII
    let ret = invokeMethod('getSequence', '?!"') as number[];
    strictEqual(ret[0], 64);

    instance.setEncoding(BCGdatamatrix.Encoding.X12);
    ret = invokeMethod('getSequence', '%!"') as number[];
    strictEqual(ret[0], 238);
    strictEqual(ret[1], 129);
    strictEqual(ret[2], 70);
  });

  it('TestSetEncoding', function () {
    instance.setEncoding(BCGdatamatrix.Encoding.Unknown);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.Unknown);
    instance.setEncoding(BCGdatamatrix.Encoding.Ascii);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.Ascii);
    instance.setEncoding(BCGdatamatrix.Encoding.C40);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.C40);
    instance.setEncoding(BCGdatamatrix.Encoding.Text);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.Text);
    instance.setEncoding(BCGdatamatrix.Encoding.X12);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.X12);
    instance.setEncoding(BCGdatamatrix.Encoding.Edifact);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.Edifact);
    instance.setEncoding(BCGdatamatrix.Encoding.Base256);
    strictEqual(getProtectedField('encoding') as BCGdatamatrix.Encoding, BCGdatamatrix.Encoding.Base256);
  });

  it('TestSetMacro', function () {
    instance.setMacro(BCGdatamatrix.Macro.None);
    strictEqual(getProtectedField('macro') as BCGdatamatrix.Macro, BCGdatamatrix.Macro.None);
    instance.setMacro(BCGdatamatrix.Macro._05);
    strictEqual(getProtectedField('macro') as BCGdatamatrix.Macro, BCGdatamatrix.Macro._05);
    instance.setMacro(BCGdatamatrix.Macro._06);
    strictEqual(getProtectedField('macro') as BCGdatamatrix.Macro, BCGdatamatrix.Macro._06);
  });

  it('TestSetMacroWithStructuredAppend', function () {
    try {
      instance.setStructuredAppend(1, 5, 1);
      instance.setMacro(BCGdatamatrix.Macro._05);
    } catch (tie) {
      strictEqual(tie.message, 'You cannot use the macro syntax with the structured append.');
    }
  });

  it('TestSetStructuredAppendWithMacro', function () {
    try {
      instance.setMacro(BCGdatamatrix.Macro._05);
      instance.setStructuredAppend(1, 5, 1);
    } catch (tie) {
      strictEqual(tie.message, 'You cannot use the structured append with the macro syntax.');
    }
  });

  it('TestGetDatamatrixSize', function () {
    let ret = instance.getDataMatrixSize();
    deepStrictEqual(ret, [-1, -1]);

    instance.setDataMatrixSize(16, 16);
    ret = instance.getDataMatrixSize();
    deepStrictEqual(ret, [16, 16]);
  });

  it('TestSetDataMatrixSize', function () {
    instance.setDataMatrixSize(16, 16);
    strictEqual(getProtectedField('forceSymbolIndex'), 5);
  });

  it('TestSetDataMatrixSizeFail', function () {
    try {
      instance.setDataMatrixSize(16, 17);
    } catch (tie) {
      strictEqual(tie.message, "The symbol you provided doesn't exists.");
    }
  });

  it('TestCustomerCode1', function () {
    let ret = invokeMethod('getSequence', '#aa1#AAAA#3') as number[];
    strictEqual(ret.length, 10);
    strictEqual(ret[0], 36);
    strictEqual(ret[1], 98);
    strictEqual(ret[2], 98);
    strictEqual(ret[3], 240);
    strictEqual(ret[4], 198);
    strictEqual(ret[5], 48);
    strictEqual(ret[6], 65);
    strictEqual(ret[7], 4);
    strictEqual(ret[8], 24);
    strictEqual(ret[9], 243);

    //
    //        0 => int 36 -> #
    //  1 => int 98 -> a
    //  2 => int 98 -> a
    //  3 => int 240 -> EDIFACT 1->110001, #->100011, A->000001, 3->110011 UNLATCH->011111
    //                  11000110  00110000  01000001  00000100 00011000 11110011  01111100
    //                  198       48        65        4        24       243       124
    //  4 => int 198 ->
    //  5 => int 48
    //  6 => int 65
    //  7 => int 4
    //  8 => int 24
    //  9 => int 243
  });

  it('TestPosteItaliane', function () {
    // This is the exact size of a 16x48
    let str = '1 10000105   2199999    99999    IMA0034253982   YY9999             ZZZZ';
    instance.setSize(BCGdatamatrix.Size.Rectangle);
    instance.setDataMatrixSize(16, 48);
    instance.setEncoding(BCGdatamatrix.Encoding.C40);
    instance.parse(str);
  });
});
