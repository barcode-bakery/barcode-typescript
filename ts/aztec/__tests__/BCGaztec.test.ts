'use strict';

import { beforeEach, describe, it } from '@jest/globals';
import { strictEqual, deepStrictEqual, throws } from 'assert';
import { BCGaztec } from '../src/BCGaztec';
import { BCGArgumentException } from '@barcode-bakery/barcode-common';

let code = 'QRCode';

describe(code, function () {
  let instance: BCGaztec;

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
    instance = new BCGaztec();
  });

  it('TestClient1', function () {
    let inputs: string[] = [];
    inputs.push('1111^1');
    inputs.push('!!!!!!é!'); // TODO This should output a P/S not a P/L

    let outputs: string[] = [];
    outputs.push('4....5.4.');
    outputs.push('3......5.3.');

    let binaries: string[] = [];

    binaries.push('11110' + '0011' + '0011' + '0011' + '0011' + '1110' + '11111' + '00001' + '01011110' + '11110' + '0011');
    binaries.push(
      '11101' +
        '11110' +
        '00110' +
        '00110' +
        '00110' +
        '00110' +
        '00110' +
        '00110' +
        '11111' +
        '11111' +
        '00001' +
        '11101001' +
        '11101' +
        '11110' +
        '00110'
    );

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('getSequence', input) as { value: string };
      strictEqual(outputs[test - 1], output.value, 'Test #' + test);

      let binary = invokeMethod('createBinaryStream', input, output.value) as string[];
      strictEqual(binary.join(''), binaries[test - 1]);

      test++;
    }
  });

  it('TestGroupBit_Group4_NoAvoid', function () {
    let inputs: string[] = [];
    inputs.push('00001001');
    inputs.push('00000000');
    inputs.push('11111111');
    inputs.push('01010101');
    inputs.push('10101010');
    inputs.push('100010001');
    inputs.push('1000100010');
    inputs.push('10001000100');

    let outputs: string[][] = [];
    outputs.push(['0000', '1001']);
    outputs.push(['0000', '0000']);
    outputs.push(['1111', '1111']);
    outputs.push(['0101', '0101']);
    outputs.push(['1010', '1010']);
    outputs.push(['1000', '1000', '1111']);
    outputs.push(['1000', '1000', '1011']);
    outputs.push(['1000', '1000', '1001']);

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('groupBit', input, 4, false) as string[];
      deepStrictEqual(output, outputs[test - 1], 'Test #' + test);
      test++;
    }
  });

  it('TestGroupBit_Group6_Avoid', function () {
    let inputs: string[] = [];
    inputs.push('101010101010');
    inputs.push('111100000011');
    inputs.push('111110000001');
    inputs.push('111111000000');
    inputs.push('111111000001');
    inputs.push('1010101010101');
    inputs.push('10101010101010');
    inputs.push('101010101010101');
    inputs.push('1010101010101010');
    inputs.push('10101010101010101');
    inputs.push('10101010101011');

    let outputs: string[][] = [];
    outputs.push(['101010', '101010']);
    outputs.push(['111100', '000011']);
    outputs.push(['111110', '000001', '011111']);
    outputs.push(['111110', '100000', '011111']);
    outputs.push(['111110', '100000', '111110']);
    outputs.push(['101010', '101010', '111110']);
    outputs.push(['101010', '101010', '101111']);
    outputs.push(['101010', '101010', '101111']);
    outputs.push(['101010', '101010', '101011']);
    outputs.push(['101010', '101010', '101011']);
    outputs.push(['101010', '101010', '111110']);

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('groupBit', input, 6, true) as string[];
      deepStrictEqual(output, outputs[test - 1], 'Test #' + test);
      test++;
    }
  });

  it('TestGetSequence', function () {
    let inputs: string[] = [];
    inputs.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ '); // U
    inputs.push('abcdefghijklmnopqrstuvwxyz '); // L
    inputs.push(
      String.fromCharCode(1) +
        String.fromCharCode(2) +
        String.fromCharCode(3) +
        String.fromCharCode(4) +
        String.fromCharCode(5) +
        String.fromCharCode(6) +
        String.fromCharCode(7) +
        String.fromCharCode(8) +
        String.fromCharCode(9) +
        String.fromCharCode(10) +
        String.fromCharCode(11) +
        String.fromCharCode(12) +
        String.fromCharCode(13) +
        String.fromCharCode(27) +
        String.fromCharCode(28) +
        String.fromCharCode(29) +
        String.fromCharCode(30) +
        String.fromCharCode(31) +
        String.fromCharCode(64) +
        String.fromCharCode(92) +
        String.fromCharCode(94) +
        String.fromCharCode(95) +
        String.fromCharCode(96) +
        String.fromCharCode(124) +
        String.fromCharCode(126) +
        String.fromCharCode(127) +
        ' '
    ); // M
    inputs.push('0123456789,. '); // D
    inputs.push(
      String.fromCharCode(13) + '!"#$%&\'()*+,-./:;<=>?[]{}' + String.fromCharCode(13) + String.fromCharCode(10) + '. ' + ', ' + ': '
    ); // P
    inputs.push('ABCDEFGHIJKLMnopqrstuvwxyz'); // L/L
    inputs.push('ABCDEFGHIJKLM@\\^_`|~'); // M/L
    inputs.push('ABCDEFGHIJKLM0123456789'); // D/L
    inputs.push('ABCDEFGHIJKLM!NOPQRSTUVWXYZ'); // P/S
    inputs.push('ABC. A'); // P/S special
    inputs.push('ABC' + String.fromCharCode(13) + String.fromCharCode(10) + 'A'); // P/S special
    inputs.push('ABC+,-./:;'); // P/L

    inputs.push('abcDefg'); // U/S
    inputs.push('abc@^_'); // M/L
    inputs.push('abc012'); // D/L
    inputs.push('abc!def'); // P/S
    inputs.push('abc: def'); // P/S special
    inputs.push('abc' + String.fromCharCode(13) + String.fromCharCode(10) + 'def'); // P/S special
    inputs.push('abc+,-/:;'); // P/L

    inputs.push('___abc'); // L/L
    inputs.push('___ABC'); // U/L
    inputs.push('___:;<'); // P/L
    inputs.push('___!___'); // P/S
    inputs.push('___, ___'); // P/S special

    inputs.push('+,-/ABC'); // U/L
    inputs.push('+,-/abc'); // L/L
    inputs.push('+,-ABC'); // P/S
    inputs.push('+,-/___'); // M/L
    inputs.push('+,-/012'); // D/L

    let outputs: string[] = [];
    outputs.push('...........................');
    outputs.push('1...........................');
    outputs.push('2...........................');
    outputs.push('4.............');
    outputs.push('3..........................SSSS');
    outputs.push('.............1.............');
    outputs.push('.............2.......');
    outputs.push('.............4..........');
    outputs.push('.............D..............');
    outputs.push('...DS.');
    outputs.push('...DS.');
    outputs.push('...3.......');

    outputs.push('1...A....');
    outputs.push('1...2...');
    outputs.push('1...4...');
    outputs.push('1...D....');
    outputs.push('1...DS...');
    outputs.push('1...DS...');
    outputs.push('1...3......');

    outputs.push('2...1...');
    outputs.push('2...0...');
    outputs.push('2...3...');
    outputs.push('2...D....');
    outputs.push('2...DS...');

    outputs.push('3....0...');
    outputs.push('3....1...');
    outputs.push('D.D.D....');
    outputs.push('3....2...');
    outputs.push('4D..D.D....');

    let binaries: string[] = [];
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011' +
        '00001'
    );
    binaries.push(
      '11100' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011' +
        '00001'
    );
    binaries.push(
      '11101' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011' +
        '00001'
    );
    binaries.push(
      '11110' + '0010' + '0011' + '0100' + '0101' + '0110' + '0111' + '1000' + '1001' + '1010' + '1011' + '1100' + '1101' + '0001'
    );
    binaries.push(
      '11101' +
        '11110' +
        '00001' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011' +
        '11100' +
        '11101' +
        '11110' +
        '00010' +
        '00011' +
        '00100' +
        '00101'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '11100' +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '11101' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        '11110' +
        '0010' +
        '0011' +
        '0100' +
        '0101' +
        '0110' +
        '0111' +
        '1000' +
        '1001' +
        '1010' +
        '1011'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00111' +
        '01000' +
        '01001' +
        '01010' +
        '01011' +
        '01100' +
        '01101' +
        '01110' +
        ('00000' + '00110') +
        '01111' +
        '10000' +
        '10001' +
        '10010' +
        '10011' +
        '10100' +
        '10101' +
        '10110' +
        '10111' +
        '11000' +
        '11001' +
        '11010' +
        '11011'
    );
    binaries.push('00010' + '00011' + '00100' + ('00000' + '00011') + '00010');
    binaries.push('00010' + '00011' + '00100' + ('00000' + '00010') + '00010');
    binaries.push('00010' + '00011' + '00100' + ('11101' + '11110') + '10000' + '10001' + '10010' + '10011' + '10100' + '10101' + '10110');

    binaries.push('11100' + '00010' + '00011' + '00100' + '11100' + '00101' + '00110' + '00111' + '01000');
    binaries.push('11100' + '00010' + '00011' + '00100' + '11101' + '10100' + '10110' + '10111');
    binaries.push('11100' + '00010' + '00011' + '00100' + '11110' + '0010' + '0011' + '0100');
    binaries.push('11100' + '00010' + '00011' + '00100' + '00000' + '00110' + '00101' + '00110' + '00111');
    binaries.push('11100' + '00010' + '00011' + '00100' + '00000' + '00101' + '00101' + '00110' + '00111');
    binaries.push('11100' + '00010' + '00011' + '00100' + '00000' + '00010' + '00101' + '00110' + '00111');
    binaries.push('11100' + '00010' + '00011' + '00100' + '11101' + '11110' + '10000' + '10001' + '10010' + '10100' + '10101' + '10110');

    binaries.push('11101' + '10111' + '10111' + '10111' + '11100' + '00010' + '00011' + '00100');
    binaries.push('11101' + '10111' + '10111' + '10111' + '11101' + '00010' + '00011' + '00100');
    binaries.push('11101' + '10111' + '10111' + '10111' + '11110' + '10101' + '10110' + '10111');
    binaries.push('11101' + '10111' + '10111' + '10111' + '00000' + '00110' + '10111' + '10111' + '10111');
    binaries.push('11101' + '10111' + '10111' + '10111' + '00000' + '00100' + '10111' + '10111' + '10111');

    binaries.push('11101' + '11110' + '10000' + '10001' + '10010' + '10100' + '11111' + '00010' + '00011' + '00100');
    binaries.push('11101' + '11110' + '10000' + '10001' + '10010' + '10100' + '11111' + '11100' + '00010' + '00011' + '00100');
    binaries.push('00000' + '10000' + '00000' + '10001' + '00000' + '10010' + '00010' + '00011' + '00100');
    binaries.push('11101' + '11110' + '10000' + '10001' + '10010' + '10100' + '11111' + '11101' + '10111' + '10111' + '10111');
    binaries.push('11110' + '0000' + '10000' + '1100' + '0000' + '10010' + '0000' + '10100' + '0010' + '0011' + '0100');

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('getSequence', input) as { value: string };
      strictEqual(output.value, outputs[test - 1], 'Test #' + test);

      let binary = invokeMethod('createBinaryStream', input, output.value) as string[];
      strictEqual(binary.join(''), binaries[test - 1]);

      test++;
    }
  });

  it('TestSequence_SpecialCharacter', function () {
    let inputs: string[] = [];
    inputs.push('ABCDE~FABCDE');
    inputs.push('ABCDE~E000123ABCDE');
    inputs.push('ABCDE~E987654ABCDE');
    inputs.push('ABCDE~~ABCDE');

    let outputs: string[] = [];
    outputs.push('.....DF.....');
    outputs.push('.....DE.....');
    outputs.push('.....DE.....');
    outputs.push('.....2~0.....');

    let binaries: string[] = [];
    binaries.push(
      '00010' + '00011' + '00100' + '00101' + '00110' + '00000' + '00000' + '000' + '00010' + '00011' + '00100' + '00101' + '00110'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00000' +
        '00000' +
        '011' +
        '0011' +
        '0100' +
        '0101' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '00000' +
        '00000' +
        '110' +
        '1011' +
        '1010' +
        '1001' +
        '1000' +
        '0111' +
        '0110' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110'
    );
    binaries.push(
      '00010' + '00011' + '00100' + '00101' + '00110' + '11101' + '11010' + '11101' + '00010' + '00011' + '00100' + '00101' + '00110'
    );

    instance.setTilde(true);

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('getSequence', input) as { value: string };
      strictEqual(output.value, outputs[test - 1], 'Test #' + test);

      let binary = invokeMethod('createBinaryStream', input, output.value) as string[];
      strictEqual(binary.join(''), binaries[test - 1]);

      test++;
    }
  });

  it('TestSequence_WithoutTilde', function () {
    let inputs: string[] = [];
    inputs.push('ABCDE~ABCDE');
    inputs.push('ABCDE~E123456ABCDE');
    inputs.push('ABCDE~E123456A123456');

    let outputs: string[] = [];
    outputs.push('.....2.0.....');
    outputs.push('.....2.0.4......0.....');
    outputs.push('.....2.0.4......A.......');

    let binaries: string[] = [];
    binaries.push(
      '00010' + '00011' + '00100' + '00101' + '00110' + '11101' + '11010' + '11101' + '00010' + '00011' + '00100' + '00101' + '00110'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '11101' +
        '11010' +
        '11101' +
        '00110' +
        '11110' +
        '0011' +
        '0100' +
        '0101' +
        '0110' +
        '0111' +
        '1000' +
        '1110' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '11101' +
        '11010' +
        '11101' +
        '00110' +
        '11110' +
        '0011' +
        '0100' +
        '0101' +
        '0110' +
        '0111' +
        '1000' +
        '1111' +
        '00010' +
        '0011' +
        '0100' +
        '0101' +
        '0110' +
        '0111' +
        '1000'
    );

    instance.setTilde(false);

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('getSequence', input) as { value: string };
      strictEqual(output.value, outputs[test - 1], 'Test #' + test);

      let binary = invokeMethod('createBinaryStream', input, output.value) as string[];
      strictEqual(binary.join(''), binaries[test - 1]);

      test++;
    }
  });

  it('TestSequence_Binary', function () {
    let inputs: string[] = [];
    inputs.push('ABCDEé');
    inputs.push('ABCDEéè');
    inputs.push('ABCDEéèéèéèéèéèéèéèéèéèéèéèéèéèéèéèé');
    inputs.push('ABCDEéèéèéèéèéèéèéèéèéèéèéèéèéèéèéèéè');
    inputs.push('ABCDEéabcde');

    let outputs: string[] = [];
    outputs.push('.....5.');
    outputs.push('.....5..');
    outputs.push('.....5...............................');
    outputs.push('.....5................................');
    outputs.push('.....5.1.....');

    let binaries: string[] = [];
    binaries.push('00010' + '00011' + '00100' + '00101' + '00110' + '11111' + '00001' + '11101001');
    binaries.push('00010' + '00011' + '00100' + '00101' + '00110' + '11111' + '00010' + '11101001' + '11101000');
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '11111' +
        '11111' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '11111' +
        '00000' +
        '00000000001' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000' +
        '11101001' +
        '11101000'
    );
    binaries.push(
      '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110' +
        '11111' +
        '00001' +
        '11101001' +
        '11100' +
        '00010' +
        '00011' +
        '00100' +
        '00101' +
        '00110'
    );

    instance.setTilde(true);

    let test = 1;
    for (let input of inputs) {
      let output = invokeMethod('getSequence', input) as { value: string };
      strictEqual(output.value, outputs[test - 1], 'Test #' + test);

      let binary = invokeMethod('createBinaryStream', input, output.value) as string[];
      strictEqual(binary.join(''), binaries[test - 1]);

      test++;
    }
  });

  it('TestSetRune', function () {
    instance.setRune(0);
    strictEqual(getProtectedField('rune'), 0);

    instance.setRune(255);
    strictEqual(getProtectedField('rune'), 255);

    instance.setRune(-1);
    strictEqual(getProtectedField('rune'), -1);
  });

  it('TestSetRune_Failure1', function () {
    throws(
      () => {
        instance.setRune(-2);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The Rune number has to be between 0 and 255.';
      }
    );
  });

  it('TestSetRune_Failure2', function () {
    throws(
      () => {
        instance.setRune(256);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The Rune number has to be between 0 and 255.';
      }
    );
  });

  it('TestSetTilde', function () {
    instance.setTilde(true);
    strictEqual(instance.getTilde(), true);

    instance.setTilde(false);
    strictEqual(instance.getTilde(), false);
  });

  it('TestSetStructuredAppend_Reset', function () {
    instance.setStructuredAppend(0, 0);
    strictEqual(getProtectedField('symbolNumber'), 0);
    strictEqual(getProtectedField('symbolTotal'), 0);
    strictEqual(getProtectedField('symbolName'), null);
  });

  it('TestSetStructuredAppend_Success', function () {
    instance.setStructuredAppend(4, 5);
    strictEqual(getProtectedField('symbolNumber'), 4);
    strictEqual(getProtectedField('symbolTotal'), 5);
    strictEqual(getProtectedField('symbolName'), null);

    instance.setStructuredAppend(1, 26);
    strictEqual(getProtectedField('symbolNumber'), 1);
    strictEqual(getProtectedField('symbolTotal'), 26);
    strictEqual(getProtectedField('symbolName'), null);

    instance.setStructuredAppend(5, 5, 'something');
    strictEqual(getProtectedField('symbolNumber'), 5);
    strictEqual(getProtectedField('symbolTotal'), 5);
    strictEqual(getProtectedField('symbolName'), 'something');
  });

  it('TestSetStructuredAppend_Failure1', function () {
    throws(
      () => {
        instance.setStructuredAppend(-1, 1);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The symbol number must be equal or bigger than 1 or 0 to reset.';
      }
    );
  });

  it('TestSetStructuredAppend_Failure2', function () {
    throws(
      () => {
        instance.setStructuredAppend(4, 3);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The symbol number must be equal or lower than the symbol total.';
      }
    );
  });

  it('TestSetStructuredAppend_Failure3', function () {
    throws(
      () => {
        instance.setStructuredAppend(4, 27);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The symbol total must be equal or lower than 26.';
      }
    );
  });

  it('TestSetStructuredAppend_Failure4', function () {
    throws(
      () => {
        instance.setStructuredAppend(4, 26, 'hello my friend');
      },
      (err: BCGArgumentException) => {
        return err.message === "The symbol name can't contain a space.";
      }
    );
  });

  it('TestSetSize_Success', function () {
    instance.setSize(BCGaztec.Size.Smallest);
    strictEqual(instance.getSize(), BCGaztec.Size.Smallest);

    instance.setSize(BCGaztec.Size.Compact);
    strictEqual(instance.getSize(), BCGaztec.Size.Compact);

    instance.setSize(BCGaztec.Size.Full);
    strictEqual(instance.getSize(), BCGaztec.Size.Full);
  });

  it('TestSetErrorLevel_Success', function () {
    instance.setErrorLevel(23);
    strictEqual(instance.getErrorLevel(), 23);
  });

  it('TestSetErrorLevel_Failure1', function () {
    throws(
      () => {
        instance.setErrorLevel(4);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The error level percentage must be between 5% and 99%.';
      }
    );
  });

  it('TestSetErrorLevel_Failure2', function () {
    throws(
      () => {
        instance.setErrorLevel(100);
      },
      (err: BCGArgumentException) => {
        return err.message === 'The error level percentage must be between 5% and 99%.';
      }
    );
  });
});
