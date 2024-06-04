'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException, BCGBarcode, BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Databar Expanded (formely RSS Expanded) barcode.
 */
class BCGdatabarexpanded extends BCGBarcode1D {
  private linkageFlag: boolean = false;
  private readonly characteristics: BCGdatabarexpandedCharacteristics;
  private stackedRow: number = 1;
  private finalBars: number[][] | null = null;
  private nbSymbols: number = 0;
  private static readonly weights: number[][] = [
    [1, 3, 9, 27, 81, 32, 96, 77],
    [20, 60, 180, 118, 143, 7, 21, 63],
    [189, 145, 13, 39, 117, 140, 209, 205],
    [193, 157, 49, 147, 19, 57, 171, 91],
    [62, 186, 136, 197, 169, 85, 44, 132],
    [185, 133, 188, 142, 4, 12, 36, 108],
    [113, 128, 173, 97, 80, 29, 87, 50],
    [150, 28, 84, 41, 123, 158, 52, 156],
    [46, 138, 203, 187, 139, 206, 196, 166],
    [76, 17, 51, 153, 37, 111, 122, 155],
    [43, 129, 176, 106, 107, 110, 119, 146],
    [16, 48, 144, 10, 30, 90, 59, 177],
    [109, 116, 137, 200, 178, 112, 125, 164],
    [70, 210, 208, 202, 184, 130, 179, 115],
    [134, 191, 151, 31, 93, 68, 204, 190],
    [148, 22, 66, 198, 172, 94, 71, 2],
    [6, 18, 54, 162, 64, 192, 154, 40],
    [120, 149, 25, 75, 14, 42, 126, 167],
    [79, 26, 78, 23, 69, 207, 199, 175],
    [103, 98, 83, 38, 114, 131, 182, 124],
    [161, 61, 183, 127, 170, 88, 53, 159],
    [55, 165, 73, 8, 24, 72, 5, 15],
    [45, 135, 194, 160, 58, 174, 100, 89]
  ];

  private static readonly finderPattern: number[][] = [
    [1, 8, 4, 1, 1], // A1
    [1, 1, 4, 8, 1], // A2
    [3, 6, 4, 1, 1], // B1
    [1, 1, 4, 6, 3], // B2
    [3, 4, 6, 1, 1], // C1
    [1, 1, 6, 4, 3], // C2
    [3, 2, 8, 1, 1], // D1
    [1, 1, 8, 2, 3], // D2
    [2, 6, 5, 1, 1], // E1
    [1, 1, 5, 6, 2], // E2
    [2, 2, 9, 1, 1], // F1
    [1, 1, 9, 2, 2] // F2
  ];

