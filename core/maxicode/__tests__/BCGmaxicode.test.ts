'use strict';

import { beforeEach, describe, it } from '@jest/globals';
import { ok, strictEqual } from 'assert';
import { BCGmaxicode } from '../src/BCGmaxicode';

let code = 'MaxiCode';

describe(code, function () {
  let instance: BCGmaxicode;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function invokeMethod(methodName: string, ...parameters: any[]): any {
    return (instance as any)[methodName].apply(instance, parameters);
  }

  function setField(fieldName: string, value: any): void {
    (instance as any)[fieldName] = value;
  }

  function utilityCreateSequence(sequence: string): Seq[] {
    let c = sequence.length;
    let seq: Seq[] = [];
    for (let i = 0; i < c; i++) {
      seq.push(new Seq(sequence[i], 1));
    }

    return seq;
  }

  beforeEach(function () {
    instance = new BCGmaxicode();
  });

  it('TestIsCharCodeSetA', function () {
    let codeSet = getProtectedField('codeSetA') as string;
    let c = codeSet.length;
    let check = true;
    for (let i = 0; i < c; i++) {
      check &&= invokeMethod('isCharCodeSetA', codeSet[i]) as boolean;
    }

    strictEqual(c, 59);
    ok(check);
  });

  it('TestIsCharCodeSetB', function () {
    let codeSet = getProtectedField('codeSetB') as string;
    let c = codeSet.length;
    let check = true;
    for (let i = 0; i < c; i++) {
      check &&= invokeMethod('isCharCodeSetB', codeSet[i]) as boolean;
    }

    strictEqual(c, 55);
    ok(check);
  });

  it('TestIsCharCodeSetC', function () {
    let codeSet = getProtectedField('codeSetC') as string;
    let c = codeSet.length;
    let check = true;
    for (let i = 0; i < c; i++) {
      check &&= invokeMethod('isCharCodeSetC', codeSet[i]) as boolean;
    }

    strictEqual(c, 60);
    ok(check);
  });

  it('TestIsCharCodeSetD', function () {
    let codeSet = getProtectedField('codeSetD') as string;
    let c = codeSet.length;
    let check = true;
    for (let i = 0; i < c; i++) {
      check &&= invokeMethod('isCharCodeSetD', codeSet[i]) as boolean;
    }

    strictEqual(c, 60);
    ok(check);
  });

  it('TestIsCharCodeSetE', function () {
    let codeSet = getProtectedField('codeSetE') as string;
    let c = codeSet.length;
    let check = true;
    for (let i = 0; i < c; i++) {
      check &&= invokeMethod('isCharCodeSetE', codeSet[i]) as boolean;
    }

    strictEqual(c, 60);
    ok(check);
  });

  it('TestGetSequence_StartingNumberNumber', function () {
    let ret = invokeMethod('getSequence', '012345678') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value[0].sequence == 'N');
    ok(ret.value[0].amount == 9);
  });

  it('TestGetSequence_StartingNumberNumberFollowedByNumber', function () {
    let ret = invokeMethod('getSequence', '012345678012345678') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value[0].sequence == 'N');
    ok(ret.value[0].amount == 9);
    ok(ret.value[1].sequence == 'N');
    ok(ret.value[1].amount == 9);
  });

  it('TestGetSequence_StartingNumberNumberFollowedByNumberNotFull', function () {
    let ret = invokeMethod('getSequence', '01234567801234') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value[0].sequence == 'N');
    ok(ret.value[0].amount == 9);
    ok(ret.value[1].sequence == 'A');
    ok(ret.value[1].amount == 5);
  });

  it('TestGetSequence_StartingTextThenNumber', function () {
    let ret = invokeMethod('getSequence', 'ABC012345678ABC') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 3);
    ok(ret.value[1].sequence == 'N');
    ok(ret.value[1].amount == 9);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 3);
  });

  it('TestGetSequence_CodeSeqAB', function () {
    let ret = invokeMethod('getSequence', ',./:') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'L');
    ok(ret.value[0].amount == 4);
  });

  it('TestGetSequence_CodeSeqAE', function () {
    let ret = invokeMethod('getSequence', String.fromCharCode(13)) as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'K');
    ok(ret.value[0].amount == 1);
  });

  it('TestGetSequence_CodeSeqA', function () {
    let ret = invokeMethod('getSequence', '0A1B2C3D4E5F6G7H8I9JKLMNOPQRSTUVWXYZ"#$%&\'()*+-') as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 47);
  });

  it('TestGetSequence_CodeSeqB', function () {
    let ret = invokeMethod('getSequence', '`abcdefghijklmnopqrstuvwxyz{}~' + String.fromCharCode(127) + ';<=>?[\\]^_@!|') as {
      value: Seq[];
      text: string;
    };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'B');
    ok(ret.value[0].amount == 44);
  });

  it('TestGetSequence_CodeSeqC', function () {
    let ret = invokeMethod(
      'getSequence',
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßª¬±²³' +
        String.fromCharCode(181) +
        '¹º¼½¾' +
        String.fromCharCode(128) +
        String.fromCharCode(129) +
        String.fromCharCode(130) +
        String.fromCharCode(131) +
        String.fromCharCode(132) +
        String.fromCharCode(133) +
        String.fromCharCode(134) +
        String.fromCharCode(135) +
        String.fromCharCode(136) +
        String.fromCharCode(137)
    ) as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'C');
    ok(ret.value[0].amount == 53);
  });

  it('TestGetSequence_CodeSeqD', function () {
    let ret = invokeMethod(
      'getSequence',
      'àáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ¡¨«¯°´·' +
        String.fromCharCode(184) +
        '»¿' +
        String.fromCharCode(138) +
        String.fromCharCode(139) +
        String.fromCharCode(140) +
        String.fromCharCode(141) +
        String.fromCharCode(142) +
        String.fromCharCode(143) +
        String.fromCharCode(144) +
        String.fromCharCode(145) +
        String.fromCharCode(146) +
        String.fromCharCode(147) +
        String.fromCharCode(148)
    ) as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'D');
    ok(ret.value[0].amount == 53);
  });

  it('TestGetSequence_CodeSeqE', function () {
    let text = '';
    for (let i = 0; i <= 27; i++) {
      if (i == 13) {
        continue;
      }

      text += String.fromCharCode(i);
    }

    for (let i = 149; i <= 160; i++) {
      text += String.fromCharCode(i);
    }

    text += String.fromCharCode(31) + String.fromCharCode(166) + String.fromCharCode(173);
    text += '¢£¤¥§©®¶';
    let ret = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'E');
    ok(ret.value[0].amount == 50);
  });

  it('TestGetSequence_Mixed', function () {
    let ret = invokeMethod(
      'getSequence',
      String.fromCharCode(28) + String.fromCharCode(29) + String.fromCharCode(30) + String.fromCharCode(32)
    ) as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 1);
    ok(ret.value[0].sequence == 'M');
    ok(ret.value[0].amount == 4);
  });

  it('TestGetSequence_CodeSetAAndMixed', function () {
    let ret = invokeMethod('getSequence', 'HELLO FRIEND' + String.fromCharCode(13)) as { value: Seq[]; text: string };
    let text = ret.text;

    ok(ret.value.length == 4);
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 5);
    ok(ret.value[1].sequence == 'M');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 6);
    ok(ret.value[3].sequence == 'K');
    ok(ret.value[3].amount == 1);
  });

  it('TestIsNextSequence', function () {
    ok(invokeMethod('isNextSequence', 'A', [], utilityCreateSequence('A'), 0) as boolean);
    ok(!invokeMethod('isNextSequence', 'A', [], utilityCreateSequence('MA'), 0) as boolean);
    ok(invokeMethod('isNextSequence', 'A', ['M'], utilityCreateSequence('MA'), 0) as boolean);
    !invokeMethod('isNextSequence', 'A', ['M'], utilityCreateSequence('MB'), 0) as boolean;
  });

  it('TestencodeCodeN', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeN', '123456789', current, utilityCreateSequence('N'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 31);
    ok(ret.value[1] == 7);
    ok(ret.value[2] == 22);
    ok(ret.value[3] == 60);
    ok(ret.value[4] == 52);
    ok(ret.value[5] == 21);
  });

  it('TestencodeCodeNMaximal', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeN', '999999999', current, utilityCreateSequence('N'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 31);
    ok(ret.value[1] == 59);
    ok(ret.value[2] == 38);
    ok(ret.value[3] == 44);
    ok(ret.value[4] == 39);
    ok(ret.value[5] == 63);
  });

  it('TestencodeCodeNMinimal', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeN', '000000000', current, utilityCreateSequence('N'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 31);
    ok(ret.value[1] == 0);
    ok(ret.value[2] == 0);
    ok(ret.value[3] == 0);
    ok(ret.value[4] == 0);
    ok(ret.value[5] == 0);
  });

  it('TestencodeCodeAFromA', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeA', 'ABC', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
  });

  it('TestencodeCodeAFromBCase1', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'A', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 59);
    ok(ret.value[1] == 1);
  });

  it('TestencodeCodeAFromBCase2', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'AB', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 56);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
  });

  it('TestencodeCodeAFromBCase3', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'ABC', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 57);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeAFromBCase4', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'ABCD', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
    ok(ret.value[4] == 4);
  });

  it('TestencodeCodeAFromBWithFollowingSequenceToLatch', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'AB', current, utilityCreateSequence('AMLA'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
  });

  it('TestencodeCodeAFromBWithFollowingSequenceToSwitch', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeA', 'AB', current, utilityCreateSequence('AMLB'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 56);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
  });

  it('TestencodeCodeAFromC', function () {
    let current = 'C';
    let ret = invokeMethod('encodeCodeA', 'ABC', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 58);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeAFromD', function () {
    let current = 'D';
    let ret = invokeMethod('encodeCodeA', 'ABC', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 58);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeAFromE', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeA', 'ABC', current, utilityCreateSequence('A'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 58);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeBFromACase1', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeB', 'a', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 59);
    ok(ret.value[1] == 1);
  });

  it('TestencodeCodeBFromACase2', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeB', 'ab', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
  });

  it('TestencodeCodeBFromAWithFollowingSequenceToLatch', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeB', 'a', current, utilityCreateSequence('BMLB'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
  });

  it('TestencodeCodeBFromAWithFollowingSequenceToSwitch', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeB', 'a', current, utilityCreateSequence('BMLA'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 59);
    ok(ret.value[1] == 1);
  });

  it('TestencodeCodeBFromB', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeB', 'abc', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
  });

  it('TestencodeCodeBFromC', function () {
    let current = 'C';
    let ret = invokeMethod('encodeCodeB', 'abc', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeBFromD', function () {
    let current = 'D';
    let ret = invokeMethod('encodeCodeB', 'abc', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeBFromE', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeB', 'abc', current, utilityCreateSequence('B'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 63);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 2);
    ok(ret.value[3] == 3);
  });

  it('TestencodeCodeCFromACase1', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃÄ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 60);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeCFromACase2', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 60);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 60);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeCFromBCase1', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃÄ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 60);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeCFromBCase2', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 60);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 60);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeCFromCCase1', function () {
    let current = 'C';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
  });

  it('TestencodeCodeCFromDCase1', function () {
    let current = 'D';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃÄ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 60);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeCFromDCase2', function () {
    let current = 'D';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 60);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 60);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeCFromECase1', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃÄ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 60);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeCFromECase2', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeC', 'ÁÂÃ', current, utilityCreateSequence('C'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 60);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 60);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 60);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeDFromACase1', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeD', 'áâãä', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 61);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeDFromACase2', function () {
    let current = 'A';
    let ret = invokeMethod('encodeCodeD', 'áâã', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 61);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 61);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeDFromBCase1', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeD', 'áâãä', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 61);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeDFromBCase2', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeD', 'áâã', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 61);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 61);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeDFromCCase1', function () {
    let current = 'C';
    let ret = invokeMethod('encodeCodeD', 'áâãä', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 61);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeCFromCCase2', function () {
    let current = 'C';
    let ret = invokeMethod('encodeCodeD', 'áâã', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 61);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 61);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeDFromDCase1', function () {
    let current = 'D';
    let ret = invokeMethod('encodeCodeD', 'áâã', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
  });

  it('TestencodeCodeDFromECase1', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeD', 'áâãä', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 61);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeDFromECase2', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeD', 'áâã', current, utilityCreateSequence('D'), 0) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 61);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 61);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 61);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeEFromACase1', function () {
    let current = 'A';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 62);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeEFromACase2', function () {
    let current = 'A';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'A');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 62);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 62);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeEFromBCase1', function () {
    let current = 'B';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 62);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeEFromBCase2', function () {
    let current = 'B';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 62);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 62);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeEFromCCase1', function () {
    let current = 'C';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 62);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeEFromCCase2', function () {
    let current = 'C';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'C');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 62);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 62);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeEFromDCase1', function () {
    let current = 'D';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 62);
    ok(ret.value[2] == 1);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 3);
    ok(ret.value[5] == 4);
  });

  it('TestencodeCodeEFromDCase2', function () {
    let current = 'D';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'D');
    ok(ret.value[0] == 62);
    ok(ret.value[1] == 1);
    ok(ret.value[2] == 62);
    ok(ret.value[3] == 2);
    ok(ret.value[4] == 62);
    ok(ret.value[5] == 3);
  });

  it('TestencodeCodeEFromECase1', function () {
    let current = 'E';
    let ret = invokeMethod(
      'encodeCodeE',
      String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4),
      current,
      utilityCreateSequence('E'),
      0
    ) as { value: number[]; currentEncoding: string };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
  });

  it('TestencodeCodeBWithSpace', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeB', 'abc def', current, utilityCreateSequence('B'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 1);
    ok(ret.value[1] == 2);
    ok(ret.value[2] == 3);
    ok(ret.value[3] == 47);
    ok(ret.value[4] == 4);
    ok(ret.value[5] == 5);
    ok(ret.value[6] == 6);
  });

  it('TestEncodeCodeMixedCase1', function () {
    let current = 'B';
    let ret = invokeMethod('encodeCodeM', String.fromCharCode(29) + ' ', current, utilityCreateSequence('M'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'B');
    ok(ret.value[0] == 29);
    ok(ret.value[1] == 47);
  });

  it('TestEncodeCodeMixedCase2', function () {
    let current = 'E';
    let ret = invokeMethod('encodeCodeM', String.fromCharCode(29) + ' ', current, utilityCreateSequence('M'), 0) as {
      value: number[];
      currentEncoding: string;
    };
    current = ret.currentEncoding;

    ok(current == 'E');
    ok(ret.value[0] == 33);
    ok(ret.value[1] == 59);
  });

  it('TestCreateSequenceL', function () {
    let ret = invokeMethod('getSequence', 'A:b') as { value: Seq[]; text: string };
    let text = ret.text;
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'L');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'B');
    ok(ret.value[2].amount == 1);

    ret = invokeMethod('getSequence', 'b:A') as { value: Seq[]; text: string };
    text = ret.text;
    ok(ret.value[0].sequence == 'B');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'L');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 1);

    ret = invokeMethod('getSequence', 'é:b') as { value: Seq[]; text: string };
    text = ret.text;
    ok(ret.value[0].sequence == 'D');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'L');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'B');
    ok(ret.value[2].amount == 1);

    ret = invokeMethod('getSequence', 'é:B') as { value: Seq[]; text: string };
    text = ret.text;
    ok(ret.value[0].sequence == 'D');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'L');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 1);
  });

  it('TestCreateBinaryL', function () {
    let text = 'A:b';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 1);
    ok(ret[1] == 58);
    ok(ret[2] == 59);
    ok(ret[3] == 2);

    text = 'b:A';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 59);
    ok(ret[1] == 2);
    ok(ret[2] == 58);
    ok(ret[3] == 1);

    text = 'é:b';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 61);
    ok(ret[1] == 9);
    ok(ret[2] == 58);
    ok(ret[3] == 59);
    ok(ret[4] == 2);

    text = 'é:B';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 61);
    ok(ret[1] == 9);
    ok(ret[2] == 58);
    ok(ret[3] == 2);

    text = 'abcd:A';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 63);
    ok(ret[1] == 1);
    ok(ret[2] == 2);
    ok(ret[3] == 3);
    ok(ret[4] == 4);
    ok(ret[5] == 51);
    ok(ret[6] == 59);
    ok(ret[7] == 1);
  });

  it('TestCreateSequenceK', function () {
    let ret = invokeMethod('getSequence', 'A' + String.fromCharCode(13) + 'A') as { value: Seq[]; text: string };
    let text = ret.text;
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'K');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 1);

    ret = invokeMethod('getSequence', 'A' + String.fromCharCode(13) + String.fromCharCode(12)) as { value: Seq[]; text: string };
    text = ret.text;
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'K');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'E');
    ok(ret.value[2].amount == 1);

    ret = invokeMethod('getSequence', String.fromCharCode(12) + String.fromCharCode(13) + 'A') as { value: Seq[]; text: string };
    text = ret.text;
    ok(ret.value[0].sequence == 'E');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'K');
    ok(ret.value[1].amount == 1);
    ok(ret.value[2].sequence == 'A');
    ok(ret.value[2].amount == 1);
  });

  it('TestCreateBinaryK', function () {
    let text = 'A' + String.fromCharCode(13) + 'A';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 1);
    ok(ret[1] == 0);
    ok(ret[2] == 1);

    text = 'A' + String.fromCharCode(13) + String.fromCharCode(12);
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 1);
    ok(ret[1] == 0);
    ok(ret[2] == 62);
    ok(ret[3] == 12);

    text = String.fromCharCode(12) + String.fromCharCode(13) + 'A';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 62);
    ok(ret[1] == 12);
    ok(ret[2] == 0);
    ok(ret[3] == 1);

    text = String.fromCharCode(12) + String.fromCharCode(12) + String.fromCharCode(12) + String.fromCharCode(12) + String.fromCharCode(13);
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 62);
    ok(ret[1] == 62);
    ok(ret[2] == 12);
    ok(ret[3] == 12);
    ok(ret[4] == 12);
    ok(ret[5] == 12);
    ok(ret[6] == 13);
  });

  it('TestEncodeM', function () {
    let text =
      'aaaa' + // Make sure we are in B
      ' ' +
      'AB' +
      ' ' +
      'ABC';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };

    ok(seq.value[0].sequence == 'B');
    ok(seq.value[0].amount == 4);
    ok(seq.value[1].sequence == 'M');
    ok(seq.value[1].amount == 1);
    ok(seq.value[2].sequence == 'A');
    ok(seq.value[2].amount == 2);
    ok(seq.value[3].sequence == 'M');
    ok(seq.value[3].amount == 1);
    ok(seq.value[4].sequence == 'A');
    ok(seq.value[4].amount == 3);

    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    ok(ret[0] == 63);
    ok(ret[1] == 1);
    ok(ret[2] == 1);
    ok(ret[3] == 1);
    ok(ret[4] == 1);
    ok(ret[5] == 47);
    ok(ret[6] == 63);
    ok(ret[7] == 1);
    ok(ret[8] == 2);
    ok(ret[9] == 32);
    ok(ret[10] == 1);
    ok(ret[11] == 2);
    ok(ret[12] == 3);
  });

  it('TestEncodeReal', function () {
    let ret = invokeMethod(
      'getSequence',
      'Comité Européen de Normalisation' +
        String.fromCharCode(28) +
        'rue de Stassart 36' +
        String.fromCharCode(28) +
        'B-1050 BRUXELLES' +
        String.fromCharCode(28) +
        'TEL +3225196811'
    ) as { value: Seq[]; text: string };
    let text = ret.text;

    // First Line
    ok(ret.value[0].sequence == 'A');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'B');
    ok(ret.value[1].amount == 4);
    ok(ret.value[2].sequence == 'D');
    ok(ret.value[2].amount == 1);
    ok(ret.value[3].sequence == 'M');
    ok(ret.value[3].amount == 1);
    ok(ret.value[4].sequence == 'A');
    ok(ret.value[4].amount == 1);
    ok(ret.value[5].sequence == 'B');
    ok(ret.value[5].amount == 4);
    ok(ret.value[6].sequence == 'D');
    ok(ret.value[6].amount == 1);
    ok(ret.value[7].sequence == 'B');
    ok(ret.value[7].amount == 2);
    ok(ret.value[8].sequence == 'M');
    ok(ret.value[8].amount == 1);
    ok(ret.value[9].sequence == 'B');
    ok(ret.value[9].amount == 2);
    ok(ret.value[10].sequence == 'M');
    ok(ret.value[10].amount == 1);
    ok(ret.value[11].sequence == 'A');
    ok(ret.value[11].amount == 1);
    ok(ret.value[12].sequence == 'B');
    ok(ret.value[12].amount == 12);
    ok(ret.value[13].sequence == 'M');
    ok(ret.value[13].amount == 1);

    // Second Line
    ok(ret.value[14].sequence == 'B');
    ok(ret.value[14].amount == 3);
    ok(ret.value[15].sequence == 'M');
    ok(ret.value[15].amount == 1);
    ok(ret.value[16].sequence == 'B');
    ok(ret.value[16].amount == 2);
    ok(ret.value[17].sequence == 'M');
    ok(ret.value[17].amount == 1);
    ok(ret.value[18].sequence == 'A');
    ok(ret.value[18].amount == 1);
    ok(ret.value[19].sequence == 'B');
    ok(ret.value[19].amount == 7);
    ok(ret.value[20].sequence == 'M');
    ok(ret.value[20].amount == 1);
    ok(ret.value[21].sequence == 'A');
    ok(ret.value[21].amount == 2);
    ok(ret.value[22].sequence == 'M');
    ok(ret.value[22].amount == 1);

    // Third Line
    ok(ret.value[23].sequence == 'A');
    ok(ret.value[23].amount == 6);
    ok(ret.value[24].sequence == 'M');
    ok(ret.value[24].amount == 1);
    ok(ret.value[25].sequence == 'A');
    ok(ret.value[25].amount == 9);
    ok(ret.value[26].sequence == 'M');
    ok(ret.value[26].amount == 1);

    // Fourth Line
    ok(ret.value[27].sequence == 'A');
    ok(ret.value[27].amount == 3);
    ok(ret.value[28].sequence == 'M');
    ok(ret.value[28].amount == 1);
    ok(ret.value[29].sequence == 'A');
    ok(ret.value[29].amount == 1);
    ok(ret.value[30].sequence == 'N');
    ok(ret.value[30].amount == 9);
    ok(ret.value[31].sequence == 'A');
    ok(ret.value[31].amount == 1);
  });

  it('TestCreateBinary', function () {
    let text =
      'Comité Européen de Normalisation' +
      String.fromCharCode(28) +
      'rue de Stassart 36' +
      String.fromCharCode(28) +
      'B-1050 BRUXELLES' +
      String.fromCharCode(28) +
      'TEL +3225196811';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];

    // First Line
    ok(ret[0] == 3); // C
    ok(ret[1] == 63); // Latch B
    ok(ret[2] == 15); // o
    ok(ret[3] == 13); // m
    ok(ret[4] == 9); // i
    ok(ret[5] == 20); // t
    ok(ret[6] == 61); // Switch D
    ok(ret[7] == 9); // é
    ok(ret[8] == 47); //
    ok(ret[9] == 59); // Switch A
    ok(ret[10] == 5); // E
    ok(ret[11] == 21); // u
    ok(ret[12] == 18); // r
    ok(ret[13] == 15); // o
    ok(ret[14] == 16); // p
    ok(ret[15] == 61); // Switch D
    ok(ret[16] == 9); // é
    ok(ret[17] == 5); // e
    ok(ret[18] == 14); // n
    ok(ret[19] == 47); //
    ok(ret[20] == 4); // d
    ok(ret[21] == 5); // e
    ok(ret[22] == 47); //
    ok(ret[23] == 59); // Shift A
    ok(ret[24] == 14); // N
    ok(ret[25] == 15); // o
    ok(ret[26] == 18); // r
    ok(ret[27] == 13); // m
    ok(ret[28] == 1); // a
    ok(ret[29] == 12); // l
    ok(ret[30] == 9); // i
    ok(ret[31] == 19); // s
    ok(ret[32] == 1); // a
    ok(ret[33] == 20); // t
    ok(ret[34] == 9); // i
    ok(ret[35] == 15); // o
    ok(ret[36] == 14); // n
    ok(ret[37] == 28); // FS

    // Second Line
    ok(ret[38] == 18); // r
    ok(ret[39] == 21); // u
    ok(ret[40] == 5); // e
    ok(ret[41] == 47); //
    ok(ret[42] == 4); // d
    ok(ret[43] == 5); // e
    ok(ret[44] == 47); //
    ok(ret[45] == 59); // Shift A
    ok(ret[46] == 19); // S
    ok(ret[47] == 20); // t
    ok(ret[48] == 1); // a
    ok(ret[49] == 19); // s
    ok(ret[50] == 19); // s
    ok(ret[51] == 1); // a
    ok(ret[52] == 18); // r
    ok(ret[53] == 20); // t
    ok(ret[54] == 47); //
    ok(ret[55] == 63); // Latch A
    ok(ret[56] == 51); // 3
    ok(ret[57] == 54); // 6
    ok(ret[58] == 28); // FS

    // Third Line
    ok(ret[59] == 2); // B
    ok(ret[60] == 45); // -
    ok(ret[61] == 49); // 1
    ok(ret[62] == 48); // 0
    ok(ret[63] == 53); // 5
    ok(ret[64] == 48); // 0
    ok(ret[65] == 32); //
    ok(ret[66] == 2); // B
    ok(ret[67] == 18); // R
    ok(ret[68] == 21); // U
    ok(ret[69] == 24); // X
    ok(ret[70] == 5); // E
    ok(ret[71] == 12); // L
    ok(ret[72] == 12); // L
    ok(ret[73] == 5); // E
    ok(ret[74] == 19); // S
    ok(ret[75] == 28); // FS

    // Fourth Line
    ok(ret[76] == 20); // T
    ok(ret[77] == 5); // E
    ok(ret[78] == 12); // L
    ok(ret[79] == 32); //
    ok(ret[80] == 43); // +
    ok(ret[81] == 31); // NS
    ok(ret[82] == 19); // b
    ok(ret[83] == 14); // b
    ok(ret[84] == 20); // b
    ok(ret[85] == 10); // b
    ok(ret[86] == 1); // b
    ok(ret[87] == 49); // 1
  });

  it('TestCreateMaxiCode', function () {
    let text = 'MaxiCode (19 chars)';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];

    /* First Line */
    ok(ret[0] == 13); // M
    ok(ret[1] == 63); // Latch B
    ok(ret[2] == 1); // a
    ok(ret[3] == 24); // x
    ok(ret[4] == 9); // i
    ok(ret[5] == 59); // Switch A
    ok(ret[6] == 3); // C
    ok(ret[7] == 15); // o
    ok(ret[8] == 4); // d
    ok(ret[9] == 5); // e
    ok(ret[10] == 47); //
    ok(ret[11] == 57); // 3Shift A
    ok(ret[12] == 40); // (
    ok(ret[13] == 49); // 1
    ok(ret[14] == 57); // 9
    ok(ret[15] == 47); //
    ok(ret[16] == 3); // c
    ok(ret[17] == 8); // h
    ok(ret[18] == 1); // a
    ok(ret[19] == 18); // r
    ok(ret[20] == 19); // s
    ok(ret[21] == 59); // Shift A
    ok(ret[22] == 41); // )
  });

  it('TestSetDataFromAnnexe', function () {
    instance.setMode(4);
    instance.parse('MaxiCode (19 chars)');
    let ret = getProtectedField('data') as number[];

    // Check the Primary Message
    strictEqual(4, ret[0]);
    strictEqual(13, ret[1]);
    strictEqual(63, ret[2]);
    strictEqual(1, ret[3]);
    strictEqual(24, ret[4]);
    strictEqual(9, ret[5]);
    strictEqual(59, ret[6]);
    strictEqual(3, ret[7]);
    strictEqual(15, ret[8]);
    strictEqual(4, ret[9]);
    strictEqual(50, ret[10]);
    strictEqual(2, ret[11]);
    strictEqual(42, ret[12]);
    strictEqual(51, ret[13]);
    strictEqual(53, ret[14]);
    strictEqual(34, ret[15]);
    strictEqual(22, ret[16]);
    strictEqual(20, ret[17]);
    strictEqual(5, ret[18]);
    strictEqual(16, ret[19]);

    strictEqual(5, ret[20]);
    strictEqual(47, ret[21]);
    strictEqual(57, ret[22]);
    strictEqual(40, ret[23]);
    strictEqual(49, ret[24]);
    strictEqual(57, ret[25]);
    strictEqual(47, ret[26]);
    strictEqual(3, ret[27]);
    strictEqual(8, ret[28]);
    strictEqual(1, ret[29]);
    strictEqual(18, ret[30]);
    strictEqual(19, ret[31]);
    strictEqual(59, ret[32]);
    strictEqual(41, ret[33]);
    for (let i = 34; i < 35 + 35 + 34; i++) {
      strictEqual(33, ret[i]);
    }
    strictEqual(31, ret[104]);
    strictEqual(1, ret[105]);
    strictEqual(2, ret[106]);
    strictEqual(15, ret[107]);
    strictEqual(58, ret[108]);
    strictEqual(22, ret[109]);
    strictEqual(6, ret[110]);
    strictEqual(28, ret[111]);
    strictEqual(6, ret[112]);
    strictEqual(39, ret[113]);
    strictEqual(39, ret[114]);
    strictEqual(17, ret[115]);
    strictEqual(13, ret[116]);
    strictEqual(60, ret[117]);
    strictEqual(63, ret[118]);
    strictEqual(5, ret[119]);
    strictEqual(2, ret[120]);
    strictEqual(35, ret[121]);
    strictEqual(30, ret[122]);
    strictEqual(35, ret[123]);
    strictEqual(19, ret[124]);
    strictEqual(4, ret[125]);
    strictEqual(19, ret[126]);
    strictEqual(8, ret[127]);
    strictEqual(14, ret[128]);
    strictEqual(0, ret[129]);
    strictEqual(19, ret[130]);
    strictEqual(32, ret[131]);
    strictEqual(23, ret[132]);
    strictEqual(51, ret[133]);
    strictEqual(17, ret[134]);
    strictEqual(45, ret[135]);
    strictEqual(62, ret[136]);
    strictEqual(63, ret[137]);
    strictEqual(8, ret[138]);
    strictEqual(53, ret[139]);
    strictEqual(2, ret[140]);
    strictEqual(61, ret[141]);
    strictEqual(23, ret[142]);
    strictEqual(14, ret[143]);
  });

  it('TestModuleSequence', function () {
    let moduleSequence = getProtectedField('moduleSequence') as number[][];

    let arr: { [key: number]: number } = {};
    let c = moduleSequence.length;
    for (let i = 0; i < c; i++) {
      let z = moduleSequence[i].length;
      for (let j = 0; j < z; j++) {
        if (!arr[moduleSequence[i][j]]) {
          arr[moduleSequence[i][j]] = 0;
        }

        arr[moduleSequence[i][j]]++;
      }
    }

    // Check if all the numbers from 1 to 864 are equal to 1
    for (let i = 1; i <= 864; i++) {
      if (arr[i] != 1) {
        ok(false, 'Number ' + i + ' is incorrect. Value: ' + arr[i]);
      }
    }
  });

  it('TestGetNumberErrorCodewordsRequired', function () {
    instance.setMode(2);
    strictEqual(40, invokeMethod('getNumberErrorCodewordsRequired') as number);
    instance.setMode(3);
    strictEqual(40, invokeMethod('getNumberErrorCodewordsRequired') as number);
    instance.setMode(4);
    strictEqual(40, invokeMethod('getNumberErrorCodewordsRequired') as number);
    instance.setMode(5);
    strictEqual(56, invokeMethod('getNumberErrorCodewordsRequired') as number);
    instance.setMode(6);
    strictEqual(40, invokeMethod('getNumberErrorCodewordsRequired') as number);
  });

  it('TestGetDataWithPaddingSEC', function () {
    setField('finalEncodingMode', 'A');
    instance.setMode(2);
    let data: number[] = [5, 10, 15];
    let ret = invokeMethod('getDataWithPadding', data) as number[];
    strictEqual(144 - 10, ret.length + 40); // 40 = BCGmaxicode::_ERRORMODESEC
    strictEqual(33, ret[3]);
  });

  it('TestGetDataWithPaddingEEC', function () {
    setField('finalEncodingMode', 'A');
    instance.setMode(5);
    let data: number[] = [5, 10, 15];
    let ret = invokeMethod('getDataWithPadding', data) as number[];
    strictEqual(144 - 10, ret.length + 56); // 56 = BCGmaxicode::_ERRORMODEEEC
    strictEqual(33, ret[3]);
  });

  it('TestGetDataWithPaddingSECFinalEncodingC', function () {
    setField('finalEncodingMode', 'C');
    instance.setMode(3);
    let data: number[] = [5, 10, 15];
    let ret = invokeMethod('getDataWithPadding', data) as number[];
    strictEqual(144 - 10, ret.length + 40); // 40 = BCGmaxicode::_ERRORMODESEC
    strictEqual(58, ret[3]);
    strictEqual(33, ret[4]);
  });

  it('TestGetDataWithPaddingSECFinalEncodingE', function () {
    setField('finalEncodingMode', 'E');
    instance.setMode(3);
    let data: number[] = [5, 10, 15];
    let ret = invokeMethod('getDataWithPadding', data) as number[];
    strictEqual(144 - 10, ret.length + 40); // 40 = BCGmaxicode::_ERRORMODESEC
    strictEqual(28, ret[3]);
    strictEqual(28, ret[4]);
  });

  it('TestGetSubdivisions', function () {
    let data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let ret = invokeMethod('getSubdivisions', data) as BCGmaxicodeMessage;

    strictEqual(data.length, ret.primary.length + ret.secondaryOdd.length + ret.secondaryEven.length);
    strictEqual(ret.primary[0], 1);
    strictEqual(ret.primary[1], 2);
    strictEqual(ret.primary[9], 10);

    strictEqual(ret.secondaryOdd[0], 11);
    strictEqual(ret.secondaryOdd[1], 13);
    strictEqual(ret.secondaryOdd[4], 19);

    strictEqual(ret.secondaryEven[0], 12);
    strictEqual(ret.secondaryEven[1], 14);
    strictEqual(ret.secondaryEven[4], 20);
  });

  it('TestGetErrorMessages', function () {
    instance.setMode(3);
    let data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let subdivisions = invokeMethod('getSubdivisions', data) as BCGmaxicodeMessage;
    let ret = invokeMethod('getErrorMessages', subdivisions) as BCGmaxicodeMessage;

    strictEqual(10, ret.primary.length);
    strictEqual(40 / 2, ret.secondaryOdd.length); // BCGmaxicode::_ERRORMODESEC = 40
    strictEqual(40 / 2, ret.secondaryEven.length); // BCGmaxicode::_ERRORMODESEC = 40
  });

  it('TestGetFinalMessage', function () {
    let subdivisions = new BCGmaxicodeMessage([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [11, 13, 15, 17, 19], [12, 14, 16, 18, 20]);
    let errorMessages = new BCGmaxicodeMessage(
      [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
      [111, 133, 155, 177, 199],
      [122, 144, 166, 188, 200]
    );

    let ret = invokeMethod('getFinalMessage', subdivisions, errorMessages) as BCGmaxicodeFinalMessage;
    strictEqual(20, ret.primary.length);
    strictEqual(5 + 5 + 5 + 5, ret.secondary.length);
    strictEqual(ret.primary[0], 1);
    strictEqual(ret.primary[1], 2);
    strictEqual(ret.primary[9], 10);
    strictEqual(ret.primary[10], 101);
    strictEqual(ret.secondary[0], 11);
    strictEqual(ret.secondary[1], 12);
    strictEqual(ret.secondary[2], 13);
    strictEqual(ret.secondary[9], 20);
    strictEqual(ret.secondary[10], 111);
    strictEqual(ret.secondary[11], 122);
    strictEqual(ret.secondary[12], 133);
  });

  it('TestSetData', function () {
    setField('finalEncodingMode', 'A');
    let data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    invokeMethod('setData', data);
    strictEqual(144, (getProtectedField('data') as number[]).length);
  });

  it('TestSetPrimaryMessage', function () {
    instance.setPrimaryMessage(1, 2, '234');
    let primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(1, primary.serviceClass);
    strictEqual(2, primary.countryCode);
    strictEqual('234', primary.postalCode);
  });

  it('TestSetPrimaryMessage_Reset', function () {
    instance.setPrimaryMessage(-1);
    let primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(null, primary);
  });

  it('TestSetPrimaryMessage_Success', function () {
    instance.setPrimaryMessage(0, 0, '0');
    let primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(0, primary.serviceClass);
    strictEqual(0, primary.countryCode);
    strictEqual('0', primary.postalCode);

    instance.setPrimaryMessage(999, 999, 'ABCDEF');
    primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(999, primary.serviceClass);
    strictEqual(999, primary.countryCode);
    strictEqual('ABCDEF', primary.postalCode);
  });

  it('TestSetPrimaryMessage_Failure1', function () {
    try {
      instance.setPrimaryMessage(1000, 0, '0');
    } catch (tie) {
      strictEqual('The class of service must have 3 digits or less.', tie.message);
    }
  });

  it('TestSetPrimaryMessage_Failure2', function () {
    try {
      instance.setPrimaryMessage(0, 1000, '0');
    } catch (tie) {
      strictEqual('The country code must have 3 digits or less.', tie.message);
    }
  });

  it('TestGetPostalCodeBinaryMode2', function () {
    instance.setMode(2);
    let ret = invokeMethod('getPostalCodeBinary', '981095566') as string;
    strictEqual('001001' + '111010011110100101010010001110', ret);
  });

  it('TestGetPostalCodeBinaryMode3', function () {
    instance.setMode(3);
    let ret = invokeMethod('getPostalCodeBinary', 'B1050') as string;
    strictEqual('000010' + '110001' + '110000' + '110101' + '110000' + '100000', ret);
  });

  it('TestGetPostalCodeBinaryMode3TooLong', function () {
    instance.setMode(3);
    let ret = invokeMethod('getPostalCodeBinary', 'B1050ADEF') as string;
    strictEqual('000010' + '110001' + '110000' + '110101' + '110000' + '000001', ret);
  });

  it('TestGetPostalCodeBinaryMode3WrongEncoding', function () {
    instance.setMode(3);

    try {
      let ret = invokeMethod('getPostalCodeBinary', 'B1050a') as string;
    } catch (tie) {
      strictEqual(tie.message, 'The postal code in mode 3 can only contain data from the Code Set A.');
    }
  });

  it('TestGetPrimaryMessageMode3', function () {
    instance.setMode(3);
    instance.setPrimaryMessage(999, 56, 'B1050');
    let ret = invokeMethod('getPrimaryMessage') as number[];

    strictEqual(3, ret[0]);
    strictEqual(8, ret[1]);
    strictEqual(28, ret[2]);
    strictEqual(13, ret[3]);
    strictEqual(28, ret[4]);
    strictEqual(44, ret[5]);
    strictEqual(0, ret[6]);
    strictEqual(14, ret[7]);
    strictEqual(28, ret[8]);
    strictEqual(62, ret[9]);
  });

  it('TestGetPrimaryMessageMode2', function () {
    instance.setMode(2);
    instance.setPrimaryMessage(999, 840, '981095566');
    let ret = invokeMethod('getPrimaryMessage') as number[];

    strictEqual(34, ret[0]);
    strictEqual(35, ret[1]);
    strictEqual(20, ret[2]);
    strictEqual(41, ret[3]);
    strictEqual(39, ret[4]);
    strictEqual(30, ret[5]);
    strictEqual(2, ret[6]);
    strictEqual(18, ret[7]);
    strictEqual(31, ret[8]);
    strictEqual(62, ret[9]);
  });

  it('TestHandleSpecialMessageWithSpecialBeginning', function () {
    instance.setMode(2);
    let text =
      '[)>' +
      String.fromCharCode(30) +
      '01' +
      String.fromCharCode(29) +
      '96152382802' +
      String.fromCharCode(29) +
      '840' +
      String.fromCharCode(29) +
      '001' +
      String.fromCharCode(29) +
      '1Z00004951' +
      String.fromCharCode(29) +
      'UPSN' +
      String.fromCharCode(29) +
      '06X610' +
      String.fromCharCode(29) +
      '159' +
      String.fromCharCode(29) +
      '1234567' +
      String.fromCharCode(29) +
      '1/1' +
      String.fromCharCode(29) +
      String.fromCharCode(29) +
      'Y' +
      String.fromCharCode(29) +
      '634 ALPHA DRIVE' +
      String.fromCharCode(29) +
      'PITTSBURG' +
      String.fromCharCode(29) +
      'PA' +
      String.fromCharCode(30) +
      String.fromCharCode(4);
    let ret = invokeMethod('handleSpecialMessage', text) as string;
    let primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(
      ret,
      '[)>' +
        String.fromCharCode(30) +
        '01' +
        String.fromCharCode(29) +
        '961Z00004951' +
        String.fromCharCode(29) +
        'UPSN' +
        String.fromCharCode(29) +
        '06X610' +
        String.fromCharCode(29) +
        '159' +
        String.fromCharCode(29) +
        '1234567' +
        String.fromCharCode(29) +
        '1/1' +
        String.fromCharCode(29) +
        String.fromCharCode(29) +
        'Y' +
        String.fromCharCode(29) +
        '634 ALPHA DRIVE' +
        String.fromCharCode(29) +
        'PITTSBURG' +
        String.fromCharCode(29) +
        'PA' +
        String.fromCharCode(30) +
        String.fromCharCode(4)
    );
    strictEqual(1, primary.serviceClass);
    strictEqual(840, primary.countryCode);
    strictEqual('152382802', primary.postalCode);
  });

  it('TestHandleSpecialMessageWithoutSpecialBeginning', function () {
    instance.setMode(2);
    let text =
      '152382802' +
      String.fromCharCode(29) +
      '840' +
      String.fromCharCode(29) +
      '001' +
      String.fromCharCode(29) +
      '1Z00004951' +
      String.fromCharCode(29) +
      'UPSN' +
      String.fromCharCode(29) +
      '06X610' +
      String.fromCharCode(29) +
      '159' +
      String.fromCharCode(29) +
      '1234567' +
      String.fromCharCode(29) +
      '1/1' +
      String.fromCharCode(29) +
      String.fromCharCode(29) +
      'Y' +
      String.fromCharCode(29) +
      '634 ALPHA DRIVE' +
      String.fromCharCode(29) +
      'PITTSBURG' +
      String.fromCharCode(29) +
      'PA' +
      String.fromCharCode(30) +
      String.fromCharCode(4);
    let ret = invokeMethod('handleSpecialMessage', text) as string;
    let primary = getProtectedField('primary') as BCGmaxicodePrimaryMessage;
    strictEqual(
      ret,
      '1Z00004951' +
        String.fromCharCode(29) +
        'UPSN' +
        String.fromCharCode(29) +
        '06X610' +
        String.fromCharCode(29) +
        '159' +
        String.fromCharCode(29) +
        '1234567' +
        String.fromCharCode(29) +
        '1/1' +
        String.fromCharCode(29) +
        String.fromCharCode(29) +
        'Y' +
        String.fromCharCode(29) +
        '634 ALPHA DRIVE' +
        String.fromCharCode(29) +
        'PITTSBURG' +
        String.fromCharCode(29) +
        'PA' +
        String.fromCharCode(30) +
        String.fromCharCode(4)
    );
    strictEqual(1, primary.serviceClass);
    strictEqual(840, primary.countryCode);
    strictEqual('152382802', primary.postalCode);
  });

  it('TestStructuredAppendCodewords', function () {
    let ret = invokeMethod('getStructuredAppendCodewords') as number[];
    strictEqual(0, ret.length);

    instance.setStructuredAppend(3, 7);
    ret = invokeMethod('getStructuredAppendCodewords') as number[];
    strictEqual(2, ret.length);
    strictEqual(33, ret[0]);
    strictEqual(22, ret[1]);
  });

  it('TestECISequence', function () {
    instance.setAcceptECI(true);
    let ret = invokeMethod('getSequence', '\\000000') as { value: Seq[]; text: string };
    let text = ret.text;
    strictEqual(1, ret.value.length);
    ok(ret.value[0].sequence == 'G');
    ok(ret.value[0].amount == 7);

    ret = invokeMethod('getSequence', '\\000000\\012345') as { value: Seq[]; text: string };
    text = ret.text;
    strictEqual(2, ret.value.length);
    ok(ret.value[0].sequence == 'G');
    ok(ret.value[0].amount == 7);
    ok(ret.value[1].sequence == 'G');
    ok(ret.value[1].amount == 7);

    instance.setAcceptECI(false);
    ret = invokeMethod('getSequence', '\\000000') as { value: Seq[]; text: string };
    text = ret.text;
    strictEqual(2, ret.value.length);
    ok(ret.value[0].sequence == 'B');
    ok(ret.value[0].amount == 1);
    ok(ret.value[1].sequence == 'A');
    ok(ret.value[1].amount == 6);
  });

  it('TestECIBinaryStream', function () {
    instance.setAcceptECI(true);

    let text = '\\000000';
    let seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    let ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 0);

    text = '\\000031';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 31);

    text = '\\000032';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 32);
    strictEqual(ret[2], 32);

    text = '\\001023';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 47);
    strictEqual(ret[2], 63);

    text = '\\001024';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 48);
    strictEqual(ret[2], 16);
    strictEqual(ret[3], 0);

    text = '\\032767';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 55);
    strictEqual(ret[2], 63);
    strictEqual(ret[3], 63);

    text = '\\032768';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 56);
    strictEqual(ret[2], 8);
    strictEqual(ret[3], 0);
    strictEqual(ret[4], 0);

    text = '\\999999';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 59);
    strictEqual(ret[2], 52);
    strictEqual(ret[3], 8);
    strictEqual(ret[4], 63);

    text = '\\999999\\000001';
    seq = invokeMethod('getSequence', text) as { value: Seq[]; text: string };
    ret = invokeMethod('createCodewordsStream', text, seq.value) as number[];
    strictEqual(ret[0], 27);
    strictEqual(ret[1], 59);
    strictEqual(ret[2], 52);
    strictEqual(ret[3], 8);
    strictEqual(ret[4], 63);
    strictEqual(ret[5], 27);
    strictEqual(ret[6], 1);
  });
});

class Seq {
  constructor(
    public sequence: string,
    public amount: number = 0,
    public pos: number = 0
  ) {}
}

class BCGmaxicodeMessage {
  constructor(
    public primary: number[],
    public secondaryOdd: number[],
    public secondaryEven: number[]
  ) {}
}

class BCGmaxicodeFinalMessage {
  constructor(
    public primary: number[],
    public secondary: number[]
  ) {}
}

class BCGmaxicodePrimaryMessage {
  constructor(
    public serviceClass: number,
    public countryCode: number,
    public postalCode: string | null
  ) {}
}
