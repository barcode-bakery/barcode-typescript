'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import {
  BCGArgumentException,
  BCGBarcode,
  BCGBarcode2D,
  BCGDrawException,
  BCGParseException,
  Utility,
  draw
} from '@barcode-bakery/barcode-common';

/**
 * Aztec.
 */
class BCGaztec extends BCGBarcode2D {
  private static readonly S_LAYER: number = 0;
  private static readonly S_SIZE: number = 1;
  private static readonly S_CWC: number = 2;
  private static readonly S_CWS: number = 3;
  private static readonly S_BITS: number = 4;
  private static readonly S_COMPACT: number = 5;
  private static readonly S_ERRGF: number = 6;
  private static readonly S_ERRPR: number = 7;

  private readonly symbolsize: number[][] = [
    [1, 15, 17, 6, 102, 1, 64, 67],
    [1, 19, 21, 6, 126, 0, 64, 67],
    [2, 19, 40, 6, 240, 1, 64, 67],
    [2, 23, 48, 6, 288, 0, 64, 67],
    [3, 23, 51, 8, 408, 1, 256, 301],
    [3, 27, 60, 8, 480, 0, 256, 301],
    [4, 27, 76, 8, 608, 1, 256, 301],
    [4, 31, 88, 8, 704, 0, 256, 301],
    [5, 37, 120, 8, 960, 0, 256, 301],
    [6, 41, 156, 8, 1248, 0, 256, 301],
    [7, 45, 196, 8, 1568, 0, 256, 301],
    [8, 49, 240, 8, 1920, 0, 256, 301],
    [9, 53, 230, 10, 2300, 0, 1024, 1033],
    [10, 57, 272, 10, 2720, 0, 1024, 1033],
    [11, 61, 316, 10, 3160, 0, 1024, 1033],
    [12, 67, 364, 10, 3640, 0, 1024, 1033],
    [13, 71, 416, 10, 4160, 0, 1024, 1033],
    [14, 75, 470, 10, 4700, 0, 1024, 1033],
    [15, 79, 528, 10, 5280, 0, 1024, 1033],
    [16, 83, 588, 10, 5880, 0, 1024, 1033],
    [17, 87, 652, 10, 6520, 0, 1024, 1033],
    [18, 91, 720, 10, 7200, 0, 1024, 1033],
    [19, 95, 790, 10, 7900, 0, 1024, 1033],
    [20, 101, 894, 10, 8640, 0, 1024, 1033],
    [21, 105, 940, 10, 9400, 0, 1024, 1033],
    [22, 109, 1020, 10, 10200, 0, 1024, 1033],
    [23, 113, 920, 12, 11040, 0, 4096, 4201],
    [24, 117, 992, 12, 11904, 0, 4096, 4201],
    [25, 121, 1066, 12, 12792, 0, 4096, 4201],
    [26, 125, 1144, 12, 13728, 0, 4096, 4201],
    [27, 131, 1224, 12, 14688, 0, 4096, 4201],
    [28, 135, 1306, 12, 15672, 0, 4096, 4201],
    [29, 139, 1392, 12, 16704, 0, 4096, 4201],
    [30, 143, 1480, 12, 17760, 0, 4096, 4201],
    [31, 147, 1570, 12, 18840, 0, 4096, 4201],
    [32, 151, 1664, 12, 19968, 0, 4096, 4201]
  ];

  private data: string[] | null = null;
  private messagemode: string[] | null = null;
  private symbolindex: number = -1;
  private xo: number = 0;

  private latch: (string | null)[][][] = [
    //U / L / M / P / D / B
    [
      [null, null, null],
      ['11100', null, null],
      ['11101', null, null],
      ['11101', '11110', null],
      ['11110', null, null],
      ['11111', null, null]
    ], // U
    [
      ['11101', '11101', null],
      [null, null, null],
      ['11101', null, null],
      ['11101', '11110', null],
      ['11110', null, null],
      ['11111', null, null]
    ], // L
    [
      ['11101', null, null],
      ['11100', null, null],
      [null, null, null],
      ['11110', null, null],
      ['11100', '11110', null],
      ['11111', null, null]
    ], // M
    [
      ['11111', null, null],
      ['11111', '11100', null],
      ['11111', '11101', null],
      [null, null, null],
      ['11111', '11110', null],
      ['11111', '11111', null]
    ], // P
    [
      ['1110', null, null],
      ['1110', '11100', null],
      ['1110', '11101', null],
      ['1110', '11101', '11110'],
      [null, null, null],
      ['1110', '11111', null]
    ] // D
  ];
  private shift: string[][] = [
    ['-1', '-1', '-1', '00000', '-1', '-1'], // U
    ['11100', '-1', '-1', '00000', '-1', '-1'], // L
    ['-1', '-1', '-1', '00000', '-1', '-1'], // M
    ['-1', '-1', '-1', '-1', '-1', '-1'], // P
    ['1111', '-1', '-1', '0000', '-1', '-1'] // D
  ];
  private code: string[] = null!; // !Assigned in the constructor.
  private errorlevel: number = 23;
  private size: BCGaztec.Size = BCGaztec.Size.Smallest;