  private static readonly finderPatternOrder: number[][] = [
    [0, 1],
    [0, 3, 2],
    [0, 5, 2, 7],
    [0, 9, 2, 7, 4],
    [0, 9, 2, 7, 6, 11],
    [0, 9, 2, 7, 8, 11, 10],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 9, 8],
    [0, 1, 2, 3, 4, 5, 6, 9, 10, 11],
    [0, 1, 2, 3, 4, 7, 6, 9, 8, 11, 10]
  ];

  /**
   * Creates a Databar Expanded barcode.
   */
  constructor() {
    super();
    this.setThickness(34);
    this.characteristics = new BCGdatabarexpandedCharacteristics();
  }

  /**
   * Sets the linkage flag.
   *
   * @param linkageFlag The linkage flag.
   */
  setLinkageFlag(linkageFlag: boolean): void {
    this.linkageFlag = linkageFlag;
  }

  /**
   * Gets the linkage flag.
   *
   * @return The linkage flag.
   */
  getLinkageFlag(): boolean {
    return this.linkageFlag;
  }

  /**
   * Sets the number of row required.
   *
   * @param stackedRow The amount of stacked rows.
   */
  setStacked(stackedRow: number): void {
    if (stackedRow > 11 || stackedRow < 1) {
      throw new BCGArgumentException('The number of stacked row must be between 1 and 11.', 'stackedRow');
    }

    this.stackedRow = stackedRow;
  }

  /**
   * Gets the number of desired rows.
   *
   * @return The amount of stacked rows.
   */
  getStacked(): number {
    return this.stackedRow;
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    let c = text.length;
    if (c === 0) {
      throw new BCGParseException('databarexpanded', 'Provide data to parse.');
    }

    this.finalBars = null;

    let data = this.prepareText(text);
    let encoder = this.findEncoder(data);
    if (encoder !== null) {
      encoder.setLinkageFlag(this.linkageFlag);
      encoder.setStacked(this.stackedRow);
      let values = encoder.encode();
      let datawidths = this.findElementDataWidths(values);
      let checksum = this.calculateChecksumValue(datawidths);
      let checksumWidths = this.findElementDataWidths([checksum]);
      checksumWidths = checksumWidths.concat(datawidths);
      let finalCharacter = checksumWidths;

      this.nbSymbols = finalCharacter.length;
      if (
        this.nbSymbols !== Utility.arraySum(BCGdatabarexpandedUtility.getSymbolsPerRow(this.nbSymbols, this.stackedRow, this.linkageFlag))
      ) {
        throw new BCGParseException('databarexpanded', 'The encoder used cannot be spread across that amount of lines.');
      }

      this.finalBars = this.getFinalWidths(finalCharacter);
    } else {
      throw new BCGParseException('databarexpanded', 'No encoder can be found.');
    }

    super.parse(text);
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    if (this.finalBars === null) {
      throw new Error();
    }

    let previousOffsetY = this.offsetY;

    let symbolsPerRow = BCGdatabarexpandedUtility.getSymbolsPerRow(this.nbSymbols, this.stackedRow, this.linkageFlag);

    // Table 17
    let reverseEven = (symbolsPerRow[0] / 2) % 2 === 0;

    let c = symbolsPerRow.length;
    let maxPositionX = 0;
    let offset = 0;
    let startingPositionX = 0;
    let startBar = false;
    for (let i = 0; i < c; i++) {
      let finderPatternInRow = Math.ceil(symbolsPerRow[i] / 2.0);
      let length = symbolsPerRow[i] + finderPatternInRow;
      let dataRow = this.finalBars.slice(offset, offset + length);

      let reverseRow = reverseEven && i % 2 === 1;
      let lastRow = i === c - 1;

      // Reversal exception
      if (reverseRow && lastRow && finderPatternInRow % 2 === 1) {
        reverseRow = false;
        startingPositionX = 1; // Push by 1
      }

      ({ startBar } = this.drawRow(image, dataRow, i, startBar, reverseRow, lastRow, startingPositionX));
      maxPositionX = Math.max(maxPositionX, this.positionX);

      offset += length;
    }

    this.offsetY = previousOffsetY;

    this.drawMiddleSeparators(
      image,
      symbolsPerRow[0] * 17 + Math.floor(symbolsPerRow[0] / 2.0) * 15,
      startingPositionX + symbolsPerRow[c - 1] * 17 + Math.floor(symbolsPerRow[c - 1] / 2.0) * 15,
      c
    );
    this.drawText(image, 0, 0, maxPositionX, this.thickness * c + 3 * (c - 1));
  }

  /**
   * Returns the maximal size of a barcode.
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number): [number, number] {
    let symbolsPerRow = BCGdatabarexpandedUtility.getSymbolsPerRow(this.nbSymbols, this.stackedRow, this.linkageFlag);
    let rows = symbolsPerRow.length;
    let symbolsRow1 = symbolsPerRow[0];

    let leftGuard = 2;
    let rightGuard = 2;
    let columnWidth = 17 * symbolsRow1 + 15 * Math.ceil(symbolsRow1 / 2.0);

    let rowsHeight = this.thickness * rows;
    let separatorHeight = 3 * (rows - 1);

    width += leftGuard + rightGuard + columnWidth;
    height += rowsHeight + separatorHeight;
    return super.getDimension(width, height);
  }

  /**
   * Draws all chars thanks to code. if startBar is true, the line begins by a space.
   * If startBar is false, the line begins by a bar.
   *
   * @param image The surface.
   * @param code The code.
   * @param startBar Indicates starting with a bar.
   * @param reversed Indicates if reversed.
   * @param drawSeparator Flag, 0: no draw; 1: draw under; 2: draw above; 3: draw both.
   * @param finderPatternVersion 0: not finder pattern, 1: version 1, 2: version 2
   */
  protected drawChar(
    image: draw.Surface,
    code: string,
    startBar: boolean = true,
    reversed: boolean = false,
    drawSeparator: number = 0x0,
    finderPatternVersion: number = 0
  ): void {
    let colors: number[] = [BCGBarcode.COLOR_FG, BCGBarcode.COLOR_BG];
    let currentColor = startBar ? 0 : 1;

    let c = code.length;
    for (let i = 0; i < c; i++) {
      let finderPatternCounter = reversed ? 0 : 1;
      let separatorColor = colors[(currentColor + 1) % 2];

      let c2 = parseInt(code[i], 10);
      for (let j = 0; j < c2; j++) {
        this.drawSingleBar(image, colors[currentColor]);

        if ((drawSeparator & 0x3) >= 1) {
          if ((finderPatternVersion === 1 && i >= 0 && i <= 2) || (finderPatternVersion === 2 && i >= 2 && i <= 4)) {
            // Counter only when finderPatternVersion is activated and WHITE
            if (currentColor === 1) {
              separatorColor = colors[++finderPatternCounter % 2];
            }
          }

          if ((drawSeparator & 0x1) === 0x1) {
            this.drawPixel(image, this.positionX, this.thickness, separatorColor);
          }

          if ((drawSeparator & 0x2) === 0x2) {
            this.drawPixel(image, this.positionX, -1, separatorColor);
          }
        }

        this.nextX();
      }

      currentColor = (currentColor + 1) % 2;
    }
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    // Nothing to validate here
    super.validate();
  }

  private drawRow(
    image: draw.Surface,
    dataRow: number[][],
    row: number,
    startBar: boolean,
    reversed: boolean,
    lastRow: boolean,
    startingPositionX: number
  ): { startBar: boolean } {
    this.positionX = startingPositionX;
    this.setOffsetY(row * this.thickness + row * 3);

    // Left Guard
    this.drawChar(image, '11', reversed ? !startBar : startBar);

    // Reverse the dataRow if reversed
    if (reversed) {
      dataRow.reverse();
      for (let data of dataRow) {
        data.reverse();
      }
    }

    // Flag for separator position
    let separatorPosition = 0;
    if (!lastRow) {
      separatorPosition |= 0x1;
    }

    if (row > 0) {
      separatorPosition |= 0x2;
    }

    // Finder pattern will always start with a version 1 for each row
    let finderPatternVersionCounter = 0;
    let counter = startBar ? 1 : 0;
    counter = reversed ? counter - 1 : counter;
    let c = dataRow.length;
    for (let i = 0; i < c; i++) {
      let code = BCGdatabarexpandedUtility.arrayFlatten(dataRow[i].map(j => j.toString()));

      let finderPatternVersion = -1;

      // Finder Pattern
      if (code.length === 5) {
        finderPatternVersion = finderPatternVersionCounter;
        finderPatternVersionCounter = (finderPatternVersionCounter + 1) % 2;
      }

      this.drawChar(image, code, counter % 2 !== 0, reversed, separatorPosition, finderPatternVersion + 1);
      counter += code.length;
    }

    this.drawChar(image, '11', counter % 2 !== 0);
    counter = reversed ? counter - 1 : counter;
    startBar = counter % 2 !== 0;

    return { startBar };
  }

  private drawMiddleSeparators(image: draw.Surface, width: number, widthLastRow: number, rows: number): void {
    let colors: number[] = [BCGBarcode.COLOR_FG, BCGBarcode.COLOR_BG];

    // Finish by drawing the middle separators
    for (let i = 1; i < rows; i++) {
      let thicknessRowPosition = i * this.thickness + (i - 1) * 3;
      for (let j = 4; j < width; j++) {
        this.drawPixel(image, j, thicknessRowPosition + 1, colors[(j + 1) % 2]);
      }

      // Beginning
      this.drawPixel(image, 2, thicknessRowPosition, colors[1]);
      this.drawPixel(image, 3, thicknessRowPosition, colors[1]);
      this.drawPixel(image, 2, thicknessRowPosition + 2, colors[1]);
      this.drawPixel(image, 3, thicknessRowPosition + 2, colors[1]);

      let currentWidth = width;
      if (i === rows - 1) {
        currentWidth = widthLastRow;
      }

      // End
      this.drawPixel(image, width, thicknessRowPosition, colors[1]);
      this.drawPixel(image, width + 1, thicknessRowPosition, colors[1]);
      this.drawPixel(image, currentWidth, thicknessRowPosition + 2, colors[1]);
      this.drawPixel(image, currentWidth + 1, thicknessRowPosition + 2, colors[1]);
    }
  }

  private getFinalWidths(finalCharacter: number[][]): number[][] {
    let finalBars: number[][] = [];
    let c = finalCharacter.length;
    let finderPatternSequence = this.getFinderPatternSequence(c);
    let loop = Math.ceil(c / 2.0);
    for (let i = 0; i < loop; i++) {
      finalBars.push(finalCharacter[i * 2]);
      finalBars.push(BCGdatabarexpanded.finderPattern[finderPatternSequence[i]]);
      if (i * 2 + 1 < c) {
        let temp = finalCharacter[i * 2 + 1].slice(0);
        temp.reverse();
        finalBars.push(temp);
      }
    }

    return finalBars;
  }

  private getFinderPatternSequence(nbOfSegments: number): number[] {
    if (nbOfSegments >= 4 && nbOfSegments <= 22) {
      return BCGdatabarexpanded.finderPatternOrder[Math.floor((nbOfSegments - 3) / 2)];
    } else {
      throw new BCGParseException('databarexpanded', 'Too many segments.');
    }
  }

  private getElementWeightIndex(finderPatternSequence: number[], currentSegment: number): number {
    if (currentSegment <= 0 || currentSegment >= 23) {
      return -1;
    }

    let patternIndex = Math.floor(currentSegment / 2);
    if (patternIndex < finderPatternSequence.length) {
      return finderPatternSequence[patternIndex] * 2 + (currentSegment % 2) - 1;
    } else {
      return -1;
    }
  }

  private calculateChecksumValue(widths: number[][]): number {
    let counter = 0;
    let c = widths.length;
    let finderPatternSequence = this.getFinderPatternSequence(c + 1);
    for (let i = 0; i < c; i++) {
      let c2 = widths[i].length;
      for (let j = 0; j < c2; j++) {
        let row = this.getElementWeightIndex(finderPatternSequence, i + 1);
        counter += widths[i][j] * BCGdatabarexpanded.weights[row][j];
      }
    }

    return 211 * (c + 1 - 4) + (counter % 211);
  }

  private findElementDataWidths(values: number[]): number[][] {
    let widths: number[][] = [];
    let c = values.length;
    for (let i = 0; i < c; i++) {
      widths.push(this.characteristics.getElementWidths(values[i]));
    }

    return widths;
  }

  private prepareText(text: string): BCGrsscommonCode[] {
    // We don't need to validate everything, but simply find if it starts with 01, and has the other special AI
    let data: BCGrsscommonCode[] = [];
    let pos = 0;
    if (text.substr(0, 2) === '01') {
      data.push(new BCGrsscommonCode('01', text.substr(2, 14)));
      pos = 16;
      let temp = text.substr(16, 3);
      if (temp === '310' || temp === '320') {
        data.push(new BCGrsscommonCode(text.substr(16, 4), text.substr(20, 6)));
        pos = 26;
        temp = text.substr(26, 2);
        if (temp === '11' || temp === '13' || temp === '15' || temp === '17') {
          data.push(new BCGrsscommonCode(temp, text.substr(28, 6)));
          pos = 34;
        }
      } else if (temp === '392' || temp === '393') {
        let final = text.substr(20);
        data.push(new BCGrsscommonCode(text.substr(16, 4), final));
        pos = 20 + final.length;
      }
    }

    if (pos < text.length) {
      // Putting at least 1 value in the first array
      data.push(new BCGrsscommonCode(text.substr(pos, 1), text.substr(pos + 1)));
    }

    return data;
  }

  private findEncoder(data: BCGrsscommonCode[]): BCGdatabarexpandedEncoder | null {
    let encoders = [
      new BCGdatabarexpandedCompressedEncoderWeightItemKG(data),
      new BCGdatabarexpandedCompressedEncoderWeightItemLB(data),
      new BCGdatabarexpandedCompressedEncoderWeightItemDate(data),
      new BCGdatabarexpandedCompressedEncoderMeasureItemPrice(data),
      new BCGdatabarexpandedCompressedEncoderMeasureItemPriceCurrency(data),
      new BCGdatabarexpandedCompressedEncoderGeneralItem(data),
      new BCGdatabarexpandedGeneralPurposeEncoder(data)
    ];

    for (let encoder of encoders) {
      if (encoder.canEncode()) {
        return encoder;
      }
    }

    return null;
  }
}

