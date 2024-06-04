'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException, BCGBarcode, BCGBarcode2D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * MaxiCode.
 */
class BCGmaxicode extends BCGBarcode2D {
  private static readonly _GF = 64;
  private static readonly _MODULUS = 67;
  private static readonly _ERRORMODEEEC = 56;
  private static readonly _ERRORMODESEC = 40;

  private readonly codeSetA: string;
  private readonly codeSetB: string;
  private readonly codeSetC: string;
  private readonly codeSetD: string;
  private readonly codeSetE: string;

  private mode = 4;
  private acceptECI = false; // bool
  private quietZone = true;

  private symbolNumber = 0; // int (for Structured Append)
  private symbolTotal = 0; // int (for Structured Append)

  private finalEncodingMode: string = '\0';

  private primary: BCGmaxicodePrimaryMessage | null = null;
  private data: number[] | null = null;

  private readonly moduleSequence = [
    [
      122, 121, 128, 127, 134, 133, 140, 139, 146, 145, 152, 151, 158, 157, 164, 163, 170, 169, 176, 175, 182, 181, 188, 187, 194, 193, 200,
      199, -1, -1
    ],
    [
      124, 123, 130, 129, 136, 135, 142, 141, 148, 147, 154, 153, 160, 159, 166, 165, 172, 171, 178, 177, 184, 183, 190, 189, 196, 195, 202,
      201, 817
    ],
    [
      126, 125, 132, 131, 138, 137, 144, 143, 150, 149, 156, 155, 162, 161, 168, 167, 174, 173, 180, 179, 186, 185, 192, 191, 198, 197, 204,
      203, 819, 818
    ],
    [
      284, 283, 278, 277, 272, 271, 266, 265, 260, 259, 254, 253, 248, 247, 242, 241, 236, 235, 230, 229, 224, 223, 218, 217, 212, 211, 206,
      205, 820
    ],
    [
      286, 285, 280, 279, 274, 273, 268, 267, 262, 261, 256, 255, 250, 249, 244, 243, 238, 237, 232, 231, 226, 225, 220, 219, 214, 213, 208,
      207, 822, 821
    ],
    [
      288, 287, 282, 281, 276, 275, 270, 269, 264, 263, 258, 257, 252, 251, 246, 245, 240, 239, 234, 233, 228, 227, 222, 221, 216, 215, 210,
      209, 823
    ],
    [
      290, 289, 296, 295, 302, 301, 308, 307, 314, 313, 320, 319, 326, 325, 332, 331, 338, 337, 344, 343, 350, 349, 356, 355, 362, 361, 368,
      367, 825, 824
    ],
    [
      292, 291, 298, 297, 304, 303, 310, 309, 316, 315, 322, 321, 328, 327, 334, 333, 340, 339, 346, 345, 352, 351, 358, 357, 364, 363, 370,
      369, 826
    ],
    [
      294, 293, 300, 299, 306, 305, 312, 311, 318, 317, 324, 323, 330, 329, 336, 335, 342, 341, 348, 347, 354, 353, 360, 359, 366, 365, 372,
      371, 828, 827
    ],
    [410, 409, 404, 403, 398, 397, 392, 391, 80, 79, -1, -1, 14, 13, 38, 37, 3, 0, 45, 44, 110, 109, 386, 385, 380, 379, 374, 373, 829],
    [412, 411, 406, 405, 400, 399, 394, 393, 82, 81, 41, -1, 16, 15, 40, 39, 4, 0, 0, 46, 112, 111, 388, 387, 382, 381, 376, 375, 831, 830],
    [414, 413, 408, 407, 402, 401, 396, 395, 84, 83, 42, 0, 0, 0, 0, 0, 6, 5, 48, 47, 114, 113, 390, 389, 384, 383, 378, 377, 832],
    [416, 415, 422, 421, 428, 427, 104, 103, 56, 55, 17, 0, 0, 0, 0, 0, 0, 0, 21, 20, 86, 85, 434, 433, 440, 439, 446, 445, 834, 833],
    [418, 417, 424, 423, 430, 429, 106, 105, 58, 57, 0, 0, 0, 0, 0, 0, 0, 0, 23, 22, 88, 87, 436, 435, 442, 441, 448, 447, 835],
    [420, 419, 426, 425, 432, 431, 108, 107, 60, 59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 90, 89, 438, 437, 444, 443, 450, 449, 837, 836],
    [482, 481, 476, 475, 470, 469, 49, -1, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 54, 53, 464, 463, 458, 457, 452, 451, 838],
    [484, 483, 478, 477, 472, 471, 50, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 466, 465, 460, 459, 454, 453, 840, 839],
    [486, 485, 480, 479, 474, 473, 52, 51, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1, 43, 468, 467, 462, 461, 456, 455, 841],
    [488, 487, 494, 493, 500, 499, 98, 97, 62, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 92, 91, 506, 505, 512, 511, 518, 517, 843, 842],
    [490, 489, 496, 495, 502, 501, 100, 99, 64, 63, 0, 0, 0, 0, 0, 0, 0, 0, 29, 28, 94, 93, 508, 507, 514, 513, 520, 519, 844],
    [492, 491, 498, 497, 504, 503, 102, 101, 66, 65, 18, 0, 0, 0, 0, 0, 0, 0, 19, 30, 96, 95, 510, 509, 516, 515, 522, 521, 846, 845],
    [560, 559, 554, 553, 548, 547, 542, 541, 74, 73, 33, 0, 0, 0, 0, 0, 0, 11, 68, 67, 116, 115, 536, 535, 530, 529, 524, 523, 847],
    [562, 561, 556, 555, 550, 549, 544, 543, 76, 75, -1, 0, 8, 7, 36, 35, 12, -1, 70, 69, 118, 117, 538, 537, 532, 531, 526, 525, 849, 848],
    [564, 563, 558, 557, 552, 551, 546, 545, 78, 77, -1, 34, 10, 9, 26, 25, 0, -1, 72, 71, 120, 119, 540, 539, 534, 533, 528, 527, 850],
    [
      566, 565, 572, 571, 578, 577, 584, 583, 590, 589, 596, 595, 602, 601, 608, 607, 614, 613, 620, 619, 626, 625, 632, 631, 638, 637, 644,
      643, 852, 851
    ],
    [
      568, 567, 574, 573, 580, 579, 586, 585, 592, 591, 598, 597, 604, 603, 610, 609, 616, 615, 622, 621, 628, 627, 634, 633, 640, 639, 646,
      645, 853
    ],
    [
      570, 569, 576, 575, 582, 581, 588, 587, 594, 593, 600, 599, 606, 605, 612, 611, 618, 617, 624, 623, 630, 629, 636, 635, 642, 641, 648,
      647, 855, 854
    ],
    [
      728, 727, 722, 721, 716, 715, 710, 709, 704, 703, 698, 697, 692, 691, 686, 685, 680, 679, 674, 673, 668, 667, 662, 661, 656, 655, 650,
      649, 856
    ],
    [
      730, 729, 724, 723, 718, 717, 712, 711, 706, 705, 700, 699, 694, 693, 688, 687, 682, 681, 676, 675, 670, 669, 664, 663, 658, 657, 652,
      651, 858, 857
    ],
    [
      732, 731, 726, 725, 720, 719, 714, 713, 708, 707, 702, 701, 696, 695, 690, 689, 684, 683, 678, 677, 672, 671, 666, 665, 660, 659, 654,
      653, 859
    ],
    [
      734, 733, 740, 739, 746, 745, 752, 751, 758, 757, 764, 763, 770, 769, 776, 775, 782, 781, 788, 787, 794, 793, 800, 799, 806, 805, 812,
      811, 861, 860
    ],
    [
      736, 735, 742, 741, 748, 747, 754, 753, 760, 759, 766, 765, 772, 771, 778, 777, 784, 783, 790, 789, 796, 795, 802, 801, 808, 807, 814,
      813, 862
    ],
    [
      738, 737, 744, 743, 750, 749, 756, 755, 762, 761, 768, 767, 774, 773, 780, 779, 786, 785, 792, 791, 798, 797, 804, 803, 810, 809, 816,
      815, 864, 863
    ]
  ];