  private symbolNumber: number = 0;
  private symbolTotal: number = 0;
  private symbolName: string | null = null;

  private tilde: boolean = false;
  private rune: number = -1;

  /**
   * Creates an Aztec barcode.
   */
  constructor() {
    super();

    let codeUpper: string = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codeLower: string = ' abcdefghijklmnopqrstuvwxyz';
    let codeMixed: string = ' ';
    for (let i = 1; i <= 13; i++) {
      codeMixed += String.fromCharCode(i);
    }

    for (let i = 27; i <= 31; i++) {
      codeMixed += String.fromCharCode(i);
    }

    codeMixed += '@\\^_`|~' + String.fromCharCode(127);
    let codePunct: string = String.fromCharCode(13) + /* HERE SOME DOUBLE CHARS */ '!"#$%&\'()*+,-./:;<=>?[]{}'; // TODO Confirm
    let codeDigit: string = ' 0123456789,.';

    this.code = [codeUpper, codeLower, codeMixed, codePunct, codeDigit];

    this.setScale(4);
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    let c = text.length;
    if (c === 0) {
      throw new BCGParseException('aztec', 'Provide data to parse.');
    }

    this.rune = -1; // Reset Rune

    let seq: string;
    ({ value: seq, text } = this.getSequence(text));
    if (seq !== '') {
      let bitstream = this.createBinaryStream(text, seq);
      this.setData(bitstream);
    }
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    if (this.messagemode === null) {
      throw new Error();
    }

    let mmcount = this.messagemode.length;
    let datacount = 0;
    if (this.data !== null) {
      datacount = this.data.length;
    }

    if (this.rune === -1 && (this.symbolindex === -1 || mmcount === 0 || datacount === 0)) {
      throw new BCGDrawException('An unknown error occured during the drawing operation.');
    }

    if (this.rune === -1) {
      this.xo = Math.floor(this.symbolsize[this.symbolindex][BCGaztec.S_SIZE] / 2);
    } else {
      // The symbol is smaller
      this.xo = Math.floor(this.symbolsize[this.symbolindex][BCGaztec.S_SIZE] / 2) - 2;
    }

    this.drawFixed(image);

    this.drawMessageMode(image);
    if (this.rune === -1) {
      this.drawLayer(image);
    }

    this.drawText(image, 0, 0, this.symbolsize[this.symbolindex][BCGaztec.S_SIZE], this.symbolsize[this.symbolindex][BCGaztec.S_SIZE]);
  }

  /**
   * Returns the maximal size of a barcode.
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number): [number, number] {
    if (this.symbolindex === -1) {
      return super.getDimension(width, height);
    }

    if (this.rune === -1) {
      width += this.symbolsize[this.symbolindex][BCGaztec.S_SIZE];
      height += this.symbolsize[this.symbolindex][BCGaztec.S_SIZE];
    } else {
      width += 11;
      height += 11;
    }

    return super.getDimension(width, height);
  }

  /**
   * Gets the error level.
   *
   * @return The error level.
   */
  getErrorLevel(): number {
    return this.errorlevel;
  }

  /**
   * Sets the error in percentage from 5 to 99%.
   * The error percentage could be bigger since we
   * have to fill the pattern with error code.
   *
   * @param level The error level.
   */
  setErrorLevel(level: number): void {
    if (level > 99 || level < 5) {
      throw new BCGArgumentException('The error level percentage must be between 5% and 99%.', 'level');
    }

    this.errorlevel = level;
  }

  /**
   * Gets the size of the barcode.
   *
   * @return The barcode size.
   */
  getSize(): BCGaztec.Size {
    return this.size;
  }

  /**
   * Sets the size of the barcode. Could be different value:
   *  - AZTEC_SIZE_SMALLEST: will try to get the smallest one
   *  - AZTEC_SIZE_COMPACT: will try to get a compact one
   *  - AZTEC_SIZE_FULL: will try to get a full-range one
   *
   * @param size The barcode size.
   */
  setSize(size: BCGaztec.Size): void {
    this.size = size;
  }

  /**
   * Aztec symbol can be appended to another one.
   * The name is optional but it must be the same accross the Aztec group.
   * The symbolTotal must remain the same too.
   * Up to 26 symbols total.
   * The first symbol is 1.
   * If you want to reset and not use this Structure Append, set the symbolNumber to 0.
   *
   * @param symbolNumber The symbol number.
   * @param symbolTotal The amount of symbols.
   * @param symbolName The symbol name.
   * @return True on success, false on failure.
   */
  setStructuredAppend(symbolNumber: number, symbolTotal: number = 0, symbolName: string | null = null): boolean {
    if (symbolTotal === 0) {
      this.symbolNumber = 0;
      this.symbolTotal = 0;
      this.symbolName = null;
      return true;
    } else {
      if (symbolNumber <= 0) {
        throw new BCGArgumentException('The symbol number must be equal or bigger than 1 or 0 to reset.', 'symbolNumber');
      }

      if (symbolNumber > symbolTotal) {
        throw new BCGArgumentException('The symbol number must be equal or lower than the symbol total.', 'symbolNumber');
      }

      if (symbolTotal > 26) {
        throw new BCGArgumentException('The symbol total must be equal or lower than 26.', 'symbolTotal');
      }

      if (symbolName !== null && symbolName.indexOf(' ') !== -1) {
        throw new BCGArgumentException("The symbol name can't contain a space.", 'symbolName');
      }

      this.symbolNumber = symbolNumber;
      this.symbolTotal = symbolTotal;
      this.symbolName = symbolName;
      return true;
    }
  }