class BCGrsscommonBarWidth {
  /**
   * Returns the number of combinaison of r selected from n
   * Combinations = n! / ((n - r)! * r!)
   */
  static combins(n: number, r: number): number {
    let maxDenom: number;
    let minDenom: number;
    if (n - r > r) {
      minDenom = r;
      maxDenom = n - r;
    } else {
      minDenom = n - r;
      maxDenom = r;
    }

    let val = 1;
    let j = 1;
    for (let i = n; i > maxDenom; i--) {
      val *= i;
      if (j <= minDenom) {
        val /= j;
        j++;
      }
    }

    for (; j <= minDenom; j++) {
      val /= j;
    }

    return val;
  }

  /**
   * Routine to generate widths for RSS elements for a given value.
   *
   * @param val Required value.
   * @param n Number of modules.
   * @param elements Elements in set(RSS-14 &amp; Expanded = 4; RSS Limited = 7)
   * @param maxWidth Maximum module width of an element.
   * @param noNarrow false will skip patterns without a one module wide element.
   */
  static getRSSWidths(val: number, n: number, elements: number, maxWidth: number, noNarrow: boolean): number[] {
    let widths: number[] = [];
    let narrowMask = 0;
    for (let bar = 0; bar < elements - 1; bar++) {
      let elmWidth = 1;
      narrowMask |= 1 << bar;
      let subVal: number;
      for (; ; /* EMPTY */ elmWidth++, narrowMask &= ~(1 << bar)) {
        // get all combinations
        subVal = BCGrsscommonBarWidth.combins(n - elmWidth - 1, elements - bar - 2);

        // less combinations with no narrow
        if (!noNarrow && narrowMask === 0 && n - elmWidth - (elements - bar - 1) >= elements - bar - 1) {
          subVal -= BCGrsscommonBarWidth.combins(n - elmWidth - (elements - bar), elements - bar - 2);
        }

        // less combinations with elements > maxVal
        if (elements - bar - 1 > 1) {
          let lessVal = 0;
          for (let mxwElement = n - elmWidth - (elements - bar - 2); mxwElement > maxWidth; mxwElement--) {
            lessVal += BCGrsscommonBarWidth.combins(n - elmWidth - mxwElement - 1, elements - bar - 3);
          }

          subVal -= lessVal * (elements - 1 - bar);
        } else if (n - elmWidth > maxWidth) {
          subVal--;
        }

        val -= subVal;
        if (val < 0) {
          break;
        }
      }

      val += subVal;
      n -= elmWidth;
      widths.push(elmWidth);
    }

    widths.push(n);
    return widths;
  }
}