  /**
   * Creates a MaxiCode barcode.
   */
  constructor() {
    super();
    this.codeSetA =
      String.fromCharCode(13) +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'A' /* ECI */ +
      String.fromCharCode(28) +
      String.fromCharCode(29) +
      String.fromCharCode(30) +
      'A' /* NS */ +
      ' ' +
      'A' /* Pad */ +
      '"#$%&\'()*+,-./0123456789:';
    this.codeSetB =
      '`abcdefghijklmnopqrstuvwxyz' +
      'a' /* ECI */ +
      String.fromCharCode(28) +
      String.fromCharCode(29) +
      String.fromCharCode(30) +
      'a' /* NS */ +
      '{' +
      'a' /* Pad */ +
      '}~' +
      String.fromCharCode(127) +
      ';<=>?[\\]^_ ,./:@!|';
    this.codeSetC =
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚ' +
      'À' /* ECI */ +
      String.fromCharCode(28) +
      String.fromCharCode(29) +
      String.fromCharCode(30) +
      'À' /* NS */ +
      'ÛÜÝÞßª¬±²³µ¹º¼½¾' +
      String.fromCharCode(128) +
      String.fromCharCode(129) +
      String.fromCharCode(130) +
      String.fromCharCode(131) +
      String.fromCharCode(132) +
      String.fromCharCode(133) +
      String.fromCharCode(134) +
      String.fromCharCode(135) +
      String.fromCharCode(136) +
      String.fromCharCode(137) +
      'À' /* Latch A */ +
      ' ';
    this.codeSetD =
      'àáâãäåæçèéêëìíîïðñòóôõö÷øùú' +
      'à' /* ECI */ +
      String.fromCharCode(28) +
      String.fromCharCode(29) +
      String.fromCharCode(30) +
      'à' /* NS */ +
      'ûüýþÿ¡¨«¯°´·¸»¿' +
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
      String.fromCharCode(148) +
      'à' /* Latch A */ +
      ' ';
    this.codeSetE = '';
    for (let i = 0; i <= 26; i++) {
      this.codeSetE += String.fromCharCode(i);
    }

    this.codeSetE += String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0); // ECI Pad Pad
    this.codeSetE += String.fromCharCode(27);
    this.codeSetE += String.fromCharCode(0); // NS
    this.codeSetE +=
      String.fromCharCode(28) +
      String.fromCharCode(29) +
      String.fromCharCode(30) +
      String.fromCharCode(31) +
      String.fromCharCode(159) +
      String.fromCharCode(160);
    for (let i = 162; i <= 167; i++) {
      this.codeSetE += String.fromCharCode(i);
    }

    this.codeSetE += String.fromCharCode(169) + String.fromCharCode(173) + String.fromCharCode(174) + String.fromCharCode(182);
    for (let i = 149; i <= 158; i++) {
      this.codeSetE += String.fromCharCode(i);
    }

