'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException, BCGBarcode, BCGBarcode2D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * DataMatrix.
 */
class BCGdatamatrix extends BCGBarcode2D {
  private static readonly UNLATCH_EDIFACT: string = '\x1f';

  private static readonly _GF = 256;
  private static readonly _MODULUS = 301;

  private data: number[] | null = null; // Saved Data
  private bitstream: number[] | null = null; // Saved Bitstream
  private quietZoneSize = 1; // int
  private symbolNumber = 0; // int (for Structured Append)
  private symbolTotal = 0; // int (for Structured Append)
  private symbolIdentification = -1; // int (for Structured Append)
  private acceptECI = false; // bool
  private tilde = false; // bool
  private fnc1 = BCGdatamatrix.Fnc1.None; // int
  private size = BCGdatamatrix.Size.Square; // int
  private forceSymbolIndex = -1; // int
  private encoding = BCGdatamatrix.Encoding.Unknown; // int
  private macro = BCGdatamatrix.Macro.None;

  private symbols: BCGdatamatrixInfo[];

  private readonly BASE_offset: number;
  private readonly BASE_C40: string;
  private readonly BASE_TEXT: string;
  private readonly SHIFT1: string;
  private readonly SHIFT2: string;
  private readonly SHIFT3_C40: string;
  private readonly SHIFT3_TEXT: string;
  private readonly X12: string;

  private currentSymbolIndex: number = 0;

  private readonly sequenceSorting = [
    BCGdatamatrix.Encoding.Ascii,
    BCGdatamatrix.Encoding.Base256,
    BCGdatamatrix.Encoding.Edifact,
    BCGdatamatrix.Encoding.Text,
    BCGdatamatrix.Encoding.X12,
    BCGdatamatrix.Encoding.C40
  ];

  /**
   * Creates a DataMatrix barcode.
   */
  constructor() {
    super();

    this.BASE_offset = 3;
    this.BASE_C40 = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.BASE_TEXT = this.BASE_C40.toLowerCase();

    this.SHIFT1 = '';
    for (let i = 0; i <= 31; i++) {
      this.SHIFT1 += String.fromCharCode(i);
    }

    this.SHIFT2 = '!"#$%&\'()*+,-./:;<=>?@[\\]^_';

    this.SHIFT3_C40 = String.fromCharCode(96) + 'abcdefghijklmnopqrstuvwxyz{|}~' + String.fromCharCode(127);
    this.SHIFT3_TEXT = this.SHIFT3_C40.toUpperCase();

    this.X12 = String.fromCharCode(13) + '*> 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.symbols = [
      new BCGdatamatrixInfoSquare(10, 1, 3, 5, 1),
      new BCGdatamatrixInfoSquare(12, 1, 5, 7, 1),
      new BCGdatamatrixInfoSquare(14, 1, 8, 10, 1),
      new BCGdatamatrixInfoSquare(16, 1, 12, 12, 1),
      new BCGdatamatrixInfoSquare(18, 1, 18, 14, 1),
      new BCGdatamatrixInfoSquare(20, 1, 22, 18, 1),
      new BCGdatamatrixInfoSquare(22, 1, 30, 20, 1),
      new BCGdatamatrixInfoSquare(24, 1, 36, 24, 1),
      new BCGdatamatrixInfoSquare(26, 1, 44, 28, 1),
      new BCGdatamatrixInfoSquare(32, 4, 62, 36, 1),
      new BCGdatamatrixInfoSquare(36, 4, 86, 42, 1),
      new BCGdatamatrixInfoSquare(40, 4, 114, 48, 1),
      new BCGdatamatrixInfoSquare(44, 4, 144, 56, 1),
      new BCGdatamatrixInfoSquare(48, 4, 174, 68, 1),
      new BCGdatamatrixInfoSquare(52, 4, 102, 42, 2),
      new BCGdatamatrixInfoSquare(64, 16, 140, 56, 2),
      new BCGdatamatrixInfoSquare(72, 16, 92, 36, 4),
      new BCGdatamatrixInfoSquare(80, 16, 114, 48, 4),
      new BCGdatamatrixInfoSquare(88, 16, 144, 56, 4),
      new BCGdatamatrixInfoSquare(96, 16, 174, 68, 4),
      new BCGdatamatrixInfoSquare(104, 16, 136, 56, 6),
      new BCGdatamatrixInfoSquare(120, 36, 175, 68, 6),
      new BCGdatamatrixInfoSquare(132, 36, 163, 62, 8),
      new BCGdatamatrixInfoSquareArray(144, 36, [156, 155], [62, 62], [8, 2]),

      new BCGdatamatrixInfoRectangle(8, 18, 1, 5, 7, 1),
      new BCGdatamatrixInfoRectangle(8, 32, 2, 10, 11, 1),
      new BCGdatamatrixInfoRectangle(12, 26, 1, 16, 14, 1),
      new BCGdatamatrixInfoRectangle(12, 36, 2, 22, 18, 1),
      new BCGdatamatrixInfoRectangle(16, 36, 2, 32, 24, 1),
      new BCGdatamatrixInfoRectangle(16, 48, 2, 49, 28, 1)
    ];

    this.currentSymbolIndex = 0;

    this.symbols.sort((a: BCGdatamatrixInfo, b: BCGdatamatrixInfo) => {
      const s1 = a.getDataSize();
      const s2 = b.getDataSize();
      if (s1 < s2) {
        return -1;
      } else if (s1 > s2) {
        return 1;
      } else {
        return 0;
      }
    });

