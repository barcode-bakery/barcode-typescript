'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
import { BCGBarcode1D, BCGParseException, Utility, draw, BCGArgumentException, BCGDataInput } from '@barcode-bakery/barcode-common';

/**
 * Code 128.
 * If you display the checksum on the label, you may obtain incorrect characters, since some characters are not displayable.
 */
class BCGcode128 extends BCGBarcode1D {
  private static readonly KEYA_FNC3 = 96;
  private static readonly KEYA_FNC2 = 97;
  private static readonly KEYA_SHIFT = 98;
  private static readonly KEYA_CODEC = 99;
  private static readonly KEYA_CODEB = 100;
  private static readonly KEYA_FNC4 = 101;
  private static readonly KEYA_FNC1 = 102;

  private static readonly KEYB_FNC3 = 96;
  private static readonly KEYB_FNC2 = 97;
  private static readonly KEYB_SHIFT = 98;
  private static readonly KEYB_CODEC = 99;
  private static readonly KEYB_FNC4 = 100;
  private static readonly KEYB_CODEA = 101;
  private static readonly KEYB_FNC1 = 102;

  private static readonly KEYC_CODEB = 100;
  private static readonly KEYC_CODEA = 101;
  private static readonly KEYC_FNC1 = 102;

  private static readonly KEY_STARTA = 103;
  private static readonly KEY_STARTB = 104;
  private static readonly KEY_STARTC = 105;

  private static readonly KEY_STOP = 106;

  /**
   * The keys for the table A.
   */
  protected keysA: string;

  /**
   * The keys for the table B.
   */
  protected keysB: string;

  /**
   * The keys for the table C.
   */
  protected keysC: string;

  private startingText: string | null = null;

  /**
   * The encoded data.
   */
  protected data: string[] | null = null;

  /**
   * Data for handling the checksum.
   */
  protected indcheck: number[] | null = null;

  /**
   * The last table used.
   */
  protected lastTable: string | null = null;

  /**
   * Indicates if we are in tilde mode.
   */
  protected tilde: boolean = false;

  private readonly shift: number[][];
  private readonly latch: number[][];
  private readonly fnc: number[][];

  private METHOD: { [code: number]: string };