class BCGrsscommonCharacteristic {
  public gSum: number;

  constructor(
    public minValueRange: number,
    public maxValueRange: number,
    public subsetModulesOdd: number,
    public subsetModulesEven: number,
    public widestElementsOdd: number,
    public widestElementsEven: number,
    public tOdd: number,
    public tEven: number
  ) {
    this.gSum = minValueRange;
  }
}

class BCGdatabarexpandedCharacteristicsBase {
  protected characteristicList: { [key: string]: BCGrsscommonCharacteristic[] } = {};

  constructor() {}

  protected addCharacteristics(
    characterStructure: BCGdatabarexpandedCharacterStructure,
    characteristicList: BCGrsscommonCharacteristic[]
  ): void {
    this.characteristicList[characterStructure.toString()] = characteristicList;
  }

  protected findElementWidths(value: number, characterStructure: BCGdatabarexpandedCharacterStructure): number[] {
    // Find the right characteristic
    let characteristic = this.findCharacteristic(value, characterStructure);
    if (characteristic === null) {
      throw new Error('Characteristic not found.');
    }

    let vOdd = Math.floor((value - characteristic.gSum) / characteristic.tEven);
    let vEven = (value - characteristic.gSum) % characteristic.tEven;

    let widthOdd = BCGrsscommonBarWidth.getRSSWidths(
      vOdd,
      characteristic.subsetModulesOdd,
      characterStructure.k,
      characteristic.widestElementsOdd,
      false
    );
    let widthEven = BCGrsscommonBarWidth.getRSSWidths(
      vEven,
      characteristic.subsetModulesEven,
      characterStructure.k,
      characteristic.widestElementsEven,
      true
    );

    let final: number[] = [];
    let c = widthOdd.length;
    for (let i = 0; i < c; i++) {
      final.push(widthOdd[i]);
      final.push(widthEven[i]);
    }

    return final;
  }

  private findCharacteristic(value: number, characterStructure: BCGdatabarexpandedCharacterStructure): BCGrsscommonCharacteristic | null {
    for (let characteristic of this.characteristicList[characterStructure.toString()]) {
      if (value >= characteristic.minValueRange && value <= characteristic.maxValueRange) {
        return characteristic;
      }
    }

    return null;
  }
}

class BCGdatabarexpandedCharacterStructure {
  constructor(
    public n: number,
    public k: number
  ) {
    this.n = n;
    this.k = k;
  }

  toString(): string {
    return this.n.toString() + ',' + this.k.toString();
  }
}

class BCGdatabarexpandedCharacteristics extends BCGdatabarexpandedCharacteristicsBase {
  protected characterStructure: BCGdatabarexpandedCharacterStructure;

  constructor() {
    super();
    this.characterStructure = new BCGdatabarexpandedCharacterStructure(17, 4);
    this.addCharacteristics(this.characterStructure, [
      new BCGrsscommonCharacteristic(0, 347, 12, 5, 7, 2, 84, 4),
      new BCGrsscommonCharacteristic(348, 1387, 10, 7, 5, 4, 52, 20),
      new BCGrsscommonCharacteristic(1388, 2947, 8, 9, 4, 5, 30, 52),
      new BCGrsscommonCharacteristic(2948, 3987, 6, 11, 3, 6, 10, 104),
      new BCGrsscommonCharacteristic(3988, 4191, 4, 13, 1, 8, 1, 204)
    ]);
  }

  getElementWidths(value: number): number[] {
    return this.findElementWidths(value, this.characterStructure);
  }
}

abstract class BCGdatabarexpandedEncoder {
  protected linkageFlag: boolean = false;
  protected stackedRow: number = 0;
  private cacheCanEncode: boolean | null;
  private cacheDataField: string | null;

  constructor(protected data: BCGrsscommonCode[]) {
    this.cacheCanEncode = null;
    this.cacheDataField = null;
    this.setLinkageFlag(false);
    this.setStacked(1);

    if (!BCGdatabarexpandedUtility.isValidInput(data)) {
      throw new BCGParseException('databarexpanded', 'Incorrect input for encoder.');
    }
  }

  setLinkageFlag(linkageFlag: boolean): void {
    this.linkageFlag = linkageFlag;
  }

  setStacked(stackedRow: number): void {
    this.stackedRow = stackedRow;
  }

  canEncode(): boolean {
    if (this.cacheCanEncode === null) {
      this.cacheCanEncode = this.internalCanEncode();
    }

    return this.cacheCanEncode;
  }

  encode(): number[] {
    let data = (this.linkageFlag ? '1' : '0') + this.encodationMethodField() + this.variableLengthSymbolField() + this.dataField();

    let values: number[] = [];
    let nbSymbols = data.length / 12;
    for (let i = 0; i < nbSymbols; i++) {
      values.push(Utility.bindec(data.substr(i * 12, 12)));
    }

    return values;
  }

  dataField(): string {
    return (this.cacheDataField ??= this.internalDataField());
  }

  protected abstract encodationMethodField(): string;
  protected abstract internalDataField(): string;
  protected abstract internalCanEncode(): boolean;
  protected variableLengthSymbolField(): string {
    return '';
  }

  /**
   * Checks if it is digits only.
   *
   * @param str The string.
   * @param number The supported digits.
   * @return True if valid.
   */
  protected static isDigits(str: string, number: number | null = null): boolean {
    let numberPattern = number !== null ? '{' + number + '}' : '+';
    return new RegExp('^[0-9]' + numberPattern + '$').test(str);
  }
}

abstract class BCGdatabarexpandedVariableEncoderBase extends BCGdatabarexpandedEncoder {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected variableLengthSymbolField(): string {
    let dataField = 1 + this.encodationMethodField().length + 2 + this.dataField().length;

    // This should always be a multiple of 12
    if (dataField % 12 !== 0) {
      throw new Error('Something wrong happened');
    }

    let symbols = dataField / 12 + 1;
    let even = symbols % 2;
    let greater14 = symbols > 14;

    return (even === 1 ? '1' : '0') + (greater14 ? '1' : '0');
  }
}

/**
 * 7.2.5.4.1 - Encodation method field '1' - General item identification data
 */
