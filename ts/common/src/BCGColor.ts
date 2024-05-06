'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { imagecolorallocate, imagecolortransparent, Surface } from './draw';

/**
 * Holds Color in RGB Format.
 */
class BCGColor {
  /**
   * Hexadecimal value for R.
   */
  protected vR: number;

  /**
   * Hexadecimal value for G.
   */
  protected vG: number;

  /**
   * Hexadecimal value for B.
   */
  protected vB: number;

  /**
   * Indicates if the color is considered transparent.
   */
  protected transparent = false;

  /**
   * Saves RGB value into the classes.
   * Given 3 parameters int (R, G, B).
   *
   * @param r Red.
   * @param g Green.
   * @param b Blue.
   */
  constructor(r: number, g: number, b: number);

  /**
   * Saves RGB value into the classes.
   * Given 1 parameter string hex value (#ff0000) (preceding with #), or
   * Given 1 parameter string color code(white, black, orange...)
   *
   * @param color The color.
   */
  constructor(color: string | number);
  constructor();

  constructor(arg0?: number | string, arg1?: number, arg2?: number) {
    if (typeof arg0 === 'number' && arg1 !== undefined && arg2 !== undefined) {
      this.vR = arg0;
      this.vG = arg1;
      this.vB = arg2;
    } else if (arg0 !== undefined) {
      if (typeof arg0 === 'string' && arg0.length === 7 && arg0[0] === '#') {
        // Hex Value in String
        this.vR = parseInt(arg0.substring(1, 3), 16);
        this.vG = parseInt(arg0.substring(3, 5), 16);
        this.vB = parseInt(arg0.substring(5, 7), 16);
      } else {
        if (typeof arg0 === 'string') {
          arg0 = BCGColor.getColor(arg0);
        }

        this.vR = (arg0 & 0xff0000) >> 16;
        this.vG = (arg0 & 0x00ff00) >> 8;
        this.vB = arg0 & 0x0000ff;
      }
    } else {
      this.vR = this.vG = this.vB = 0;
    }
  }

  /**
   * Sets the color transparent.
   *
   * @param transparent Indicates if the color should be transparent.
   */
  setTransparent(transparent: boolean): void {
    this.transparent = transparent;
  }

  /**
   * Returns Red Color.
   *
   * @return The red color.
   */
  r(): number {
    return this.vR;
  }

  /**
   * Returns Green Color.
   *
   * @return The green color.
   */
  g(): number {
    return this.vG;
  }

  /**
   * Returns Blue Color.
   *
   * @return The blue color.
   */
  b(): number {
    return this.vB;
  }

  /**
   * Creates a color to be used on the surface.
   *
   * @param image The surface
   * @return The color.
   */
  allocate(image: Surface): { r: number; g: number; b: number } {
    const allocated = imagecolorallocate(image, this.vR, this.vG, this.vB);
    if (this.transparent) {
      return imagecolortransparent(image, allocated);
    } else {
      return allocated;
    }
  }

  /**
   * Returns class of Color depending of the string color.
   *
   * If the color doens't exist, it takes the default one.
   *
   * @param code The color name.
   * @param defaultColor The default color name.
   */
  static getColor(code: string, defaultColor: string = 'white'): number {
    defaultColor = defaultColor || 'white';
    switch (code.toLowerCase()) {
      case '':
      case 'white':
        return 0xffffff;
      case 'black':
        return 0x000000;
      case 'maroon':
        return 0x800000;
      case 'red':
        return 0xff0000;
      case 'orange':
        return 0xffa500;
      case 'yellow':
        return 0xffff00;
      case 'olive':
        return 0x808000;
      case 'purple':
        return 0x800080;
      case 'fuchsia':
        return 0xff00ff;
      case 'lime':
        return 0x00ff00;
      case 'green':
        return 0x008000;
      case 'navy':
        return 0x000080;
      case 'blue':
        return 0x0000ff;
      case 'aqua':
        return 0x00ffff;
      case 'teal':
        return 0x008080;
      case 'silver':
        return 0xc0c0c0;
      case 'gray':
        return 0x808080;
      default:
        return BCGColor.getColor(defaultColor, 'white');
    }
  }
}

export { BCGColor };