  /**
   * Creates a Code 128 barcode.
   *
   * @param start The start table.
   */
  constructor(start?: string | null) {
    super();

    /* CODE 128 A */
    this.keysA = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_';
    for (let i = 0; i < 32; i++) {
      this.keysA += String.fromCharCode(i);
    }

    /* CODE 128 B */
    this.keysB =
      ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' + String.fromCharCode(127);

    /* CODE 128 C */
    this.keysC = '0123456789';

    this.code = [
      '101111' /* 00 */,
      '111011' /* 01 */,
      '111110' /* 02 */,
      '010112' /* 03 */,
      '010211' /* 04 */,
      '020111' /* 05 */,
      '011102' /* 06 */,
      '011201' /* 07 */,
      '021101' /* 08 */,
      '110102' /* 09 */,
      '110201' /* 10 */,
      '120101' /* 11 */,
      '001121' /* 12 */,
      '011021' /* 13 */,
      '011120' /* 14 */,
      '002111' /* 15 */,
      '012011' /* 16 */,
      '012110' /* 17 */,
      '112100' /* 18 */,
      '110021' /* 19 */,
      '110120' /* 20 */,
      '102101' /* 21 */,
      '112001' /* 22 */,
      '201020' /* 23 */,
      '200111' /* 24 */,
      '210011' /* 25 */,
      '210110' /* 26 */,
      '201101' /* 27 */,
      '211001' /* 28 */,
      '211100' /* 29 */,
      '101012' /* 30 */,
      '101210' /* 31 */,
      '121010' /* 32 */,
      '000212' /* 33 */,
      '020012' /* 34 */,
      '020210' /* 35 */,
      '001202' /* 36 */,
      '021002' /* 37 */,
      '021200' /* 38 */,
      '100202' /* 39 */,
      '120002' /* 40 */,
      '120200' /* 41 */,
      '001022' /* 42 */,
      '001220' /* 43 */,
      '021020' /* 44 */,
      '002012' /* 45 */,
      '002210' /* 46 */,
      '022010' /* 47 */,
      '202010' /* 48 */,
      '100220' /* 49 */,
      '120020' /* 50 */,
      '102002' /* 51 */,
      '102200' /* 52 */,
      '102020' /* 53 */,
      '200012' /* 54 */,
      '200210' /* 55 */,
      '220010' /* 56 */,
      '201002' /* 57 */,
      '201200' /* 58 */,
      '221000' /* 59 */,
      '203000' /* 60 */,
      '110300' /* 61 */,
      '320000' /* 62 */,
      '000113' /* 63 */,
      '000311' /* 64 */,
      '010013' /* 65 */,
      '010310' /* 66 */,
      '030011' /* 67 */,
      '030110' /* 68 */,
      '001103' /* 69 */,
      '001301' /* 70 */,
      '011003' /* 71 */,
      '011300' /* 72 */,
      '031001' /* 73 */,
      '031100' /* 74 */,
      '130100' /* 75 */,
      '110003' /* 76 */,
      '302000' /* 77 */,
      '130001' /* 78 */,
      '023000' /* 79 */,
      '000131' /* 80 */,
      '010031' /* 81 */,
      '010130' /* 82 */,
      '003101' /* 83 */,
      '013001' /* 84 */,
      '013100' /* 85 */,
      '300101' /* 86 */,
      '310001' /* 87 */,
      '310100' /* 88 */,
      '101030' /* 89 */,
      '103010' /* 90 */,
      '301010' /* 91 */,
      '000032' /* 92 */,
      '000230' /* 93 */,
      '020030' /* 94 */,
      '003002' /* 95 */,
      '003200' /* 96 */,
      '300002' /* 97 */,
      '300200' /* 98 */,
      '002030' /* 99 */,
      '003020' /* 100*/,
      '200030' /* 101*/,
      '300020' /* 102*/,
      '100301' /* 103*/,
      '100103' /* 104*/,
      '100121' /* 105*/,
      '122000' /*STOP*/
    ];
    this.setStart(start || null);
    this.setTilde(true);

    // Latches and Shifts
    this.latch = [
      [-1, BCGcode128.KEYA_CODEB, BCGcode128.KEYA_CODEC],
      [BCGcode128.KEYB_CODEA, -1, BCGcode128.KEYB_CODEC],
      [BCGcode128.KEYC_CODEA, BCGcode128.KEYC_CODEB, -1]
    ];
    this.shift = [
      [-1, BCGcode128.KEYA_SHIFT],
      [BCGcode128.KEYB_SHIFT, -1]
    ];
    this.fnc = [
      [BCGcode128.KEYA_FNC1, BCGcode128.KEYA_FNC2, BCGcode128.KEYA_FNC3, BCGcode128.KEYA_FNC4],
      [BCGcode128.KEYB_FNC1, BCGcode128.KEYB_FNC2, BCGcode128.KEYB_FNC3, BCGcode128.KEYB_FNC4],
      [BCGcode128.KEYC_FNC1, -1, -1, -1]
    ];

    // Method available
    this.METHOD = {
      [BCGcode128.Code.Auto]: '#',
      [BCGcode128.Code.A]: 'A',
      [BCGcode128.Code.B]: 'B',
      [BCGcode128.Code.C]: 'C'
    };
  }

  /**
   * Specifies the start code. Can be 'A', 'B', 'C', or NULL
   *  - Table A: Capitals + ASCII 0-31 + punct
   *  - Table B: Capitals + LowerCase + punct
   *  - Table C: Numbers
   *
   * If NULL is specified, the table selection is automatically made.
   * The default is NULL.
   *
   * @param table The table.
   */
  setStart(table: string | null): void {
    if (table !== 'A' && table !== 'B' && table !== 'C' && table !== null) {
      throw new BCGArgumentException('The starting table must be A, B, C or null.', 'table');
    }

    this.startingText = table;
  }