///
/// Example:
///  - 01 00012345678905 | 10 ABC123
class BCGdatabarexpandedCompressedEncoderGeneralItem extends BCGdatabarexpandedVariableEncoderBase {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    return '1';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(0, 1), 10);
      bits += Utility.decbin(n1, 4);
      let n2 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n4, 10);
      let n5 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n5, 10);

      if (this.data.length > 1) {
        let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder(this.data.slice(1, 1 + this.data.length - 1), 45);
        generalEncoder.setLinkageFlag(this.linkageFlag);
        generalEncoder.setStacked(this.stackedRow);
        bits += generalEncoder.dataField();
      }
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length >= 1) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14)) {
        if (this.data.length > 1) {
          let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder(this.data.slice(1, 1 + this.data.length - 1), 45);
          generalEncoder.setLinkageFlag(this.linkageFlag);
          generalEncoder.setStacked(this.stackedRow);
          return generalEncoder.canEncode();
        }

        return true;
      }
    }

    return false;
  }
}

/**
 * 7.2.5.4.2 - Encodation method field '0100' - variable weight item (0.001 kilogram increments)
 */
///
/// Example:
///  - 01 90012345678908 | 3103 001750
class BCGdatabarexpandedCompressedEncoderWeightItemKG extends BCGdatabarexpandedEncoder {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    return '0100';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n1, 10);
      let n2 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n4, 10);
      let n5 = parseInt(this.data[1].dataField, 10);
      bits += Utility.decbin(n5, 15);
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length === 2) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14) && this.data[0].dataField[0] === '9') {
        if (
          this.data[1].ai === '3103' &&
          this.data[1].dataField.length === 6 &&
          BCGdatabarexpandedEncoder.isDigits(this.data[1].dataField) &&
          parseInt(this.data[1].dataField, 10) <= 32767
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * 7.2.5.4.3 - Encodation method field '0101' - variable weight item (0.01 or 0.001 pound increments)
 */
///
/// Example:
///  - 01 90012345678908 | 3102 000156
class BCGdatabarexpandedCompressedEncoderWeightItemLB extends BCGdatabarexpandedEncoder {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    return '0101';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n1, 10);
      let n2 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n4, 10);

      let weightValue = parseInt(this.data[1].dataField, 10); // TODO Valid?
      if (this.data[1].ai === '3203') {
        weightValue += 10000;
      }

      bits += Utility.decbin(weightValue, 15);
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length === 2) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14) && this.data[0].dataField[0] === '9') {
        let intValue = parseInt(this.data[1].dataField, 10);
        if (
          ((this.data[1].ai === '3202' && !isNaN(intValue) && intValue <= 9999) ||
            (this.data[1].ai === '3203' && !isNaN(intValue) && intValue <= 22767)) &&
          BCGdatabarexpandedEncoder.isDigits(this.data[1].dataField, 6)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * 7.2.5.4.4 - Encodation method field '0111000' through '0111111' - variable weight item plus date
 */
///
/// Example:
///  - 01 90012345678908 | 3103 012233 | 15 991231
class BCGdatabarexpandedCompressedEncoderWeightItemDate extends BCGdatabarexpandedEncoder {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    if (this.canEncode()) {
      let code = this.data[1].ai.substr(0, 3);
      if (this.data.length === 3) {
        code += this.data[2].ai;
      } else {
        // We can default to 11, 13, 15, 17
        code += '11';
      }

      switch (code) {
        case '31011':
          return '0111000';
        case '32011':
          return '0111001';
        case '31013':
          return '0111010';
        case '32013':
          return '0111011';
        case '31015':
          return '0111100';
        case '32015':
          return '0111101';
        case '31017':
          return '0111110';
        case '32017':
          return '0111111';
      }
    }

    return '';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n1, 10);
      let n2 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n4, 10);

      // Creating a new number
      let newNumber = this.data[1].ai[3] + this.data[1].dataField.substr(1);
      let n5 = parseInt(newNumber, 10);
      bits += Utility.decbin(n5, 20);

      // Date (YY * 384) + ((MM - 1) * 32) + (DD)
      let dateValue = 38400; // No Date
      if (this.data.length === 3) {
        let yy = parseInt(this.data[2].dataField.substr(0, 2), 10);
        let mm = parseInt(this.data[2].dataField.substr(2, 2), 10);
        let dd = parseInt(this.data[2].dataField.substr(4, 2), 10);
        dateValue = yy * 384 + (mm - 1) * 32 + dd;
      }

      bits += Utility.decbin(dateValue, 16);
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length >= 2) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14) && this.data[0].dataField[0] === '9') {
        let n1 = parseInt(this.data[1].dataField, 10);
        if (
          BCGdatabarexpandedEncoder.isDigits(this.data[1].ai, 4) &&
          (this.data[1].ai.substr(0, 3) === '320' || this.data[1].ai.substr(0, 3) === '310') &&
          BCGdatabarexpandedEncoder.isDigits(this.data[1].dataField, 6) &&
          n1 <= 99999
        ) {
          // data[2] is not required but we should validate it, make sure the month is 01 <= mm <= 12 and day is 00 <= dd <= 31
          let c = this.data.length;
          if (c === 2) {
            return true;
          } else if (c === 3) {
            // documentation doesn't disallow dd = 00
            let mm = parseInt(this.data[2].dataField.substr(2, 2), 10);
            let dd = parseInt(this.data[2].dataField.substr(4, 2), 10);
            if (
              (this.data[2].ai === '11' || this.data[2].ai === '13' || this.data[2].ai === '15' || this.data[2].ai === '17') &&
              BCGdatabarexpandedEncoder.isDigits(this.data[2].dataField, 6) &&
              !isNaN(mm) &&
              mm <= 12 &&
              mm >= 1 &&
              !isNaN(dd) &&
              dd <= 31
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
}

/**
 * 7.2.5.4.5 - Encodation method field '01100' - variable measure item and price
 */
///
/// Example:
///  - 01 90012345678908 | 3922 795
class BCGdatabarexpandedCompressedEncoderMeasureItemPrice extends BCGdatabarexpandedVariableEncoderBase {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    return '01100';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n1, 10);
      let n2 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n4, 10);

      let n5 = parseInt(this.data[1].ai.substr(3), 10);
      bits += Utility.decbin(n5, 2);
      let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder([new BCGrsscommonCode('', this.data[1].dataField)], 47);
      generalEncoder.setLinkageFlag(this.linkageFlag);
      generalEncoder.setStacked(this.stackedRow);
      bits += generalEncoder.dataField();
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length === 2) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14) && this.data[0].dataField[0] === '9') {
        let dec = this.data[1].ai.substr(3);
        if (
          this.data[1].ai.substr(0, 3) === '392' &&
          (dec === '0' || dec === '1' || dec === '2' || dec === '3') &&
          BCGdatabarexpandedEncoder.isDigits(this.data[1].dataField)
        ) {
          let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder([new BCGrsscommonCode('', this.data[1].dataField)], 47);
          generalEncoder.setLinkageFlag(this.linkageFlag);
          generalEncoder.setStacked(this.stackedRow);
          return generalEncoder.canEncode();
        }
      }
    }

    return false;
  }
}

