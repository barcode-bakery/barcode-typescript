'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException, BCGLabel, BCGParseException, Utility } from '@barcode-bakery/barcode-common';
import { BCGean13 } from './BCGean13';

/**
 * ISBN-10 and ISBN-13.
 *
 * You can provide an ISBN with 10 digits with or without the checksum.
 * You can provide an ISBN with 13 digits with or without the checksum.
 * Calculate the ISBN based on the EAN-13 encoding.
 *
 * The checksum is always displayed.
 */
class BCGisbn extends BCGean13 {
  private gs1: BCGisbn.GS1;

  /**
   * Creates a ISBN barcode.
   *
   * @param gs1 The GS1.
   */
  constructor(gs1?: BCGisbn.GS1 | null) {
    super();
    this.gs1 = gs1 || BCGisbn.GS1.Auto;
  }

  /**
   * Adds the default label.
   */
  protected addDefaultLabel(): void {
    if (this.isDefaultEanLabelEnabled()) {
      const isbn = this.createISBNText();
      const font = this.font;

      const topLabel = new BCGLabel(isbn, font, BCGLabel.Position.Top, BCGLabel.Alignment.Center);

      this.addLabel(topLabel);
    }

    super.addDefaultLabel();
  }

  /**
   * Sets the first numbers of the barcode.
   *  - GS1_AUTO: Adds 978 before the code
   *  - GS1_PREFIX978: Adds 978 before the code
   *  - GS1_PREFIX979: Adds 979 before the code
   *
   * @param gs1 The GS1 code.
   */
  setGS1(gs1: BCGisbn.GS1): void {
    gs1 = parseInt(gs1.toString(), 10);
    if (gs1 !== BCGisbn.GS1.Auto && gs1 !== BCGisbn.GS1.PREFIX978 && gs1 !== BCGisbn.GS1.PREFIX979) {
      throw new BCGArgumentException('The GS1 argument must be BCGisbn.GS1.Auto, BCGisbn.GS1.PREFIX978, or BCGisbn.GS1.PREFIX979', 'gs1');
    }

    this.gs1 = gs1;
  }

  /**
   * Check chars allowed.
   */
  protected checkCharsAllowed(): void {
    const c = this.text.length;

    // Special case, if we have 10 digits, the last one can be X
    if (c === 10) {
      if (Utility.arraySearch(this.keys, this.text[9]) === -1 && this.text[9] !== 'X') {
        throw new BCGParseException('Isbn', "The character '" + this.text[9] + "' is not allowed.");
      }

      // Drop the last char
      this.text = this.text.substring(0, 9);
    }

    super.checkCharsAllowed();
  }

  /**
   * Check correct length.
   */
  protected checkCorrectLength(): void {
    const c = this.text.length;

    // If we have 13 chars just flush the last one
    if (c === 13) {
      this.text = this.text.substring(0, 12);
    } else if (c === 9 || c === 10) {
      if (c === 10) {
        // Before dropping it, we check if it's legal
        if (Utility.arraySearch(this.keys, this.text[9]) === -1 && this.text[9] !== 'X') {
          throw new BCGParseException('Isbn', "The character '" + this.text[9] + "' is not allowed.");
        }

        this.text = this.text.substring(0, 9);
      }

      if (this.gs1 === BCGisbn.GS1.Auto || this.gs1 === BCGisbn.GS1.PREFIX978) {
        this.text = '978' + this.text;
      } else if (this.gs1 === BCGisbn.GS1.PREFIX979) {
        this.text = '979' + this.text;
      }
    } else if (c !== 12) {
      throw new BCGParseException('Isbn', 'The code parsed must be 9, 10, 12, or 13 digits long.');
    }
  }

  /**
   * Creates the ISBN text.
   *
   * @return The ISBN text.
   */
  private createISBNText(): string {
    let isbn = '';
    if (this.text !== '') {
      // We try to create the ISBN Text... the hyphen really depends the ISBN agency.
      // We just put one before the checksum and one after the GS1 if present.
      const c = this.text.length;
      if (c === 12 || c === 13) {
        // If we have 13 characters now, just transform it temporarily to find the checksum...
        // Further in the code we take care of that anyway.
        let lastCharacter = '';
        if (c === 13) {
          lastCharacter = this.text[12];
          this.text = this.text.substring(0, 12);
        }

        const checksum = this.processChecksum();
        isbn = 'ISBN ' + this.text.substring(0, 3) + '-' + this.text.substring(3, 12) + '-' + checksum;

        // Put the last character back
        if (c === 13) {
          this.text += lastCharacter;
        }
      } else if (c === 9 || c === 10) {
        let checksum = 0;
        for (let i = 10; i >= 2; i--) {
          checksum += parseInt(this.text[10 - i], 10) * i;
        }

        checksum = 11 - (checksum % 11);

        isbn = 'ISBN ' + this.text.substring(0, 9) + '-' + (checksum === 10 ? 'X' : checksum);
      }
    }

    return isbn;
  }
}

namespace BCGisbn {
  /**
   * GS1 Prefix.
   */
  export enum GS1 {
    /**
     * Auto Prefix.
     */
    Auto = 0,

    /**
     * Prefix 978.
     */
    PREFIX978 = 1,

    /**
     * Prefix 979.
     */
    PREFIX979 = 2
  }
}

export { BCGisbn };
