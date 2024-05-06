'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

class BCGArgumentException extends Error {
  /**
   * Constructor with specific message for a parameter.
   *
   * @param message The message.
   * @param param The param.
   */
  constructor(
    message?: string,
    public readonly param?: string
  ) {
    super(message);
  }
}

export { BCGArgumentException };