/**
 *  7.2.5.4.6 - Encodation method field '01101' - variable measure item and price with ISO 4217
 */
///
/// Example:
///  - 01 90012345678908 | 3932 0401234
class BCGdatabarexpandedCompressedEncoderMeasureItemPriceCurrency extends BCGdatabarexpandedVariableEncoderBase {
  constructor(data: BCGrsscommonCode[]) {
    super(data);
  }

  protected encodationMethodField(): string {
    return '01101';
  }

  protected internalDataField(): string {
    let bits = '';
    if (this.canEncode()) {
      let n1 = parseInt(this.data[0].dataField.substr(1, 3), 10);
      bits += Utility.decbin(n1, 10);
      let n2 = parseInt(this.data[0].dataField.substr(4, 3), 10);
      bits += Utility.decbin(n2, 10);
      let n3 = parseInt(this.data[0].dataField.substr(7, 3), 10);
      bits += Utility.decbin(n3, 10);
      let n4 = parseInt(this.data[0].dataField.substr(10, 3), 10);
      bits += Utility.decbin(n4, 10);

      let n5 = parseInt(this.data[1].ai.substr(3), 10);
      bits += Utility.decbin(n5, 2);
      let n6 = parseInt(this.data[1].dataField.substr(0, 3), 10);
      bits += Utility.decbin(n6, 10);
      let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder([new BCGrsscommonCode('', this.data[1].dataField.substr(3))], 57);
      generalEncoder.setLinkageFlag(this.linkageFlag);
      generalEncoder.setStacked(this.stackedRow);
      bits += generalEncoder.dataField();
    }

    return bits;
  }

  protected internalCanEncode(): boolean {
    if (this.data.length === 2) {
      if (this.data[0].ai === '01' && BCGdatabarexpandedEncoder.isDigits(this.data[0].dataField, 14) && this.data[0].dataField[0] === '9') {
        let dec = this.data[1].ai.substr(3);
        if (
          this.data[1].ai.substr(0, 3) === '393' &&
          (dec === '0' || dec === '1' || dec === '2' || dec === '3') &&
          BCGdatabarexpandedEncoder.isDigits(this.data[1].dataField)
        ) {
          // Make sure we have at least 3 digits for the Currency
          if (this.data[1].dataField.substr(0, 3).length === 3) {
            let generalEncoder = new BCGdatabarexpandedGeneralPurposeEncoder(
              [new BCGrsscommonCode('', this.data[1].dataField.substr(3))],
              57
            );
            generalEncoder.setLinkageFlag(this.linkageFlag);
            generalEncoder.setStacked(this.stackedRow);
            return generalEncoder.canEncode();
          }
        }
      }
    }

    return false;
  }
}

class BCGdatabarexpandedGeneralPurposeEncoderCode {
  constructor(
    public type: string,
    public val: string
  ) {}
}

class BCGdatabarexpandedToName {
  constructor(
    public generalPurposeEncoderCode: BCGdatabarexpandedGeneralPurposeEncoderCode | null,
    public extraValue: number
  ) {}
}

class BCGdatabarexpandedGeneralPurposeEncoderParser {
  private readonly cache: { [key: number]: BCGdatabarexpandedToName } = {};

  constructor(private text: string) {}

  get(pos: number): BCGdatabarexpandedGeneralPurposeEncoderCode | null {
    if (pos > 0 && Object.keys(this.cache).length < pos - 1) {
      // TODO Confirm !isset(this.cache[pos - 1])
      this.get(pos - 1);
    }

    if (!!this.cache[pos]) {
      return this.cache[pos].generalPurposeEncoderCode;
    } else {
      let plus = 0;
      let previous = pos > 0 ? this.cache[pos - 1].extraValue : 0;
      let temp: BCGdatabarexpandedGeneralPurposeEncoderCode | null;
      ({ value: temp, plus } = BCGdatabarexpandedGeneralPurposeEncoderParser.getCharacterCode(this.text, pos + previous, plus));
      this.cache[pos] = new BCGdatabarexpandedToName(temp, previous + plus);
      return this.cache[pos].generalPurposeEncoderCode;
    }
  }

  private static getCharacterCode(
    text: string,
    pos: number,
    plus: number
  ): { value: BCGdatabarexpandedGeneralPurposeEncoderCode | null; plus: number } {
    let val = text.length > pos ? text[pos] : '';
    plus = 0;
    let type: string;
    if (val === '') {
      return { value: null, plus };
    } else if (BCGdatabarexpandedGeneralPurposeEncoderParser.isCharFnc1(text, pos).value) {
      type = 'F';
      plus = 2;
    } else if (BCGdatabarexpandedGeneralPurposeEncoderParser.isCharNumeric(val[0])) {
      type = 'N';
    } else if (BCGdatabarexpandedGeneralPurposeEncoderParser.isCharAlphanumeric(val[0])) {
      type = 'A';
    } else if (BCGdatabarexpandedGeneralPurposeEncoderParser.isISO646(val[0])) {
      type = 'I';
    } else {
      throw new BCGParseException('databarexpanded', 'The character "' + val + '" is not allowed.');
    }

    return {
      value: new BCGdatabarexpandedGeneralPurposeEncoderCode(type, val),
      plus
    };
  }

  /**
   * Returns if a character is numeric [0-9].
   *
   * @param character The character.
   * @return True if numeric.
   */
  private static isCharNumeric(character: string): boolean {
    let o = character.charCodeAt(0);
    return o >= 0x30 && o <= 0x39;
  }

  /**
   * Returns if a character is alpha-numeric [0-9A-Z*,-./]
   *
   * @param character The character.
   * @return True if alphanumeric.
   */
  private static isCharAlphanumeric(character: string): boolean {
    let o = character.charCodeAt(0);

    let numeric = BCGdatabarexpandedGeneralPurposeEncoderParser.isCharNumeric(character);
    return numeric || (o >= 0x41 && o <= 0x5a) || o === 0x2a || (o >= 0x2c && o <= 0x2f);
  }