    this.setScale(4);
  }

  /**
   * Gets the size of the barcode.
   *
   * @return The barcode size.
   */
  getSize(): BCGdatamatrix.Size {
    return this.size;
  }

  /**
   * Sets the size of the barcode. Could be different value:
   *  - BCGdatamatrix.Size.Smallest: generates the smallest size (default)
   *  - BCGdatamatrix.Size.Square: generates a square code
   *  - BCGdatamatrix.Size.Rectangle: generates a rectangle code
   *
   * @param size The barcode size.
   */
  setSize(size: BCGdatamatrix.Size): void {
    this.size = size;
  }

  /**
   * Gets the DataMatrix Size.
   *
   * @return Rows and Cols.
   */
  getDataMatrixSize(): number[] {
    if (this.forceSymbolIndex === -1) {
      return [-1, -1];
    } else {
      return [this.symbols[this.forceSymbolIndex].row, this.symbols[this.forceSymbolIndex].col];
    }
  }

  /**
   * Sets the DataMatrix you wish to use.
   * -1 is automatic.
   * If you don't set the second argument, it will create a square symbol.
   *
   * @param row The row amount.
   * @param col The col amount.
   */
  setDataMatrixSize(row: number, col: number = -1): void {
    this.forceSymbolIndex = -1;
    if (col === -1) {
      col = row;
    }

    if (row > 0) {
      const nb = this.symbols.length;
      for (let i = 0; i < nb; i++) {
        if (this.symbols[i].row === row && this.symbols[i].col === col) {
          this.forceSymbolIndex = i;
          break;
        }
      }

      if (this.forceSymbolIndex === -1) {
        throw new BCGArgumentException("The symbol you provided doesn't exists.", 'row');
      }
    }
  }

  /**
   * Gets the quiet zone size.
   *
   * @return The quiet zone size.
   */
  getQuietZoneSize(): number {
    return this.quietZoneSize;
  }

  /**
   * Sets the quiet zone size.
   *
   * @param quietZoneSize The quiet zone size.
   */
  setQuietZoneSize(quietZoneSize: number): void {
    if (quietZoneSize < 0) {
      throw new BCGArgumentException('The quiet zone must be equal or bigger than 0.', 'quietZoneSize');
    }

    this.quietZoneSize = quietZoneSize;
  }

  /**
   * Gets if it accepts the backslash as a special character.
   *
   * @return True if enabled.
   */
  getAcceptECI(): boolean {
    return this.acceptECI;
  }

  /**
   * Accepts ECI code to be process as a special character.
   * If true, you can do this:
   *  - \\    : to make ONE backslash
   *  - \xxxxxx    : with x a number between 0 and 9
   *
   * @param accept Accept ECI special character.
   */
  setAcceptECI(accept: boolean): void {
    this.acceptECI = accept;
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
   *
   * @param accept Accept the tilde as special character.
   */
  setTilde(accept: boolean): void {
    this.tilde = accept;
  }

  /**
   * DataMatrix symbol can be appended to another one.
   * The symbolTotal must remain the same across all the DataMatrix group.
   * Up to 16 symbols total.
   * The first symbol is 1.
   * If you want to reset and not use this Structured Append, set the symbolNumber to 0.
   * The symbolIdentification is a number between 1 and 64516. This is used to identify symbols that belong
   * together. The number must remain the same accross the symbols.
   *
   * @param symbolNumber The symbol number.
   * @param symbolTotal The amount of symbols.
   * @param symbolIdentification The symbol identifier.
   * @return True on success, false on failure.
   */
  setStructuredAppend(symbolNumber: number, symbolTotal: number = 0, symbolIdentification: number = 1): boolean {
    if (symbolTotal === 0) {
      // Keep weak
      this.symbolNumber = 0;
      this.symbolTotal = 0;
      this.symbolIdentification = -1;
      return true;
    } else {
      if (this.macro !== BCGdatamatrix.Macro.None) {
        throw new BCGArgumentException('You cannot use the structured append with the macro syntax.', 'symbolNumber');
      }

      if (symbolNumber <= 0) {
        throw new BCGArgumentException('The symbol number must be equal or bigger than 1.', 'symbolNumber');
      }

      if (symbolNumber > symbolTotal) {
        throw new BCGArgumentException('The symbol number must be equal or lower than the symbol total.', 'symbolNumber');
      }

      if (symbolTotal < 2 && symbolTotal > 16) {
        throw new BCGArgumentException('The symbol total must be between 2 and 16.', 'symbolTotal');
      }

      if (symbolIdentification < 1 || symbolIdentification > 64516) {
        throw new BCGArgumentException('The symbol identification must be between 1 and 64516.', 'symbolIdentification');
      }

      this.symbolNumber = symbolNumber;
      this.symbolTotal = symbolTotal;
      this.symbolIdentification = symbolIdentification;

      return true;
    }
  }

  /**
   * Sets the FNC1 type for the barcode. The argument fnc1Type can be:
   *  - BCGdatamatrix.Fnc1.None: No FNC1 will be used
   *  - BCGdatamatrix.Fnc1.GS1: FNC1 will be used with GS1 standard.
   *  - BCGdatamatrix.Fnc1.AIM: FNC1 will be used with AIM standard.
   *
   * @param fnc1Type The FNC1 type.
   */
  setFNC1(fnc1Type: BCGdatamatrix.Fnc1): void {
    this.fnc1 = fnc1Type;
  }

  /**
   * Gets the forced encoding.
   *
   * @return The encoding.
   */
  getEncoding(): BCGdatamatrix.Encoding {
    return this.encoding;
  }

  /**
   * Forces the encoding to be used.
   *
   * @param encoding The encoding.
   */
  setEncoding(encoding: BCGdatamatrix.Encoding): void {
    this.encoding = encoding;
  }

  /**
   * Gets the macro.
   *
   * @return The macro.
   */
  getMacro(): BCGdatamatrix.Macro {
    return this.macro;
  }

  /**
   * Sets the macro.
   *
   * @param macro The macro.
   */
  setMacro(macro: BCGdatamatrix.Macro): void {
    if (macro !== BCGdatamatrix.Macro.None && this.symbolNumber !== 0) {
      throw new BCGArgumentException('You cannot use the macro syntax with the structured append.', 'macro');
    }

    this.macro = macro;
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    if (this.bitstream === null) {
      throw new Error();
    }

    const symbol = this.symbols[this.currentSymbolIndex];

    if (this.quietZoneSize > 0) {
      this.drawFilledRectangle(
        image,
        0,
        0,
        symbol.col + this.quietZoneSize * 2 - 1,
        symbol.row + this.quietZoneSize * 2 - 1,
        BCGBarcode.COLOR_BG
      );
    }

    const mappingSize = symbol.getMappingSize();
    const placement = new BCGdatamatrixPlacement(mappingSize[0], mappingSize[1]);
    const matrix = placement.getMatrix(this.bitstream);

    this.drawAlignmentsAndMatrix(image, matrix);

    this.drawText(image, 0, 0, symbol.col + this.quietZoneSize * 2, symbol.row + this.quietZoneSize * 2);
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    const c = text.length;
    if (c === 0) {
      throw new BCGParseException('datamatrix', 'Provide data to parse.');
    }

    const seq = this.getSequence(text);

    if (seq !== null) {
      const bitstream = this.createBinaryStream(text, seq);
      this.bitstream = bitstream;
    }
  }

  /**
   * Returns the maximal size of a barcode.
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    const symbol = this.symbols[this.currentSymbolIndex];
    width += symbol.col + this.quietZoneSize * 2;
    height += symbol.row + this.quietZoneSize * 2;

    return super.getDimension(width, height, createSurface);
  }

  /**
   * Finds the mode we have to encode the following data starting at position i
   *
   * @param text The full text.
   * @param i The position of where we are encoding.
   * @param currentMode The current mode.
   * @return The encoding or null.
   */
  protected getSequenceLookAhead(text: string, i: number, currentMode: BCGdatamatrix.Encoding | null): BCGdatamatrix.Encoding | null {
    if (this.encoding !== BCGdatamatrix.Encoding.Unknown) {
      if (i >= text.length) {
        return null;
      }

      return this.encoding;
    }

    let count: { [encoding: number]: number };
    if (currentMode === BCGdatamatrix.Encoding.Ascii) {
      count = {
        [BCGdatamatrix.Encoding.Ascii]: 0,
        [BCGdatamatrix.Encoding.C40]: 1,
        [BCGdatamatrix.Encoding.Text]: 1,
        [BCGdatamatrix.Encoding.X12]: 1,
        [BCGdatamatrix.Encoding.Edifact]: 1,
        [BCGdatamatrix.Encoding.Base256]: 1.25
      };
    } else {
      count = {
        [BCGdatamatrix.Encoding.Ascii]: 1,
        [BCGdatamatrix.Encoding.C40]: 2,
        [BCGdatamatrix.Encoding.Text]: 2,
        [BCGdatamatrix.Encoding.X12]: 2,
        [BCGdatamatrix.Encoding.Edifact]: 2,
        [BCGdatamatrix.Encoding.Base256]: 2.25
      };
    }

    if (currentMode === null) {
      throw new Error('Developer Exception');
    }

    count[currentMode] = 0;

    const c = text.length;
    for (let counter = 1; i < c; i++, counter++) {
      const t = text[i];
      const o = t.charCodeAt(0);
      let isFNC1 = false;

      // If \ and we accept ECI, then we must go to ASCII
      if (this.isCharECI(text, i)) {
        return BCGdatamatrix.Encoding.Ascii;
      }

      if (this.isCharFNC1(text, i)) {
        i++;
        isFNC1 = true;
      }

      // ASCII count
      if (isFNC1) {
        count[BCGdatamatrix.Encoding.Ascii] = Math.ceil(count[BCGdatamatrix.Encoding.Ascii]) + 1;
      } else if (Utility.isNumeric(t.toString())) {
        count[BCGdatamatrix.Encoding.Ascii] += 0.5;
      } else if (o > 127) {
        count[BCGdatamatrix.Encoding.Ascii] = Math.ceil(count[BCGdatamatrix.Encoding.Ascii]) + 2;
      } else {
        count[BCGdatamatrix.Encoding.Ascii] = Math.ceil(count[BCGdatamatrix.Encoding.Ascii]) + 1;
      }

      // C40 count
      if (isFNC1 || this.BASE_C40.indexOf(t) > -1) {
        count[BCGdatamatrix.Encoding.C40] += 2.0 / 3.0;
      } else if (o > 127) {
        count[BCGdatamatrix.Encoding.C40] += 8.0 / 3.0;
      } else {
        count[BCGdatamatrix.Encoding.C40] += 4.0 / 3.0;
      }

      // Text count
      if (isFNC1 || this.BASE_TEXT.indexOf(t) > -1) {
        count[BCGdatamatrix.Encoding.Text] += 2.0 / 3.0;
      } else if (o > 127) {
        count[BCGdatamatrix.Encoding.Text] += 8.0 / 3.0;
      } else {
        count[BCGdatamatrix.Encoding.Text] += 4.0 / 3.0;
      }

      // X12 count
      if (isFNC1) {
        count[BCGdatamatrix.Encoding.X12] += 10.0 / 3.0;
      } else if (this.X12.indexOf(t) > -1) {
        count[BCGdatamatrix.Encoding.X12] += 2.0 / 3.0;
      } else if (o > 127) {
        count[BCGdatamatrix.Encoding.X12] += 13.0 / 3.0;
      } else {
        count[BCGdatamatrix.Encoding.X12] += 10.0 / 3.0;
      }

      // EDF count
      if (isFNC1) {
        count[BCGdatamatrix.Encoding.Edifact] += 13.0 / 4.0;
      } else if (o >= 32 && o <= 94) {
        count[BCGdatamatrix.Encoding.Edifact] += 3.0 / 4.0;
      } else if (o > 127) {
        count[BCGdatamatrix.Encoding.Edifact] += 17.0 / 4.0;
      } else {
        count[BCGdatamatrix.Encoding.Edifact] += 13.0 / 4.0;
      }

      // Base256 count
      if (isFNC1 /* TODO Reader Program, Code Page */) {
        count[BCGdatamatrix.Encoding.Base256] += 4;
      } else {
        count[BCGdatamatrix.Encoding.Base256] += 1;
      }

      // Check return condition
      if (counter >= 4) {
        const returnCondition = this.checkReturnCondition(count, false, text, i + 1);
        if (returnCondition !== null) {
          return returnCondition;
        }
      }
    }

    // We are here so we have no more data
    return this.checkReturnCondition(count, true);
  }

  private getAccomodatedSymbolIndex(size: number): number {
    let currentSymbolIndex = -1;
    if (this.forceSymbolIndex > -1) {
      this.currentSymbolIndex = -1;
      if (size <= this.symbols[this.forceSymbolIndex].getDataSize()) {
        currentSymbolIndex = this.forceSymbolIndex;
      }
    } else {
      const c = this.symbols.length;
      const startingIndex = this.currentSymbolIndex;
      for (let i = startingIndex; i < c; i++) {
        if (this.size === BCGdatamatrix.Size.Square && !(this.symbols[i] instanceof BCGdatamatrixInfoSquare)) {
          continue;
        }

        if (this.size === BCGdatamatrix.Size.Rectangle && !(this.symbols[i] instanceof BCGdatamatrixInfoRectangle)) {
          continue;
        }

        if (size <= this.symbols[i].getDataSize()) {
          currentSymbolIndex = i;
          break;
        }
      }
    }

    if (currentSymbolIndex === -1) {
      const extendedMessage =
        this.forceSymbolIndex > -1 ? ' Specify a bigger Datamatrix size or let the application choose by default.' : '';
      throw new BCGParseException('datamatrix', 'There is no valid symbol that can fit your data.' + extendedMessage);
    }

    return currentSymbolIndex;
  }

  private accomodateSymbol(size: number): void {
    this.currentSymbolIndex = this.getAccomodatedSymbolIndex(size);
  }

  /**
   * Creates the binary stream based on the text and the 3 sequences seq passed.
   * The output will be an array of string containing 8 bits 1 and 0 (binary as string)
   */
  private createBinaryStream(text: string, seq: number[]): number[] {
    const symbol = this.symbols[this.currentSymbolIndex];

    const finalError = BCGdatamatrix.getFinalError(seq, symbol.block, symbol.data, symbol.error, symbol.block1);

    seq = seq.concat(finalError);

    return seq;
  }

  private drawAlignmentsAndMatrix(image: draw.Surface, matrix: boolean[][]): void {
    const symbol = this.symbols[this.currentSymbolIndex];

    const line = Math.floor(Math.sqrt(symbol.region));
    const col = symbol.region === 2 ? 2 : line;
    const w = symbol.col / col;
    const h = symbol.row / line;

    let i: number;
    let j: number;
    for (i = 0; i < col; i++) {
      for (j = 0; j < line; j++) {
        this.drawAlignment(image, w * i + this.quietZoneSize, h * j + this.quietZoneSize, w, h);
      }
    }

    const c1 = matrix.length;
    const c2 = matrix[0].length;
    for (
      let y = (i = 0);
      i < c1;
      y++, i++ // Line
    ) {
      for (
        let x = (j = 0);
        j < c2;
        x++, j++ // Column
      ) {
        const xT = x + Math.floor(j / (w - 2)) * 2;
        const yT = y + Math.floor(i / (h - 2)) * 2;

        this.drawPixel(
          image,
          1 + this.quietZoneSize + xT,
          1 + this.quietZoneSize + yT,
          matrix[i][j] ? BCGBarcode.COLOR_FG : BCGBarcode.COLOR_BG
        );
      }
    }
  }

  /**
   * Draws the alignment pattern at position x &amp; y (top left) of width w and height h
   */
  private drawAlignment(image: draw.Surface, x: number, y: number, w: number, h: number): void {
    this.drawRectangle(image, x, y, x, y + h - 1, BCGBarcode.COLOR_FG);
    this.drawRectangle(image, x, y + h - 1, x + w - 1, y + h - 1, BCGBarcode.COLOR_FG);

    const color: number[] = [BCGBarcode.COLOR_FG, BCGBarcode.COLOR_BG];
    for (let i = 1; i < w; i++) {
      this.drawPixel(image, x + i, y, color[i % 2]);
    }

    for (let i = 0; i < h; i++) {
      this.drawPixel(image, x + w - 1, y + i, color[(i + 1) % 2]);
    }
  }

  /**
   * Returns if the character represents the ECI code \Exxxxxx.
   */
  private isCharECI(text: string, i: number): boolean {
    if (this.acceptECI) {
      if (text[i] === '\\') {
        const temp = Utility.safeSubstring(text, i + 1, 6);
        if (temp.length === 6 && Utility.isNumeric(temp)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Returns if the character represents the FNC1 ~F.
   */
  private isCharFNC1(text: string, i: number): boolean {
    if (this.tilde) {
      if (text[i] === '~') {
        if (text.length > i + 1 && text[i + 1] === 'F') {
          return true;
        }
      }
    }

    return false;
  }

  private checkReturnCondition(
    count: {
      [encoding: number /*BCGdatamatrix.Encoding*/]: number;
    },
    eod: boolean,
    text: string | null = null,
    i: number = 0
  ): BCGdatamatrix.Encoding | null {
    if (eod) {
      const newCount: { [encoding: number /*BCGdatamatrix.Encoding*/]: number } = {};
      for (const key in count) {
        if (count.hasOwnProperty(key)) {
          newCount[key] = Math.ceil(count[key]);
        }
      }

      // Sorting
      const orderedCount = BCGdatamatrixSequenceSort.sort(newCount, this.sequenceSorting);
      const type1 = orderedCount[0];

      if (!type1 || type1.value === 0) {
        return null;
      } else {
        // The documentation says ASCII+1. We do not follow.
        return type1.key;
      }
    } else {
      // Sorting
      const orderedCount = BCGdatamatrixSequenceSort.sort(count, this.sequenceSorting);
      const type1 = orderedCount[0];
      const type2 = orderedCount[1];

      switch (type1.key) {
        case BCGdatamatrix.Encoding.Ascii:
          if (type1.value + 1 <= type2.value) {
            return BCGdatamatrix.Encoding.Ascii;
          }

          break;
        case BCGdatamatrix.Encoding.Base256:
          if (
            (type2.key === BCGdatamatrix.Encoding.Ascii && type1.value + 1 <= type2.value) ||
            (type2.key !== BCGdatamatrix.Encoding.Ascii && type1.value < type2.value)
          ) {
            return BCGdatamatrix.Encoding.Base256;
          }

          break;
        case BCGdatamatrix.Encoding.Edifact:
        case BCGdatamatrix.Encoding.Text:
          if (type1.value + 1 < type2.value) {
            return type1.key;
          }

          break;
        case BCGdatamatrix.Encoding.C40:
          if (
            type1.value + 1 < type2.value &&
            (type2.key === BCGdatamatrix.Encoding.Ascii ||
              type2.key === BCGdatamatrix.Encoding.Base256 ||
              type2.key === BCGdatamatrix.Encoding.Edifact ||
              type2.key === BCGdatamatrix.Encoding.Text)
          ) {
            if (type1.value < count[BCGdatamatrix.Encoding.X12]) {
              return BCGdatamatrix.Encoding.C40;
            } else if (type1.value === count[BCGdatamatrix.Encoding.X12]) {
              // keep weak
              // Section AP r6iiI
              let found = false;
              if (text !== null) {
                const c = text.length;
                for (; i < c; i++) {
                  const pos = this.X12.indexOf(text[i]);
                  if (pos === 0 || pos === 1 || pos === 2) {
                    found = true;
                    break;
                  } else if (pos === -1) {
                    break;
                  }
                }

                if (found) {
                  return BCGdatamatrix.Encoding.X12;
                } else {
                  return BCGdatamatrix.Encoding.C40;
                }
              }
            }
          }

          break;
      }

      return null;
    }
  }

  /**
   * Will check if we have correct \ if acceptECI is activated.
   * Will check if we have correct ~ if tilde is activated.
   * Returns the sanitized string.
   */
  private sanitizeText(text: string): string {
    if (this.acceptECI || this.tilde) {
      let c = text.length;
      for (let i = 0; i < c; i++) {
        if (this.acceptECI && text[i] === '\\' && !this.isCharECI(text, i)) {
          // We got a \\, do we have a following one?
          if (text.length > i + 1 && text[i + 1] === '\\') {
            text = text.substring(0, i) + text.substring(i + 1);
            c--;
          } else {
            throw new BCGParseException(
              'datamatrix',
              'Incorrect ECI code detected. ECI code must contain a backslash followed by 6 digits or double the backslash to write one backslash.'
            );
          }
        } else if (this.tilde && text[i] === '~' && !this.isCharFNC1(text, i)) {
          // We got a ~, do we have a following one?
          if (text.length > i + 1 && text[i + 1] === '~') {
            text = text.substring(0, i) + text.substring(i + 1);
            c--;
          } else {
            throw new BCGParseException('datamatrix', 'Incorrect tilde code detected. Tilde code must be ~~ or ~F.');
          }
        }
      }
    }

    return text;
  }

  private getSequence(text: string): number[] {
    let subText: string;
    let counter: number;

    this.currentSymbolIndex = 0;

    // Start with the Structured Append if present.
    this.data = this.getStructuredAppendOrMacroCodewords();

    let currentMode: BCGdatamatrix.Encoding | null = BCGdatamatrix.Encoding.Ascii;

    let edifactLastCharacters = '';
    text = this.sanitizeText(text);
    let c = text.length;
    for (let i = 0; i < c; i++) {
      if (edifactLastCharacters !== '') {
        this.data = this.data.concat(this.encodeRawEdifact(edifactLastCharacters));
        edifactLastCharacters = '';
      }

      let nextMode = this.getSequenceLookAhead(text, i, currentMode);

      switch (currentMode) {
        case BCGdatamatrix.Encoding.Ascii:
          if (this.isCharECI(text, i)) {
            this.data.push(241);
            const eci = parseInt(text.substring(i + 1, i + 1 + 6), 10);
            if (eci <= 126) {
              this.data.push(eci + 1);
            } else if (eci <= 16382) {
              this.data.push(Math.floor((eci - 127) / 254) + 128);
              this.data.push(((eci - 127) % 254) + 1);
            } else {
              this.data.push(Math.floor((eci - 16383) / 64516) + 192);
              this.data.push((Math.floor((eci - 16383) / 254) % 254) + 1);
              this.data.push(((eci - 16383) % 254) + 1);
            }

            i += 6;
          } else if (this.isCharFNC1(text, i)) {
            this.data.push(232);
            i += 1;
          } else {
            const o1 = text.length > i ? text.charCodeAt(i) : 0; // This is always true.
            const o2 = text.length > i + 1 ? text.charCodeAt(i + 1) : 0;

            if (o1 >= 0x30 && o1 <= 0x39 && o2 >= 0x30 && o2 <= 0x39) {
              const n1 = parseInt(text[i].toString() + text[i + 1].toString(), 10);
              this.data.push(n1 + 130);
              i++;
            } else if (nextMode !== BCGdatamatrix.Encoding.Ascii) {
              if (nextMode === BCGdatamatrix.Encoding.Base256) {
                // Pb3
                currentMode = nextMode;
                i--;
              } else {
                currentMode = nextMode;
                i--;
              }
            } else if (o1 > 127) {
              this.data.push(235);
              this.data.push(o1 - 127);
            } else {
              this.data.push(o1 + 1);
            }
          }
          break;
        case BCGdatamatrix.Encoding.C40:
          subText = '';
          counter = 0;
          do {
            subText += text[i];
            i++;
            counter++;
          } while (text.length > i && (counter < 2 || this.getSequenceLookAhead(text, i, currentMode) === BCGdatamatrix.Encoding.C40));

          nextMode = this.getSequenceLookAhead(text, i, currentMode);
          this.data = this.data.concat(this.parseC40(subText, nextMode === null));
          currentMode = nextMode;
          i--;
          break;
        case BCGdatamatrix.Encoding.Text:
          subText = '';
          counter = 0;
          do {
            subText += text[i];
            i++;
            counter++;
          } while (text.length > i && (counter < 2 || this.getSequenceLookAhead(text, i, currentMode) === BCGdatamatrix.Encoding.Text));

          nextMode = this.getSequenceLookAhead(text, i, currentMode);
          this.data = this.data.concat(this.parseText(subText, nextMode === null));
          currentMode = nextMode;
          i--;
          break;
        case BCGdatamatrix.Encoding.X12:
          subText = '';
          counter = 0;
          do {
            subText += text[i];
            i++;
            counter++;
          } while (text.length > i && (counter < 2 || this.getSequenceLookAhead(text, i, currentMode) === BCGdatamatrix.Encoding.X12));

          nextMode = this.getSequenceLookAhead(text, i, currentMode);
          this.data = this.data.concat(this.parseX12(subText, nextMode === null));
          currentMode = nextMode;
          i--;
          break;
        case BCGdatamatrix.Encoding.Edifact:
          subText = '';
          counter = 0;
          do {
            subText += text[i];
            i++;
            counter++;
          } while (text.length > i && (counter < 3 || this.getSequenceLookAhead(text, i, currentMode) === BCGdatamatrix.Encoding.Edifact));

          nextMode = this.getSequenceLookAhead(text, i, currentMode);
          let temp: number[];
          ({ value: temp, lastCharacters: edifactLastCharacters } = this.parseEdifact(subText, edifactLastCharacters));
          this.data = this.data.concat(temp);
          currentMode = nextMode;
          i--;
          break;
        case BCGdatamatrix.Encoding.Base256:
          subText = '';
          do {
            subText += text[i];
            i++;
            nextMode = this.getSequenceLookAhead(text, i, currentMode);
          } while (text.length > i && nextMode === BCGdatamatrix.Encoding.Base256);

          let isFlush = false;
          if (i === c) {
            const finalCountWouldBe: number = this.data.length + this.getNumberOfBase256Codewords(subText);
            isFlush = this.symbols[this.getAccomodatedSymbolIndex(finalCountWouldBe)].getDataSize() - finalCountWouldBe === 0;
          }

          this.data = this.data.concat(this.parseBase256(subText, isFlush));

          currentMode = nextMode;
          i--;
          break;
      }

      this.accomodateSymbol(this.data.length);
    }

    // We have FNC1?
    if (this.fnc1 !== BCGdatamatrix.Fnc1.None) {
      let position = 0;
      if (this.fnc1 === BCGdatamatrix.Fnc1.AIM) {
        position = 1;
      }

      if (this.symbolNumber === 1) {
        position += 4;
      }

      if (this.symbolNumber === 0 || this.symbolNumber === 1) {
        this.data.splice(position, 0, 232);
        this.accomodateSymbol(this.data.length);
      }
    }

    // Did we finish the edifact last characters?
    if (edifactLastCharacters !== '') {
      c = this.data.length;

      // We remove the UNLATCH, we might not need it
      const finalText = Utility.safeSubstring(edifactLastCharacters, 0, -1);
      const finalTextLength = finalText.length;

      // If there is no more space, we might need a bigger symbol
      let remainingSize = this.symbols[this.currentSymbolIndex].getDataSize() - c;

      if (finalTextLength > remainingSize) {
        // They would be encoded in ASCII, get something bigger
        this.accomodateSymbol(c + finalTextLength);
        remainingSize = this.symbols[this.currentSymbolIndex].getDataSize() - c;
      }

      // Rare case where we have only 1 or 2 left, then we encode in ASCII
      // Otherwise we finish the edifact then we accomodate.
      if (finalTextLength !== 0) {
        if (remainingSize <= 2 && finalTextLength === 1) {
          this.data.push(finalText.charCodeAt(0) + 1);
        } else if (remainingSize === 2 && finalTextLength === 2) {
          this.data.push(finalText.charCodeAt(0) + 1);
          this.data.push(finalText.charCodeAt(1) + 1);
        } else {
          this.data = this.data.concat(this.encodeRawEdifact(edifactLastCharacters));
          this.accomodateSymbol(this.data.length);
        }
      } else if (finalTextLength === 0 && remainingSize > 2) {
        // We need to encode our unlatch since we have more space left.
        this.data = this.data.concat(this.encodeRawEdifact(edifactLastCharacters));
      }
    }

    // We need padding?
    c = this.data.length;
    const fullLength = this.symbols[this.currentSymbolIndex].getDataSize();
    if (fullLength - c > 0) {
      this.data.push(129);

      const morePad = fullLength - c - 1;
      if (morePad > 0) {
        const pad: number[] = [];
        for (let i = 0; i < morePad; i++) {
          pad[i] = 129;
        }

        this.data = this.data.concat(this.randomize253(pad, c + 2));
      }
    }

    return this.data;
  }

  /**
   * Returns the 4 codewords for Structured Append only if activated
   * Or return 1 codeword if the macro is activated
   */
  private getStructuredAppendOrMacroCodewords(): number[] {
    const codewords: number[] = [];
    if (this.symbolNumber > 0) {
      codewords.push(233);
      codewords.push(((this.symbolNumber - 1) << 4) | (17 - this.symbolTotal));
      codewords.push(Math.floor((this.symbolIdentification - 1) / 254) + 1);
      codewords.push(((this.symbolIdentification - 1) % 254) + 1);
    } else if (this.macro === BCGdatamatrix.Macro._05) {
      codewords.push(236);
    } else if (this.macro === BCGdatamatrix.Macro._06) {
      codewords.push(237);
    }

    return codewords;
  }

  /**
   * Parses Ascii.
   *
   * The method will try to optimize the code receive in argument to transfer
   * it into keywords.
   * The text value should be clean and all characters are supposed to be allowed.
   */
  private parseAscii(text: string): number[] {
    const c = text.length;

    const data: number[] = [];
    for (let i = 0; i < c; i++) {
      if (this.isCharFNC1(text, i)) {
        data.push(232);
        i++;
        continue;
      }

      const o = text.charCodeAt(i);

      // Do we have 2 numbers in a row?
      if (o >= 48 && o <= 57 && text.length > i + 1) {
        // We have the first number. Check second
        const o2 = text.charCodeAt(i + 1);
        if (o2 >= 48 && o2 <= 57) {
          const n1 = parseInt(text[i].toString() + text[i + 1].toString(), 10);
          data.push(n1 + 130);
          i++;
          continue;
        }
      }

      if (o <= 127) {
        data.push(o + 1);
      } else {
        data.push(235);
        data.push(o - 127);
      }
    }

    return data;
  }

  /**
   * Parses C40.
   *
   * The method will try to optimize the code receive in argument to transfer
   * it into keywords. C40 uses mostly capital letters.
   * The text value should be clean and all characters are supposed to be allowed.
   */
  private parseC40(text: string, last: boolean): number[] {
    let ret: number[] = [230];
    ret = ret.concat(this.parseC40AndText('C40', text, last));
    return ret;
  }

  /**
   * Parses Text.
   *
   * The method will try to optimize the code receive in argument to transfer
   * it into keywords. Text uses mostly lower case.
   * The text value should be clean and all characters are supposed to be allowed.
   */
  private parseText(text: string, last: boolean): number[] {
    let ret: number[] = [239];
    ret = ret.concat(this.parseC40AndText('TEXT', text, last));
    return ret;
  }

  /**
   * Parses X12.
   *
   * The method will transorm the text into keywords.
   * The text value should be clean and all characters are supposed to be allowed.
   */
  private parseX12(text: string, last: boolean): number[] {
    let currentChar: string = '\0';
    const code: number[] = [];

    const c = text.length;
    for (let i = 0; i < c; i++) {
      currentChar = text[i];

      // Search in X12
      const pos = this.X12.indexOf(currentChar);
      if (pos > -1) {
        code.push(pos);
      }
    }

    let ret: number[] = [238];
    ret = ret.concat(this.calculateX12C40Text(code, currentChar, true, last));
    return ret;
  }

  /**
   * Parses Edifact.
   *
   * The method will transform the text into keywords.
   * The text value should be clean and all characters are supposed to be allowed.
   * The last edifact characters are returned if they do not complete a full set of 4 codewords.
   */
  private parseEdifact(text: string, lastCharacters: string): { value: number[]; lastCharacters: string } {
    text += BCGdatamatrix.UNLATCH_EDIFACT;
    const textLength = text.length;
    const firstTextLength = Math.floor(textLength / 4) * 4;
    const firstText = text.substring(0, firstTextLength);
    lastCharacters = firstTextLength === textLength ? '' : text.substring(firstTextLength);

    let ret: number[] = [240];
    ret = ret.concat(this.encodeRawEdifact(firstText));
    return { value: ret, lastCharacters };
  }

  private encodeRawEdifact(text: string): number[] {
    let c = text.length;

    const edifact: number[] = [];
    for (let i = 0; i < c; i++) {
      const o = text.charCodeAt(i);
      edifact.push(o & 63);
    }

    const data: number[] = [];
    c = edifact.length;
    for (let i = 0; i < c; i += 4) {
      let s = edifact[i] * 262144;
      let nbData = 1;
      if (edifact.length > i + 1) {
        nbData = 2;
        s += edifact[i + 1] * 4096;
        if (edifact.length > i + 2) {
          nbData = 3;
          s += edifact[i + 2] * 64;
          if (edifact.length > i + 3) {
            nbData = 3; // Data 3
            s += edifact[i + 3];
          }
        }
      }

      data.push(Math.floor(s / 65536));

      if (nbData >= 2) {
        data.push(Math.floor((s % 65536) / 256));
        if (nbData >= 3) {
          data.push(s % 256);
        }
      }
    }

    return data;
  }

  private randomize253(input: number[], position: number): number[] {
    const c = input.length;
    for (let i = 0; i < c; i++) {
      const random = ((149 * (i + position)) % 253) + 1;
      input[i] = (input[i] + random) % 254;
    }

    return input;
  }

  private randomize255(input: number[], position: number): number[] {
    const c = input.length;
    for (let i = 0; i < c; i++) {
      const random = ((149 * (i + position)) % 255) + 1;
      input[i] = (input[i] + random) % 256;
    }

    return input;
  }

  private getNumberOfBase256Codewords(text: string): number {
    const textLength = text.length;
    const sections = Math.ceil(textLength / 1555.0);

    return 1 + textLength + sections + (sections - 1);
  }

  /**
   * Parses Base256.
   *
   * The method will transorm the text into keywords.
   * The text value should be clean and all characters are supposed to be allowed.
   */
  private parseBase256(text: string, fullFill: boolean): number[] {
    let data: number[] = [];
    const convert = Utility.stringSplit(text, 1555);

    const c = convert.length;
    for (let i = 0; i < c; i++) {
      const len = convert[i].length;

      const current: number[] = [];

      // Encodes the "Length"
      if (fullFill && i + 1 === c) {
        current.push(0);
      } else if (len < 250) {
        current.push(len);
      } else if (len >= 250) {
        current.push(Math.floor(len / 250) + 249);
        current.push(len % 250);
      }

      for (let j = 0; j < len; j++) {
        current.push(convert[i].charCodeAt(j));
      }

      // Encodes the data - 255-state algorithm
      const initialDataCount = this.data !== null ? this.data.length : 0;
      const randomized = this.randomize255(current, initialDataCount + data.length + 2);
      data.push(231);
      data = data.concat(randomized);
    }

    return data;
  }

  /**
   * Parses the text and returns the correct keywords depending
   * on the type
   *
   * @param type C40 or TEXT.
   * @param text The text.
   * @param last If it's the last char.
   */
  private parseC40AndText(type: string, text: string, last: boolean): number[] {
    const code: number[] = [];

    let currentChar: string = '\0';
    let isCurrentCharData = false;
    const c = text.length;
    for (let i = 0; i < c; i++) {
      isCurrentCharData = false;
      const isExtendedChar = false;
      currentChar = text[i];

      // FNC1 ?
      if (this.isCharFNC1(text, i)) {
        code.push(1); // Shift 1
        code.push(27); // FNC1
        i++;
        continue;
      }

      const o = text.charCodeAt(i);
      // Extended Char?
      if (o >= 128) {
        code.push(1); // Shift 1
        code.push(30); // Upper Shift
        currentChar = String.fromCharCode(o - 128);
      }

      // Search in BASE
      let temp: string = '';
      switch (type) {
        case 'C40':
          temp = this.BASE_C40;
          break;
        case 'TEXT':
          temp = this.BASE_TEXT;
          break;
      }

      let pos = temp.indexOf(currentChar);
      if (pos > -1) {
        isCurrentCharData = !isExtendedChar;
        code.push(pos + this.BASE_offset);
        continue;
      }

      // Search in SHIFT3
      switch (type) {
        case 'C40':
          temp = this.SHIFT3_C40;
          break;
        case 'TEXT':
          temp = this.SHIFT3_TEXT;
          break;
      }

      pos = temp.indexOf(currentChar);
      if (pos > -1) {
        code.push(2); // SHIFT3 Code
        code.push(pos);
        continue;
      }

      // Search in SHIFT2
      pos = this.SHIFT2.indexOf(currentChar);
      if (pos > -1) {
        code.push(1); // SHIFT2 Code
        code.push(pos);
        continue;
      }

      // Search in SHIFT1
      pos = this.SHIFT1.indexOf(currentChar);
      if (pos > -1) {
        code.push(0); // SHIFT1 Code
        code.push(pos);
        continue;
      }
    }

    return this.calculateX12C40Text(code, currentChar, isCurrentCharData, last);
  }

  /**
   * This method will pad the code Array to have a count
   * which can be divided by mod We will pad with padCode
   */
  private padWithCode(code: number[], mod: number, padCode: number): number[] {
    // Group by $mod
    const n = code.length % mod;
    if (n > 0) {
      const c = mod - n;
      for (let i = 0; i < c; i++) {
        code.push(padCode);
      }
    }

    return code;
  }

  private calculateX12C40TextEncoding(code: number[]): number[] {
    const data: number[] = [];
    const c = code.length;

    for (let i = 0; i < c; i += 3) {
      const c1 = code[i];
      const c2 = code.length > i + 1 ? code[i + 1] : 0;
      const c3 = code.length > i + 2 ? code[i + 2] : 0;
      const v = 1600 * c1 + 40 * c2 + c3 + 1;
      data.push(Math.floor(v / 256));
      data.push(v % 256);
    }

    return data;
  }

  /**
   * Creates the keywords for X12, C40, and TEXT mode.
   * count(code must be dividable by 3.
   */
  private calculateX12C40Text(code: number[], lastCharacter: string, isLastCharacterData: boolean, last: boolean): number[] {
    // We will take care of the last 1, 2, or 3 $code separately
    const nbCodeBeforePadding = code.length;
    code = this.padWithCode(code, 3, 0);
    const nbCodeAfterPadding = code.length;

    let p = Math.max(0, code.length - 3);
    let temp = code.slice(0, p);
    code = code.slice(p, code.length);
    let data = this.calculateX12C40TextEncoding(temp);

    // +1 for the latch
    const initialDataCount = this.data !== null ? this.data.length : 0;
    const requiredCodewords = initialDataCount + data.length + 1;
    this.accomodateSymbol(requiredCodewords);

    let remainingCodewords = this.symbols[this.currentSymbolIndex].getDataSize() - requiredCodewords;

    // If we filled completely, it won't be possible to add the last code if we have any
    if (remainingCodewords === 0 && nbCodeAfterPadding - nbCodeBeforePadding > 0) {
      this.accomodateSymbol(requiredCodewords + 1);
      remainingCodewords = this.symbols[this.currentSymbolIndex].getDataSize() - requiredCodewords;
    }

    let unlatch = true;
    let normalEncoding = true;
    const nbCodeWasRemaining = 3 - (nbCodeAfterPadding - nbCodeBeforePadding);

    if (last) {
      if (remainingCodewords === 2) {
        switch (nbCodeWasRemaining) {
          case 3: // Option A
            unlatch = false;
            break;
          case 2: // Option B
            if (isLastCharacterData) {
              unlatch = false;
            }

            break;
        }
      } else if (remainingCodewords === 1) {
        // Option D
        if (nbCodeWasRemaining === 1 && isLastCharacterData) {
          unlatch = false;
          normalEncoding = false;
        }
      }
    }

    // Option C
    // Can happen at any time but not when option D has been selected
    if (nbCodeWasRemaining === 1 && unlatch === true && isLastCharacterData) {
      normalEncoding = false;
    }

    if (normalEncoding) {
      p = Math.max(0, code.length - 3);
      temp = code.slice(p, code.length);
      data = data.concat(this.calculateX12C40TextEncoding(temp));
    }

    if (unlatch) {
      data.push(254);
    }

    if (!normalEncoding) {
      data = data.concat(this.parseAscii(lastCharacter));
    }

    this.accomodateSymbol(initialDataCount + data.length + 1);

    return data;
  }

  /**
   * Reed Solomon.
   */
  private static reedSolomon(wd: { [key: number]: number }, nd: number, nc: number, gf: number, pp: number): number[] {
    const log: number[] = [];
    const alog: number[] = [];

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

    const c: number[] = [];

    for (let i = 0; i < nc + 1; i++) {
      c[i] = 0;
    }

    c[0] = 1;

    for (let i = 1; i < nc + 1; i++) {
      c[i] = c[i - 1];
      for (let j = i - 1; j >= 1; j--) {
        c[j] = c[j - 1] ^ BCGdatamatrix.prod(c[j], alog[i], log, alog);
      }

      c[0] = BCGdatamatrix.prod(c[0], alog[i], log, alog);
    }

    const t = nd + nc;
    for (let i = nd; i <= t; i++) {
      wd[i] = 0;
    }

    for (let i = 0; i < nd; i++) {
      const k = wd[nd] ^ wd[i];
      for (let j = 0; j < nc; j++) {
        wd[nd + j] = wd[nd + j + 1] ^ BCGdatamatrix.prod(k, c[nc - j - 1], log, alog);
      }
    }

    const r: number[] = [];
    for (let i = nd; i < t; i++) {
      r[i - nd] = wd[i];
    }

    return r;
  }

  /**
   * Products x times y in array.
   */
  private static prod(x: number, y: number, log: number[], alog: number[]): number {
    if (x === 0 || y === 0) {
      return 0;
    } else {
      return alog[(log[x] + log[y]) % (BCGdatamatrix._GF - 1)];
    }
  }

  /**
   * Creates the reed solomon error and do the interleaved if needed to be done.
   * The nextMoreBlock is used for only one special case: 144x144.
   */
  private static getFinalError(data: number[], nbBlock: number, nbData: number, nbError: number, nextMoreBlock: number = 0): number[] {
    const finalError: number[] = [];
    for (let i = 0; i < nbBlock + nextMoreBlock; i++) {
      let nbDataFinal = nbData;

      if (i >= nbBlock) {
        nbDataFinal--;
      }

      const finalData: { [key: number]: number } = {};
      for (let j = 0; j < nbDataFinal; j++) {
        finalData[j] = data[i + j * (nbBlock + nextMoreBlock)];
      }

      const error = BCGdatamatrix.reedSolomon(finalData, nbDataFinal, nbError, BCGdatamatrix._GF, BCGdatamatrix._MODULUS);
      for (let j = 0; j < nbError; j++) {
        finalError[i + j * (nbBlock + nextMoreBlock)] = error[j];
      }
    }

    ////ksort(finalError);

    return finalError;
  }
}

class BCGdatamatrixSequenceSort {
  static sort(
    count: {
      [encoding: number /* BCGdatamatrix.Encoding */]: number;
    },
    keyOrder: BCGdatamatrix.Encoding[]
  ): { key: BCGdatamatrix.Encoding; value: number }[] {
    const unsortedCount: { key: BCGdatamatrix.Encoding; value: number }[] = Object.keys(count).map(k => ({ key: +k, value: count[+k] }));
    return unsortedCount.sort((a, b) => {
      const v1 = a.value;
      const v2 = b.value;

      if (v1 < v2) {
        return -1;
      } else if (v1 > v2) {
        return 1;
      } else {
        if (a.key === b.key) {
          return 0;
        } else {
          return keyOrder.indexOf(a.key) < keyOrder.indexOf(b.key) ? -1 : 1;
        }
      }

      return -1;
    });
  }
}

abstract class BCGdatamatrixInfo {
  public block1: number = 0;

  constructor(
    public row: number,
    public col: number,
    public region: number,
    public data: number,
    public error: number,
    public block: number
  ) {}

  getDataSize(): number {
    return this.data * this.block;
  }

  getMappingSize(): number[] {
    const minus = Math.sqrt(this.region) * 2;
    return [Math.floor(this.row - minus), Math.floor(this.col - minus)];
  }
}

class BCGdatamatrixInfoSquare extends BCGdatamatrixInfo {
  constructor(row: number, region: number, data: number, error: number, block: number) {
    super(row, row, region, data, error, block);
  }
}

class BCGdatamatrixInfoSquareArray extends BCGdatamatrixInfo {
  public data1: number;
  public error1: number; // Not used in our software.

  constructor(row: number, region: number, data: number[], error: number[], block: number[]) {
    super(row, row, region, data[0], error[0], block[0]);
    this.data1 = data[1];
    this.error1 = error[1];
    this.block1 = block[1];
  }

  getDataSize(): number {
    return this.data * this.block + this.data1 * this.block1;
  }
}

class BCGdatamatrixInfoRectangle extends BCGdatamatrixInfo {
  constructor(row: number, col: number, region: number, data: number, error: number, block: number) {
    super(row, col, region, data, error, block);
  }

  getMappingSize(): number[] {
    if (this.region === 1) {
      return super.getMappingSize();
    } else {
      return [this.row - 2, this.col - 4];
    }
  }
}

/**
 * Calculates and creates the matrix for display.
 */
class BCGdatamatrixPlacement {
  private arr: number[] = null!; // !Assigned immediately in the method

  /**
   * Checks for valid command line entries, then computes &amp; displays array.
   */
  constructor(
    private readonly nrow: number,
    private readonly ncol: number
  ) {}

  /**
   * Creates the $matrix with the real value passed as data
   */
  getMatrix(data: number[]): boolean[][] {
    const matrix: boolean[][] = [];
    if (this.nrow >= 6 && this.ncol >= 6) {
      this.arr = [];
      this.ecc200();
      let x: number;
      for (x = 0; x < this.nrow; x++) {
        matrix[x] = [];
        let y: number;
        for (y = 0; y < this.ncol; y++) {
          const z = this.arr[x * this.ncol + y];

          if (z === 0) {
            matrix[x][y] = false;
          } else if (z === 1) {
            matrix[x][y] = true;
          } else {
            const i = Math.floor(z / 10) - 1;
            const b = z % 10;

            matrix[x][y] = (data[i] & (0x1 << (8 - b))) > 0;
          }
        }
      }
    }

    return matrix;
  }

  /**
   * Places "chrbit with appropriate wrapping within arr[].
   */
  private module(row: number, col: number, chr: number, bit: number): void {
    if (row < 0) {
      row += this.nrow;
      col += 4 - ((this.nrow + 4) % 8);
    }

    if (col < 0) {
      col += this.ncol;
      row += 4 - ((this.ncol + 4) % 8);
    }

    this.arr[row * this.ncol + col] = 10 * chr + bit;
  }

  /**
   * Places the 8 bits of a utah-shaped symbol character in ECC200.
   */
  private utah(row: number, col: number, chr: number): void {
    this.module(row - 2, col - 2, chr, 1);
    this.module(row - 2, col - 1, chr, 2);
    this.module(row - 1, col - 2, chr, 3);
    this.module(row - 1, col - 1, chr, 4);
    this.module(row - 1, col, chr, 5);
    this.module(row, col - 2, chr, 6);
    this.module(row, col - 1, chr, 7);
    this.module(row, col, chr, 8);
  }

  /// Corner 1.
  /**
   * Places 8 bits of the four special corner cases in ECC200.
   */
  private corner1(chr: number): void {
    this.module(this.nrow - 1, 0, chr, 1);
    this.module(this.nrow - 1, 1, chr, 2);
    this.module(this.nrow - 1, 2, chr, 3);
    this.module(0, this.ncol - 2, chr, 4);
    this.module(0, this.ncol - 1, chr, 5);
    this.module(1, this.ncol - 1, chr, 6);
    this.module(2, this.ncol - 1, chr, 7);
    this.module(3, this.ncol - 1, chr, 8);
  }

  /// Corner 2.
  /**
   * Places 8 bits of the four special corner cases in ECC200.
   */
  private corner2(chr: number): void {
    this.module(this.nrow - 3, 0, chr, 1);
    this.module(this.nrow - 2, 0, chr, 2);
    this.module(this.nrow - 1, 0, chr, 3);
    this.module(0, this.ncol - 4, chr, 4);
    this.module(0, this.ncol - 3, chr, 5);
    this.module(0, this.ncol - 2, chr, 6);
    this.module(0, this.ncol - 1, chr, 7);
    this.module(1, this.ncol - 1, chr, 8);
  }

  /// Corner 3.
  /**
   * Places 8 bits of the four special corner cases in ECC200.
   */
  private corner3(chr: number): void {
    this.module(this.nrow - 3, 0, chr, 1);
    this.module(this.nrow - 2, 0, chr, 2);
    this.module(this.nrow - 1, 0, chr, 3);
    this.module(0, this.ncol - 2, chr, 4);
    this.module(0, this.ncol - 1, chr, 5);
    this.module(1, this.ncol - 1, chr, 6);
    this.module(2, this.ncol - 1, chr, 7);
    this.module(3, this.ncol - 1, chr, 8);
  }

  /// Corner 4.
  /**
   * Places 8 bits of the four special corner cases in ECC200.
   */
  private corner4(chr: number): void {
    this.module(this.nrow - 1, 0, chr, 1);
    this.module(this.nrow - 1, this.ncol - 1, chr, 2);
    this.module(0, this.ncol - 3, chr, 3);
    this.module(0, this.ncol - 2, chr, 4);
    this.module(0, this.ncol - 1, chr, 5);
    this.module(1, this.ncol - 3, chr, 6);
    this.module(1, this.ncol - 2, chr, 7);
    this.module(1, this.ncol - 1, chr, 8);
  }

  /**
   * Fills an nrow x ncol array with appropriate values for ECC200.
   */
  private ecc200(): void {
    let row: number;
    let col: number;
    /* First, fill the arr[] with invalid entries */
    for (row = 0; row < this.nrow; row++) {
      for (col = 0; col < this.ncol; col++) {
        this.arr[row * this.ncol + col] = 0;
      }
    }

    /* Starting in the correct location for character #1, bit 8,... */
    let chr = 1;
    row = 4;
    col = 0;
    do {
      /* repeatedly first check for one of the special corner cases, then... */
      if (row === this.nrow && col === 0) {
        this.corner1(chr++);
      }
      if (row === this.nrow - 2 && col === 0 && this.ncol % 4 > 0) {
        this.corner2(chr++);
      }
      if (row === this.nrow - 2 && col === 0 && this.ncol % 8 === 4) {
        this.corner3(chr++);
      }
      if (row === this.nrow + 4 && col === 2 && !(this.ncol % 8 > 0)) {
        this.corner4(chr++);
      }

      /* sweep upward diagonally, inserting successive characters,... */
      do {
        if (row < this.nrow && col >= 0 && this.arr[row * this.ncol + col] === 0) {
          this.utah(row, col, chr++);
        }

        row -= 2;
        col += 2;
      } while (row >= 0 && col < this.ncol);
      row += 1;
      col += 3;

      /* & then sweep downward diagonally, inserting successive characters,... */
      do {
        if (row >= 0 && col < this.ncol && this.arr[row * this.ncol + col] === 0) {
          this.utah(row, col, chr++);
        }

        row += 2;
        col -= 2;
      } while (row < this.nrow && col >= 0);
      row += 3;
      col += 1;

      /* ... until the entire array is scanned */
    } while (row < this.nrow || col < this.ncol);

    /* Lastly, if the lower righthand corner is untouched, fill in fixed pattern */
    if (this.arr[this.nrow * this.ncol - 1] === 0) {
      this.arr[this.nrow * this.ncol - 1] = this.arr[this.nrow * this.ncol - this.ncol - 2] = 1;
    }
  }
}

namespace BCGdatamatrix {
  /**
   * The size type.
   */
  export enum Size {
    /**
     * The code will be the smallest possible.
     */
    Smallest,

    /**
     * The code will be a square.
     */
    Square,

    /**
     * The code will be a rectangle.
     */
    Rectangle
  }

  /**
   * The Encoding.
   */
  export enum Encoding {
    /**
     * No specific encoding is selected.
     */
    Unknown,

    /**
     * ASCII and extended ASCII (low compression).
     * Remarks: ASCII, (0-127)=1byte, (128-255)=0.5byte, (numbers)=2bytes per keyword
     */
    Ascii,

    /**
     * C40 encoding (capital letters).
     * Remarks: Capital letters, 1.5byte per keyword
     */
    C40,

    /**
     * TEXT encoding (lowercase letters).
     * Remarks: Lower Case, 1.5byte per keyword
     */
    Text,

    /**
     * X12 encoding (capital letters and numbers).
     * Remarks: ANSI X12, 1.5byte per keyword
     */
    X12,

    /**
     * Edifact encoding.
     * Remarks: ASCII 32-94, 1.33byte per keyword
     */
    Edifact,

    /**
     * Binary encoding.
     * Remarks: ASCII 0-255, 1byte per keyword
     */
    Base256
  }

  /**
   * The FNC1.
   */
  export enum Fnc1 {
    /**
     * The code will not follow any standards.
     */
    None,

    /**
     * The code will follow the GS1 standard. Separate GS1 identifiers by ~F. Don't forget to turn on setTilde(true).
     */
    GS1,

    /**
     * The code will follow the AIM standard.
     */
    AIM
  }

  /**
   * The Macro code.
   */
  export enum Macro {
    /**
     * Your data will appear raw. No prefix or suffix.
     */
    None,

    /**
     * Prefix: [)>RS05GS - Suffix: RSEoT
     */
    _05,

    /**
     * Prefix: [)>RS06GS - Suffix: RSEoT
     */
    _06
  }
}

export { BCGdatamatrix };