  /**
   * Gets if aztec accepts the tilde as a special character.
   *
   * @return True if enabled.
   */
  getTilde(): boolean {
    return this.tilde;
  }

  /**
   * Accepts tilde to be process as a special character.
   * If true, you can do this:
   *  - ~~    : to make ONE tilde
   *  - ~F    : to insert FCN1
   *  - ~Exxxxxx    : with x a number between 0 and 9
   *
   * @param accept Accept the tilde as special character.
   */
  setTilde(accept: boolean): void {
    this.tilde = accept;
  }

  /**
   * Gets the rune number.
   *
   * @return The rune number.
   */
  getRune(): number {
    return this.rune;
  }

  /**
   * Draws the rune number runeNumber 0 to 255.
   *
   * @param runeNumber The rune number.
   */
  setRune(runeNumber: number): void {
    if (runeNumber === -1) {
      this.rune = -1;
      return;
    }

    if (runeNumber < 0 || runeNumber > 255) {
      throw new BCGArgumentException('The Rune number has to be between 0 and 255.', 'runeNumber');
    }

    this.symbolindex = 0;
    let mmbitstream = Utility.decbin(runeNumber, 8);
    this.messagemode = this.groupBit(mmbitstream, 4, false);

    // Error Message Mode
    let nc = 5;
    let gf = 16;
    let pp = 19;
    ({ bitstreamArray: this.messagemode } = this.computeError(this.messagemode, 4, nc, gf, pp));

    // Apply special stuff !
    for (let i = 0; i < 7; i++) {
      this.messagemode[i] = Utility.decbin(Utility.bindec(this.messagemode[i]) ^ 10, 4);
    }

    this.rune = runeNumber;
  }

  /**
   * Depending on the text, it will return the correct
   * sequence to encode the text.
   *
   * @param text The text.
   * @return The sequence.
   */
  private getSequence(text: string): { value: string; text: string } {
    let e = 100000;
    let latLen = [
      [0, 5, 5, 10, 5, 10],
      [10, 0, 5, 10, 5, 10],
      [5, 5, 0, 5, 10, 10],
      [5, 10, 10, 0, 10, 15],
      [4, 9, 9, 14, 0, 14],
      [0, 0, 0, 0, 0, 0]
    ];
    let shftLen = [
      [e, e, e, 5, e],
      [5, e, e, 5, e],
      [e, e, e, 5, e],
      [e, e, e, e, e],
      [4, e, e, 4, e]
    ];
    let charSiz = [5, 5, 5, 5, 4, 8];

    let startingSequence: string | null = '';
    if (this.symbolNumber > 0) {
      // We have a Structured Append
      let code = '' + String.fromCharCode(65 + this.symbolNumber - 1) + String.fromCharCode(65 + this.symbolTotal - 1);
      if (this.symbolName !== null) {
        text = ' ' + this.symbolName + ' ' + code + text;
      } else {
        text = code + text;
      }

      startingSequence = '20';
    }

    let curLen = [0, e, e, e, e, e];
    let curSeq = [startingSequence, startingSequence, startingSequence, startingSequence, startingSequence, startingSequence];

    let bincheckRef = 'B' + Utility.strRepeat('.', 32);
    let xLen = text.length;

    for (let x = 0; x < xLen; x++) {
      let input = text[x];

      // 1. There is a problem here if we have Digit, Going to 3 to do CR.LF. The code won't be
      //    able to do it because it will try to "LATCH" from Digit to 3... which takes 14
      //    this code is really too big to be taken correctly. We changed the number 4 and it's
      //    not as the doc said but it's fully working.
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (curLen[i] + latLen[i][j] < curLen[j]) {
            curLen[j] = curLen[i] + latLen[i][j];
            curSeq[j] = curSeq[i] + j;
          }
        }
      }

      // 2.
      let nxtLen = [e, e, e, e, e, e];
      let nxtSeq = ['', '', '', '', '', ''];

      // 3.
      let character = '.';
      let posArray: number[] = [];

