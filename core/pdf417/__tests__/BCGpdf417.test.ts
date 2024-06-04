'use strict';

import { beforeEach, describe, it } from '@jest/globals';
import { fail, ok, strictEqual } from 'assert';
import { BCGpdf417 } from '../src/BCGpdf417';

function chr(code: number) {
  return String.fromCharCode(code);
}

interface Seq {
  sequence: string;
  amount: number;
  pos: number;
}

let code = 'Pdf417';
const CHAR_ALP = (BCGpdf417 as any).CHAR_ALP;
const TEXT_LOW = (BCGpdf417 as any).TEXT_LOW;
const TEXT_MIX = (BCGpdf417 as any).TEXT_MIX;
const TEXT_T_PON = (BCGpdf417 as any).TEXT_T_PON;
const TEXT_ALP = (BCGpdf417 as any).TEXT_ALP;
const TEXT_T_ALP = (BCGpdf417 as any).TEXT_T_ALP;
const CHAR_LOW = (BCGpdf417 as any).CHAR_LOW;
const TEXT_PON = (BCGpdf417 as any).TEXT_PON;

describe(code, function () {
  let instance: BCGpdf417;

  function getProtectedField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function getPrivateField(fieldName: string): any {
    return (instance as any)[fieldName];
  }

  function invokeMethod(methodName: string, ...parameters: any[]): any {
    return (instance as any)[methodName].apply(instance, parameters);
  }

  beforeEach(function () {
    instance = new BCGpdf417();
    instance.setAcceptECI(false);
    instance.setQuietZone(true);
    instance.setScale(4);
  });

  describe('#GetSequence', function () {
    it('works with StartingNumberNumber', function () {
      let ret = invokeMethod('getSequence', '01234567890123ABC') as Seq[];

      strictEqual(ret[0].sequence, 'N');
      strictEqual(ret[0].amount, 14);
      strictEqual(ret[1].sequence, 'B');
      strictEqual(ret[1].amount, 3);
    });

    it('works with StartingBinaryNumber', function () {
      let ret = invokeMethod('getSequence', 'ABC01234567890123ABC') as Seq[];

      strictEqual(ret[0].sequence, 'B');
      strictEqual(ret[0].amount, 3);
      strictEqual(ret[1].sequence, 'N');
      strictEqual(ret[1].amount, 14);
      strictEqual(ret[2].sequence, 'B');
      strictEqual(ret[2].amount, 3);
    });

    it('works with NotEnoughNumber', function () {
      let ret = invokeMethod('getSequence', 'ABéDE12FG') as Seq[];

      strictEqual(ret[0].sequence, 'B');
      strictEqual(ret[0].amount, 3);
      strictEqual(ret[1].sequence, 'T');
      strictEqual(ret[1].amount, 6);
    });

    it('works with StartingTextAndNumber', function () {
      let ret = invokeMethod('getSequence', 'ABCDEF01928') as Seq[];

      strictEqual(ret[0].sequence, 'T');
      strictEqual(ret[0].amount, 11);
    });

    it('works with StartingTextFollowedBinary', function () {
      let ret = invokeMethod('getSequence', 'ABCDEFéé') as Seq[];

      strictEqual(ret[0].sequence, 'T');
      strictEqual(ret[0].amount, 6);
      strictEqual(ret[1].sequence, 'B');
      strictEqual(ret[1].amount, 2);
    });

    it('works with NotEnoughText', function () {
      let ret = invokeMethod('getSequence', 'éAB12é') as Seq[];

      strictEqual(ret[0].sequence, 'B');
      strictEqual(ret[0].amount, 6);
    });
  });

  describe('#EncodeNumeric', function () {
    it('works with NumericForceNew', function () {
      let ret = invokeMethod('encodeNumeric', '000213298174000', 'N', true);

      strictEqual(ret[0], 902);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 624);
      strictEqual(ret[3], 434);
      strictEqual(ret[4], 632);
      strictEqual(ret[5], 282);
      strictEqual(ret[6], 200);
    });

    it('works with NumericNotForceNew', function () {
      let ret = invokeMethod('encodeNumeric', '000213298174000', 'N', false);

      strictEqual(ret[0], 1);
      strictEqual(ret[1], 624);
      strictEqual(ret[2], 434);
      strictEqual(ret[3], 632);
      strictEqual(ret[4], 282);
      strictEqual(ret[5], 200);
    });

    it('works with NotNumeric', function () {
      let ret = invokeMethod('encodeNumeric', '000213298174000', 'T', false);

      strictEqual(ret[0], 902);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 624);
      strictEqual(ret[3], 434);
      strictEqual(ret[4], 632);
      strictEqual(ret[5], 282);
      strictEqual(ret[6], 200);
    });
  });

  describe('#FindSubMode', function () {
    it('works with SingleLetterAlpha', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'A');

      strictEqual(ret['current'], CHAR_ALP);
      strictEqual(ret['value'], '');
    });

    it('works with SingleLetterLower', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'a');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW);
    });

    it('works with SingleLetterMixed', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '^');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX);
    });

    it('works with SingleLetterPonctuation', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '?');

      // TODO current
      strictEqual(ret['value'], TEXT_T_PON);
    });

    it('works with SingleLetterAlpha2', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, 'A');

      // TODO current
      strictEqual(ret['value'], TEXT_T_ALP);
    });

    it('works with DoubleLetterLowerAlphaLatch', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, 'AA');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX + TEXT_ALP);
    });

    it('works with DoubleLetterLowerAlphaSwitch', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, 'Aa');

      // TODO current
      strictEqual(ret['value'], TEXT_T_ALP);
    });

    it('works with DoubleLetterLowerMixedSwitch', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, 'A^');

      // TODO current
      strictEqual(ret['value'], TEXT_T_ALP);
    });

    it('works with DoubleLetterLowerPonctuationSwitch', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, 'A?');

      // TODO current
      strictEqual(ret['value'], TEXT_T_ALP);
    });

    it('works with DoubleLetterAlphaLowerLatch', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'aA');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW);
    });

    it('works with DoubleLetterAphaLowerLatch2', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'aa');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW);
    });

    it('works with DoubleLetterAlphaLowerLatch3', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'a^');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW);
    });

    it('works with DoubleLetterAlphaLowerLatch4', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, 'a?');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW);
    });

    it('works with DoubleLetterAlphaMixedLatch', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '^A');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX);
    });

    it('works with DoubleLetterAphaMixedLatch2', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '^a');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX);
    });

    it('works with DoubleLetterAlphaMixedLatch3', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '^^');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX);
    });

    it('works with DoubleLetterAlphaMixedLatch4', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '^?');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX);
    });

    it('works with DoubleLetterAlphaPonctuationSwitch', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '?A');

      // TODO current
      strictEqual(ret['value'], TEXT_T_PON);
    });

    it('works with DoubleLetterAphaPonctuationLatch', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '?a');

      // TODO current
      strictEqual(ret['value'], TEXT_LOW + TEXT_T_PON);
    });

    it('works with DoubleLetterAlphaPonctuationLatch3', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '?^');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX + TEXT_T_PON);
    });

    it('works with DoubleLetterAlphaPonctuationLatch4', function () {
      let current = CHAR_ALP;
      let ret = invokeMethod('findSubMode', current, '??');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX + TEXT_PON);
    });

    it('works with DoubleLetterLowerMixedLatch', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, '?^');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX + TEXT_T_PON);
    });

    it('works with DoubleLetterLowerAlphaLatchPunctuation', function () {
      let current = CHAR_LOW;
      let ret = invokeMethod('findSubMode', current, '?A');

      // TODO current
      strictEqual(ret['value'], TEXT_MIX + TEXT_PON);
    });
  });

  describe('#EncodeText', function () {
    it('works with TextForceNew', function () {
      let ret = invokeMethod('encodeText', 'ABC', 'T', true);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 89);
    });

    it('works with NotText', function () {
      let ret = invokeMethod('encodeText', 'ABC', 'N', true);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 89);
    });

    it('works with Scenario1', function () {
      let ret = invokeMethod('encodeText', 'ABCDEF', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 63); // CD
      strictEqual(ret[2], 125); // EF
    });

    it('works with Scenario2', function () {
      let ret = invokeMethod('encodeText', 'ABCdef', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 87); // C TEXT_LOW
      strictEqual(ret[2], 94); // de
      strictEqual(ret[3], 179); // f TEXT_T_PON
    });

    it('works with Scenario3', function () {
      let ret = invokeMethod('encodeText', 'ABC  def', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 86); // C [space]
      strictEqual(ret[2], 807); // [space] TEXT_LOW
      strictEqual(ret[3], 94); // de
      strictEqual(ret[4], 179); // f TEXT_T_PON
    });

    it('works with Scenario4', function () {
      let ret = invokeMethod('encodeText', 'ABC\r\nDEF', 'T', false);

      // TODO It would actually be better to use 2+ TEXT_T_PON
      // instead of switching to MIX then PON if we have 2 or less PON

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 88); // C TEXT_MIX
      strictEqual(ret[2], 761); // TEXT_PON [CR]
      strictEqual(ret[3], 479); // [LF] TEXT_ALP
      strictEqual(ret[4], 94); // DE
      strictEqual(ret[5], 179); // F TEXT_T_PON
    });

    it('works with Scenario5', function () {
      let ret = invokeMethod('encodeText', 'ABC^^DEF', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 88); // C TEXT_MIX
      strictEqual(ret[2], 744); // ^^
      strictEqual(ret[3], 843); // TEXT_ALP D
      strictEqual(ret[4], 125); // EF
    });

    it('works with Scenario6', function () {
      let ret = invokeMethod('encodeText', 'ABC^DEF', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 88); // C TEXT_MIX
      strictEqual(ret[2], 748); // ^ TEXT_ALP
      strictEqual(ret[3], 94); // DE
      strictEqual(ret[4], 179); // F TEXT_T_PON
    });

    it('works with Scenario7', function () {
      let ret = invokeMethod('encodeText', '?AB', 'T', false);

      strictEqual(ret[0], 895); // TEXT_T_PON ?
      strictEqual(ret[1], 1); // AB
    });

    it('works with Scenario8', function () {
      let ret = invokeMethod('encodeText', 'abc  def', 'T', false);

      strictEqual(ret[0], 810); // TEXT_LOW a
      strictEqual(ret[1], 32); // bc
      strictEqual(ret[2], 806); // [space] [space]
      strictEqual(ret[3], 94); // de
      strictEqual(ret[4], 179); // f TEXT_T_PON
    });

    it('works with Scenario9', function () {
      let ret = invokeMethod('encodeText', 'abc  DEF', 'T', false);

      strictEqual(ret[0], 810); // TEXT_LOW a
      strictEqual(ret[1], 32); // bc
      strictEqual(ret[2], 806); // [space] [space]
      strictEqual(ret[3], 868); // TEXT_MIX TEXT_ALP
      strictEqual(ret[4], 94); // DE
      strictEqual(ret[5], 179); // F TEXT_T_PON
    });

    it('works with Scenario10', function () {
      let ret = invokeMethod('encodeText', '^{}ABC', 'T', false);

      strictEqual(ret[0], 864); // TEXT_MIX ^
      strictEqual(ret[1], 776); // TEXT_PON {
      strictEqual(ret[2], 839); // } TEXT_ALP
      strictEqual(ret[3], 1); // AB
      strictEqual(ret[4], 89); // C TEXT_T_PON
    });

    it('works with Scenario11', function () {
      let ret = invokeMethod('encodeText', '^{}abc', 'T', false);

      strictEqual(ret[0], 864); // TEXT_MIX ^
      strictEqual(ret[1], 776); // TEXT_PON {
      strictEqual(ret[2], 839); // } TEXT_ALP
      strictEqual(ret[3], 810); // TEXT_LOW a
      strictEqual(ret[4], 32); // bc
    });

    it('works with Scenario12', function () {
      let ret = invokeMethod('encodeText', '^?^', 'T', false);

      strictEqual(ret[0], 864); // TEXT_MIX ^
      strictEqual(ret[1], 895); // TEXT_T_PON ?
      strictEqual(ret[2], 749); // ^ TEXT_T_PON
    });

    it('works with Scenario13', function () {
      let ret = invokeMethod('encodeText', '?abc', 'T', false);

      strictEqual(ret[0], 839); // TEXT_LOW TEXT_T_PON
      strictEqual(ret[1], 750); // ?a
      strictEqual(ret[2], 32); // bc
    });

    it('works with Scenario14', function () {
      let ret = invokeMethod('encodeText', '-ABC', 'T', false);

      strictEqual(ret[0], 886); // TEXT_T_PON -
      strictEqual(ret[1], 1); // AB
      strictEqual(ret[2], 89); // C TEXT_T_PON
    });

    it('works with Scenario15', function () {
      let ret = invokeMethod('encodeText', '--ABC', 'T', false);

      strictEqual(ret[0], 865); // TEXT_MIX TEXT_PON
      strictEqual(ret[1], 496); // --
      strictEqual(ret[2], 870); // TEXT_ALP A
      strictEqual(ret[3], 32); // BC
    });

    it('works with Scenario17', function () {
      let ret = invokeMethod('encodeText', 'AB@@@', 'T', false);

      strictEqual(ret[0], 1); // AB
      strictEqual(ret[1], 865); // TEXT_MIX TEXT_PON
      strictEqual(ret[2], 93); // @@
      strictEqual(ret[3], 119); // @ TEXT_ALP
    });

    it('works with Scenario18', function () {
      let ret = invokeMethod('encodeText', 'PDF417', 'T', false);

      strictEqual(ret[0], 453); // PD
      strictEqual(ret[1], 178); // F TEXT_MIX
      strictEqual(ret[2], 121); // 41
      strictEqual(ret[3], 239); // 7 TEXT_T_PON
    });
  });

  describe('#EncodeBinary', function () {
    it('works with Scenario1', function () {
      let ret = invokeMethod('encodeBinary', chr(231) + chr(101) + chr(11) + chr(97) + chr(205) + chr(2), 'B', false);

      strictEqual(ret[0], 924);
      strictEqual(ret[1], 387);
      strictEqual(ret[2], 700);
      strictEqual(ret[3], 208);
      strictEqual(ret[4], 213);
      strictEqual(ret[5], 302);
    });

    it('works with Scenario2', function () {
      let ret = invokeMethod(
        'encodeBinary',
        chr(231) + chr(101) + chr(11) + chr(97) + chr(205) + chr(2) + chr(231) + chr(101) + chr(11) + chr(97) + chr(205) + chr(2),
        'B',
        false
      );

      strictEqual(ret[0], 924);
      strictEqual(ret[1], 387);
      strictEqual(ret[2], 700);
      strictEqual(ret[3], 208);
      strictEqual(ret[4], 213);
      strictEqual(ret[5], 302);
      strictEqual(ret[6], 387);
      strictEqual(ret[7], 700);
      strictEqual(ret[8], 208);
      strictEqual(ret[9], 213);
      strictEqual(ret[10], 302);
    });

    it('works with Scenario3', function () {
      let ret = invokeMethod('encodeBinary', chr(231), 'T', false);

      strictEqual(ret[0], 913);
      strictEqual(ret[1], 231);
    });

    it('works with Scenario4', function () {
      let ret = invokeMethod('encodeBinary', chr(231) + chr(245), 'T', false);

      strictEqual(ret[0], 901);
      strictEqual(ret[1], 231);
      strictEqual(ret[2], 245);
    });

    it('works with Scenario5', function () {
      let ret = invokeMethod('encodeBinary', chr(231) + chr(101) + chr(11) + chr(97) + chr(205) + chr(2) + chr(250), 'B', false);

      strictEqual(ret[0], 901);
      strictEqual(ret[1], 387);
      strictEqual(ret[2], 700);
      strictEqual(ret[3], 208);
      strictEqual(ret[4], 213);
      strictEqual(ret[5], 302);
      strictEqual(ret[6], 250);
    });
  });

  describe('#EncodeTextAndBinary', function () {
    it('works with Scenario1', function () {
      let text = 'ABCDEFéGHIJKLMNO';
      let seq = invokeMethod('getSequence', text) as Seq[];
      let ret = instance.createBinaryStream(text, seq);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 63);
      strictEqual(ret[3], 125);
      strictEqual(ret[4], 913);
      strictEqual(ret[5], 233);
      strictEqual(ret[6], 187);
    });

    it('works with Scenario2', function () {
      let text = 'ABCDEFéghijklmno';
      let seq = invokeMethod('getSequence', text) as Seq[];
      let ret = instance.createBinaryStream(text, seq);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 1);
      strictEqual(ret[2], 63);
      strictEqual(ret[3], 125);
      strictEqual(ret[4], 913);
      strictEqual(ret[5], 233);
      strictEqual(ret[6], 816);
    });

    it('works with Scenario3', function () {
      let text = 'abcdeféghijklmno';
      let seq = invokeMethod('getSequence', text) as Seq[];
      let ret = instance.createBinaryStream(text, seq);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 810);
      strictEqual(ret[2], 32);
      strictEqual(ret[3], 94);
      strictEqual(ret[4], 179);
      strictEqual(ret[5], 913);
      strictEqual(ret[6], 233);
      strictEqual(ret[7], 187);
    });

    it('works with Scenario4', function () {
      let text = '?????éABCDEF';
      let seq = invokeMethod('getSequence', text) as Seq[];
      let ret = instance.createBinaryStream(text, seq);

      strictEqual(ret[0], 900);
      strictEqual(ret[1], 865);
      strictEqual(ret[2], 775);
      strictEqual(ret[3], 775);
      strictEqual(ret[4], 779);
      strictEqual(ret[5], 913);
      strictEqual(ret[6], 233);
      strictEqual(ret[7], 1);
      strictEqual(ret[8], 63);
    });
  });

  describe('#GetColumn', function () {
    it('returns correct value', function () {
      instance.setRatio(0.5);
      let ret = invokeMethod('getColumnInternal', 100, 177);

      strictEqual(ret, 8);
    });
  });

  describe('#Overflow', function () {
    it('returns correct value 1', function () {
      instance.setColumn(1);

      try {
        instance.parse(
          'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST'
        );
      } catch (e) {
        strictEqual(e.message, 'There is no valid symbol that can fit your data.');
        return;
      }

      fail('Error');
    });

    it('returns correct value 2', function () {
      invokeMethod('setScaleY', 1);

      try {
        instance.parse(
          'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST'
        );
      } catch (e) {
        fail('Error');
        return;
      }

      ok(true);
    });

    it('returns correct value 3', function () {
      invokeMethod('setScaleY', 1);

      try {
        instance.parse('TEST');
      } catch (e) {
        fail('Error');
        return;
      }

      ok(true);
    });
  });

  describe('#GetPad', function () {
    it('returns correct value', function () {
      let ret = invokeMethod('getPad', 246, 32, 12);

      strictEqual(ret, 9);
    });
  });
});