  /**
   * Gets the tilde.
   *
   * @return True if enabled.
   */
  getTilde(): boolean {
    return this.tilde;
  }

  /**
   * Accepts tilde to be process as a special character.
   * If true, you can do this:
   *  - ~~     : to make ONE tilde
   *  - ~Fx    : to insert FCNx. x is equal from 1 to 4.
   *
   * @param accept Accept the tilde as special character.
   */
  setTilde(accept: boolean): void {
    this.tilde = !!accept;
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The input.
   */
  parse(text: BCGDataInput<BCGcode128.Code> | BCGDataInput<BCGcode128.Code>[] | string): void {
    let input: BCGDataInput<BCGcode128.Code>[];
    if (typeof text === 'string') {
      input = [new BCGDataInput(BCGcode128.Code.Auto, text)];
    } else if (Array.isArray(text)) {
      input = text;
    } else {
      input = [text];
    }

    this.setStartFromText(input[0].mode, input[0].data);

    this.text = '';
    let seq = '';

    let currentMode = this.startingText;
    for (const inp of input) {
      if (inp.mode === BCGcode128.Code.Auto) {
        seq += this.getSequence(inp.data, currentMode);
        this.text += inp.data;
      } else {
        const ret = this.invokeSetParse(inp.mode, inp.data, currentMode);
        seq += ret.value;
        currentMode = ret.currentMode;
        this.text += inp.data;
      }
    }

    if (seq !== '') {
      const bitstream = this.createBinaryStream(this.text, seq);
      this.setData(bitstream);
    }

    this.addDefaultLabel();
  }

  private invokeSetParse(mode: BCGcode128.Code, arg1: string, arg2: string | null): { value: string; currentMode: string } {
    switch (mode) {
      case BCGcode128.Code.A:
        return this.setParseA(arg1, arg2);
      case BCGcode128.Code.B:
        return this.setParseB(arg1, arg2);
      case BCGcode128.Code.C:
        return this.setParseC(arg1, arg2);
      default:
        throw new Error();
    }
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    if (this.data === null) {
      throw new Error();
    }

    const c = this.data.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.data[i], true);
    }