      // Special case, we do have a tilde and we process them
      if (this.tilde && input === '~') {
        // Check next input
        if (text.length > x + 1) {
          // Do we have a tilde?
          if (text[x + 1] === '~') {
            // We simply skip a tilde
            posArray.push(2);
            character = '~';
            x++;
          } else if (text[x + 1] === 'E') {
            // Do we have 6 chars?
            if (text.length > x + 2) {
              let temp = text.substr(x + 2, Math.min(6, text.length - (x + 2)));
              if (temp.length === 6 && Utility.isNumeric(temp)) {
                posArray.push(3);
                character = 'E';

                // We skip the E + the 6 numbers
                x += 7;
              } else {
                throw new BCGParseException('aztec', 'Bad ~E. You must provide 6 following digits.');
              }
            } else {
              throw new BCGParseException('aztec', 'Bad ~E. You must provide 6 following digits.');
            }
          } else if (text[x + 1] === 'F') {
            posArray.push(3);
            character = 'F';

            // We skip the F
            x++;
          } else {
            // Wrong code
            throw new BCGParseException('aztec', 'Wrong code after the ~.');
          }
        } else {
          // Wrong code
          throw new BCGParseException('aztec', 'Wrong code after the ~.');
        }
      } else {
        for (let i = 0; i < 5; i++) {
          let pos = this.code[i].indexOf(input);
          if (pos !== -1) {
            posArray.push(i);
          }
        }

        posArray.push(5);
      }

      let c = posArray.length;
      for (let i = 0; i < c; i++) {
        if (curLen[posArray[i]] + charSiz[posArray[i]] < nxtLen[posArray[i]]) {
          nxtLen[posArray[i]] = curLen[posArray[i]] + charSiz[posArray[i]];
          nxtSeq[posArray[i]] = curSeq[posArray[i]].toString() + character;
        }

        for (let j = 0; j < 5; j++) {
          if (j === posArray[i] || posArray[i] === 5) {
            continue;
          }

          if (curLen[j] + shftLen[j][posArray[i]] + charSiz[posArray[i]] < nxtLen[j]) {
            nxtLen[j] = curLen[j] + shftLen[j][posArray[i]] + charSiz[posArray[i]];
            nxtSeq[j] = curSeq[j] + String.fromCharCode(posArray[i] + 65).toString() + character;
          }
        }
      }

      // 4.
      if (x > 0) {
        let d = text.substr(x - 1, 2);
        if ((d[0] === String.fromCharCode(13) && d[1] === String.fromCharCode(10)) || d === '. ' || d === ', ' || d === ': ') {
          if (curLen[3] < nxtLen[3]) {
            nxtLen[3] = curLen[3];
            nxtSeq[3] = Utility.safeSubstring(curSeq[3], 0, -1) + 'S';
          }

          // not in doc
          for (let i = 0; i < 5; i++) {
            if (i === 3) {
              continue;
            }

            if (Utility.safeSubstring(nxtSeq[i], -3) === 'D..') {
              nxtLen[i] = 5;
              nxtSeq[i] = Utility.safeSubstring(nxtSeq[i], 0, -2) + 'S';
            } else if (Utility.safeSubstring(curSeq[i]!, -2) === 'D.') {
              nxtLen[i] = curLen[i];
              nxtSeq[i] = Utility.safeSubstring(curSeq[i], 0, -1) + 'S';
            }
          }
        }
      }

      // 5.
      let bincheck = Utility.safeSubstring(nxtSeq[5], -33, 33);
      if (bincheck.length === 33 && bincheck === bincheckRef) {
        nxtLen[5] += 11;
      }