    this.codeSetE += String.fromCharCode(0); // Latch A
    this.codeSetE += ' ';
  }

  /**
   * Gets the quiet zone.
   *
   * @return The quiet zone.
   */
  getQuietZone(): boolean {
    return this.quietZone;
  }

  /**
   * Quiet zone 1 module each side of the barcode.
   *
   * @param quietZone The quiet zone.
   */
  setQuietZone(quietZone: boolean): void {
    this.quietZone = quietZone;
  }

  /**
   * Gets the mode.
   *
   * @return The mode.
   */
  getMode(): number {
    return this.mode;
  }

  /**
   * Sets the mode for MaxiCode.
   * With mode 2 and 3, you need to provide a primary message.
   * Mode 5 contains a full error correction.
   *
   * @param mode The mode.
   */
  setMode(mode: number): void {
    if (mode < 2 && mode > 6) {
      throw new BCGArgumentException('The specified mode is not supported.', 'mode');
    }

    this.mode = mode;
  }

  /**
   * Sets the primary message with the required information.
   * If the primary message is used, you must use mode 2 or 3.
   * If your postal code is numeric only, we recommend you use the mode 2, otherwise, use mode 3.
   *
   * The serviceClass must be a number between 0 and 999.
   * The countryCode must correspond to ISO 3166 with a number between 0 and 999.
   * The postalCode can be 9 digits or alphanumeric.
   *
   * Sets the serviceClass to -1 to reset the primary message.
   *
   * @param serviceClass The service class.
   * @param countryCode The country code.
   * @param postalCode The postal code.
   */
  setPrimaryMessage(serviceClass: number, countryCode: number = -1, postalCode: string | null = null): void {
    if (serviceClass === -1) {
      this.primary = null;
    } else {
      if (serviceClass < 0 || serviceClass > 999) {
        throw new BCGArgumentException('The class of service must have 3 digits or less.', 'serviceClass');
      }

      if (countryCode < 0 || countryCode > 999) {
        throw new BCGArgumentException('The country code must have 3 digits or less.', 'serviceClass');
      }

      this.primary = new BCGmaxicodePrimaryMessage(serviceClass, countryCode, postalCode);
    }
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
   * MaxiCode symbol can be appended to another one.
   * The symbolTotal must remain the same across all the MaxiCode group.
   * Up to 8 symbols total.
   * The first symbol is 1.
   * If you want to reset and not use this Structured Append, set the symbolNumber to 0.
   *
   * @param symbolNumber The symbol number.
   * @param symbolTotal The amount of symbols.
   * @return True on success, false on failure.
   */
  setStructuredAppend(symbolNumber: number, symbolTotal: number = 0): boolean {
    if (symbolTotal === 0) {
      // Keep weak
      this.symbolNumber = 0;
      this.symbolTotal = 0;
      return true;
    } else {
      if (symbolNumber <= 0) {
        throw new BCGArgumentException('The symbol number must be equal or bigger than 1.', 'symbolNumber');
      }

      if (symbolNumber > symbolTotal) {
        throw new BCGArgumentException('The symbol number must be equal or lower than the symbol total.', 'symbolNumber');
      }

      if (symbolTotal < 2 && symbolTotal > 8) {
        throw new BCGArgumentException('The symbol total must be between 2 and 8.', 'symbolTotal');
      }

      this.symbolNumber = symbolNumber;
      this.symbolTotal = symbolTotal;

      return true;
    }
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    const c = text.length;
    if (c === 0) {
      throw new BCGParseException('maxicode', 'Provide data to parse.');
    }

    text = this.handleSpecialMessage(text);

    let seq: Seq[];
    ({ value: seq, text } = this.getSequence(text));
    if (seq !== null) {
      const codewords = this.createCodewordsStream(text, seq);
      this.setData(codewords);
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

    const quietZoneSize = this.quietZone ? 1 : 0;
    const c1 = this.moduleSequence.length;

    for (let y = 0; y < c1; y++) {
      const c2 = this.moduleSequence[y].length;
      for (let x = 0; x < c2; x++) {
        let o = this.moduleSequence[y][x];

        let dark = false;
        if (o === -1) {
          dark = true;
        } else if (o === 0) {
          dark = false;
        } else {
          o -= 1;
          const b = Math.floor(o / 6);
          const m = 1 << (5 - (o % 6));
          dark = (this.data[b] & m) === m;
        }

        const offset = c2 === 30 ? 0 : 5;

        this.drawModule(image, x + quietZoneSize, y + quietZoneSize, offset, dark);
      }
    }

    const positionX = 145 + quietZoneSize * 10;
    const positionY = 150 + quietZoneSize * 9;
    this.drawCircle(image, positionX, positionY, 92, BCGBarcode.COLOR_FG);
    this.drawCircle(image, positionX, positionY, 76, BCGBarcode.COLOR_BG);
    this.drawCircle(image, positionX, positionY, 60, BCGBarcode.COLOR_FG);
    this.drawCircle(image, positionX, positionY, 44, BCGBarcode.COLOR_BG);
    this.drawCircle(image, positionX, positionY, 28, BCGBarcode.COLOR_FG);
    this.drawCircle(image, positionX, positionY, 12, BCGBarcode.COLOR_BG);

    this.drawText(image, 0, 0, (30 + quietZoneSize * 2) * 10, (32 + quietZoneSize * 2) * 9 + 11);
  }

  /**
   * Returns the maximal size of a barcode.
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    const X = 10;
    const Y = 9;
    const V = 11;
    const quietZoneSize = this.quietZone ? 2 : 0;
    width += (30 + quietZoneSize) * X;
    height += (32 + quietZoneSize) * Y + V;

    return super.getDimension(width, height, createSurface);
  }

  /**
   * Handles special text message and set the primary if needed.
   */
  private handleSpecialMessage(text: string): string {
    let newText = text;
    if ((this.mode === 2 || this.mode === 3) && this.primary === null) {
      let message: string[];
      if (Utility.safeSubstring(text, 0, 7) === '[)>' + String.fromCharCode(30) + '01' + String.fromCharCode(29)) {
        message = Utility.safeSubstring(text, 9).split(String.fromCharCode(29));
        newText = Utility.safeSubstring(text, 0, 9);
      } else {
        message = text.split(String.fromCharCode(29));
        newText = '';
      }

      if (message !== null && message.length >= 3) {
        const postalCode = message[0];
        const countryCode = parseInt(message[1], 10);
        const serviceClass = parseInt(message[2], 10);
        this.setPrimaryMessage(serviceClass, countryCode, postalCode);
        const newMessage: string[] = message.slice(3);
        newText += newMessage.join(String.fromCharCode(29));
      }
    }

    return newText;
  }

  /**
   * Draws a circle on the image.
   */
  private drawCircle(image: draw.Surface, x: number, y: number, d: number, color: number): void {
    const scaleX = this.scale * this.scaleX;
    const scaleY = this.scale * this.scaleY;

    // We don't draw ellipse here, it's only circle.
    draw.imagefillcircle(
      image,
      (x + this.offsetX) * scaleX + this.pushLabel[0],
      (y + this.offsetY) * scaleY + this.pushLabel[1],
      (d / 2) * scaleX, // Note / 2, we draw the radius, not the width.
      this.getColor(image, color)
    );
  }

  /**
   * Draws a module on the image.
   */
  private drawModule(image: draw.Surface, x: number, y: number, offset: number, dark: boolean): void {
    // Draw background color first to cover everything
    this.drawFilledRectangle(image, offset + 0 + x * 10, 3 + y * 9, offset + 9 + x * 10, 8 + y * 9, BCGBarcode.COLOR_BG);
    this.drawFilledRectangle(image, offset + 1 + x * 10, 2 + y * 9, offset + 8 + x * 10, 9 + y * 9, BCGBarcode.COLOR_BG);
    this.drawFilledRectangle(image, offset + 3 + x * 10, 1 + y * 9, offset + 6 + x * 10, 10 + y * 9, BCGBarcode.COLOR_BG);
    this.drawFilledRectangle(image, offset + 4 + x * 10, 0 + y * 9, offset + 5 + x * 10, 11 + y * 9, BCGBarcode.COLOR_BG);

    if (dark) {
      this.drawFilledRectangle(image, offset + 1 + x * 10, 4 + y * 9, offset + 9 + x * 10, 7 + y * 9, BCGBarcode.COLOR_FG);
      this.drawFilledRectangle(image, offset + 2 + x * 10, 3 + y * 9, offset + 8 + x * 10, 8 + y * 9, BCGBarcode.COLOR_FG);
      this.drawFilledRectangle(image, offset + 3 + x * 10, 2 + y * 9, offset + 7 + x * 10, 9 + y * 9, BCGBarcode.COLOR_FG);
      this.drawFilledRectangle(image, offset + 4 + x * 10, 1 + y * 9, offset + 6 + x * 10, 10 + y * 9, BCGBarcode.COLOR_FG);
    }
  }

  /**
   * Creates the codewords stream based on the text and the sequence previously found.
   */
  private createCodewordsStream(text: string, seq: Seq[]): number[] {
    let final: number[] = [];
    const c = seq.length;
    let offset = 0;

    let currentEncoding = 'A';
    for (let i = 0; i < c; i++) {
      if (seq[i].amount > 0) {
        let currentSeq: number[];
        ({ value: currentSeq, currentEncoding } = this.getEncodeCodeMethod(seq[i].sequence)(
          text.substring(offset, offset + seq[i].amount),
          currentEncoding,
          seq,
          i
        ));
        offset += seq[i].amount;

        final = final.concat(currentSeq);
      }
    }

    this.finalEncodingMode = currentEncoding;

    return final;
  }

  /**
   * Encodes Code Set A.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   * If the currentEncoding is not code set A, we provide the codeword to latch/switch.
   */
  private encodeCodeA(data: string, currentEncoding: string, sequence: Seq[], pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [];

    const length = data.length;
    if (currentEncoding === 'C' || currentEncoding === 'D' || currentEncoding === 'E') {
      seq.push(58);
      currentEncoding = 'A';
    } else if (currentEncoding === 'B') {
      // Find if the next sequence is forcing A
      if (this.isNextSequence('A', ['M', 'L'], sequence, pos + 1)) {
        seq.push(63);
        currentEncoding = 'A';
      } else if (length === 3) {
        seq.push(57);
      } else if (length === 2) {
        seq.push(56);
      } else if (length === 1) {
        seq.push(59);
      } else {
        seq.push(63);
        currentEncoding = 'A';
      }
    }

    for (let i = 0; i < length; i++) {
      seq.push(this.codeSetA.indexOf(data[i]));
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes Code Set B.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   * If the currentEncoding is not code set B, we provide the codeword to latch/switch.
   */
  private encodeCodeB(data: string, currentEncoding: string, sequence: Seq[], pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [];

    const length = data.length;
    if (currentEncoding === 'C' || currentEncoding === 'D' || currentEncoding === 'E') {
      seq.push(63);
      currentEncoding = 'B';
    } else if (currentEncoding === 'A') {
      // Find if the next sequence is forcing B
      if (this.isNextSequence('B', ['M', 'L'], sequence, pos + 1) || length !== 1) {
        seq.push(63);
        currentEncoding = 'B';
      } else {
        seq.push(59);
      }
    }

    for (let i = 0; i < length; i++) {
      seq.push(this.codeSetB.indexOf(data[i]));
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes Code Set C.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   * If the currentEncoding is not code set C, we provide the codeword to latch/switch.
   */
  private encodeCodeC(data: string, currentEncoding: string, _sequence: Seq[], _pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [];

    const length = data.length;
    if (currentEncoding !== 'C' && length >= 4) {
      seq.push(60);
      seq.push(60); // We lock in
      currentEncoding = 'C';
    }

    for (let i = 0; i < length; i++) {
      if (currentEncoding !== 'C') {
        seq.push(60);
      }

      seq.push(this.codeSetC.indexOf(data[i]));
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes Code Set D.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   * If the currentEncoding is not code set D, we provide the codeword to latch/switch.
   */
  private encodeCodeD(data: string, currentEncoding: string, _sequence: Seq[], _pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [];

    const length = data.length;
    if (currentEncoding !== 'D' && length >= 4) {
      seq.push(61);
      seq.push(61); // We lock in
      currentEncoding = 'D';
    }

    for (let i = 0; i < length; i++) {
      if (currentEncoding !== 'D') {
        seq.push(61);
      }

      seq.push(this.codeSetD.indexOf(data[i]));
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes Code Set E.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   * If the currentEncoding is not code set E, we provide the codeword to latch/switch.
   */
  private encodeCodeE(data: string, currentEncoding: string, _sequence: Seq[], _pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [];

    const length = data.length;
    if (currentEncoding !== 'E' && length >= 4) {
      seq.push(62);
      seq.push(62); // We lock in
      currentEncoding = 'E';
    }

    for (let i = 0; i < length; i++) {
      if (currentEncoding !== 'E') {
        seq.push(62);
      }

      seq.push(this.codeSetE.indexOf(data[i]));
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes ECI character. The data will be \xxxxxx.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   */
  private encodeCodeG(data: string, currentEncoding: string, _sequence: Seq[], _pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [27];
    const eci = parseInt(data.substring(1), 10);
    let code: number = 0;
    let mode: number = 0;
    if (eci <= 31) {
      code = eci;
      mode = 1;
    } else if (eci <= 1023) {
      code = eci + 2048;
      mode = 2;
    } else if (eci <= 32767) {
      code = eci + 196608;
      mode = 3;
    } else if (eci <= 999999) {
      code = eci + 14680064;
      mode = 4;
    }

    switch (mode) {
      case 4:
        seq.push((code & 16515072) >> 18);
      //goto case 3;
      case 3:
        seq.push((code & 258048) >> 12);
      //goto case 2;
      case 2:
        seq.push((code & 4032) >> 6);
      //goto case 1;
      case 1:
        seq.push(code & 63);
        break;
    }

    return {
      value: seq,
      currentEncoding
    };
  }

  /**
   * Encodes AE Codeset.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   */
  private encodeCodeK(data: string, currentEncoding: string, sequence: Seq[], pos: number): { value: number[]; currentEncoding: string } {
    if (currentEncoding === 'A' || currentEncoding === 'E') {
      return this.getEncodeCodeMethod(currentEncoding)(data, currentEncoding, sequence, pos);
    } else {
      if (this.isNextSequence('E', ['M', 'K'], sequence, pos + 1)) {
        return this.encodeCodeE(data, currentEncoding, sequence, pos);
      } else {
        return this.encodeCodeA(data, currentEncoding, sequence, pos);
      }
    }
  }

  /**
   * Encodes AB Codeset.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   */
  private encodeCodeL(data: string, currentEncoding: string, sequence: Seq[], pos: number): { value: number[]; currentEncoding: string } {
    if (currentEncoding === 'A' || currentEncoding === 'B') {
      return this.getEncodeCodeMethod(currentEncoding)(data, currentEncoding, sequence, pos);
    } else {
      if (this.isNextSequence('B', ['M', 'L'], sequence, pos + 1)) {
        return this.encodeCodeB(data, currentEncoding, sequence, pos);
      } else {
        return this.encodeCodeA(data, currentEncoding, sequence, pos);
      }
    }
  }

  /**
   * Encodes Mixed Codeset.
   *
   * The method transforms string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   */
  private encodeCodeM(data: string, currentEncoding: string, sequence: Seq[], pos: number): { value: number[]; currentEncoding: string } {
    return this.getEncodeCodeMethod(currentEncoding)(data, currentEncoding, sequence, pos);
  }

  /**
   * Encodes Numeric.
   *
   * The method transforms numerical string into codewords.
   * The data value should be clean and all characters are supposed to be allowed.
   */
  private encodeCodeN(data: string, currentEncoding: string, _sequence: Seq[], _pos: number): { value: number[]; currentEncoding: string } {
    const seq: number[] = [31];
    const n1 = parseInt(data, 10);
    const number = Utility.decbin(n1, 30);
    seq.push(Utility.bindec(number.substring(0, 6)));
    seq.push(Utility.bindec(number.substring(6, 12)));
    seq.push(Utility.bindec(number.substring(12, 18)));
    seq.push(Utility.bindec(number.substring(18, 24)));
    seq.push(Utility.bindec(number.substring(24, 30)));

    return {
      value: seq,
      currentEncoding
    };
  }

  private getEncodeCodeMethod(
    code: string
  ): (data: string, currentEncodign: string, seq: Seq[], pos: number) => { value: number[]; currentEncoding: string } {
    switch (code) {
      case 'A':
        return this.encodeCodeA.bind(this);
      case 'B':
        return this.encodeCodeB.bind(this);
      case 'C':
        return this.encodeCodeC.bind(this);
      case 'D':
        return this.encodeCodeD.bind(this);
      case 'E':
        return this.encodeCodeE.bind(this);
      case 'G':
        return this.encodeCodeG.bind(this);
      case 'K':
        return this.encodeCodeK.bind(this);
      case 'L':
        return this.encodeCodeL.bind(this);
      case 'M':
        return this.encodeCodeM.bind(this);
      case 'N':
        return this.encodeCodeN.bind(this);
      default:
        throw new Error('Not possible'); // Differ from PHP
    }
  }

  /**
   * Checks if we can find the needle in the following sequence
   * without hitting any not allowed sequences.
   */
  private isNextSequence(needle: string, allowed: string[], sequence: Seq[], position: number): boolean {
    const c = sequence.length;
    for (; position < c; position++) {
      if (sequence[position].sequence === needle) {
        return true;
      } else if (allowed.indexOf(sequence[position].sequence) === -1) {
        break;
      }
    }

    return false;
  }

  /**
   * Adds the required padding to the data according with the number of error message required.
   * The correct padding is added based on the final encoding.
   */
  private getDataWithPadding(data: number[]): number[] {
    // We need to reach 144
    const numberErrorCodewordsRequired = this.getNumberErrorCodewordsRequired();
    let requiredPad = 144 - data.length - numberErrorCodewordsRequired - 10; // -10 is for error correction primary message

    if (requiredPad > 0) {
      if (this.finalEncodingMode === 'C' || this.finalEncodingMode === 'D') {
        data.push(58); // Latch A
        requiredPad--;
      }

      if (requiredPad > 0) {
        let encodingPadCodeword = 33;
        if (this.finalEncodingMode === 'E') {
          encodingPadCodeword = 28;
        }

        for (let i = 0; i < requiredPad; i++) {
          data.push(encodingPadCodeword);
        }
      }
    } else if (requiredPad < 0) {
      throw new BCGParseException('maxicode', 'The barcode cannot hold your data. Change the mode or reduce the number of data.');
    }

    return data;
  }

  /**
   * Gets the division of the data.
   * Will return an array with the following keys: primary, secondaryOdd, secondaryEven
   */
  private getSubdivisions(data: number[]): BCGmaxicodeMessage {
    const primaryMessage = data.slice(0, 10);
    const secondaryMessage = data.slice(10, data.length);

    const secondaryMessageOdd: number[] = [];
    const secondaryMessageEven: number[] = [];
    const c = secondaryMessage.length;
    for (let i = 0; i < c; i += 2) {
      secondaryMessageOdd.push(secondaryMessage[i]);
      secondaryMessageEven.push(secondaryMessage[i + 1]); // Assume we receive a pair amount
    }

    return new BCGmaxicodeMessage(primaryMessage, secondaryMessageOdd, secondaryMessageEven);
  }

  /**
   * Gets the error messages of the subdivisions and based on the number of required error code words.
   * Will return an array with the following keys: primary, secondaryOdd, secondaryEven
   */
  private getErrorMessages(subdivisions: BCGmaxicodeMessage): BCGmaxicodeMessage {
    const requiredError = this.getNumberErrorCodewordsRequired();

    const dictionaryPrimary: { [key: number]: number } = {};
    const dictionarySecondaryOdd: { [key: number]: number } = {};
    const dictionarySecondaryEven: { [key: number]: number } = {};

    let index = 0;
    for (const item of subdivisions.primary) {
      dictionaryPrimary[index++] = item;
    }

    index = 0;
    for (const item of subdivisions.secondaryOdd) {
      dictionarySecondaryOdd[index++] = item;
    }

    index = 0;
    for (const item of subdivisions.secondaryEven) {
      dictionarySecondaryEven[index++] = item;
    }

    const errorMessages = new BCGmaxicodeMessage(
      BCGmaxicode.reedSolomon(dictionaryPrimary, 10, 10, BCGmaxicode._GF, BCGmaxicode._MODULUS),
      BCGmaxicode.reedSolomon(
        dictionarySecondaryOdd,
        subdivisions.secondaryOdd.length,
        requiredError / 2,
        BCGmaxicode._GF,
        BCGmaxicode._MODULUS
      ),
      BCGmaxicode.reedSolomon(
        dictionarySecondaryEven,
        subdivisions.secondaryEven.length,
        requiredError / 2,
        BCGmaxicode._GF,
        BCGmaxicode._MODULUS
      )
    );

    return errorMessages;
  }

  /**
   * Reconstructs the final message based on the subdivisions and error messages.
   * Will return an array with the following keys: primary, secondary
   */
  private getFinalMessage(subdivisions: BCGmaxicodeMessage, errorMessages: BCGmaxicodeMessage): BCGmaxicodeFinalMessage {
    const final = new BCGmaxicodeFinalMessage([], []);

    final.primary = final.primary.concat(subdivisions.primary);
    final.primary = final.primary.concat(errorMessages.primary);

    let tempOdd: number[] = [];
    tempOdd = tempOdd.concat(subdivisions.secondaryOdd);
    tempOdd = tempOdd.concat(errorMessages.secondaryOdd);

    let tempEven: number[] = [];
    tempEven = tempEven.concat(subdivisions.secondaryEven);
    tempEven = tempEven.concat(errorMessages.secondaryEven);

    const c = tempOdd.length;
    for (let i = 0; i < c; i++) {
      final.secondary.push(tempOdd[i]);
      final.secondary.push(tempEven[i]); // Assume same length
    }

    return final;
  }

  /**
   * Gets the postal code in binary format.
   * If the mode is 2, the postal code will be numeric.
   * Otherwise, the postal code is alphanumeric.
   */
  private getPostalCodeBinary(postalCode: string | null): string {
    if (this.mode === 2) {
      const postalCodeInt = parseInt(postalCode ?? '0', 10);
      const postalCodeBinary = Utility.decbin(postalCodeInt, 30);
      const lengthBinary = Utility.decbin(postalCode?.length ?? 0, 6);

      return lengthBinary + postalCodeBinary;
    } else {
      // Check if the postalCode is only from Code Set A
      let temp = postalCode ?? '';
      let seq: Seq[];
      ({ value: seq, text: temp } = this.getSequence(temp));
      postalCode = temp;
      const c = seq.length;
      for (let i = 0; i < c; i++) {
        if (seq[i].sequence !== 'A' && seq[i].sequence !== 'L' && seq[i].sequence !== 'K') {
          throw new BCGParseException('maxicode', 'The postal code in mode 3 can only contain data from the Code Set A.');
        }
      }

      let currentEncoding = 'A';
      let postalCodeCodewords: number[];
      ({ value: postalCodeCodewords, currentEncoding } = this.encodeCodeA(postalCode, currentEncoding, [new Seq('A')], 0));

      // Take a maximum of 6 character
      postalCodeCodewords = postalCodeCodewords.slice(0, Math.min(6, postalCodeCodewords.length));
      for (let i = postalCodeCodewords.length; i < 6; i++) {
        postalCodeCodewords.push(32);
      }

      let postalCodeBinary = '';
      for (let i = 0; i < 6; i++) {
        postalCodeBinary += Utility.decbin(postalCodeCodewords[i], 6);
      }

      return postalCodeBinary;
    }
  }

  /**
   * Gets the codeword primary message.
   */
  private getPrimaryMessage(): number[] {
    // Must set the primary message in those modes
    if (this.primary === null) {
      throw new BCGParseException('maxicode', 'You must set the primary message if you use the mode 2 or 3.');
    }

    const modeBinary = Utility.decbin(this.mode, 4);
    const serviceClassBinary = Utility.decbin(this.primary.serviceClass, 10);
    const countryCodeBinary = Utility.decbin(this.primary.countryCode, 10);
    const postalCodeBinary = this.getPostalCodeBinary(this.primary.postalCode);

    const finalBinary =
      postalCodeBinary.substring(34, 36) +
      modeBinary +
      postalCodeBinary.substring(28, 34) +
      postalCodeBinary.substring(22, 28) +
      postalCodeBinary.substring(16, 22) +
      postalCodeBinary.substring(10, 16) +
      postalCodeBinary.substring(4, 10) +
      countryCodeBinary.substring(8, 10) +
      postalCodeBinary.substring(0, 4) +
      countryCodeBinary.substring(2, 8) +
      serviceClassBinary.substring(6, 10) +
      countryCodeBinary.substring(0, 2) +
      serviceClassBinary.substring(0, 6);

    const message: number[] = [];
    for (let i = 0; i < 10; i++) {
      message.push(Utility.bindec(finalBinary.substring(i * 6, i * 6 + 6)));
    }

    return message;
  }

  /**
   * Sets the data and prepares the drawing but does not draw it.
   */
  private setData(data: number[]): void {
    // We fill the beginning
    let firstSection: number[];
    if (this.mode === 2 || this.mode === 3) {
      // Exception moved to GetPrimaryMessage(); // Different from PHP
      firstSection = this.getPrimaryMessage();
    } else {
      // If we have a primary message here, the user must select the correct mode
      if (this.primary !== null) {
        throw new BCGParseException('maxicode', 'You must use the mode 2 or 3 if you use the primary message.');
      }

      firstSection = [this.mode];
    }

    let finalData: number[] = [];
    finalData = finalData.concat(firstSection);
    finalData = finalData.concat(this.getStructuredAppendCodewords());
    finalData = finalData.concat(data);

    data = this.getDataWithPadding(finalData);
    const subdivisions = this.getSubdivisions(data);
    const errorMessages = this.getErrorMessages(subdivisions);
    const final = this.getFinalMessage(subdivisions, errorMessages);

    this.data = [];
    this.data = this.data.concat(final.primary);
    this.data = this.data.concat(final.secondary);
  }

  /**
   * Returns the 2 codewords for Structured Append only if activated.
   */
  private getStructuredAppendCodewords(): number[] {
    const codewords: number[] = [];
    if (this.symbolNumber > 0) {
      codewords[0] = 33;
      codewords[1] = ((this.symbolNumber - 1) << 3) | (this.symbolTotal - 1);
      return codewords;
    }

    return [];
  }

  /**
   * Gets the number of error codewords required based on the mode.
   */
  private getNumberErrorCodewordsRequired(): number {
    return this.mode === 5 ? BCGmaxicode._ERRORMODEEEC : BCGmaxicode._ERRORMODESEC;
  }

  /**
   * Returns if the character represents the ECI code \Exxxxxx
   * Returns 1 if ECI
   * Returns 2 if \
   */
  private isEscapedCharacter(text: string, i: number): number {
    if (this.acceptECI) {
      if (text[i] === '\\') {
        const temp = Utility.safeSubstring(text, i + 1, 6);
        if (temp.length === 6 && Utility.isNumeric(temp)) {
          return 1;
        } else if (text.length > i + 1 && text[i + 1] === '\\') {
          return 2;
        } else {
          throw new BCGParseException(
            'maxicode',
            'Incorrect ECI code detected. ECI code must contain a backslash followed by 6 digits or double the backslash to write one backslash.'
          );
        }
      }
    }

    return 0;
  }

  /**
   * Returns true if the char is numeric only.
   */
  private isCharNumeric(character: string): boolean {
    const o = character.charCodeAt(0);
    return o >= 0x30 && o <= 0x39;
  }

  /**
   * Returns true if the char from Code Set A or B.
   */
  private isCharCodeSetAB(character: string): boolean {
    const o = character.charCodeAt(0);
    return o === 58 || o === 47 || o === 46 || o === 44;
  }

  /**
   * Returns true if the char from Code Set A or E.
   */
  private isCharCodeSetAE(character: string): boolean {
    const o = character.charCodeAt(0);
    return o === 13;
  }

  /**
   * Returns true if the char from Code Set A, B, C, D, or E.
   */
  private isCharCodeSetABCDE(character: string): boolean {
    const o = character.charCodeAt(0);
    return o === 28 || o === 29 || o === 30 || o === 32;
  }

  /**
   * Returns true if the char from Code Set A.
   */
  private isCharCodeSetA(character: string): boolean {
    const o = character.charCodeAt(0);
    return (o >= 65 && o <= 90) || o === 13 || (o >= 34 && o <= 58) || this.isCharCodeSetABCDE(character);
  }

  /**
   * Returns true if the char from Code Set B.
   */
  private isCharCodeSetB(character: string): boolean {
    let o = character.charCodeAt(0);
    return (
      (o >= 96 && o <= 127) ||
      (o >= 58 && o <= 64) ||
      (o >= 91 && o <= 95) ||
      o === 33 ||
      o === 44 ||
      o === 46 ||
      o === 47 ||
      this.isCharCodeSetABCDE(character)
    );
  }

  /**
   * Returns true if the char from Code Set C.
   */
  private isCharCodeSetC(character: string): boolean {
    const o = character.charCodeAt(0);
    return (
      (o >= 192 && o <= 223) ||
      o === 170 ||
      o === 172 ||
      o === 177 ||
      o === 178 ||
      o === 179 ||
      o === 181 ||
      o === 185 ||
      o === 186 ||
      o === 188 ||
      o === 189 ||
      o === 190 ||
      (o >= 128 && o <= 137) ||
      this.isCharCodeSetABCDE(character)
    );
  }

  /**
   * Returns true if the char from Code Set D.
   */
  private isCharCodeSetD(character: string): boolean {
    const o = character.charCodeAt(0);
    return (
      (o >= 224 && o <= 255) ||
      o === 161 ||
      o === 168 ||
      o === 171 ||
      o === 175 ||
      o === 176 ||
      o === 180 ||
      o === 183 ||
      o === 184 ||
      o === 187 ||
      o === 191 ||
      (o >= 138 && o <= 148) ||
      this.isCharCodeSetABCDE(character)
    );
  }

  /**
   * Returns true if the char from Code Set E.
   */
  private isCharCodeSetE(character: string): boolean {
    const o = character.charCodeAt(0);
    return (
      (o >= 0 && o <= 26) ||
      o === 27 ||
      o === 31 ||
      o === 159 ||
      o === 160 ||
      (o >= 162 && o <= 167) ||
      o === 169 ||
      o === 173 ||
      o === 174 ||
      o === 182 ||
      (o >= 149 && o <= 158) ||
      this.isCharCodeSetABCDE(character)
    );
  }

  /**
   * Depending on the text, it will return the correct
   * sequence to encode the text.
   * Each data is for the Version 1-9, 10-26 and 27-40 respectivitely. Followed by the Micro 1 to 4.
   * The data will contain letters indicating each character has to be encoded in which
   * type. N=Numeric, T=Text, B=Byte
   */
  private getSequence(text: string): { value: Seq[]; text: string } {
    // A=> code Set A
    // B=> code Set B
    // C=> code Set C
    // D=> code Set D
    // E=> code Set E
    // G=> ECI
    // K=> code Set A or E
    // L=> code Set A or B
    // M=> mixed encoding used in all code Set
    // N=> Numeric
    let c: number;
    let textSeq = '';
    let textLen = text.length;
    for (let i = 0; i < textLen; i++) {
      let escapedCharacter = 0;
      if ((escapedCharacter = this.isEscapedCharacter(text, i)) > 0) {
        if (escapedCharacter === 1) {
          textSeq += 'GGGGGGG';
          i += 6;
        } else {
          text = text.substring(0, i) + text.substring(i + 1);
          textLen--;
          textSeq += 'B';
        }
      } else if (this.isCharNumeric(text[i])) {
        textSeq += 'N';
      } else if (this.isCharCodeSetABCDE(text[i])) {
        textSeq += 'M';
      } else if (this.isCharCodeSetAB(text[i])) {
        textSeq += 'L';
      } else if (this.isCharCodeSetAE(text[i])) {
        textSeq += 'K';
      } else if (this.isCharCodeSetA(text[i])) {
        textSeq += 'A';
      } else if (this.isCharCodeSetB(text[i])) {
        textSeq += 'B';
      } else if (this.isCharCodeSetC(text[i])) {
        textSeq += 'C';
      } else if (this.isCharCodeSetD(text[i])) {
        textSeq += 'D';
      } else if (this.isCharCodeSetE(text[i])) {
        textSeq += 'E';
      } else {
        throw new BCGParseException('maxicode', 'Unknown character');
      }
    }

    let finalSequence: Seq[];
    ({ value: finalSequence, text: textSeq } = this.getSequenceLetter(textSeq, 'N', 9, true));
    textSeq = textSeq.replace(/N/g, 'A');

    let temp: Seq[];
    ({ value: temp, text: textSeq } = this.getSequenceLetter(textSeq, 'G', 7, true));
    finalSequence = finalSequence.concat(temp);

    const letters = 'ABCDEKLM';
    c = letters.length;
    for (let i = 0; i < c; i++) {
      ({ value: temp, text: textSeq } = this.getSequenceLetter(textSeq, letters[i], 1));
      finalSequence = finalSequence.concat(temp);
    }

    finalSequence.sort((a: Seq, b: Seq) => {
      if (a.pos < b.pos) {
        return -1;
      } else {
        return 1;
      }
    });

    // Skipping the loop from PHP as we don't need to recreate a sequence.
    return {
      value: finalSequence,
      text
    };
  }

  /**
   * Gets the sequence letter.
   */
  private getSequenceLetter(text: string, search: string, length: number, fixedLength: boolean = false): { value: Seq[]; text: string } {
    const finalSequence: Seq[] = [];
    const fullSearch = Utility.strRepeat(search, length);
    const textLen = fixedLength ? length : text.length;
    let pos: number;
    while ((pos = text.indexOf(fullSearch)) !== -1) {
      let i = pos + length;
      for (; i < textLen; i++) {
        if (text[i] !== search) {
          break;
        }
      }

      const finalLength = i - pos;
      text = text.substring(0, pos) + Utility.strRepeat('Z', finalLength) + text.substring(pos + finalLength);
      finalSequence.push(new Seq(search, finalLength, pos));
    }

    return {
      value: finalSequence,
      text
    };
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
        c[j] = c[j - 1] ^ BCGmaxicode.prod(c[j], alog[i], log, alog);
      }

      c[0] = BCGmaxicode.prod(c[0], alog[i], log, alog);
    }

    const t = nd + nc;
    for (let i = nd; i <= t; i++) {
      wd[i] = 0;
    }

    for (let i = 0; i < nd; i++) {
      const k = wd[nd] ^ wd[i];
      for (let j = 0; j < nc; j++) {
        wd[nd + j] = wd[nd + j + 1] ^ BCGmaxicode.prod(k, c[nc - j - 1], log, alog);
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
      return alog[(log[x] + log[y]) % (BCGmaxicode._GF - 1)];
    }
  }
}

class Seq {
  constructor(
    public sequence: string,
    public amount: number = 0,
    public pos: number = 0
  ) {}
}

class BCGmaxicodePrimaryMessage {
  constructor(
    public serviceClass: number,
    public countryCode: number,
    public postalCode: string | null
  ) {}
}

class BCGmaxicodeFinalMessage {
  constructor(
    public primary: number[],
    public secondary: number[]
  ) {}
}

class BCGmaxicodeMessage {
  constructor(
    public primary: number[],
    public secondaryOdd: number[],
    public secondaryEven: number[]
  ) {}
}

export { BCGmaxicode };