    this.drawChar(image, '1', true);
    this.drawText(image, 0, 0, this.positionX, this.thickness);
  }

  /**
   * Returns the maximal size of a barcode.
   * [0]->width
   * [1]->height
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createDrawableSurface?: draw.CreateSurface): [number, number] {
    if (this.data === null) {
      throw new Error();
    }

    // Contains start + text + checksum + stop
    const textlength = this.data.length * 11;
    const endlength = 2; // + final bar

    width += textlength + endlength;
    height += this.thickness;
    return super.getDimension(width, height, createDrawableSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    if (this.data === null) {
      throw new Error();
    }

    const c = this.data.length;
    if (c === 0) {
      throw new BCGParseException('Code128', 'No data has been entered.');
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    if (this.indcheck === null) {
      throw new Error();
    }

    // Checksum
    // First Char (START)
    // + Starting with the first data character following the start character,
    // take the value of the character (between 0 and 102, inclusive) multiply
    // it by its character position (1) and add that to the running checksum.
    // Modulated 103
    this.checksumValue = [this.indcheck[0]];
    const c = this.indcheck.length;
    for (let i = 1; i < c; i++) {
      this.checksumValue[0] += this.indcheck[i] * i;
    }

    this.checksumValue[0] = this.checksumValue[0] % 103;
  }

  /**
   * Overloaded method to display the checksum.
   *
   * @return The checksum value.
   */
  protected processChecksum(): string | null {
    // Calculate the checksum only once
    if (this.checksumValue === null) {
      this.calculateChecksum();
    }

    if (this.checksumValue !== null) {
      if (this.lastTable === 'C') {
        return this.checksumValue.toString();
      }

      const keys = this.lastTable === 'A' ? this.keysA : this.keysB;
      return keys[this.checksumValue[0]];
    }

    return null;
  }

  /**
   * Specifies the startingText table if none has been specified earlier.
   *
   * @param mode The mode.
   * @param text The input.
   */
  private setStartFromText(mode: BCGcode128.Code, text: string): void {
    if (this.startingText === null) {
      // If we have a forced table at the start, we get that one...
      if (mode !== BCGcode128.Code.Auto) {
        this.startingText = this.METHOD[mode];
        return;
      }

      // At this point, we had an "automatic" table selection...
      // If we can get at least 4 numbers, go in C; otherwise go in B.
      const tmp = Utility.regexpQuote(this.keysC);
      const length = text.length;
      const regexp = new RegExp('[ ' + tmp + ']');
      if (length >= 4 && text.substring(0, 4).match(regexp) !== null) {
        this.startingText = 'C';
      } else {
        if (length > 0 && this.keysB.indexOf(text[0]) >= 0) {
          this.startingText = 'B';
        } else {
          this.startingText = 'A';
        }
      }
    }
  }

  /**
   * Extracts the ~ value from the text at the pos.
   * If the tilde is not ~~, ~F1, ~F2, ~F3, ~F4; an error is raised.
   *
   * @param text The text.
   * @param pos The position.
   * @return Extracted tilde value.
   */
  private extractTilde(text: string, pos: number): string {
    if (text[pos] === '~') {
      if (text[pos + 1] !== undefined) {
        // Do we have a tilde?
        if (text[pos + 1] === '~') {
          return '~~';
        } else if (text[pos + 1] === 'F') {
          // Do we have a number after?
          if (text[pos + 2] !== undefined) {
            const v = parseInt(text[pos + 2], 10);
            if (v >= 1 && v <= 4) {
              return '~F' + v;
            } else {
              throw new BCGParseException('Code128', 'Bad ~F. You must provide a number from 1 to 4.');
            }
          } else {
            throw new BCGParseException('Code128', 'Bad ~F. You must provide a number from 1 to 4.');
          }
        } else {
          throw new BCGParseException('Code128', 'Wrong code after the ~.');
        }
      } else {
        throw new BCGParseException('Code128', 'Wrong code after the ~.');
      }
    } else {
      throw new BCGParseException('Code128', 'There is no ~ at this location.');
    }
  }

  /**
   * Gets the "dotted" sequence for the text based on the currentMode.
   * There is also a check if we use the special tilde ~
   *
   * @param text The text.
   * @param currentMode The current mode.
   * @return The sequence.
   */
  private getSequenceParsed(text: string, currentMode: string): string {
    let length;
    if (this.tilde) {
      let sequence = '';
      let previousPos = 0;
      let pos = 0;
      while ((pos = text.indexOf('~', previousPos)) !== -1) {
        const tildeData = this.extractTilde(text, pos);

        const simpleTilde = tildeData === '~~';
        if (simpleTilde && currentMode !== 'B') {
          throw new BCGParseException('Code128', 'The Table ' + currentMode + " doesn't contain the character ~.");
        }

        // At this point, we know we have ~Fx
        if (tildeData !== '~F1' && currentMode === 'C') {
          // The mode C doesn't support ~F2, ~F3, ~F4
          throw new BCGParseException('Code128', "The Table C doesn't contain the function " + tildeData + '.');
        }

        length = pos - previousPos;
        if (currentMode === 'C') {
          if (length % 2 === 1) {
            throw new BCGParseException(
              'Code128',
              'The text "' + text + '" must have an even number of character to be encoded in Table C.'
            );
          }
        }

        sequence += Utility.strRepeat('.', length);
        sequence += '.';
        sequence += !simpleTilde ? 'F' : '';
        previousPos = pos + tildeData.length;
      }

      // Flushing
      length = text.length - previousPos;
      if (currentMode === 'C') {
        if (length % 2 === 1) {
          throw new BCGParseException('Code128', 'The text "' + text + '" must have an even number of character to be encoded in Table C.');
        }
      }

      sequence += Utility.strRepeat('.', length);

      return sequence;
    } else {
      return Utility.strRepeat('.', text.length);
    }
  }

  /**
   * Parses the text and returns the appropriate sequence for the Table A.
   *
   * @param text The text.
   * @param currentMode The current mode.
   * @return The sequence.
   */
  private setParseA(text: string, currentMode: string | null): { value: string; currentMode: string } {
    let tmp = Utility.regexpQuote(this.keysA);

    // If we accept the ~ for special character, we must allow it.
    if (this.tilde) {
      tmp += '~';
    }

    let match;
    const regexp = new RegExp('[^' + tmp + ']');
    if ((match = text.match(regexp)) !== null) {
      // We found something not allowed
      throw new BCGParseException(
        'Code128',
        'The text "' + text + '" can\'t be parsed with the Table A. The character "' + match[0] + '" is not allowed.'
      );
    } else {
      const latch = currentMode === 'A' ? '' : '0';
      currentMode = 'A';

      return {
        value: latch + this.getSequenceParsed(text, currentMode),
        currentMode: currentMode
      };
    }
  }

  /**
   * Parses the text and returns the appropriate sequence for the Table B.
   *
   * @param text The text.
   * @param currentMode The current mode.
   * @return The sequence.
   */
  setParseB(text: string, currentMode: string | null): { value: string; currentMode: string } {
    const tmp = Utility.regexpQuote(this.keysB);

    let match;
    const regexp = new RegExp('[^' + tmp + ']');
    if ((match = text.match(regexp)) !== null) {
      // We found something not allowed
      throw new BCGParseException(
        'Code128',
        'The text "' + text + '" can\'t be parsed with the Table B. The character "' + match[0] + '" is not allowed.'
      );
    } else {
      const latch = currentMode === 'B' ? '' : '1';
      currentMode = 'B';

      return {
        value: latch + this.getSequenceParsed(text, currentMode),
        currentMode: currentMode
      };
    }
  }

  /**
   * Parses the text and returns the appropriate sequence for the Table C.
   *
   * @param text The text.
   * @param currentMode The current mode.
   * @return The sequence.
   */
  setParseC(text: string, currentMode: string | null): { value: string; currentMode: string } {
    let tmp = Utility.regexpQuote(this.keysC);

    // If we accept the ~ for special character, we must allow it.
    if (this.tilde) {
      tmp += '~F';
    }

    let match;
    const regexp = new RegExp('[^' + tmp + ']');
    if ((match = text.match(regexp)) !== null) {
      // We found something not allowed
      throw new BCGParseException(
        'Code128',
        'The text "' + text + '" can\'t be parsed with the Table C. The character "' + match[0] + '" is not allowed.'
      );
    } else {
      const latch = currentMode === 'C' ? '' : '2';
      currentMode = 'C';

      return {
        value: latch + this.getSequenceParsed(text, currentMode),
        currentMode: currentMode
      };
    }
  }

  /**
   * Depending on the text, it will return the correct
   * sequence to encode the text.
   *
   * @param text The text.
   * @param startingText The starting text.
   * @return The sequence.
   */
  private getSequence(text: string, startingText: string | null): string {
    const e = 10000;
    const latLen = [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0]
    ];
    const shftLen = [
      [e, 1, e],
      [1, e, e],
      [e, e, e]
    ];
    const charSiz = [2, 2, 1];

    let startA = e;
    let startB = e;
    let startC = e;
    if (startingText === 'A') {
      startA = 0;
    }
    if (startingText === 'B') {
      startB = 0;
    }
    if (startingText === 'C') {
      startC = 0;
    }

    const curLen = [startA, startB, startC];
    const curSeq = ['', '', ''];

    let nextNumber = false;

    let x = 0;
    const xLen = text.length;
    for (x = 0; x < xLen; x++) {
      const input = text[x];

      // 1.
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (curLen[i] + latLen[i][j] < curLen[j]) {
            curLen[j] = curLen[i] + latLen[i][j];
            curSeq[j] = curSeq[i] + j;
          }
        }
      }

      // 2.
      const nxtLen = [e, e, e];
      const nxtSeq: { [key: number]: string } = [];

      // 3.
      let flag = false;
      const posArray: number[] = [];

      // Special case, we do have a tilde and we process them
      if (this.tilde && input === '~') {
        const tildeData = this.extractTilde(text, x);

        if (tildeData === '~~') {
          // We simply skip a tilde
          posArray.push(1);
          x++;
        } else if (tildeData.substring(0, 2) === '~F') {
          const v = parseInt(tildeData[2], 10);
          posArray.push(0);
          posArray.push(1);
          if (v === 1) {
            posArray.push(2);
          }

          x += 2;
          flag = true;
        }
      } else {
        let pos = this.keysA.indexOf(input);
        if (pos !== -1) {
          posArray.push(0);
        }

        pos = this.keysB.indexOf(input);
        if (pos !== -1) {
          posArray.push(1);
        }

        // Do we have the next char a number?? OR a ~F1
        pos = this.keysC.indexOf(input);
        if (nextNumber || (pos !== -1 && text[x + 1] !== undefined && this.keysC.indexOf(text[x + 1]) !== -1)) {
          nextNumber = !nextNumber;
          posArray.push(2);
        }
      }

      const c = posArray.length;
      for (let i = 0; i < c; i++) {
        if (curLen[posArray[i]] + charSiz[posArray[i]] < nxtLen[posArray[i]]) {
          nxtLen[posArray[i]] = curLen[posArray[i]] + charSiz[posArray[i]];
          nxtSeq[posArray[i]] = curSeq[posArray[i]] + '.';
        }

        for (let j = 0; j < 2; j++) {
          if (j === posArray[i]) {
            continue;
          }
          if (curLen[j] + shftLen[j][posArray[i]] + charSiz[posArray[i]] < nxtLen[j]) {
            nxtLen[j] = curLen[j] + shftLen[j][posArray[i]] + charSiz[posArray[i]];
            nxtSeq[j] = curSeq[j] + String.fromCharCode(posArray[i] + 65) + '.';
          }
        }
      }

      if (c === 0) {
        // We found an unsuported character
        throw new BCGParseException('Code128', 'Character ' + input + ' not supported.');
      }

      if (flag) {
        for (let i = 0; i < 5; i++) {
          if (nxtSeq[i] !== undefined) {
            nxtSeq[i] += 'F';
          }
        }
      }

      // 4.
      for (let i = 0; i < 3; i++) {
        curLen[i] = nxtLen[i];
        if (nxtSeq[i] !== undefined) {
          curSeq[i] = nxtSeq[i];
        }
      }
    }

    // Every curLen under e is possible but we take the smallest
    let m = e;
    let k = -1;
    for (let i = 0; i < 3; i++) {
      if (curLen[i] < m) {
        k = i;
        m = curLen[i];
      }
    }

    if (k === -1) {
      return '';
    }

    return curSeq[k];
  }

  /**
   * Depending on the sequence seq given (returned from getSequence()),
   * this method will return the code stream in an array. Each char will be a
   * string of bit based on the Code 128.
   *
   * Each letter from the sequence represents bits.
   *
   * 0 to 2 are latches
   * A to B are Shift + Letter
   * . is a char in the current encoding
   *
   * @param text The text.
   * @param seq The sequence.
   * @return The stream.
   */
  private createBinaryStream(text: string, seq: string): [number[], string[]] {
    let ret;
    const c = seq.length;

    let data: string[] = []; // code stream
    let indcheck: number[] = []; // index for checksum

    let currentEncoding = 0;
    if (this.startingText === 'A') {
      currentEncoding = 0;
      indcheck.push(BCGcode128.KEY_STARTA);
      this.lastTable = 'A';
    } else if (this.startingText === 'B') {
      currentEncoding = 1;
      indcheck.push(BCGcode128.KEY_STARTB);
      this.lastTable = 'B';
    } else if (this.startingText === 'C') {
      currentEncoding = 2;
      indcheck.push(BCGcode128.KEY_STARTC);
      this.lastTable = 'C';
    }

    data.push(this.code[103 + currentEncoding]);

    let temporaryEncoding = -1;
    for (let i = 0, counter = 0; i < c; i++) {
      const input = seq[i];
      const inputI = parseInt(input, 10);
      if (input === '.') {
        ret = this.encodeChar(data, currentEncoding, seq, text, i, counter, indcheck);
        data = ret.data;
        i = ret.i;
        counter = ret.counter;
        indcheck = ret.indcheck;
        if (temporaryEncoding !== -1) {
          currentEncoding = temporaryEncoding;
          temporaryEncoding = -1;
        }
      } else if (input >= 'A' && input <= 'B') {
        // We shift
        const encoding = input.charCodeAt(0) - 65;
        const shift = this.shift[currentEncoding][encoding];
        indcheck.push(shift);
        data.push(this.code[shift]);
        if (temporaryEncoding === -1) {
          temporaryEncoding = currentEncoding;
        }

        currentEncoding = encoding;
      } else if (inputI >= 0 && inputI < 3) {
        temporaryEncoding = -1;

        // We latch
        const latch = this.latch[currentEncoding][inputI];
        if (latch !== null) {
          indcheck.push(latch);
          this.lastTable = String.fromCharCode(65 + inputI);
          data.push(this.code[latch]);
          currentEncoding = inputI;
        }
      }
    }

    return [indcheck, data];
  }

  /**
   * Encodes characters, base on its encoding and sequence
   *
   * @param data The data.
   * @param encoding The encoding.
   * @param seq The sequence.
   * @param text The text.
   * @param i The position.
   * @param counter The counter.
   * @param indcheck The checksum counter.
   */
  private encodeChar(
    data: string[],
    encoding: number,
    seq: string,
    text: string,
    i: number,
    counter: number,
    indcheck: number[]
  ): { data: string[]; i: number; counter: number; indcheck: number[] } {
    if (seq[i + 1] !== undefined && seq[i + 1] === 'F') {
      // We have a flag !!
      if (text[counter + 1] === 'F') {
        const number = parseInt(text[counter + 2], 10);
        const fnc = this.fnc[encoding][number - 1];
        indcheck.push(fnc);
        data.push(this.code[fnc]);

        // Skip F + number
        counter += 2;
      } else {
        // Not supposed
      }

      i++;
    } else {
      if (encoding === 2) {
        // We take 2 numbers in the same time
        const code = parseInt(text.substring(counter, counter + 2), 10);
        indcheck.push(code);
        data.push(this.code[code]);
        counter++;
        i++;
      } else {
        const keys = encoding === 0 ? this.keysA : this.keysB;
        const pos = keys.indexOf(text[counter]);
        indcheck.push(pos);
        data.push(this.code[pos]);
      }
    }

    counter++;

    return {
      data: data,
      i: i,
      counter: counter,
      indcheck: indcheck
    };
  }

  /**
   * Saves data into the classes.
   *
   * This method will save data, calculate real column number
   * (if -1 was selected), the real error level (if -1 was
   * selected)... It will add Padding to the end and generate
   * the error codes.
   *
   * @param data The data.
   */
  private setData(data: [number[], string[]]): void {
    this.indcheck = data[0];
    this.data = data[1];
    this.calculateChecksum();

    if (this.checksumValue === null) {
      throw new Error();
    }

    this.data.push(this.code[this.checksumValue[0]]);
    this.data.push(this.code[BCGcode128.KEY_STOP]);
  }
}

namespace BCGcode128 {
  export enum Code {
    /**
     * Auto selection.
     */
    Auto = 0,

    /**
     * Table A.
     */
    A,

    /**
     * Table B.
     */
    B,

    /**
     * Table C.
     */
    C
  }
}

export { BCGcode128 };
