'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

/**
 * The data input.
 */
class BCGDataInput<T> {
  /**
   * Initializes the class.
   *
   * @param mode The mode.
   * @param data The data.
   */
  constructor(
    public mode: T,
    public data: string
  ) {}
}

export { BCGDataInput };