  /**
   * Returns if a character is numeric ISO 646.
   *
   * @param character The character.
   * @return True if ISO646.
   */
  private static isISO646(character: string): boolean {
    let o = character.charCodeAt(0);

    let alphaNumeric = BCGdatabarexpandedGeneralPurposeEncoderParser.isCharAlphanumeric(character);
    return (
      alphaNumeric ||
      (o >= 0x61 && o <= 0x7a) ||
      o === 32 ||
      o === 95 ||
      o === 0x21 ||
      o === 0x22 ||
      (o >= 0x25 && o <= 0x2f) ||
      (o >= 0x3a && o <= 0x3f)
    );
  }

  /**
   * Returns if the character represents the FNC1 code ~F1.
   *
   * @param text The text.
   * @param i The position.
   * @return True if FNC1.
   */
  private static isCharFnc1(text: string, i: number): { value: boolean; i: number } {
    if (text[i] === '~') {
      let temp = text.substr(i + 1, 2);
      if (temp.length === 2 && temp === 'F1') {
        return {
          value: true,
          i
        };
      }
    }

    return {
      value: false,
      i
    };
  }
}

class BCGdatabarexpandedGeneralPurposeEncoder extends BCGdatabarexpandedVariableEncoderBase {
  private readonly previousBits: number;

  constructor(data: BCGrsscommonCode[], previousBits: number = 2) {
    super(data);

    // 3 -> linkage bit + 2 bits for variable length
    this.previousBits = 3 + Math.floor(previousBits);
  }

  protected encodationMethodField(): string {
    if (this.data.length >= 1) {
      if (this.data[0].ai !== '') {
        return '00';
      }
    }

    return '';
  }

  protected internalDataField(): string {
    let text = BCGdatabarexpandedUtility.arrayFlattenCode(this.data);
    return this.createBinaryStream(text);
  }

  protected internalCanEncode(): boolean {
    for (let data of this.data) {
      if (data.ai !== '' && !BCGdatabarexpandedEncoder.isDigits(data.ai)) {
        return false;
      }
    }

    return true;
  }

  private static readonly NUMERIC_TO_ALPHA: string = '0000';
  private static readonly ALPHA_TO_ISO: string = '00100';
  private static readonly ALPHA_TO_NUMERIC: string = '000';
  private static readonly ISO_TO_NUMERIC: string = '000';
  private static readonly ISO_TO_ALPHA: string = '00100';

  private createBinaryStream(text: string): string {
    let pos = 0;
    let bits = '';
    let parser = new BCGdatabarexpandedGeneralPurposeEncoderParser(text);
    let currentMode = 'N';
    let currentCode: BCGdatabarexpandedGeneralPurposeEncoderCode | null;
    while ((currentCode = parser.get(pos)) !== null) {
      if (currentMode === 'N') {
        // Current code is not encodable, handle (a) and (b)
        if (currentCode.type !== 'N' && currentCode.type !== 'F') {
          bits += BCGdatabarexpandedGeneralPurposeEncoder.NUMERIC_TO_ALPHA;
          currentMode = 'A';
        } else {
          let nextCode = parser.get(pos + 1);
          if (nextCode !== null) {
            if (currentCode.type === 'F' && nextCode.type === 'F') {
              // Can't encode 2 ~F1 in a row, switching to alpha
              bits += BCGdatabarexpandedGeneralPurposeEncoder.NUMERIC_TO_ALPHA;
              currentMode = 'A';
            } else if (nextCode.type === 'N' || nextCode.type === 'F') {
              // Encoding
              bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeNumeric(currentCode, nextCode);
              pos += 2;
            } else {
              // Next code is not encodable, handle (a)
              bits += BCGdatabarexpandedGeneralPurposeEncoder.NUMERIC_TO_ALPHA;
              currentMode = 'A';
            }
          } else {
            // handle (b) for ~F1
            if (currentCode.type === 'F') {
              bits += BCGdatabarexpandedGeneralPurposeEncoder.NUMERIC_TO_ALPHA;
              currentMode = 'A';
            } else {
              // Encoding, handle (c)
              let remainingBits = (12 - ((bits.length + this.previousBits) % 12)) % 12;
              if (remainingBits >= 4 && remainingBits <= 6) {
                // Encoding, handle (c2)
                let n1 = parseInt(currentCode.val, 10);
                bits += Utility.decbin(n1 + 1, 4); // TODO val can be double?
              } else {
                // Encoding, handle (c1 and c3)
                bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeNumeric(
                  currentCode,
                  new BCGdatabarexpandedGeneralPurposeEncoderCode('F', '~F1')
                );
              }

              pos++;
            }
          }
        }
      } else if (currentMode === 'A') {
        if (currentCode.type === 'F') {
          // Encoding, handle (a)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeAlphanumeric(currentCode);
          pos++;
        } else if (currentCode.type === 'I') {
          // Can't encode, handle (b)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.ALPHA_TO_ISO;
          currentMode = 'I';
        } else if (BCGdatabarexpandedGeneralPurposeEncoder.lookAhead(parser, pos, 6, ['N', 'F'])) {
          // Latching, handle (c)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.ALPHA_TO_NUMERIC;
          currentMode = 'N';
        } else if (BCGdatabarexpandedGeneralPurposeEncoder.lookAhead(parser, pos, 4, ['N', 'F']) && parser.get(pos + 4) === null) {
          // Latching, handle (d)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.ALPHA_TO_NUMERIC;
          currentMode = 'N';
        } else {
          // Encoding
          bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeAlphanumeric(currentCode);
          pos++;
        }
      } else if (currentMode === 'I') {
        if (currentCode.type === 'F') {
          // Encoding, handle (a)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeISO646(currentCode);
          pos++;
        } else if (
          BCGdatabarexpandedGeneralPurposeEncoder.lookAhead(parser, pos, 4, ['N', 'F']) &&
          BCGdatabarexpandedGeneralPurposeEncoder.lookAhead(parser, pos + 4, 10, ['N', 'F', 'A'], true)
        ) {
          // Latching, handle (b)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.ISO_TO_NUMERIC;
          currentMode = 'N';
        } else if (BCGdatabarexpandedGeneralPurposeEncoder.lookAhead(parser, pos, 5 + 10, ['N', 'F', 'A'], true)) {
          // Latching, handle (c)
          bits += BCGdatabarexpandedGeneralPurposeEncoder.ISO_TO_ALPHA;
          currentMode = 'A';
        } else {
          // Encoding
          bits += BCGdatabarexpandedGeneralPurposeEncoder.encodeISO646(currentCode);
          pos++;
        }
      }
    }

    bits = this.pad(bits, currentMode);

    return bits;
  }