      // 6.
      for (let i = 0; i < 6; i++) {
        curLen[i] = nxtLen[i];
        curSeq[i] = nxtSeq[i];
      }
    }

    // Every curLen under $e are possible but we take the smallest !
    let m = e;
    let k = -1;
    for (let i = 0; i < 6; i++) {
      if (curLen[i] < m) {
        k = i;
        m = curLen[i];
      }
    }

    if (k === -1) {
      return {
        value: '',
        text
      };
    }

    return {
      value: curSeq[k],
      text
    };
  }

  private encodeChar(
    data: string[],
    encoding: number,
    seq: string,
    text: string,
    sequenceCounter: number,
    textCounter: number
  ): { data: string[]; sequenceCounter: number; textCounter: number } {
    if (encoding === 5) {
      // B
      data.push(Utility.decbin(text.charCodeAt(textCounter), 8));
    } else {
      if (seq[sequenceCounter] === 'S') {
        let encode = text.substr(textCounter, 2);
        if (encode[0] === String.fromCharCode(13) && encode[1] === String.fromCharCode(10)) {
          data.push(Utility.decbin(2, 5));
        }
        if (encode === '. ') {
          data.push(Utility.decbin(3, 5));
        }
        if (encode === ', ') {
          data.push(Utility.decbin(4, 5));
        }
        if (encode === ': ') {
          data.push(Utility.decbin(5, 5));
        }
        textCounter++;
      } else if (seq[sequenceCounter] === 'F') {
        data.push('00000000');
        textCounter++;
      } else if (seq[sequenceCounter] === 'E') {
        data.push('00000');
        let number = text.substr(textCounter + 2, 6);
        let numberInteger = parseInt(number, 10); // Remove extra 0
        let numberString = numberInteger.toString(); // Transform to string
        let c = numberString.length;
        data.push(Utility.decbin(c, 3)); // FLG(n);

        // Encode numbers
        for (let j = 0; j < c; j++) {
          let pos = this.code[4].indexOf(numberString[j]);
          data.push(Utility.decbin(pos + 1, 4));
        }

        // Skip E + numbers
        textCounter += 7;
      } else if (seq[sequenceCounter] === '~') {
        data.push('11010');
        textCounter++;
      } else {
        let pos = this.code[encoding].indexOf(text[textCounter]);
        if (encoding === 3) {
          // P
          if (pos === 0) {
            data.push(Utility.decbin(1, 5));
          } else {
            data.push(Utility.decbin(pos + 5, 5)); // Offset
          }
        } else if (encoding === 4) {
          // D
          data.push(Utility.decbin(pos + 1, 4));
        } // ULM
        else {
          data.push(Utility.decbin(pos + 1, 5));
        }
      }
    }

    textCounter++;

    return {
      data,
      sequenceCounter,
      textCounter
    };
  }

  /**
   * Depending on the sequence seq given (returned from getSequence()),
   * this method will return the bitstream in an array. Each char will be a
   * string of bit based on the Aztec Code. (e.g. upper T = 10101)
   *
   * Each letter from the sequence represents bits. The value S is special,
   * it rollbacks the previous entered bits (if it was a .) and it replaced by another.
   * If it was a "Shift", it doesn't replace the char but put the correct one.
   *
   * 0 to 5 are latches
   * A to D are Shift + Letter
   * . is a char in the current encoding
   *
   * @param text The text.
   * @param seq The sequence.
   * @return The binary stream for each possible path.
   */
  private createBinaryStream(text: string, seq: string): string[] {
    let c = seq.length;
    let currentEncoding = 0;
    let data: string[] = []; // binary stream
    let fromBinary = -1;
    let temporaryEncoding = -1;
    let i = 0;
    let counter = 0;
    for (; i < c; i++) {
      let input = seq[i];
      let inputI = parseInt(input.toString(), 10);
      if (input === '.' || input === 'S' || input === 'F' || input === 'E' || input === '~') {
        ({ data, sequenceCounter: i, textCounter: counter } = this.encodeChar(data, currentEncoding, seq, text, i, counter));
        if (temporaryEncoding !== -1) {
          currentEncoding = temporaryEncoding;
          temporaryEncoding = -1;
        }
      } else if (input >= 'A' && input <= 'D') {
        // We shift
        let encoding = input.charCodeAt(0) - 65;
        data.push(this.shift[currentEncoding][encoding]);
        if (temporaryEncoding === -1) {
          temporaryEncoding = currentEncoding;
        }

        currentEncoding = encoding;
      } else if (inputI >= 0 && inputI <= 5) {
        temporaryEncoding = -1;

        // We latch
        if (inputI === 5) {
          if (seq.length > i + 1 && seq[i + 1] === '.') {
            let c2 = 0;
            for (let j = i + 1; j < c; j++) {
              if (seq[j] === '.') {
                c2++;
              } else {
                break;
              }
            }

            this.addLatchEncoding(data, currentEncoding, inputI);

            // If we were in punc or digit, we switched to upper
            if (currentEncoding === 3 || currentEncoding === 4) {
              currentEncoding = 0;
            }

            if (c2 <= 31) {
              data.push(Utility.decbin(c2, 5));
            } else {
              data.push(Utility.decbin(0, 5));
              data.push(Utility.decbin(c2 - 31, 11));
            }

            fromBinary = currentEncoding;
            currentEncoding = inputI;
          }
        } else {
          // We restore the correct latch from previous binary
          if (fromBinary !== -1) {
            currentEncoding = fromBinary;
            fromBinary = -1;
          }

          let latch = this.latch[currentEncoding][inputI][0];
          if (latch !== null) {
            this.addLatchEncoding(data, currentEncoding, inputI);
            currentEncoding = inputI;
          }
        }
      }
    }

    return data;
  }

  private findPerfectSymbol(data: string): void {
    this.symbolindex = -1;

    let bits = Math.ceil((data.length * 100) / (100 - this.errorlevel));
    let chars = Math.ceil((3 * 100) / (100 - this.errorlevel));

    // Search the best size
    let c = this.symbolsize.length;
    for (let i = 0; i < c; i++) {
      if (bits + chars * this.symbolsize[i][BCGaztec.S_CWS] <= this.symbolsize[i][BCGaztec.S_BITS]) {
        this.symbolindex = i;
        if (this.size === BCGaztec.Size.Smallest) {
          break;
        }

        if (this.size === BCGaztec.Size.Full && this.symbolsize[i][BCGaztec.S_COMPACT] === 0) {
          break;
        }

        if (this.size === BCGaztec.Size.Compact) {
          if (this.symbolsize[i][BCGaztec.S_COMPACT] === 1) {
            break;
          } else if (i > 6) {
            break; // We won't find a compact after index 6
          }
        }
      }
    }
  }

  private groupBit(bitstream: string, groupBy: number, avoidAllSame: boolean): string[] {
    let allzero = Utility.strRepeat('0', groupBy - 1);
    let allones = Utility.strRepeat('1', groupBy - 1);
    let c = bitstream.length;
    let data: string[] = [];
    let i = 0;
    let counter = 0;
    for (; i < c; i += groupBy, counter++) {
      data.push(bitstream.substr(i, Math.min(groupBy, c - i)));

      if (avoidAllSame) {
        // We avoid all zero or all one
        if (Utility.safeSubstring(data[counter], 0, -1) === allzero) {
          data[counter] = data[counter].substr(0, groupBy - 1) + '1' + data[counter].substr(groupBy);
          i--;
        } else if (Utility.safeSubstring(data[counter], 0, -1) === allones) {
          data[counter] = data[counter].substr(0, groupBy - 1) + '0' + data[counter].substr(groupBy);
          i--;
        }
      }
    }

    // Padding
    if (counter > 0) {
      data[counter - 1] = Utility.pad(data[counter - 1], groupBy, '1', false);
      if (avoidAllSame) {
        // BUT if the last is all 1, we replace the last one with a 0 !
        if (Utility.safeSubstring(data[counter - 1], 0, -1) === allones) {
          data[counter - 1] = Utility.safeSubstring(data[counter - 1], 0, -1) + '0';
        }
      }
    }

    return data;
  }

  private computeError(bitstreamArray: string[], groupBy: number, nc: number, gf: number, pp: number): { bitstreamArray: string[] } {
    let dataDecimal: { [key: number]: number } = {};
    let c = bitstreamArray.length;
    for (let i = 0; i < c; i++) {
      dataDecimal[i] = Utility.bindec(bitstreamArray[i]);
    }

    let errorCodeDecimal = this.reedSolomon(dataDecimal, c, nc, gf, pp);
    for (let i = 0; i < nc; i++) {
      bitstreamArray.push(Utility.decbin(errorCodeDecimal[i], groupBy));
    }

    return {
      bitstreamArray
    };
  }

  private setData(data: string[]): void {
    let bitstream = data.join('');

    this.findPerfectSymbol(bitstream);
    if (this.symbolindex === -1) {
      throw new BCGParseException('aztec', 'Too many bits to encode.');
    }

    // Create the real bitstream now
    let cwsize = this.symbolsize[this.symbolindex][BCGaztec.S_CWS];
    this.data = this.groupBit(bitstream, cwsize, true);
    let counterData = this.data.length;

    // Error Data
    let groupBy = this.symbolsize[this.symbolindex][BCGaztec.S_CWS];
    let nc = this.symbolsize[this.symbolindex][BCGaztec.S_CWC] - counterData;
    let gf = this.symbolsize[this.symbolindex][BCGaztec.S_ERRGF];
    let pp = this.symbolsize[this.symbolindex][BCGaztec.S_ERRPR];
    ({ bitstreamArray: data } = this.computeError(this.data, groupBy, nc, gf, pp));

    // Message Mode
    let mmsymbolsizebits = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1 ? 2 : 5;
    let mmsymbolsize = Utility.decbin(this.symbolsize[this.symbolindex][BCGaztec.S_LAYER] - 1, mmsymbolsizebits);

    let mmsymbollenghtbits = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1 ? 6 : 11;
    let mmsymbollenght = Utility.decbin(counterData - 1, mmsymbollenghtbits);

    let mmbitstream = mmsymbolsize + mmsymbollenght;
    this.messagemode = this.groupBit(mmbitstream, 4, false);

    // Error Message Mode
    nc = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1 ? 5 : 6;
    gf = 16;
    pp = 19;
    ({ bitstreamArray: this.messagemode } = this.computeError(this.messagemode, 4, nc, gf, pp));
  }

  /**
   * Products x times y in array.
   */
  private prod(x: number, y: number, log: number[], alog: number[], gf: number): number {
    if (x === 0 || y === 0) {
      return 0;
    } else {
      return alog[(log[x] + log[y]) % (gf - 1)];
    }
  }

  /**
   * Reed solomon.
   */
  private reedSolomon(wd: { [key: number]: number }, nd: number, nc: number, gf: number, pp: number): number[] {
    let log: number[] = [];
    let alog: number[] = [];

    for (let i = 0; i < gf; i++) {
      log[i] = 0;
      alog[i] = 0;
    }

    log[0] = 1 - gf;
    alog[0] = 1;

    for (let i = 1; i < gf; i++) {
      alog[i] = alog[i - 1] * 2;
      if (alog[i] >= gf) {
        alog[i] ^= pp;
      }

      log[alog[i]] = i;
    }

    let c: number[] = [];

    for (let i = 0; i < nc + 1; i++) {
      c[i] = 0;
    }

    c[0] = 1;

    for (let i = 1; i < nc + 1; i++) {
      c[i] = c[i - 1];
      for (let j = i - 1; j >= 1; j--) {
        c[j] = c[j - 1] ^ this.prod(c[j], alog[i], log, alog, gf);
      }

      c[0] = this.prod(c[0], alog[i], log, alog, gf);
    }

    let t = nd + nc;
    for (let i = nd; i <= t; i++) {
      wd[i] = 0;
    }

    for (let i = 0; i < nd; i++) {
      let k = wd[nd] ^ wd[i];
      for (let j = 0; j < nc; j++) {
        wd[nd + j] = wd[nd + j + 1] ^ this.prod(k, c[nc - j - 1], log, alog, gf);
      }
    }

    let r: number[] = [];
    for (let i = nd; i < t; i++) {
      r[i - nd] = wd[i];
    }

    return r;
  }

  /**
   * Draws one pixel.
   *
   * @param image The surface.
   * @param x X.
   * @param y Y.
   * @param color The color.
   */
  protected drawPixel(image: draw.Surface, x: number, y: number, color: number = BCGBarcode.COLOR_FG): void {
    super.drawPixel(image, x + this.xo, -y + this.xo, color);
  }

  /**
   * Draws a rectangle.
   *
   * @param image The surface.
   * @param x1 X1.
   * @param y1 Y1.
   * @param x2 X2.
   * @param y2 Y2.
   * @param color The color.
   */
  protected drawRectangle(image: draw.Surface, x1: number, y1: number, x2: number, y2: number, color: number): void {
    super.drawRectangle(image, x1 + this.xo, -y1 + this.xo, x2 + this.xo, -y2 + this.xo, color);
  }

  /**
   * Draws a filled rectangle.
   *
   * @param image The surface.
   * @param x1 X1.
   * @param y1 Y1.
   * @param x2 X2.
   * @param y2 Y2.
   * @param color The surface.
   */
  protected drawFilledRectangle(image: draw.Surface, x1: number, y1: number, x2: number, y2: number, color: number): void {
    super.drawFilledRectangle(image, x1 + this.xo, -y1 + this.xo, x2 + this.xo, -y2 + this.xo, color);
  }

  private drawFixed(image: draw.Surface): void {
    let compact = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1;
    let f = compact ? 4 : 6;

    // Center
    this.drawPixel(image, 0, 0);

    // Square
    for (let i = f; i > 0; i--) {
      let color = BCGBarcode.COLOR_FG;
      if (i % 2 === 1) {
        color = BCGBarcode.COLOR_BG;
      }

      this.drawRectangle(image, -i, -i, i, i, color);
    }

    // Dark Module
    this.drawPixel(image, -f - 1, f);
    this.drawPixel(image, -f - 1, f + 1);
    this.drawPixel(image, -f, f + 1);
    this.drawPixel(image, f + 1, f + 1);
    this.drawPixel(image, f + 1, f);
    this.drawPixel(image, f + 1, -f);

    // Light Module
    this.drawPixel(image, f, f + 1, BCGBarcode.COLOR_BG);
    this.drawPixel(image, f + 1, -f - 1, BCGBarcode.COLOR_BG);
    this.drawPixel(image, f, -f - 1, BCGBarcode.COLOR_BG);
    this.drawPixel(image, -f, -f - 1, BCGBarcode.COLOR_BG);
    this.drawPixel(image, -f - 1, -f - 1, BCGBarcode.COLOR_BG);
    this.drawPixel(image, -f - 1, -f, BCGBarcode.COLOR_BG);

    let color2: number[] = [BCGBarcode.COLOR_FG, BCGBarcode.COLOR_BG];

    // Grid
    if (!compact) {
      let starting = Math.floor(this.xo % 16) - this.xo;
      for (let x = -this.xo; x <= this.xo; x++) {
        for (let y = starting; y < this.xo; y += 16) {
          this.drawPixel(image, x, y, color2[(Math.abs(x) + Math.abs(y)) % 2]);
        }
      }

      for (let y = -this.xo; y <= this.xo; y++) {
        for (let x = starting; x < this.xo; x += 16) {
          this.drawPixel(image, x, y, color2[(Math.abs(x) + Math.abs(y)) % 2]);
        }
      }
    }
  }

  private drawMessageMode(image: draw.Surface): void {
    let compact = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1;
    let bits = compact ? 7 : 10;
    let f = compact ? 4 : 6;

    if (this.messagemode === null) {
      throw new Error();
    }

    let mm = this.messagemode.join('');
    let counter = 0;

    let color: number[] = [BCGBarcode.COLOR_BG, BCGBarcode.COLOR_FG];

    // Line 1
    let c = -f + 1 + bits;
    let y = f + 1;
    for (let x = -f + 1; x < c; x++) {
      // Skip Reference Grid
      if (!compact) {
        if (x === 0) {
          c++;
          continue;
        }
      }

      let n1 = parseInt(mm[counter++].toString(), 10);
      this.drawPixel(image, x, y, color[n1]);
    }

    // Line 2
    c = f - 1 - bits;
    let xx = f + 1;
    for (y = f - 1; y > c; y--) {
      // Skip Reference Grid
      if (!compact) {
        if (y === 0) {
          c--;
          continue;
        }
      }

      let n1 = parseInt(mm[counter++].toString(), 10);
      this.drawPixel(image, xx, y, color[n1]);
    }

    // Line 3
    c = f - 1 - bits;
    y = -f - 1;
    for (let x = f - 1; x > c; x--) {
      // Skip Reference Grid
      if (!compact) {
        if (x === 0) {
          c--;
          continue;
        }
      }

      let n1 = parseInt(mm[counter++].toString(), 10);
      this.drawPixel(image, x, y, color[n1]);
    }

    // Line 4
    c = -f + 1 + bits;
    xx = -f - 1;
    for (y = -f + 1; y < c; y++) {
      // Skip Reference Grid
      if (!compact) {
        if (y === 0) {
          c++;
          continue;
        }
      }

      let n1 = parseInt(mm[counter++].toString(), 10);
      this.drawPixel(image, xx, y, color[n1]);
    }
  }

  private drawLayer(image: draw.Surface): void {
    if (this.data === null) {
      throw new Error();
    }

    let compact = this.symbolsize[this.symbolindex][BCGaztec.S_COMPACT] === 1;
    let f = compact ? 4 : 6;
    let bitsPerLineStart = compact ? 13 : 16;
    let cws = this.symbolsize[this.symbolindex][BCGaztec.S_CWS];

    // Reorder the bits to write them.
    let dr = '';
    let c = this.data.length;
    for (let i = c - 1; i >= 0; i--) {
      for (let j = cws - 1; j >= 0; j -= 2) {
        dr += this.data[i][j - 1];
        dr += this.data[i][j];
      }
    }

    // We pad with light just in case
    for (let i = 0; i < cws; i++) {
      dr += '0';
    }

    let color: number[] = [BCGBarcode.COLOR_BG, BCGBarcode.COLOR_FG];

    let counter = 0;
    let layers = this.symbolsize[this.symbolindex][BCGaztec.S_LAYER];
    let sx = -f - 3; // The starting point is the top left corner of the layer... not the starting point
    let sy = f + 3;
    let skipMoment = 1; // Change between 0 and 1
    let l = 1;
    let bitsPerLine = bitsPerLineStart;
    for (; l <= layers; l++, bitsPerLine += 4) {
      // Line 1
      let x = sx + 2; // Do we have a split X?
      if ((x - 1) % 16 === 0) {
        x++;
      }

      let y = sy; // Do we have a split Y?
      let skipS = (y - 1) % 16 === 0 ? 1 : 0;

      let skip = 0;
      for (let i = 0; i < bitsPerLine + skip; i++, x++) {
        if (!compact && Math.abs(x) % 16 === 0) {
          // Skip grid
          skip++;
          continue;
        }

        let n1 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y, color[n1]);
        let n2 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y - 1 - skipS, color[n2]);
      }

      // Line 2
      x -= 1;
      y = y - 2 - skipS;

      skip = 0;
      for (let i = 0; i < bitsPerLine + skip; i++, y--) {
        if (!compact && Math.abs(y) % 16 === 0) {
          // Skip grid
          skip++;
          continue;
        }

        let n1 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y, color[n1]);
        let n2 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x - 1 - skipS, y, color[n2]);
      }

      // Line 3
      x = x - 2 - skipS;
      y += 1;

      skip = 0;
      for (let i = 0; i < bitsPerLine + skip; i++, x--) {
        if (!compact && Math.abs(x) % 16 === 0) {
          // Skip grid
          skip++;
          continue;
        }

        let n1 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y, color[n1]);
        let n2 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y + 1 + skipS, color[n2]);
      }

      // Line 4
      x += 1;
      y = y + 2 + skipS;
      skip = 0;
      for (let i = 0; i < bitsPerLine + skip; i++, y++) {
        if (!compact && Math.abs(y) % 16 === 0) {
          // Skip grid
          skip++;
          continue;
        }

        let n1 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x, y, color[n1]);
        let n2 = parseInt(dr[counter++].toString(), 10);
        this.drawPixel(image, x + 1 + skipS, y, color[n2]);
      }

      sx -= 2;
      sy += 2;
      if ((sy - skipMoment) % 16 === 0) {
        // Skip the grid
        sx -= 1;
        sy += 1;
        if (skipMoment === 1) {
          skipMoment = 0;
        } else {
          skipMoment = 1;
        }
      }
    }
  }

  private addLatchEncoding(data: string[], currentEncoding: number, inputI: number): void {
    for (let j = 0; j < 3; j++) {
      let latch: string | null = this.latch[currentEncoding][inputI][j];

      if (latch !== null) {
        data.push(latch);
      }
    }
  }
}

namespace BCGaztec {
  /**
   * The size type.
   */
  export enum Size {
    /**
     * The code will be the smallest possible.
     */
    Smallest,

    /**
     * The code will try to be a compact code if possible.
     */
    Compact,

    /**
     * The code will be in full mode (with the reference grid).
     */
    Full
  }
}

export { BCGaztec };