  private pad(bits: string, currentMode: string): string {
    let pad = '';
    let currentSize = bits.length + this.previousBits;
    let remainingBits = (12 - (currentSize % 12)) % 12;
    let symbols = (currentSize + remainingBits) / 12 + 1;

    let rows = BCGdatabarexpandedUtility.getSymbolsPerRow(symbols, this.stackedRow, this.linkageFlag);
    let requiredBits = Utility.arraySum(rows) * 12;

    let requiredPad = requiredBits - currentSize - 12;
    if (requiredPad > 0) {
      if (currentMode === 'N') {
        pad += '0000';
      }

      while (pad.length < requiredPad) {
        pad += '00100';
      }

      pad = pad.substr(0, requiredPad);
    }

    return bits + pad;
  }

  private static lookAhead(
    parser: BCGdatabarexpandedGeneralPurposeEncoderParser,
    pos: number,
    amount: number,
    values: string[],
    trueOnNull: boolean = false
  ): boolean {
    let valuesList: string[] = values; // TODO Check
    let sequence: string[] = [];
    for (let i = 0; i < amount; i++) {
      let code = parser.get(pos + i);
      if (trueOnNull && code === null) {
        return true;
      }

      if (code === null || valuesList.indexOf(code.type) === -1) {
        return false;
      }

      if (i % 2 === 1) {
        sequence[sequence.length - 1] += code.type;
      } else {
        sequence.push(code.type);
      }
    }

    // We can't have two ~F1 following per pair
    if (valuesList.length === 2 && valuesList.indexOf('F') !== -1 && valuesList.indexOf('N') !== -1 && sequence.indexOf('FF') !== -1) {
      return false;
    }

    return true;
  }

  private static getNumericValue(code: BCGdatabarexpandedGeneralPurposeEncoderCode): number {
    if (code.type === 'F') {
      return 10;
    } else if (code.type === 'N') {
      let n1 = parseInt(code.val, 10);
      return n1;
    } else {
      throw new BCGParseException('databarexpanded', 'Incorrect value received.');
    }
  }

  /// Needs 2 code
  /**
   * Encodes a numeric value.
   */
  protected static encodeNumeric(
    input1: BCGdatabarexpandedGeneralPurposeEncoderCode,
    input2: BCGdatabarexpandedGeneralPurposeEncoderCode
  ): string {
    let d1 = BCGdatabarexpandedGeneralPurposeEncoder.getNumericValue(input1);
    let d2 = BCGdatabarexpandedGeneralPurposeEncoder.getNumericValue(input2);

    if (d1 === 10 && d2 === 10) {
      throw new BCGParseException('databarexpanded', 'Incorrect ~F1 inputs');
    }

    return Utility.decbin(11 * d1 + d2 + 8, 7);
  }

  protected static encodeAlphanumeric(input: BCGdatabarexpandedGeneralPurposeEncoderCode): string | null {
    let o = input.val.charCodeAt(0);
    if (input.type === 'F') {
      return '01111';
    } else if (o >= 0x30 && o <= 0x39) {
      // [0-9]
      return Utility.decbin(o - 43, 5);
    } else if (o >= 0x41 && o <= 0x5a) {
      // [A-Z]
      return Utility.decbin(o - 33, 6);
    } else if (o === 0x2a) {
      // *
      return '111010';
    } else if (o === 0x2c) {
      // ,
      return '111011';
    } else if (o === 0x2d) {
      // -
      return '111100';
    } else if (o === 0x2e) {
      // .
      return '111101';
    } else if (o === 0x2f) {
      // /
      return '111110';
    }

    return null;
  }

  protected static encodeISO646(input: BCGdatabarexpandedGeneralPurposeEncoderCode): string | null {
    let o = input.val.charCodeAt(0);
    if (input.type === 'F') {
      return '01111';
    } else if (o >= 0x30 && o <= 0x39) {
      // [0-9]
      return Utility.decbin(o - 43, 5);
    } else if (o >= 0x41 && o <= 0x5a) {
      // [A-Z]
      return Utility.decbin(o - 1, 7);
    } else if (o >= 0x61 && o <= 0x7a) {
      // [a-z]
      return Utility.decbin(o - 7, 7);
    } else if (o === 0x21) {
      // !
      return '11101000';
    } else if (o === 0x22) {
      // "
      return '11101001';
    } else if (o >= 0x25 && o <= 0x2f) {
      // [%&'()*+,-./]
      return Utility.decbin(o + 197, 8);
    } else if (o >= 0x3a && o <= 0x3f) {
      // [:;<=>?]
      return Utility.decbin(o + 187, 8);
    } else if (o === 0x5f) {
      // _
      return '11111011';
    } else if (o === 0x20) {
      // [space]
      return '11111100';
    }

    return null;
  }
}

class BCGrsscommonCode {
  constructor(
    public ai: string,
    public dataField: string
  ) {}
}

class BCGdatabarexpandedUtility {
  static isValidInput(data: BCGrsscommonCode[]): boolean {
    // TODO Support more inputs?
    if (data !== null && data.length >= 1) {
      return true;
    }

    return false;
  }

  static arrayFlatten(arr: string[] | string[][]): string {
    let ret = '';
    let c = arr.length;
    for (let i = 0; i < c; i++) {
      let temp = arr[i];
      if (Array.isArray(temp)) {
        ret += BCGdatabarexpandedUtility.arrayFlatten(temp);
      } else {
        ret += temp;
      }
    }

    return ret;
  }

  static arrayFlattenCode(arr: BCGrsscommonCode[]): string {
    let ret = '';
    let c = arr.length;
    for (let i = 0; i < c; i++) {
      ret += arr[i].ai + arr[i].dataField;
    }

    return ret;
  }

  static getSymbolsPerRow(nbSymbols: number, rows: number, linkage: boolean = false): number[] {
    let val = Math.ceil(nbSymbols / rows);
    val += val % 2;

    if (linkage || rows === 1) {
      val = Math.max(4, val);
      nbSymbols = Math.max(4, nbSymbols);
    }

    let arr: number[] = Array(rows).fill(val);
    arr[rows - 1] = Math.max(2, nbSymbols - val * (rows - 1));

    return arr;
  }
}

export { BCGdatabarexpanded };
