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
 * QRCode.
 */
class BCGqrcode extends BCGBarcode2D {
  private static readonly _GF: number = 256;

  private data: BCGqrcodePixel[][] | null = null;

  private errorLevel = 1;
  private size = BCGqrcode.Size.Full;
  private quietZone = true;
  private mirror = false;
  private mask = -1;
  private qrSize = -1;
  private qrMicro = false;
  private symbolNumber = 0;
  private symbolTotal = 0;
  private symbolData: string | null = null;

  private fnc1 = BCGqrcode.Fnc1.None;
  private fnc1Id: string | null = null;

  private acceptECI = false;

  // Ordered List
  private symbols: BCGqrcodeInfo[] = [
    new BCGqrcodeInfoMicro1(1, true, 36, [20, 0, 0, 0], [[1], [0], [0], [0]]),
    new BCGqrcodeInfoMicro2(2, true, 80, [40, 32, 0, 0], [[1], [1], [0], [0]]),
    new BCGqrcodeInfoMicro3(3, true, 132, [84, 68, 0, 0], [[1], [1], [0], [0]]),
    new BCGqrcodeInfoMicro4(4, true, 192, [128, 112, 80, 0], [[1], [1], [1], [0]]),
    new BCGqrcodeInfoFullSmall(1, false, 208, [152, 128, 104, 72], [[1], [1], [1], [1]]),
    new BCGqrcodeInfoFullSmall(2, false, 359, [272, 224, 176, 128], [[1], [1], [1], [1]]),
    new BCGqrcodeInfoFullSmall(3, false, 567, [440, 352, 272, 208], [[1], [1], [2], [2]]),
    new BCGqrcodeInfoFullSmall(4, false, 807, [640, 512, 384, 288], [[1], [2], [2], [4]]),
    new BCGqrcodeInfoFullSmall(5, false, 1079, [864, 688, 496, 368], [[1], [2], [2, 2], [2, 2]]),
    new BCGqrcodeInfoFullSmall(6, false, 1383, [1088, 864, 608, 480], [[2], [4], [4], [4]]),
    new BCGqrcodeInfoFullSmall(7, false, 1568, [1248, 992, 704, 528], [[2], [4], [2, 4], [4, 1]]),
    new BCGqrcodeInfoFullSmall(8, false, 1936, [1552, 1232, 880, 688], [[2], [2, 2], [4, 2], [4, 2]]),
    new BCGqrcodeInfoFullSmall(9, false, 2336, [1856, 1456, 1056, 800], [[2], [3, 2], [4, 4], [4, 4]]),
    new BCGqrcodeInfoFullMedium(
      10,
      false,
      2768,
      [2192, 1728, 1232, 976],
      [
        [2, 2],
        [4, 1],
        [6, 2],
        [6, 2]
      ]
    ),
    new BCGqrcodeInfoFullMedium(11, false, 3232, [2592, 2032, 1440, 1120], [[4], [1, 4], [4, 4], [3, 8]]),
    new BCGqrcodeInfoFullMedium(
      12,
      false,
      3728,
      [2960, 2320, 1648, 1264],
      [
        [2, 2],
        [6, 2],
        [4, 6],
        [7, 4]
      ]
    ),
    new BCGqrcodeInfoFullMedium(13, false, 4256, [3424, 2672, 1952, 1440], [[4], [8, 1], [8, 4], [12, 4]]),
    new BCGqrcodeInfoFullMedium(
      14,
      false,
      4651,
      [3688, 2920, 2088, 1576],
      [
        [3, 1],
        [4, 5],
        [11, 5],
        [11, 5]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      15,
      false,
      5243,
      [4184, 3320, 2360, 1784],
      [
        [5, 1],
        [5, 5],
        [5, 7],
        [11, 7]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      16,
      false,
      5867,
      [4712, 3624, 2600, 2024],
      [
        [5, 1],
        [7, 3],
        [15, 2],
        [3, 13]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      17,
      false,
      6523,
      [5176, 4056, 2936, 2264],
      [
        [1, 5],
        [10, 1],
        [1, 15],
        [2, 17]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      18,
      false,
      7211,
      [5768, 4504, 3176, 2504],
      [
        [5, 1],
        [9, 4],
        [17, 1],
        [2, 19]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      19,
      false,
      7931,
      [6360, 5016, 3560, 2728],
      [
        [3, 4],
        [3, 11],
        [17, 4],
        [9, 16]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      20,
      false,
      8683,
      [6888, 5352, 3880, 3080],
      [
        [3, 5],
        [3, 13],
        [15, 5],
        [15, 10]
      ]
    ),
    new BCGqrcodeInfoFullMedium(21, false, 9252, [7456, 5712, 4096, 3248], [[4, 4], [17], [17, 6], [19, 6]]),
    new BCGqrcodeInfoFullMedium(22, false, 10068, [8048, 6256, 4544, 3536], [[2, 7], [17], [7, 16], [34]]),
    new BCGqrcodeInfoFullMedium(
      23,
      false,
      10916,
      [8752, 6880, 4912, 3712],
      [
        [4, 5],
        [4, 14],
        [11, 14],
        [16, 14]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      24,
      false,
      11796,
      [9392, 7312, 5312, 4112],
      [
        [6, 4],
        [6, 14],
        [11, 16],
        [30, 2]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      25,
      false,
      12708,
      [10208, 8000, 5744, 4304],
      [
        [8, 4],
        [8, 13],
        [7, 22],
        [22, 13]
      ]
    ),
    new BCGqrcodeInfoFullMedium(
      26,
      false,
      13652,
      [10960, 8496, 6032, 4768],
      [
        [10, 2],
        [19, 4],
        [28, 6],
        [33, 4]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      27,
      false,
      14628,
      [11744, 9024, 6464, 5024],
      [
        [8, 4],
        [22, 3],
        [8, 26],
        [12, 28]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      28,
      false,
      15371,
      [12248, 9544, 6968, 5288],
      [
        [3, 10],
        [3, 23],
        [4, 31],
        [11, 31]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      29,
      false,
      16411,
      [13048, 10136, 7288, 5608],
      [
        [7, 7],
        [21, 7],
        [1, 37],
        [19, 26]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      30,
      false,
      17483,
      [13880, 10984, 7880, 5960],
      [
        [5, 10],
        [19, 10],
        [15, 25],
        [23, 25]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      31,
      false,
      18587,
      [14744, 11640, 8264, 6344],
      [
        [13, 3],
        [2, 29],
        [42, 1],
        [23, 28]
      ]
    ),
    new BCGqrcodeInfoFullLarge(32, false, 19723, [15640, 12328, 8920, 6760], [[17], [10, 23], [10, 35], [19, 35]]),
    new BCGqrcodeInfoFullLarge(
      33,
      false,
      20891,
      [16568, 13048, 9368, 7208],
      [
        [17, 1],
        [14, 21],
        [29, 19],
        [11, 46]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      34,
      false,
      22091,
      [17528, 13800, 9848, 7688],
      [
        [13, 6],
        [14, 23],
        [44, 7],
        [59, 1]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      35,
      false,
      23008,
      [18448, 14496, 10288, 7888],
      [
        [12, 7],
        [12, 26],
        [39, 14],
        [22, 41]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      36,
      false,
      24272,
      [19472, 15312, 10832, 8432],
      [
        [6, 14],
        [6, 34],
        [46, 10],
        [2, 64]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      37,
      false,
      25568,
      [20528, 15936, 11408, 8768],
      [
        [17, 4],
        [29, 14],
        [49, 10],
        [24, 46]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      38,
      false,
      26896,
      [21616, 16816, 12016, 9136],
      [
        [4, 18],
        [13, 32],
        [48, 14],
        [42, 32]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      39,
      false,
      28256,
      [22496, 17728, 12656, 9776],
      [
        [20, 4],
        [40, 7],
        [43, 22],
        [10, 67]
      ]
    ),
    new BCGqrcodeInfoFullLarge(
      40,
      false,
      29648,
      [23648, 18672, 13328, 10208],
      [
        [19, 6],
        [18, 31],
        [34, 34],
        [20, 61]
      ]
    )
  ];
  private symbol: BCGqrcodeInfo | null = null;

  private hasECI = false;

  ////private readonly Encoding utf8Encoding = Encoding.UTF8;
  ////private readonly Encoding shiftJisEncoding = Encoding.GetEncoding(932);

  private readonly alignmentPatterns = [
    [], // This index 0 is not used.
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];

  private readonly logTable = [
    -255, 255, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8, 76,
    113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77,
    228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210,
    19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43,
    78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38,
    184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86,
    211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246,
    108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122,
    117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175
  ];
  private readonly aLogTable = [
    1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192,
    157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111,
    222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225,
    223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199,
    147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82,
    164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227,
    219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83,
    166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235,
    203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 1
  ];

  private readonly aLogRS: { [key: number]: number[] } = {
    2: [3, 2],
    5: [31, 198, 63, 147, 116],
    6: [248, 1, 218, 32, 227, 38],
    7: [127, 122, 154, 164, 11, 68, 117],
    8: [255, 11, 81, 54, 239, 173, 200, 24],
    10: [216, 194, 159, 111, 199, 94, 95, 113, 157, 193],
    13: [137, 73, 227, 17, 177, 17, 52, 13, 46, 43, 83, 132, 120],
    14: [14, 54, 114, 70, 174, 151, 43, 158, 195, 127, 166, 210, 234, 163],
    15: [29, 196, 111, 163, 112, 74, 10, 105, 105, 139, 132, 151, 32, 134, 26],
    16: [59, 13, 104, 189, 68, 209, 30, 8, 163, 65, 41, 229, 98, 50, 36, 59],
    17: [119, 66, 83, 120, 119, 22, 197, 83, 249, 41, 143, 134, 85, 53, 125, 99, 79],
    18: [239, 251, 183, 113, 149, 175, 199, 215, 240, 220, 73, 82, 173, 75, 32, 67, 217, 146],
    20: [152, 185, 240, 5, 111, 99, 6, 220, 112, 150, 69, 36, 187, 22, 228, 198, 121, 121, 165, 174],
    22: [89, 179, 131, 176, 182, 244, 19, 189, 69, 40, 28, 137, 29, 123, 67, 253, 86, 218, 230, 26, 145, 245],
    24: [122, 118, 169, 70, 178, 237, 216, 102, 115, 150, 229, 73, 130, 72, 61, 43, 206, 1, 237, 247, 127, 217, 144, 117],
    26: [246, 51, 183, 4, 136, 98, 199, 152, 77, 56, 206, 24, 145, 40, 209, 117, 233, 42, 135, 68, 70, 144, 146, 77, 43, 94],
    28: [252, 9, 28, 13, 18, 251, 208, 150, 103, 174, 100, 41, 167, 12, 247, 56, 117, 119, 233, 127, 181, 100, 121, 147, 176, 74, 58, 197],
    30: [
      212, 246, 77, 73, 195, 192, 75, 98, 5, 70, 103, 177, 22, 217, 138, 51, 181, 246, 72, 25, 18, 46, 228, 74, 216, 195, 11, 106, 130, 150
    ],
    32: [
      116, 64, 52, 174, 54, 126, 16, 194, 162, 33, 33, 157, 176, 197, 225, 12, 59, 55, 253, 228, 148, 47, 179, 185, 24, 138, 253, 20, 142,
      55, 172, 88
    ],
    34: [
      206, 60, 154, 113, 6, 117, 208, 90, 26, 113, 31, 25, 177, 132, 99, 51, 105, 183, 122, 22, 43, 136, 93, 94, 62, 111, 196, 23, 126, 135,
      67, 222, 23, 10
    ],
    36: [
      28, 196, 67, 76, 123, 192, 207, 251, 185, 73, 124, 1, 126, 73, 31, 27, 11, 104, 45, 161, 43, 74, 127, 89, 26, 219, 59, 137, 118, 200,
      237, 216, 31, 243, 96, 59
    ],
    40: [
      210, 248, 240, 209, 173, 67, 133, 167, 133, 209, 131, 186, 99, 93, 235, 52, 40, 6, 220, 241, 72, 13, 215, 128, 255, 156, 49, 62, 254,
      212, 35, 99, 51, 218, 101, 180, 247, 40, 156, 38
    ],
    42: [
      108, 136, 69, 244, 3, 45, 158, 245, 1, 8, 105, 176, 69, 65, 103, 107, 244, 29, 165, 52, 217, 41, 38, 92, 66, 78, 34, 9, 53, 34, 242,
      14, 139, 142, 56, 197, 179, 191, 50, 237, 5, 217
    ],
    44: [
      174, 128, 111, 118, 188, 207, 47, 160, 252, 165, 225, 125, 65, 3, 101, 197, 58, 77, 19, 131, 2, 11, 238, 120, 84, 222, 18, 102, 199,
      62, 153, 99, 20, 50, 155, 41, 221, 229, 74, 46, 31, 68, 202, 49
    ],
    46: [
      129, 113, 254, 129, 71, 18, 112, 124, 220, 134, 225, 32, 80, 31, 23, 238, 105, 76, 169, 195, 229, 178, 37, 2, 16, 217, 185, 88, 202,
      13, 251, 29, 54, 233, 147, 241, 20, 3, 213, 18, 119, 112, 9, 90, 211, 38
    ],
    48: [
      61, 3, 200, 46, 178, 154, 185, 143, 216, 223, 53, 68, 44, 111, 171, 161, 159, 197, 124, 45, 69, 206, 169, 230, 98, 167, 104, 83, 226,
      85, 59, 149, 163, 117, 131, 228, 132, 11, 65, 232, 113, 144, 107, 5, 99, 53, 78, 208
    ],
    50: [
      247, 51, 213, 209, 198, 58, 199, 159, 162, 134, 224, 25, 156, 8, 162, 206, 100, 176, 224, 36, 159, 135, 157, 230, 102, 162, 46, 230,
      176, 239, 176, 15, 60, 181, 87, 157, 31, 190, 151, 47, 61, 62, 235, 255, 151, 215, 239, 247, 109, 167
    ],
    52: [
      248, 5, 177, 110, 5, 172, 216, 225, 130, 159, 177, 204, 151, 90, 149, 243, 170, 239, 234, 19, 210, 77, 74, 176, 224, 218, 142, 225,
      174, 113, 210, 190, 151, 31, 17, 243, 235, 118, 234, 30, 177, 175, 53, 176, 28, 172, 34, 39, 22, 142, 248, 10
    ],
    54: [
      196, 6, 56, 127, 89, 69, 31, 117, 159, 190, 193, 5, 11, 149, 54, 36, 68, 105, 162, 43, 189, 145, 6, 226, 149, 130, 20, 233, 156, 142,
      11, 255, 123, 240, 197, 3, 236, 119, 59, 208, 239, 253, 133, 56, 235, 29, 146, 210, 34, 192, 7, 30, 192, 228
    ],
    56: [
      52, 59, 104, 213, 198, 195, 129, 248, 4, 163, 27, 99, 37, 56, 112, 122, 64, 168, 142, 114, 169, 81, 215, 162, 205, 66, 204, 42, 98,
      54, 219, 241, 174, 24, 116, 214, 22, 149, 34, 151, 73, 83, 217, 201, 99, 111, 12, 200, 131, 170, 57, 112, 166, 180, 111, 116
    ],
    58: [
      211, 248, 6, 131, 97, 12, 222, 104, 173, 98, 28, 55, 235, 160, 216, 176, 89, 168, 57, 139, 227, 21, 130, 27, 73, 54, 83, 214, 71, 42,
      190, 145, 51, 201, 143, 96, 236, 44, 249, 64, 23, 43, 48, 77, 204, 218, 83, 233, 237, 48, 212, 161, 115, 42, 243, 51, 82, 197
    ],
    60: [
      104, 132, 6, 205, 58, 21, 125, 141, 72, 141, 86, 193, 178, 34, 86, 59, 24, 49, 204, 64, 17, 131, 4, 167, 7, 186, 124, 86, 34, 189,
      230, 211, 74, 148, 11, 140, 230, 162, 118, 177, 232, 151, 96, 49, 107, 3, 50, 127, 190, 68, 174, 172, 94, 12, 162, 76, 225, 128, 39,
      44
    ],
    62: [
      190, 112, 31, 67, 188, 9, 27, 199, 249, 113, 1, 236, 74, 201, 4, 61, 105, 118, 128, 26, 169, 120, 125, 199, 94, 30, 9, 225, 101, 5,
      94, 206, 50, 152, 121, 102, 49, 156, 69, 237, 235, 232, 122, 164, 41, 197, 242, 106, 124, 64, 28, 17, 6, 207, 98, 43, 204, 239, 37,
      110, 103, 52
    ],
    64: [
      193, 10, 255, 58, 128, 183, 115, 140, 153, 147, 91, 197, 219, 221, 220, 142, 28, 120, 21, 164, 147, 6, 204, 40, 230, 182, 14, 121, 48,
      143, 77, 228, 81, 85, 43, 162, 16, 195, 163, 35, 149, 154, 35, 132, 100, 100, 51, 176, 11, 161, 134, 208, 132, 244, 176, 192, 221,
      232, 171, 125, 155, 228, 242, 245
    ],
    66: [
      32, 199, 138, 150, 79, 79, 191, 10, 159, 237, 135, 239, 231, 152, 66, 131, 141, 179, 226, 246, 190, 158, 171, 153, 206, 226, 34, 212,
      101, 249, 229, 141, 226, 128, 238, 57, 60, 206, 203, 106, 118, 84, 161, 127, 253, 71, 44, 102, 155, 60, 78, 247, 52, 5, 252, 211, 30,
      154, 194, 52, 179, 3, 184, 182, 193, 26
    ],
    68: [
      131, 115, 9, 39, 18, 182, 60, 94, 223, 230, 157, 142, 119, 85, 107, 34, 174, 167, 109, 20, 185, 112, 145, 172, 224, 170, 182, 107, 38,
      107, 71, 246, 230, 225, 144, 20, 14, 175, 226, 245, 20, 219, 212, 51, 158, 88, 63, 36, 199, 4, 80, 157, 211, 239, 255, 7, 119, 11,
      235, 12, 34, 149, 204, 8, 32, 29, 99, 11
    ]
  };

  private readonly formatErrorCodeMicro = [
    0x4445, 0x4172, 0x4e2b, 0x4b1c, 0x55ae, 0x5099, 0x5fc0, 0x5af7, 0x6793, 0x62a4, 0x6dfd, 0x68ca, 0x7678, 0x734f, 0x7c16, 0x7921, 0x06de,
    0x03e9, 0x0cb0, 0x0987, 0x1735, 0x1202, 0x1d5b, 0x186c, 0x2508, 0x203f, 0x2f66, 0x2a51, 0x34e3, 0x31d4, 0x3e8d, 0x3bba
  ];
  private readonly formatErrorCodeFull = [
    0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0, 0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976, 0x1689,
    0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b, 0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed
  ];

  // This variable should start at index 7, so prepending 0.
  private readonly versionErrorCode = [
    0, 0, 0, 0, 0, 0, 0, 0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d, 0x0f928, 0x10b78, 0x1145d, 0x12a17,
    0x13532, 0x149a6, 0x15683, 0x168c9, 0x177ec, 0x18ec4, 0x191e1, 0x1afab, 0x1b08e, 0x1cc1a, 0x1d33f, 0x1ed75, 0x1f250, 0x209d5, 0x216f0,
    0x228ba, 0x2379f, 0x24b0b, 0x2542e, 0x26a64, 0x27541, 0x28c69
  ];
  private readonly errorCorrectionBinaryIndicator = [1, 0, 3, 2];

  private readonly errorCode: { [character: string]: number } = {
    L: 0,
    M: 1,
    Q: 2,
    H: 3
  };

  /**
   * Creates a QRCode barcode.
   */
  constructor() {
    super();
    this.setScale(4);
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    const c = text.length;
    if (c === 0) {
      throw new BCGParseException('qrcode', 'Provide data to parse.');
    }

    let seq; // TODO
    ({ value: seq, text } = this.getSequence(text));
    if (seq !== null) {
      const bitstream = this.createBinaryStream(text, seq);
      this.setData(bitstream);
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

    if (this.symbol === null) {
      throw new BCGDrawException('Undefined symbol');
    }

    const quietSize = this.quietZone ? (this.symbol.micro ? 4 : 8) : 0;

    const c = BCGqrcodeInfo.getSize(this.symbol);

    // Draws the quiet zone square
    if (this.quietZone) {
      super.drawFilledRectangle(image, 0, 0, c + quietSize - 1, c + quietSize - 1, BCGBarcode.COLOR_BG);
    }

    for (let x = 0; x < c; x++) {
      for (let y = 0; y < c; y++) {
        const xD = this.mirror ? c - x - 1 : x;

        this.drawPixel(image, x, y, this.data[xD][y].pixel ? BCGBarcode.COLOR_FG : BCGBarcode.COLOR_BG);
      }
    }

    this.drawText(image, 0, 0, c + quietSize, c + quietSize);
  }

  /**
   * Returns the maximal size of a barcode.
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    if (this.symbol === null) {
      return [width + 1, height + 1];
    } else {
      const size = BCGqrcodeInfo.getSize(this.symbol);
      const quietSize = this.quietZone ? (this.symbol.micro ? 4 : 8) : 0;
      const wh = size + quietSize;

      width += wh;
      height += wh;
      return super.getDimension(width, height, createSurface);
    }
  }

  /**
   * Sets the error level code (0=L, 1=M, 2=Q, or 3=H)
   *
   * @param level The error level.
   */
  setErrorLevel(level: string | number): void {
    if (typeof level === 'string') {
      if (!this.errorCode[level]) {
        throw new BCGArgumentException("This error level doesn't exist.", 'level');
      }

      this.setErrorLevel(this.errorCode[level]);
    } else {
      if (level < 0 || level > 3) {
        throw new BCGArgumentException('The error level must be between 0 and 3.', 'level');
      }

      this.errorLevel = level;
    }
  }

  /**
   * Sets the size of the barcode. Could be different value:
   *  - Size.Smallest: generates the smallest size(default)
   *  - Size.Micro: generates a micro size
   *  - Size.Full: generates a full size
   *
   * @param size The size.
   */
  setSize(size: BCGqrcode.Size): void {
    this.size = size;
  }

  /**
   * Sets the FNC1. The argument fnc1Type can be:
   *  - Fnc1.None: No FNC1 will be used
   *  - Fnc1.GS1: FNC1 will be used with GS1 standard.
   *
   * @param fnc1Type The FNC1.
   **/
  setFNC1(fnc1Type: Exclude<BCGqrcode.Fnc1, BCGqrcode.Fnc1.AIM>): void;
  /**
   * Sets the FNC1. The argument fnc1Type can be:
   *  - Fnc1.None: No FNC1 will be used
   *  - Fnc1.GS1: FNC1 will be used with GS1 standard.
   *  - Fnc1.AIM: FNC1 will be used with AIM standard, the fnc1Id is required.
   *
   * @param fnc1Type The FNC1.
   * @param fnc1Id The Id.
   **/
  setFNC1(fnc1Type: BCGqrcode.Fnc1.AIM, fnc1Id: number | string): void;
  setFNC1(fnc1Type: BCGqrcode.Fnc1, fnc1Id: number | string | null = null): void {
    this.fnc1 = fnc1Type;

    if (this.fnc1 === BCGqrcode.Fnc1.AIM) {
      const tempFnc1Id = fnc1Id?.toString() || '';
      const tempFnc1IdInt = parseInt(tempFnc1Id || '', 10);
      if (
        (tempFnc1Id?.length === 1 && tempFnc1Id.toLowerCase()[0] >= 'a' && tempFnc1Id.toLowerCase()[0] <= 'z') ||
        (!isNaN(tempFnc1IdInt) && tempFnc1IdInt >= 0 && tempFnc1IdInt <= 99)
      ) {
        this.fnc1Id = tempFnc1Id;
      } else {
        throw new BCGArgumentException(
          'In FNC1 AIM mode, you need to provide to the fnc1Id one letter or a number between 0 and 99.',
          'fnc1Id'
        );
      }
    } else {
      this.fnc1Id = null;
    }
  }

  /**
   * QRCode symbol can be appended to another one.
   * The symbolTotal must remain the same across all the QRCodes group.
   * Up to 16 symbols total.
   * The first symbol is 1.
   * If you want to reset and not use this Structured Append, set the symbolNumber to 0.
   * Returns true on success, false on failure.
   * The symbolData should be the full data that you encode across all the symbols. The operation is
   * costly and you can simply put a string that will identify the barcode, as long as it remains
   * the same across the symbols.
   *
   * @param symbolNumber The symbol number.
   * @param symbolTotal The amount of symbols.
   * @param symbolData The full data you plan to encode.
   * @return True on success, false on failure.
   */
  setStructuredAppend(symbolNumber: number, symbolTotal: number = 0, symbolData: string | null = null): boolean {
    if (symbolTotal === 0) {
      this.symbolNumber = 0;
      this.symbolTotal = 0;
      this.symbolData = null;
      return true;
    } else {
      if (symbolNumber <= 0) {
        throw new BCGArgumentException('The symbol number must be equal or bigger than 1.', 'symbolNumber');
      }

      if (symbolNumber > symbolTotal) {
        throw new BCGArgumentException('The symbol number must be equal or lower than the symbol total.', 'symbolNumber');
      }

      if (symbolTotal > 16) {
        throw new BCGArgumentException('The symbol total must be equal or lower than 16.', 'symbolTotal');
      }

      this.symbolNumber = symbolNumber;
      this.symbolTotal = symbolTotal;
      this.symbolData = symbolData;

      return true;
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
   * Quiet zone is 4 element for micro, 8 for full.
   *
   * @param quietZone The quiet zone.
   */
  setQuietZone(quietZone: boolean): void {
    this.quietZone = quietZone;
  }

  /**
   * Sets the image to be output as a mirror following the standard.
   *
   * @param mirror Set the mirror.
   */
  setMirror(mirror: boolean): void {
    this.mirror = mirror;
  }

  /**
   * Specifies the masking to be used from 0 to 7.
   * If -1 is set, the best masking will be used.
   *
   * @param mask The mask.
   */
  setMask(mask: number): void {
    if (mask < -1 || mask > 7) {
      throw new BCGArgumentException('The mask number must be between 0 and 7. You can set -1 for automatic.', 'mask');
    }

    this.mask = mask;
  }

  /**
   * Sets the QRSize you wish to use.
   * -1 is automatic.
   * For micro, you can use 1 to 4
   * For full, you can use 1 to 40
   *
   * @param qrSize The QRSize.
   * @param qrMicro True if micro.
   */
  setQRSize(qrSize: number, qrMicro: boolean = false): void {
    this.qrMicro = qrMicro;
    const maxSize = this.qrMicro ? 4 : 40;

    if (qrSize < -1 || qrSize === 0 || qrSize > maxSize) {
      throw new BCGArgumentException(
        'The QR size number must be between 1 and 4 for Micro mode, or between 1 and 40 for Full mode. You can set -1 for automatic.',
        'qrSize'
      );
    }

    this.qrSize = qrSize;
  }

  /**
   * Draws a pixel at the position x, y with the color color.
   * It gives more space if there is a quiet zone.
   */
  protected drawPixel(image: draw.Surface, x: number, y: number, color: number): void {
    if (this.symbol === null) {
      throw new Error();
    }

    const adder = this.quietZone ? (this.symbol.micro ? 2 : 4) : 0;
    super.drawPixel(image, x + adder, y + adder, color);
  }

  /**
   * Draws a filled rectangle with the top left position x1, y1 and bottom right x2, y2 with the color color.
   * It gives more space if there is a quiet zone.
   */
  protected drawFilledRectangle(image: draw.Surface, x1: number, y1: number, x2: number, y2: number, color: number): void {
    if (this.symbol === null) {
      throw new Error();
    }

    const adder = this.quietZone ? (this.symbol.micro ? 2 : 4) : 0;
    super.drawFilledRectangle(image, x1 + adder, y1 + adder, x2 + adder, y2 + adder, color);
  }

  /**
   * Products x times y in array.
   */
  private static prod(x: number, y: number, log: number[], alog: number[]): number {
    if (x === 0 || y === 0) {
      return 0;
    } else {
      return alog[(log[x] + log[y]) % (BCGqrcode._GF - 1)];
    }
  }

  /**
   * Assembles the data into nbBlocks with a maximum of code per blocks.
   */
  private static assembleFromBlocks(data: string[], nbBlocks: number[], codePerBlock1: number, codePerBlock2: number): string[] {
    let blockRow1: number;
    let blockRow2: number;

    // We have 1 line
    if (codePerBlock2 === 0) {
      blockRow1 = Utility.arraySum(nbBlocks);
      blockRow2 = 0;
    } else {
      // We have 2 lines
      blockRow1 = nbBlocks[0];
      blockRow2 = nbBlocks[1];
    }

    const finalData: string[] = [];

    const totalBlocks = Utility.arraySum(nbBlocks);
    for (let i = 0; i < codePerBlock1; i++) {
      for (let j = 0; j < totalBlocks; j++) {
        let index = j * codePerBlock1 + i;
        index += Math.max(0, j - blockRow1);

        finalData.push(data[index]);
      }
    }

    const start = (blockRow1 + 1) * codePerBlock1;
    for (let i = 0; i < blockRow2; i++) {
      const index = start + codePerBlock2 * i;

      finalData.push(data[index]);
    }

    return finalData;
  }

  /**
   * Sets the value of a pixel on an horizontal line at the position x, y for a lenght l.
   * If pixel is true, the line is black.
   * If info is true, the line contains non-data information.
   */
  private setLineHorizontal(x: number, y: number, l: number, pixel: boolean, info: boolean): void {
    if (this.data === null) {
      throw new Error();
    }

    for (let i = 0; i < l; i++) {
      this.data[x + i][y].set(pixel, info);
    }
  }

  /**
   * Sets the value of a pixel on an vertical line at the position x, y for a lenght l.
   * If pixel true, the line is black.
   * If info is true, the line contains non-data information.
   */
  private setLineVertical(x: number, y: number, l: number, pixel: boolean, info: boolean): void {
    if (this.data === null) {
      throw new Error();
    }

    for (let i = 0; i < l; i++) {
      this.data[x][y + i].set(pixel, info);
    }
  }

  /**
   * Draws an unfilled rectangle at position x, y with a width w and height h.
   * If pixel is true, the rectangle is black.
   * If info is true, the rectangle contains non-data information.
   */
  private setRectangle(x: number, y: number, w: number, h: number, pixel: boolean, info: boolean): void {
    this.setLineHorizontal(x, y, w, pixel, info);
    this.setLineHorizontal(x, y + h - 1, w, pixel, info);
    this.setLineVertical(x, y, h, pixel, info);
    this.setLineVertical(x + w - 1, y, h, pixel, info);
  }

  /**
   * Draws a finder pattern at the position x, y.
   */
  private setFinderPattern(x: number, y: number): void {
    if (this.data === null) {
      throw new Error();
    }

    this.setRectangle(x, y, 7, 7, true, true);
    this.setRectangle(x + 1, y + 1, 5, 5, false, true);
    this.setRectangle(x + 2, y + 2, 3, 3, true, true);
    this.data[x + 3][y + 3].set(true, true);
  }

  /**
   * Draws all the required finder pattern for an image.
   */
  private setFinderPatterns(): void {
    if (this.symbol === null) {
      throw new Error();
    }

    // Pattern 1
    this.setFinderPattern(0, 0);

    if (!this.symbol.micro) {
      const limit = BCGqrcodeInfo.getSize(this.symbol) - 7;

      // Pattern 2 & 3
      this.setFinderPattern(limit, 0);
      this.setFinderPattern(0, limit);
    }
  }

  /**
   * Draws the timing (black &amp; white sequence).
   */
  private setTiming(): void {
    if (this.data === null) {
      throw new Error();
    }

    if (this.symbol === null) {
      throw new Error();
    }

    // Skip also the separator
    let c = BCGqrcodeInfo.getSize(this.symbol!) - 8;
    let y = 6;
    if (this.symbol.micro) {
      y = 0;
      c += 8;
    }

    for (let x = 8; x < c; x++) {
      let color = true;
      if (x % 2 === 1) {
        color = false;
      }

      this.data[x][y].set(color, true);
      this.data[y][x].set(color, true);
    }
  }

  /**
   * Draws an alignment pattern at the position x, y.
   */
  private setAlignmentPattern(x: number, y: number): void {
    if (this.data === null) {
      throw new Error();
    }

    this.setRectangle(x, y, 5, 5, true, true);
    this.setRectangle(x + 1, y + 1, 3, 3, false, true);
    this.data[x + 2][y + 2].set(true, true);
  }

  /**
   * Draws all the required alignment patterns for an image.
   */
  private setAlignmentPatterns(): void {
    if (this.symbol === null) {
      throw new Error();
    }

    if (!this.symbol.micro) {
      const patternPositions = this.alignmentPatterns[this.symbol.version];
      let c = patternPositions.length;
      const positions: number[][] = [];
      for (let i = 0; i < c; i++) {
        for (let j = 0; j < c; j++) {
          // We don't add 6x6, 6xBiggest, Biggestx6
          if (patternPositions[i] === patternPositions[j] && patternPositions[i] === 6) {
            continue;
          }

          if (patternPositions[i] === 6 && patternPositions[j] === patternPositions[c - 1]) {
            continue;
          }

          if (patternPositions[j] === 6 && patternPositions[i] === patternPositions[c - 1]) {
            continue;
          }

          positions.push([patternPositions[i], patternPositions[j]]);
        }
      }

      c = positions.length;
      for (let i = 0; i < c; i++) {
        this.setAlignmentPattern(positions[i][0] - 2, positions[i][1] - 2);
      }
    }
  }

  /**
   * Draws the version information into the image at the top right and bottom left if required.
   * If blank is true, we simply set the value "true" in the $info of the pixel.
   */
  private setVersion(blank: boolean): void {
    if (this.symbol === null) {
      throw new Error();
    }

    if (this.data === null) {
      throw new Error();
    }

    // We draw a blank version to set the pixels to an "info" state.
    if (!this.symbol.micro && this.symbol.version >= 7) {
      const size = BCGqrcodeInfo.getSize(this.symbol) - 11;
      if (blank) {
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 3; j++) {
            this.data[j + size][i].set(false, true);
            this.data[i][j + size].set(false, true);
          }
        }
      } else {
        const final = this.versionErrorCode[this.symbol.version];
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 3; j++) {
            const bit = 1 << (j + 3 * i);
            const color = (final & bit) === bit;
            this.data[j + size][i].set(color, true);
            this.data[i][j + size].set(color, true);
          }
        }
      }
    }
  }

  /**
   * Draws the white separator around the finder patterns.
   */
  private setSeparator(): void {
    if (this.symbol === null) {
      throw new Error();
    }

    // Pattern 1
    this.setLineHorizontal(0, 7, 8, false, true);
    this.setLineVertical(7, 0, 8, false, true);

    if (!this.symbol.micro) {
      const limit = BCGqrcodeInfo.getSize(this.symbol) - 8;

      // Pattern 2
      this.setLineHorizontal(limit, 7, 8, false, true);
      this.setLineVertical(limit, 0, 8, false, true);

      // Pattern 3
      this.setLineHorizontal(0, limit, 8, false, true);
      this.setLineVertical(7, limit, 8, false, true);
    }
  }

  /**
   * Draws the format information.
   * If blank is true, we simply set the value "true" in the $info of the pixel.
   */
  private setFormat(blank: boolean): void {
    if (this.symbol === null) {
      throw new Error();
    }

    if (this.data === null) {
      throw new Error();
    }

    let i = 0;

    if (blank) {
      const limit = BCGqrcodeInfo.getSize(this.symbol) - 8;

      // Timing is called later and will erase a part of it. Good :)
      // Pattern 1
      this.setLineHorizontal(0, 8, 9, true, true);
      this.setLineVertical(8, 0, 9, true, true);

      if (!this.symbol.micro) {
        // Pattern 2
        this.setLineHorizontal(limit, 8, 8, false, true);

        // Pattern 3
        this.setLineVertical(8, limit, 8, false, true);
      }
    } else {
      if (this.symbol.micro) {
        let code = 0; // Should be null, but we won't deal with Nullable
        switch (this.symbol.version) {
          case 1:
            code = 0;
            break;

          case 2:
            code = this.errorLevel === 0 ? 1 : 2;
            break;

          case 3:
            code = this.errorLevel === 0 ? 3 : 4;
            break;

          case 4:
            code = this.errorLevel === 0 ? 5 : this.errorLevel === 1 ? 6 : 7;
            break;
        }

        code = (code << 2) | this.mask;

        const final = this.formatErrorCodeMicro[code];

        i = 0;
        let j = 14;
        for (; i <= 7; i++, j--) {
          const bit1 = 1 << i;
          const color1 = (final & bit1) === bit1;
          const bit2 = 1 << j;
          const color2 = (final & bit2) === bit2;
          this.data[8][i + 1].set(color1, true); // Vertical line going down
          this.data[i + 1][8].set(color2, true); // Horizontal going right
        }
      } else {
        // Find the binary
        const code = (this.errorCorrectionBinaryIndicator[this.errorLevel] << 3) | this.mask;
        const final = this.formatErrorCodeFull[code];

        const limit = BCGqrcodeInfo.getSize(this.symbol) - 1;
        for (i = 0; i <= 7; i++) {
          const bit = 1 << i;
          const color = (final & bit) === bit;
          this.data[8][i].set(color, true); // Vertical line going down
          this.data[limit - i][8].set(color, true); // Horizontal line going left
        }

        // Starting bit 14
        i = 14;
        let counter = 0;
        for (; i >= 8; i--, counter++) {
          const bit = 1 << i;
          const color = (final & bit) === bit;
          this.data[counter][8].set(color, true); // Horizontal going right
          this.data[8][limit - counter].set(color, true); // Vertical going up
        }

        // Fix the timing of going down
        this.data[8][8] = this.data[8][7];
        this.data[8][7] = this.data[8][6];
        this.data[8][6] = new BCGqrcodePixel();
        this.data[8][6].set(true, true);

        this.data[7][8] = this.data[6][8];
        this.data[6][8] = new BCGqrcodePixel();
        this.data[6][8].set(true, true);

        // Dark module
        this.data[8][limit - 7].set(true, true);
      }
    }
  }

  /**
   * Sets the data in the pixel array at the right position based on the size of the symbol.
   */
  private setDataIntoVariable(data: string[]): void {
    if (this.symbol === null) {
      throw new Error();
    }

    const c = BCGqrcodeInfo.getSize(this.symbol);

    let x = c - 1;
    let y = x;
    let up = true;
    let left = true;

    let color = false;
    const numberOfGroups = this.symbol.bits / 8;

    for (let j = 0; j < numberOfGroups; j++) {
      color = !color;

      // Special case for M1 and M3, we have only 4 bits on the last.
      // So we have to do a strlen
      const codewordSize = data[j].length;
      for (let i = 0; i < codewordSize; i++) {
        let a: BCGqrcodePixel;
        ({ value: a, x, y, up, left } = this.getBitPosition(x, y, up, left, c - 1));
        a.set(data[j][i] === '1', false);
      }
    }
  }

  /**
   * Gets the pixel at the right position on the graphic avoiding any "info" pixel.
   *
   * TODO Check if we call one of too many, will it go in an infinite loop?
   */
  private getBitPosition(
    x: number,
    y: number,
    up: boolean,
    left: boolean,
    max: number
  ): { value: BCGqrcodePixel; x: number; y: number; up: boolean; left: boolean } {
    if (this.data === null) {
      throw new Error();
    }

    if (this.symbol === null) {
      throw new Error();
    }

    let data: BCGqrcodePixel | null = null;
    if (!this.data[x][y].info) {
      data = this.data[x][y];
    }

    if (left) {
      x--;
      left = !left;
    } else {
      if (up) {
        x++;
        y--;
        left = !left;

        if (y < 0) {
          x -= 2;
          y++;
          up = false;
        }
      } else {
        x++;
        y++;
        left = !left;

        if (y > max) {
          x -= 2;
          y--;
          up = true;
        }
      }
    }

    // If we are on the left timing line in a full QR Code, we go one left
    if (x === 6 && !this.symbol.micro) {
      x--;
    }

    // If we fell on a "info" pixel, we will re-execute this method until we find
    // a non-"info" pixel to return.
    if (data === null) {
      ({ value: data, x, y, up, left } = this.getBitPosition(x, y, up, left, max));
    }

    return {
      value: data,
      x,
      y,
      up,
      left
    };
  }

  /**
   * Applies the masking on the this.data.
   */
  private applyMasking(): void {
    if (this.symbol === null) {
      throw new Error();
    }

    if (this.data === null) {
      throw new Error();
    }

    const maskInstance = BCGqrcodeCodeMaskBase.getMaskClass(this.symbol, this.mask);
    this.data = maskInstance.getMaskData(this.data);
    this.mask = maskInstance.getMaskId();
  }

  /**
   * Sets the data and prepares the drawing but does not draw it.
   */
  private setData(data: string[]): void {
    if (this.symbol === null) {
      throw new Error();
    }

    // Initialize the data
    const c = BCGqrcodeInfo.getSize(this.symbol);
    this.data = [];
    for (let i = 0; i < c; i++) {
      this.data[i] = [];
      for (let j = 0; j < c; j++) {
        this.data[i][j] = new BCGqrcodePixel();
      }
    }

    this.setFinderPatterns();
    this.setSeparator();
    this.setAlignmentPatterns();
    this.setFormat(true);
    this.setVersion(true);
    this.setTiming();
    this.setDataIntoVariable(data);
    this.applyMasking();
    this.setFormat(false);
    this.setVersion(false);
  }

  /**
   * Returns the starting sequence of the textSeq.
   */
  private findStartingSequence(textSeq: string): { [key: number]: string } {
    const sizeType: { [key: number]: string } = {};
    let temp: string;

    // Micro
    sizeType[5] = sizeType[6] = 'B';
    sizeType[4] = 'A';
    sizeType[3] = 'N';

    // Full
    // Byte
    sizeType[0] = sizeType[1] = sizeType[2] = 'B';

    // See Annex J.2.a
    // Alphanumeric
    if (textSeq[0] === 'E') {
      throw new Error('[DEBUG] Do not provide a E to findStartingSequence method');
    }

    // Kanji
    if (textSeq[0] === 'K') {
      // Mathematically, it makes no sense to switch to binary like they mention in the documentation.
      // We try to keep one Kanji to switch to Binary like BKKKKKKKKKB
      // The doc says we should encode the last Kanji as two binary.
      // But the doc doesn't really say what to do while in Kanji mode.
      // So we will suppose we stay in Kanji if we find a Kanji character
      sizeType[0] = sizeType[1] = sizeType[2] = sizeType[5] = sizeType[6] = 'K';
    }

    // Alpha
    else if (textSeq[0] === 'A') {
      temp = Utility.safeSubstring(textSeq, 0, 6);
      if (temp.length === 6 && temp.indexOf('B') === -1) {
        sizeType[0] = 'A';
        if (textSeq.length > 6 && textSeq[6] !== 'B') {
          sizeType[1] = 'A';
          if (textSeq.length > 7 && textSeq[7] !== 'B') {
            sizeType[2] = 'A';
          }
        }
      }

      // Micro
      temp = Utility.safeSubstring(textSeq, 0, 3);
      if (temp.length === 3 && temp.indexOf('B') === -1) {
        sizeType[5] = 'A';
        if (textSeq.length > 3 && textSeq[3] !== 'B') {
          sizeType[6] = 'A';
        }
      }
    }

    // Numeric
    else if (textSeq[0] === 'N') {
      if (Utility.safeSubstring(textSeq, 0, 7) === 'NNNNNNN') {
        sizeType[0] = 'N';
        if (textSeq.length > 7 && textSeq[7] === 'N') {
          sizeType[1] = 'N';
          if (textSeq.length > 8 && textSeq[8] === 'N') {
            sizeType[2] = 'N';
          }
        }
      }

      // Micro
      if (textSeq.indexOf('B') === -1) {
        sizeType[4] = sizeType[5] = sizeType[6] = 'A';
        temp = Utility.safeSubstring(textSeq, 0, 3);
        if (temp.length === 3 && temp === 'NNN') {
          sizeType[4] = 'N';
          if (textSeq.length > 3 && textSeq[3] === 'N') {
            sizeType[5] = 'N';
            if (textSeq.length > 4 && textSeq[4] === 'N') {
              sizeType[6] = 'N';
            }
          }
        }
      } else {
        temp = Utility.safeSubstring(textSeq, 0, 2);
        if (temp.length === 2 && temp === 'NN') {
          sizeType[5] = 'N';
          if (textSeq.length > 2 && textSeq[2] === 'N') {
            sizeType[6] = 'N';
          }
        }
      }

      // Full
      temp = Utility.safeSubstring(textSeq, 0, 4);
      if (temp.length === 4 && temp.indexOf('B') === -1) {
        sizeType[0] = sizeType[0] !== 'N' ? 'A' : 'N';
        sizeType[1] = sizeType[1] !== 'N' ? 'A' : 'N';
        if (textSeq.length > 4 && textSeq[4] !== 'B') {
          sizeType[2] = 'A';
        }
      }
    }

    return sizeType;
  }

  /**
   * Depending on the text, it will return the correct
   * sequence to encode the text. The sequence is composed of an array of 7 data.
   * Each data is for the Version 1-9, 10-26 and 27-40 respectivitely. Followed by the Micro 1 to 4.
   * The data will contain letters indicating each character has to be encoded in which
   * type. N=Numeric, A=AlphaNumeric, K=Kanji, B=Byte
   */
  private getSequence(text: string): { value: (Seq[] | null)[]; text: string } {
    // N=> Numeric
    // A=> Alphanumeric
    // B=> Byte
    // K=> Kanji
    // E=> ECI

    // We return a different sequence based on the version of the barcode.
    // [0] => Version 1-9
    // [1] => Version 10-26
    // [2] => Version 27-40
    // [3] => M1
    // [4] => M2
    // [5] => M3
    // [6] => M4

    let textSeq = '';
    let textLen = text.length;
    for (let i = 0; i < textLen; i++) {
      let escapedCharacter: number = 0;
      if ((escapedCharacter = this.isEscapedCharacter(text, i)) > 0) {
        if (escapedCharacter === 1) {
          textSeq += 'E' + text.substring(i + 1, i + 1 + 6);
          i += 6;
        } else {
          text = text.substring(0, i) + text.substring(i + 1);
          textLen--;
          textSeq += 'B';
        }
      } else if (this.isCharNumeric(text[i])) {
        textSeq += 'N';
      } else if (this.isCharAlphanumeric(text[i])) {
        textSeq += 'A';
      } else if (this.isCharByte(text[i])) {
        textSeq += 'B';
      } else if (this.isCharKanji(text[i])) {
        textSeq += 'K';
      } else {
        throw new BCGParseException('qrcode', 'The character ' + text[i] + ' is not supported.');
      }
    }

    const seqLen = textSeq.length;

    // Impossible
    const e = 99999;

    // See Annex J.2.bcd
    // We are different than the documentation, because we have separated Kanji from bytes
    const codeSeqAlpha = [13, 15, 17, 1, 3, 4, 5];
    const codeSeqByte2Kanji = [9, 12, 13, e, e, e, e];
    const codeSeqByte2Alpha = [11, 15, 16, e, e, 3, 4];
    const codeSeqByte2Nume2 = [6, 7, 8, e, e, 2, 3];

    // Do all the sizeType
    const finalSequence: (Seq[] | null)[] = [];
    for (let j = 0; j < 7; j++) {
      const micro = j >= 3;

      let seq: Seq[] = [];
      let currentSeq = '\0'; // TODO

      // If we had starting E, we add it now
      let counter: { [key: string]: number } = { B: 0, A: 0, N: 0, K: 0, E: 0 };

      for (let i = 0; i < seqLen; i++) {
        if (currentSeq === '\0') {
          if (textSeq[i] === 'E') {
            ({ value: currentSeq, i, seq, counter } = this.addESequence(j, micro, textSeq, i, seq, counter));
          } else {
            const sizeType = this.findStartingSequence(textSeq);
            currentSeq = sizeType[j];
          }
        }

        // This would happen if the user entered only the ECI only
        if (currentSeq === '\0') {
          break;
        }

        // If our code thought it was better to encode binary but we are in Kanji,
        // we need to add double the sequence since we have 2 bytes.
        if (currentSeq === 'B' && textSeq[i] === 'K') {
          ({ seq, counter } = this.addSequence(j, currentSeq, 2, micro, seq, counter));
        } else {
          ({ seq, counter } = this.addSequence(j, currentSeq, 1, micro, seq, counter));
        }

        if (textSeq.length <= i + 1) {
          break;
        }

        if (currentSeq === 'B') {
          if (Utility.safeSubstring(textSeq, i + 1, codeSeqByte2Kanji[j]) === Utility.strRepeat('K', codeSeqByte2Kanji[j])) {
            currentSeq = 'K';
          } else if (textSeq[i + 1] === 'E') {
            i++;
            ({ value: currentSeq, i, seq, counter } = this.addESequence(j, micro, textSeq, i, seq, counter));
          } else if (Utility.safeSubstring(textSeq, i + 1, codeSeqByte2Alpha[j]) === Utility.strRepeat('A', codeSeqByte2Alpha[j])) {
            currentSeq = 'A';
            ({ seq, counter } = this.addSequence(j, currentSeq, codeSeqByte2Alpha[j], micro, seq, counter));
            i += codeSeqByte2Alpha[j];
            currentSeq = textSeq.length > i + 1 ? textSeq[i + 1] : '\0';
          } else if (Utility.safeSubstring(textSeq, i + 1, codeSeqByte2Nume2[j]) === Utility.strRepeat('N', codeSeqByte2Nume2[j])) {
            // We skipped J2b3
            currentSeq = 'N';
            ({ seq, counter } = this.addSequence(j, currentSeq, codeSeqByte2Nume2[j], micro, seq, counter));
            i += codeSeqByte2Nume2[j];
            currentSeq = textSeq.length > i + 1 ? textSeq[i + 1] : '\0';
          }
        } else if (currentSeq === 'A') {
          if (textSeq[i + 1] === 'K') {
            currentSeq = 'K';
          } else if (textSeq[i + 1] === 'E') {
            i++;
            ({ value: currentSeq, i, seq, counter } = this.addESequence(j, micro, textSeq, i, seq, counter));
          } else if (textSeq[i + 1] === 'B') {
            currentSeq = 'B';
          } else if (Utility.safeSubstring(textSeq, i + 1, codeSeqAlpha[j]) === Utility.strRepeat('N', codeSeqAlpha[j])) {
            // Copy at least those characters
            currentSeq = 'N';
            ({ seq, counter } = this.addSequence(j, currentSeq, codeSeqAlpha[j], micro, seq, counter));
            i += codeSeqAlpha[j];
            currentSeq = textSeq.length > i + 1 ? textSeq[i + 1] : '\0';
          }
        } else if (currentSeq === 'N') {
          if (textSeq[i + 1] === 'K') {
            currentSeq = 'K';
          } else if (textSeq[i + 1] === 'E') {
            i++;
            ({ value: currentSeq, i, seq, counter } = this.addESequence(j, micro, textSeq, i, seq, counter));
          } else if (textSeq[i + 1] === 'B') {
            currentSeq = 'B';
          } else if (textSeq[i + 1] === 'A') {
            currentSeq = 'A';
          }
        } else if (currentSeq === 'K') {
          // The next sequence is like restarting the barcode.
          const sizeType = this.findStartingSequence(Utility.safeSubstring(textSeq, i + 1));
          currentSeq = sizeType[j];
        }
      }

      finalSequence[j] = seq;
    }

    // Delete the sequences that can't exist
    // M1 can contain only N
    // M2 can contain only N and A
    // M3 and M4 can't contain E
    for (let j = 3; j < 7; j++) {
      let resetLoop = false;
      const c = finalSequence[j]?.length ?? 0;
      for (let i = 0; i < c && !resetLoop; i++) {
        const code = finalSequence[j]![i].sequence;

        switch (j) {
          case 3:
            if (code !== 'N') {
              finalSequence[j] = null;
              resetLoop = true;
              continue; // Continues I loop TODO
            }

            break;
          case 4:
            if (code !== 'N' && code !== 'A') {
              finalSequence[j] = null;
              resetLoop = true;
              continue; // Continues I loop TODO
            }

            break;
          case 5:
          case 6:
            if (code === 'E') {
              finalSequence[j] = null;
              resetLoop = true;
              continue; // Continues I loop TODO
            }

            break;
        }
      }
    }

    return {
      value: finalSequence,
      text
    };
  }

  /**
   * Adds the E Sequence and returns the next in the sequence.
   */
  private addESequence(
    currentEncoding: number,
    micro: boolean,
    textSeq: string,
    i: number,
    seq: Seq[],
    counter: { [key: string]: number }
  ): { value: string; i: number; seq: Seq[]; counter: { [key: string]: number } } {
    this.hasECI = true;
    while (textSeq.length > i && textSeq[i] === 'E') {
      ({ seq, counter } = this.addSequence(currentEncoding, 'E', 1, micro, seq, counter));

      // We save the ECI number in the amount code. We will use it later.
      const n1 = parseInt(Utility.safeSubstring(textSeq, i + 1, 6), 10);
      seq[seq.length - 1].amount = n1;
      i += 7;
    }

    if (textSeq.length > i) {
      const sizeType = this.findStartingSequence(textSeq.substring(i));
      return {
        value: sizeType[currentEncoding],
        i,
        seq,
        counter
      };
    } else {
      return {
        value: '\0', // TODO
        i,
        seq,
        counter
      };
    }
  }

  /**
   * Creates an array of sequence in seq. Each sequence contains of [currentSeq, NumberOfCharToEncode].
   * This function takes care to not bust a sequence size. It creates a new sequence in that case.
   * It creates a new sequence if the current sequence type is different from the previous one.
   */
  private addSequence(
    sizeTypeNumber: number,
    currentSeq: string,
    amount: number,
    micro: boolean,
    seq: Seq[],
    counter: { [key: string]: number }
  ): { seq: Seq[]; counter: { [key: string]: number } } {
    // This may never be used... check if we can bust those numbers?
    const maxAmount: { [key: string]: number[] } = {
      B: [255, 65535, 65535],
      A: [511, 2047, 8191],
      N: [1023, 4095, 16383],
      K: [255, 1023, 4095],
      E: [1, 1, 1]
    };

    // We reset
    if (counter[currentSeq] === 0) {
      counter = { B: 0, A: 0, N: 0, K: 0, E: 0 };
      seq.push(new Seq(currentSeq));
    }

    const numberToAddNow = micro ? amount : Math.min(amount, maxAmount[currentSeq][sizeTypeNumber] - counter[currentSeq]);
    if (numberToAddNow > 0) {
      seq[seq.length - 1].amount += numberToAddNow;
      counter[currentSeq] += numberToAddNow;
    }

    if (amount > numberToAddNow) {
      counter[currentSeq] = 0;
      ({ seq, counter } = this.addSequence(sizeTypeNumber, currentSeq, amount - numberToAddNow, micro, seq, counter));
    }

    return {
      seq,
      counter
    };
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
            'qrcode',
            'Incorrect ECI code detected. ECI code must contain a backslash followed by 6 digits or double the backslash to write one backslash.'
          );
        }
      }
    }

    return 0;
  }

  /**
   * Returns if a character is numeric [0-9].
   */
  private isCharNumeric(character: string): boolean {
    const o = character.charCodeAt(0);
    return o >= 0x30 && o <= 0x39;
  }

  /**
   * Returns if a character is alpha-numeric [0-9A-Z $%*+-./:]
   * If exclusive, it will return false if it's numeric [0-9].
   */
  private isCharAlphanumeric(character: string, exclusive: boolean = false): boolean {
    const o = character.charCodeAt(0);

    const numeric = this.isCharNumeric(character);
    const alpha =
      (o >= 0x41 && o <= 0x5a) ||
      o === 0x20 ||
      o === 0x24 ||
      o === 0x25 ||
      o === 0x2a ||
      o === 0x2b ||
      o === 0x2d ||
      o === 0x2e ||
      o === 0x2f ||
      o === 0x3a;

    return (!exclusive && (alpha || numeric)) || (exclusive && alpha && !numeric);
  }

  /**
   * Returns if a character is byte.
   * If exclusive, it will return false if it's alpha-numeric.
   */
  private isCharByte(character: string, exclusive: boolean = false): boolean {
    const o = character.charCodeAt(0);
    return (!exclusive && o >= 0 && o <= 255) || (exclusive && !this.isCharAlphanumeric(character));
  }

  /**
   * Returns if a character is Kanji.
   */
  private isCharKanji(_character: string, _exclusive: boolean = false): boolean {
    return false;
  }

  private getKanjiValue(_character: string): number {
    return 0;
  }

  private isLowKanji(value: number): boolean {
    return value >= 0x8140 && value <= 0x9ffc;
  }

  /**
   * Calculates the number of bits required per symbol size
   * See section 6.4.x.
   * sizeType contains the string sequences (BANK)
   * It returns the size of each sequence.
   */
  private calculateBits(seq: (Seq[] | null)[]): number[] {
    const bitsNumeric = [10, 12, 14, 3, 4, 5, 6];
    const bitsAlphanumeric = [9, 11, 13, 0, 3, 4, 5];
    const bitsByte = [8, 16, 16, 0, 0, 4, 5];
    const bitsKanji = [8, 10, 12, 0, 0, 3, 4];
    const bitsIndicator = [4, 4, 4, 0, 1, 2, 3];

    const c = seq.length;
    const sizeBits: number[] = Array(c).fill(0);

    for (let i = 0; i < c; i++) {
      if (seq[i] === null) {
        continue;
      }

      const c2 = seq[i]!.length;
      for (let j = 0; j < c2; j++) {
        const mode = seq[i]![j].sequence;
        const value = seq[i]![j].amount;

        if (mode === 'E') {
          sizeBits[i] += 4;
          if (value <= 127) {
            sizeBits[i] += 8;
          } else if (value <= 16383) {
            sizeBits[i] += 16;
          } else {
            sizeBits[i] += 24;
          }
        } else if (mode === 'N') {
          // B = M + C + 10(D DIV 3) + R
          const R_Temp = value % 3;
          const R = R_Temp === 2 ? 7 : R_Temp === 1 ? 4 : R_Temp === 0 ? 0 : 0;
          sizeBits[i] += bitsIndicator[i] + bitsNumeric[i] + 10 * Math.floor(value / 3) + R;
        } else if (mode === 'A') {
          // B = M + C + 11(D DIV 2) + 6(D MOD 2)
          sizeBits[i] += bitsIndicator[i] + bitsAlphanumeric[i] + 11 * Math.floor(value / 2) + 6 * Math.floor(value % 2);
        } else if (mode === 'B') {
          // B = M + C + 8D
          sizeBits[i] += bitsIndicator[i] + bitsByte[i] + 8 * value;
        } else if (mode === 'K') {
          // B = M + C + 13D
          sizeBits[i] += bitsIndicator[i] + bitsKanji[i] + 13 * value;
        }
      }
    }

    // If we have a Structured Append, we need to add 20 bits.
    let bitAdder = 0;
    if (this.symbolNumber > 0) {
      bitAdder += 20;
    }

    // If we have a FNC1 GS1, we add 4 bits
    if (this.fnc1 === BCGqrcode.Fnc1.GS1) {
      bitAdder += 4;
    }

    // If we have a FNC1 AIM, we add 12 bits
    if (this.fnc1 === BCGqrcode.Fnc1.AIM) {
      bitAdder += 12;
    }

    if (bitAdder > 0) {
      for (let i = 0; i < 3; i++) {
        sizeBits[i] += bitAdder;
      }
    }

    return sizeBits;
  }

  /**
   * To speed up the lookup, the this.symbols is ordered, we know what are the index of our version
   * Version is 1 to 4 in micro, index 0 to 3
   * Version is 1 to 40 in full, index is 4 to 43
   */
  private findSymbolIndex(version: number, micro: boolean): number {
    if (micro) {
      return version - 1;
    } else {
      return version + 3;
    }
  }

  /**
   * Finds the perfect Symbol based on the version we allow and the number of bits we want to fit.
   */
  private findPerfectSymbolRange(versionMin: number, versionMax: number, micro: boolean, bits: number): BCGqrcodeInfo | null {
    if (bits > 0) {
      const c = this.findSymbolIndex(versionMax, micro);
      for (let i = this.findSymbolIndex(versionMin, micro); i <= c; i++) {
        const symbol = this.symbols[i];

        // No check for $micro because we have the correct index.
        if (bits <= symbol.data[this.errorLevel]) {
          // We check if we have enough place for the terminator.
          // If it's flush, we do not put the terminator, otherwise, we need at least 3 free bits
          if (bits === symbol.data[this.errorLevel] || bits + 3 <= symbol.data[this.errorLevel]) {
            return symbol;
          }
        }
      }
    }

    return null;
  }

  /**
   * Finds the perfect symbol based on the number of bits in each stream.
   *
   * @param sizeBits Number of bits for sequence Version 1-9, 10-26, 27-40, M1, M2, M3, M4.
   * @return Index of the sequence taken.
   */
  private findPerfectSymbol(sizeBits: number[]): number {
    this.symbol = null;

    if (this.qrSize === -1) {
      // We can't have a micro if we have a structured append, FNC1 or ECI
      if (
        this.symbolNumber === 0 &&
        this.fnc1 === BCGqrcode.Fnc1.None &&
        !this.hasECI &&
        (this.size === BCGqrcode.Size.Smallest || this.size === BCGqrcode.Size.Micro)
      ) {
        for (let i = 0; i < 4; i++) {
          this.symbol = this.findPerfectSymbolRange(i + 1, i + 1, true, sizeBits[i + 3]);
          if (this.symbol !== null) {
            return i + 3;
          }
        }
      }

      if (this.size === BCGqrcode.Size.Smallest || this.size === BCGqrcode.Size.Full) {
        this.symbol = this.findPerfectSymbolRange(1, 9, false, sizeBits[0]);
        if (this.symbol !== null) {
          return 0;
        }

        this.symbol = this.findPerfectSymbolRange(10, 26, false, sizeBits[1]);
        if (this.symbol !== null) {
          return 1;
        }

        this.symbol = this.findPerfectSymbolRange(27, 40, false, sizeBits[2]);
        if (this.symbol !== null) {
          return 2;
        }
      }
    } else {
      const i = this.findSymbolIndex(this.qrSize, this.qrMicro);

      let keyIndex: number;
      if (this.qrMicro) {
        keyIndex = this.qrSize + 2;
      } else {
        keyIndex = this.qrSize <= 40 ? (this.qrSize <= 26 ? (this.qrSize <= 9 ? 0 : 1) : 2) : -1;
      }

      const symbol = this.symbols[i];

      // We need space for the terminator OR less than 4 bits
      const spaceForTerminator = symbol.data[this.errorLevel] - sizeBits[keyIndex];
      if (
        symbol !== null &&
        sizeBits[keyIndex] > 0 &&
        (sizeBits[keyIndex] === symbol.data[this.errorLevel] ||
          (sizeBits[keyIndex] < symbol.data[this.errorLevel] &&
            (spaceForTerminator < 4 || spaceForTerminator >= symbol.getCodeTerminator().length)))
      ) {
        this.symbol = symbol;
      }

      if (this.symbol !== null) {
        return keyIndex;
      }
    }

    throw new BCGParseException('qrcode', 'No barcode can fit the data you provided. Accept bigger barcodes or change your data.');
  }

  /**
   * Creates the binary stream based on the text and the 3 sequences seq passed.
   * The function choses the best symbol based on the inputs.
   * The output will be an array of string containing 8 bits 1 and 0 (binary as string)
   */
  private createBinaryStream(text: string, seq: (Seq[] | null)[]): string[] {
    // We will decide what would be the perfect symbol now because we don't want to carry 7 bitstreams
    const sizeBits = this.calculateBits(seq);
    const sequenceTaken = this.findPerfectSymbol(sizeBits);

    const realSeq = seq[sequenceTaken];
    const binaryData = this.encode(text, realSeq);

    return binaryData;
  }

  /**
   * Creates the binary for the Structured Append if needed.
   */
  private encodeStructuredAppend(): string {
    if (this.symbol === null) {
      throw new Error();
    }

    if (this.symbolNumber > 0 && this.symbol instanceof BCGqrcodeInfoMicro) {
      throw new BCGParseException(
        'qrcode',
        "A Micro QRCode cannot contain a structured append. Make sure to allow Full mode or don't use structured append."
      );
    } else if (this.symbolNumber > 0) {
      let binary = this.symbol.getCodeStructuredAppend();
      binary += Utility.decbin(this.symbolNumber - 1, 4);
      binary += Utility.decbin(this.symbolTotal - 1, 4);

      let symbolData = 0;
      const c = this.symbolData?.length ?? 0;
      for (let i = 0; i < c; i++) {
        symbolData ^= this.symbolData!.charCodeAt(i);
      }

      binary += Utility.decbin(symbolData, 8);
      return binary;
    } else {
      return '';
    }
  }

  /**
   * Creates the binary for the FNC1 if needed.
   */
  private encodeFNC1(pos: BCGqrcode.Fnc1): string {
    if (this.symbol === null) {
      throw new Error();
    }

    if (this.fnc1 !== BCGqrcode.Fnc1.None && this.symbol instanceof BCGqrcodeInfoMicro) {
      throw new BCGParseException('qrcode', "A Micro QRCode cannot contain a FNC1. Make sure to allow Full mode or don't use FNC1.");
    } else if (pos === BCGqrcode.Fnc1.GS1 && this.fnc1 === BCGqrcode.Fnc1.GS1) {
      return this.symbol.getCodeFNC1(0);
    } else if (pos === BCGqrcode.Fnc1.AIM && this.fnc1 === BCGqrcode.Fnc1.AIM) {
      let binary = this.symbol.getCodeFNC1(1);
      if (!Utility.isNumeric(this.fnc1Id || '')) {
        binary += Utility.decbin(this.fnc1Id!.charCodeAt(0) + 100, 8); // !Verified in the Set
      } else {
        const n1 = parseInt(this.fnc1Id!, 10); // !Verified in the Set
        binary += Utility.decbin(n1, 8);
      }

      return binary;
    } else {
      return '';
    }
  }

  private encodeECI(value: number): string {
    if (this.symbol === null) {
      throw new Error();
    }

    let binary = this.symbol.getCodeECI();
    if (value <= 127) {
      binary += '0' + Utility.decbin(value, 7);
    } else if (value <= 16383) {
      binary += '10' + Utility.decbin(value, 14);
    } else {
      binary += '110' + Utility.decbin(value, 21);
    }

    return binary;
  }

  /**
   * Encodes the first ECI if there is one.
   */
  private encodeFirstECI(text: string, realSeq: Seq[] | null): { value: string; text: string; realSeq: Seq[] | null } {
    if (realSeq && realSeq.length > 0 && realSeq[0].sequence === 'E') {
      if (this.symbol instanceof BCGqrcodeInfoMicro) {
        throw new BCGParseException('qrcode', "A Micro QRCode cannot contain a ECI code. Make sure to allow Full mode or don't use ECI.");
      } else {
        text = text.substring(7);
        const value = realSeq[0].amount;
        realSeq.splice(0, 1);
        return {
          value: this.encodeECI(value),
          text,
          realSeq
        };
      }
    } else {
      return {
        value: '',
        text,
        realSeq
      };
    }
  }

  /**
   * Encodes the text based on the sequence provided.
   */
  private encode(text: string, realSeq: Seq[] | null): string[] {
    if (this.symbol === null) {
      throw new Error();
    }

    let binary = this.encodeStructuredAppend();
    binary += this.encodeFNC1(BCGqrcode.Fnc1.GS1);
    let tmp: string;
    ({ value: tmp, text } = this.encodeFirstECI(text, realSeq));
    binary += tmp;
    binary += this.encodeFNC1(BCGqrcode.Fnc1.AIM);

    let c = realSeq?.length ?? 0;
    let valueIndex = 0;
    for (let i = 0; i < c; i++) {
      const mode = realSeq![i].sequence;
      let value = realSeq![i].amount;

      if (mode === 'E') {
        binary += this.encodeECI(value);
        value = 7;
      } else if (mode === 'N') {
        binary += this.encodeNumeric(text.substring(valueIndex, valueIndex + value));
      } else if (mode === 'A') {
        binary += this.encodeAlphanumeric(text.substring(valueIndex, valueIndex + value));
      } else if (mode === 'B') {
        // In binary mode, we might have to encode Kanji.
        // However, in our code we don't have 2 different bytes
        // We have 1 UTF8 character that has 2 bytes.
        // We need to adjust the text that we need to encode.
        let newText = '';
        let counter = valueIndex;
        while (counter < value + valueIndex) {
          const oneCharacter = text.substring(counter, counter + 1);
          if (this.isCharKanji(oneCharacter[0], true)) {
            const kanjiValue = this.getKanjiValue(oneCharacter[0]);
            newText += String.fromCharCode(kanjiValue >> 8);
            newText += String.fromCharCode(kanjiValue & 0x00ff);
            value--;
          } else {
            newText += oneCharacter;
          }

          counter++;
        }

        binary += this.encodeByte(newText);
      } else if (mode === 'K') {
        binary += this.encodeKanji(text.substring(valueIndex, valueIndex + value));
      }

      valueIndex += value;
    }

    // Append Terminator if needed. We don't check more than that because the findPerfectSymbol has taken care of the size
    // TODO Comment wrong, fix next line
    const terminator = this.symbol
      .getCodeTerminator()
      .substring(0, Math.min(this.symbol.data[this.errorLevel] - binary.length, this.symbol.getCodeTerminator().length));
    binary += terminator;

    const pad = (8 - (binary.length % 8)) % 8;

    binary += Utility.strRepeat('0', pad);

    const padding: string[] = ['11101100', '00010001'];
    c = Math.ceil((this.symbol.data[this.errorLevel] - binary.length) / 8);

    for (let i = 0; i < c; i++) {
      binary += padding[i % 2];
    }

    // We have a special case for M1 and M3.
    // * If we had group padding, we removed the last 8 bits and put 0000
    // * If we didn't have padding, make sure we remove the last 4 bit of padding
    if (this.symbol.micro && (this.symbol.version === 1 || this.symbol.version === 3)) {
      if (c >= 1) {
        binary = Utility.safeSubstring(binary, 0, -8) + '0000';
      } else {
        binary = Utility.safeSubstring(binary, 0, -4);
      }
    }

    // TODO Verify if we NEED to fit it for Micro
    const dataBinary = Utility.stringSplit(binary, 8);

    const numberOfErrorCodewords = Math.floor((this.symbol.bits - this.symbol.data[this.errorLevel]) / 8);
    const errorBinary = this.computeError(dataBinary, numberOfErrorCodewords);
    const finalBinary = this.assemble(dataBinary, errorBinary);

    // Add Remainder
    const remainder = this.symbol.bits % 8;
    if (remainder > 0) {
      finalBinary.push(Utility.strRepeat('0', remainder));
    }

    return finalBinary;
  }

  /**
   * Computes the error on the dataBinary and returns nc Number of error codewords in binary string.
   */
  private computeError(dataBinary: string[], nc: number): string[] {
    if (this.symbol === null) {
      throw new Error();
    }

    const nbBlocks = this.symbol.blocks[this.errorLevel];

    const totalBlocks = Utility.arraySum(nbBlocks);
    const codePerBlocks = Math.floor(Math.floor(this.symbol.data[this.errorLevel] / 8) / totalBlocks);
    const codePerBlock1 = codePerBlocks;
    const codePerBlock2 = Math.floor(this.symbol.data[this.errorLevel] / 8) % totalBlocks === 0 ? 0 : codePerBlock1 + 1;

    let errorPerBlock = Math.floor(nc / totalBlocks);
    let errorCodeDecimal: number[] = [];
    let index = 0;
    for (let i = 0; i < nbBlocks[0]; i++) {
      const dataDecimal: number[] = Array(codePerBlock1 + errorPerBlock + 1).fill(0);
      for (let j = 0; j < codePerBlock1; j++) {
        index = j + i * codePerBlock1;
        dataDecimal[j] = Utility.bindec(dataBinary[index]);
      }

      errorCodeDecimal = errorCodeDecimal.concat(this.reedSolomon(dataDecimal, codePerBlock1, errorPerBlock));
    }

    index++;

    if (nbBlocks.length > 1) {
      for (let i = 0; i < nbBlocks[1]; i++) {
        const dataDecimal: number[] = Array(codePerBlock2 + errorPerBlock + 1).fill(0);
        for (let j = 0; j < codePerBlock2; j++) {
          dataDecimal[j] = Utility.bindec(dataBinary[j + i * codePerBlock2 + index]);
        }

        errorCodeDecimal = errorCodeDecimal.concat(this.reedSolomon(dataDecimal, codePerBlock2, errorPerBlock));
      }
    }

    const errorBinary: string[] = [];
    for (let i = 0; i < nc; i++) {
      errorBinary[i] = Utility.decbin(errorCodeDecimal[i], 8);
    }

    return errorBinary;
  }

  /**
   * Reed Solomon.
   */
  private reedSolomon(wd: number[], nd: number, nc: number): number[] {
    const t = nd + nc;
    for (let i = nd; i <= t; i++) {
      wd[i] = 0;
    }

    for (let i = 0; i < nd; i++) {
      const k = wd[nd] ^ wd[i];

      for (let j = 0; j < nc; j++) {
        wd[nd + j] = wd[nd + j + 1] ^ BCGqrcode.prod(k, this.aLogRS[nc][j], this.logTable, this.aLogTable);
      }
    }

    const r: number[] = [];
    for (let i = nd; i < t; i++) {
      r[i - nd] = wd[i];
    }

    return r;
  }

  /**
   * Assembles the dataBinary and errorBinary on the selected symbol.
   */
  private assemble(dataBinary: string[], errorBinary: string[]): string[] {
    if (this.symbol === null) {
      throw new Error();
    }

    const nbBlocks = this.symbol.blocks[this.errorLevel];

    const totalBlocks = Utility.arraySum(nbBlocks);
    const codePerBlocks = Math.floor(Math.floor(this.symbol.data[this.errorLevel] / 8) / totalBlocks);
    let codePerBlock1 = codePerBlocks;
    let codePerBlock2 = Math.floor(this.symbol.data[this.errorLevel] / 8.0) % totalBlocks === 0 ? 0 : codePerBlock1 + 1;

    // Special case for M1 and M3
    if (this.symbol.micro && (this.symbol.version === 1 || this.symbol.version === 3)) {
      if (codePerBlock2 > 0) {
        codePerBlock1++;
        codePerBlock2 = 0;
      }
    }

    const data1 = BCGqrcode.assembleFromBlocks(dataBinary, nbBlocks, codePerBlock1, codePerBlock2);

    const codePerBlocksError = Math.floor(Math.floor((this.symbol.bits - this.symbol.data[this.errorLevel]) / 8) / totalBlocks); // TODO
    const codePerBlock1Error = codePerBlocksError;
    const codePerBlock2Error =
      Math.floor((this.symbol.bits - this.symbol.data[this.errorLevel]) / 8) % totalBlocks === 0 ? 0 : codePerBlock1Error + 1;
    const data2 = BCGqrcode.assembleFromBlocks(errorBinary, nbBlocks, codePerBlock1Error, codePerBlock2Error);

    return data1.concat(data2);
  }

  /**
   * Encodes Kanji text based on the symbol.
   * We assume here the text is valid.
   */
  private encodeKanji(text: string): string {
    if (this.symbol === null) {
      throw new Error();
    }

    let binary = '';
    const c = text.length;
    for (let i = 0; i < c; i++) {
      const kanjiValue = this.getKanjiValue(text[i]);
      const subtractor = this.isLowKanji(kanjiValue) ? 0x8140 : 0xc140;

      // 1. Sutract by subtractor
      const value = kanjiValue - subtractor;

      // 2. Multiply MSB by C0
      const mult = (value >> 8) * 0xc0;

      // 3. Add LSB
      const final = mult + (value & 0x00ff);

      // 4. Convert to binary
      binary += Utility.decbin(final, 13);
    }

    const bank = this.symbol.getBANK();
    return this.symbol.getCodeKanji() + Utility.decbin(text.length, bank['K']) + binary;
  }

  /**
   * Encodes Byte text based on the symbol.
   * We assume here the text is valid.
   */
  private encodeByte(text: string): string {
    if (this.symbol === null) {
      throw new Error();
    }

    let binary = '';
    const c = text.length;
    for (let i = 0; i < c; i++) {
      binary += Utility.decbin(text.charCodeAt(i), 8);
    }

    const bank = this.symbol.getBANK();
    return this.symbol.getCodeByte() + Utility.decbin(text.length, bank['B']) + binary;
  }

  /**
   * Encodes Alphanumeric text based on the symbol.
   * We assume here the text is valid.
   */
  private encodeAlphanumeric(text: string): string {
    if (this.symbol === null) {
      throw new Error();
    }

    const keyValue = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'; // TODO CONSTANT

    let binary = '';
    const c = text.length;
    for (let i = 0; i < c; i += 2) {
      const pos = keyValue.indexOf(text[i]);

      if (text.length > i + 1) {
        const pos2 = keyValue.indexOf(text[i + 1]);
        binary += Utility.decbin(pos * 45 + pos2, 11);
      } else {
        binary += Utility.decbin(pos, 6);
      }
    }

    const bank = this.symbol.getBANK();
    return this.symbol.getCodeAlphanumeric() + Utility.decbin(text.length, bank['A']) + binary;
  }

  /**
   * Encodes Numeric text based on the symbol.
   * We assume here the text is valid.
   */
  private encodeNumeric(text: string): string {
    if (this.symbol === null) {
      throw new Error();
    }

    let binary = '';

    const groups = Utility.stringSplit(text, 3);
    const c = groups.length;
    for (let i = 0; i < c; i++) {
      const len = groups[i].length;
      const n1 = parseInt(groups[i], 10);
      if (len === 3) {
        binary += Utility.decbin(n1, 10);
      } else if (len === 2) {
        binary += Utility.decbin(n1, 7);
      } else if (len === 1) {
        binary += Utility.decbin(n1, 4);
      }
    }

    const bank = this.symbol.getBANK();
    return this.symbol.getCodeNumeric() + Utility.decbin(text.length, bank['N']) + binary;
  }
}

/**
 * Abstract class representing a barcode version.
 */
abstract class BCGqrcodeInfo {
  /**
   * Constructor.
   */
  constructor(
    public version: number,
    public micro: boolean,
    public bits: number,
    public data: number[],
    public blocks: number[][]
  ) {}

  /**
   * Number of bits per mode (Byte, Alpha, Numeric, Kanji).
   */
  abstract getBANK(): { [key: string]: number };

  /**
   * Gets the ECI code.
   */
  abstract getCodeECI(): string;

  /**
   * Gets the Numeric code.
   */
  abstract getCodeNumeric(): string;

  /**
   * Gets the Alphanumeric code.
   */
  abstract getCodeAlphanumeric(): string;

  /**
   * Gets the Byte code.
   */
  abstract getCodeByte(): string;

  /**
   * Gets the Kanji code.
   */
  abstract getCodeKanji(): string;

  /**
   * Gets the Structured Append code.
   */
  abstract getCodeStructuredAppend(): string;

  /**
   * Gets the FNC1 code based on position.
   */
  abstract getCodeFNC1(pos: number): string;

  /**
   * Gets the Terminator code.
   */
  abstract getCodeTerminator(): string;

  /**
   * Gets the size of the $qrInfo in pixel.
   */
  public static getSize(symbol: BCGqrcodeInfo): number {
    if (symbol.micro) {
      return (symbol.version - 1) * 2 + 11;
    } else {
      return (symbol.version - 1) * 4 + 21;
    }
  }
}

/**
 * Class representing a micro code.
 */
abstract class BCGqrcodeInfoMicro extends BCGqrcodeInfo {
  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getCodeECI(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeStructuredAppend(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeFNC1(_pos: number): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }
}

/**
 * Class representing a full code.
 */
abstract class BCGqrcodeInfoFull extends BCGqrcodeInfo {
  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getCodeECI(): string {
    return '0111';
  }

  getCodeNumeric(): string {
    return '0001';
  }

  getCodeAlphanumeric(): string {
    return '0010';
  }

  getCodeByte(): string {
    return '0100';
  }

  getCodeKanji(): string {
    return '1000';
  }

  getCodeStructuredAppend(): string {
    return '0011';
  }

  getCodeFNC1(pos: number): string {
    if (pos === 0) {
      return '0101';
    } else {
      return '1001';
    }
  }

  getCodeTerminator(): string {
    return '0000';
  }
}

/**
 * Class representing a micro code M1.
 */
class BCGqrcodeInfoMicro1 extends BCGqrcodeInfoMicro {
  private static readonly BITS_NUMERIC: number = 3;
  private static readonly BITS_ALPHANUMERIC: number = 0;
  private static readonly BITS_BYTE: number = 0;
  private static readonly BITS_KANJI: number = 0;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoMicro1.BITS_BYTE,
      A: BCGqrcodeInfoMicro1.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoMicro1.BITS_NUMERIC,
      K: BCGqrcodeInfoMicro1.BITS_KANJI
    };
  }

  getCodeNumeric(): string {
    // We only support numeric, and there is no value returned here.
    return '';
  }

  getCodeAlphanumeric(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeByte(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeKanji(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeTerminator(): string {
    return '000';
  }
}

/**
 * Class representing a micro code M2.
 */
class BCGqrcodeInfoMicro2 extends BCGqrcodeInfoMicro {
  private static readonly BITS_NUMERIC: number = 4;
  private static readonly BITS_ALPHANUMERIC: number = 3;
  private static readonly BITS_BYTE: number = 0;
  private static readonly BITS_KANJI: number = 0;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoMicro2.BITS_BYTE,
      A: BCGqrcodeInfoMicro2.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoMicro2.BITS_NUMERIC,
      K: BCGqrcodeInfoMicro2.BITS_KANJI
    };
  }

  getCodeNumeric(): string {
    return '0';
  }

  getCodeAlphanumeric(): string {
    return '1';
  }

  getCodeByte(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeKanji(): string {
    throw new BCGParseException('qrcode', 'Not supported');
  }

  getCodeTerminator(): string {
    return '00000';
  }
}

/**
 * Class representing a micro code M3.
 */
class BCGqrcodeInfoMicro3 extends BCGqrcodeInfoMicro {
  private static readonly BITS_NUMERIC: number = 5;
  private static readonly BITS_ALPHANUMERIC: number = 4;
  private static readonly BITS_BYTE: number = 4;
  private static readonly BITS_KANJI: number = 3;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoMicro3.BITS_BYTE,
      A: BCGqrcodeInfoMicro3.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoMicro3.BITS_NUMERIC,
      K: BCGqrcodeInfoMicro3.BITS_KANJI
    };
  }

  getCodeNumeric(): string {
    return '00';
  }

  getCodeAlphanumeric(): string {
    return '01';
  }

  getCodeByte(): string {
    return '10';
  }

  getCodeKanji(): string {
    return '11';
  }

  getCodeTerminator(): string {
    return '0000000';
  }
}

/**
 * Class representing a micro code M4.
 */
class BCGqrcodeInfoMicro4 extends BCGqrcodeInfoMicro {
  private static readonly BITS_NUMERIC: number = 6;
  private static readonly BITS_ALPHANUMERIC: number = 5;
  private static readonly BITS_BYTE: number = 5;
  private static readonly BITS_KANJI: number = 4;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoMicro4.BITS_BYTE,
      A: BCGqrcodeInfoMicro4.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoMicro4.BITS_NUMERIC,
      K: BCGqrcodeInfoMicro4.BITS_KANJI
    };
  }

  getCodeNumeric(): string {
    return '000';
  }

  getCodeAlphanumeric(): string {
    return '001';
  }

  getCodeByte(): string {
    return '010';
  }

  getCodeKanji(): string {
    return '011';
  }

  getCodeTerminator(): string {
    return '000000000';
  }
}

/**
 * Class representing a full code Small (1-9).
 */
class BCGqrcodeInfoFullSmall extends BCGqrcodeInfoFull {
  private static readonly BITS_NUMERIC: number = 10;
  private static readonly BITS_ALPHANUMERIC: number = 9;
  private static readonly BITS_BYTE: number = 8;
  private static readonly BITS_KANJI: number = 8;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoFullSmall.BITS_BYTE,
      A: BCGqrcodeInfoFullSmall.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoFullSmall.BITS_NUMERIC,
      K: BCGqrcodeInfoFullSmall.BITS_KANJI
    };
  }
}

/**
 * Class representing a micro code Medium (10-26).
 */
class BCGqrcodeInfoFullMedium extends BCGqrcodeInfoFull {
  private static readonly BITS_NUMERIC: number = 12;
  private static readonly BITS_ALPHANUMERIC: number = 11;
  private static readonly BITS_BYTE: number = 16;
  private static readonly BITS_KANJI: number = 10;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoFullMedium.BITS_BYTE,
      A: BCGqrcodeInfoFullMedium.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoFullMedium.BITS_NUMERIC,
      K: BCGqrcodeInfoFullMedium.BITS_KANJI
    };
  }
}

/**
 * Class representing a micro code Large (27-40).
 */
class BCGqrcodeInfoFullLarge extends BCGqrcodeInfoFull {
  private static readonly BITS_NUMERIC: number = 14;
  private static readonly BITS_ALPHANUMERIC: number = 13;
  private static readonly BITS_BYTE: number = 16;
  private static readonly BITS_KANJI: number = 12;

  public constructor(version: number, micro: boolean, bits: number, data: number[], blocks: number[][]) {
    super(version, micro, bits, data, blocks);
  }

  getBANK(): { [key: string]: number } {
    return {
      B: BCGqrcodeInfoFullLarge.BITS_BYTE,
      A: BCGqrcodeInfoFullLarge.BITS_ALPHANUMERIC,
      N: BCGqrcodeInfoFullLarge.BITS_NUMERIC,
      K: BCGqrcodeInfoFullLarge.BITS_KANJI
    };
  }
}

/**
 * Class representing 1 pixel on the image..
 */
class BCGqrcodePixel {
  /**
   * Pixel color, true is dark.
   */
  public pixel: boolean = false;

  /**
   * Value indicating if it's info data. true is non-data.
   */
  public info: boolean = false;

  /**
   * Sets the pixel color and if we have a "info" or "data"
   * If pixel is true, then the pixel is dark
   */
  public set(pixel: boolean, info: boolean): void {
    this.pixel = pixel;
    this.info = info;
  }

  public clone(): BCGqrcodePixel {
    let pixel = new BCGqrcodePixel();
    pixel.info = this.info;
    pixel.pixel = this.pixel;

    return pixel;
  }
}

/**
 * Class representing the Masking.
 */
abstract class BCGqrcodeCodeMaskBase {
  protected data: BCGqrcodePixel[][] = null!; // !Assigned in the first public method.

  /**
   * Constructor.
   */
  protected constructor(
    protected qrInfo: BCGqrcodeInfo,
    protected maskId: number
  ) {}

  /**
   * Tries to find the best mask that would be appropriate for the barcode.
   */
  private findPerfectMask(): BCGqrcodePixel[][] {
    const maskConditions = this.getMaskConditions();
    const numberOfMasks = maskConditions.length;

    const masks: BCGqrcodePixel[][][] = [];
    const c = BCGqrcodeInfo.getSize(this.qrInfo);

    // This version is reversed from PHP as we need to create array instance.
    for (let i = 0; i < numberOfMasks; i++) {
      masks[i] = [];
      for (let x = 0; x < c; x++) {
        masks[i][x] = [];
        for (let y = 0; y < c; y++) {
          if (this.data[x][y].info) {
            masks[i][x][y] = this.data[x][y].clone();
          } else {
            let tmp: BCGqrcodePixel[][];
            ({ mask: tmp } = this.applyMaskingToMask(masks[i], x, y, maskConditions[i](x, y)));
            masks[i] = tmp;
          }
        }
      }
    }

    const maskId = this.applyMaskConditions(masks);
    this.maskId = maskId;

    return masks[this.maskId];
  }

  /**
   * Gets an array of condition in string format
   * with $x and $y as variable.
   */
  protected abstract getMaskConditions(): BCGqrcodeMaskFunction[];

  /**
   * Executes code that checks which masks is the most suitable
   * to be used. Returns the index of the best mask.
   */
  protected abstract applyMaskConditions(masks: BCGqrcodePixel[][][]): number;

  /**
   * Gets the mask id that has been selected.
   * The information is available after getMaskData() has been called.
   */
  public getMaskId(): number {
    return this.maskId;
  }

  /**
   * Returns the perfect data mask based on the data passed.
   */
  public getMaskData(data: BCGqrcodePixel[][]): BCGqrcodePixel[][] {
    this.data = data;
    if (this.maskId === -1) {
      return this.findPerfectMask();
    } else {
      const maskConditions = this.getMaskConditions();
      return this.createMask(maskConditions[this.maskId]);
    }
  }

  /**
   * Returns the correct instance to calculate the mask based on the
   * size of the symbol.
   */
  public static getMaskClass(qrInfo: BCGqrcodeInfo, maskId: number): BCGqrcodeCodeMaskBase {
    if (qrInfo.micro) {
      return new BCGqrcodeCodeMaskMicro(qrInfo, maskId);
    } else {
      return new BCGqrcodeCodeMaskFull(qrInfo, maskId);
    }
  }

  /**
   * Applies the mask operation xorValue on the pixel at the position x, y.
   */
  protected applyMaskingToMask(mask: BCGqrcodePixel[][], x: number, y: number, xorValue: boolean): { mask: BCGqrcodePixel[][] } {
    mask[x][y] = this.data[x][y].clone();
    mask[x][y].pixel = ((mask[x][y].pixel ? 1 : 0) ^ (xorValue ? 1 : 0)) === 1;

    return {
      mask
    };
  }

  /**
   * Creates a mask based on the condition.
   */
  protected createMask(condition: BCGqrcodeMaskFunction): BCGqrcodePixel[][] {
    const c = BCGqrcodeInfo.getSize(this.qrInfo);
    let mask: BCGqrcodePixel[][] = [];
    for (let x = 0; x < c; x++) {
      for (let y = 0; y < c; y++) {
        if (this.data[x][y].info) {
          mask[x][y] = this.data[x][y].clone();
        } else {
          let tmp: BCGqrcodePixel[][];
          ({ mask: tmp } = this.applyMaskingToMask(mask, x, y, condition(x, y)));
          mask = tmp;
        }
      }
    }

    return mask;
  }
}

type BCGqrcodeMaskFunction = (x: number, y: number) => boolean;

/**
 * Class reprensenting the masking for Micro code.
 */
class BCGqrcodeCodeMaskMicro extends BCGqrcodeCodeMaskBase {
  private readonly maskConditions: BCGqrcodeMaskFunction[] = [
    (x, y) => y % 2 === 0,
    (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
    (x, y) => (((y * x) % 2) + ((y * x) % 3)) % 2 === 0,
    (x, y) => (((y + x) % 2) + ((y * x) % 3)) % 2 === 0
  ];

  public constructor(qrInfo: BCGqrcodeInfo, maskId: number) {
    super(qrInfo, maskId);
  }

  protected getMaskConditions(): BCGqrcodeMaskFunction[] {
    return this.maskConditions;
  }

  /**
   * Calculates how many dark module is on the right and lower side of the mask.
   * Then take the smallest number times 16 + the biggest number.
   * The one that scores the most is the mask selected.
   */
  protected applyMaskConditions(masks: BCGqrcodePixel[][][]): number {
    const c = BCGqrcodeInfo.getSize(this.qrInfo);
    const numberOfMasks = 4;
    const penalty: number[] = Array(numberOfMasks).fill(0);
    for (let i = 0; i < numberOfMasks; i++) {
      let sum1 = 0;
      let sum2 = 0;
      for (let j = 1; j < c; j++) {
        sum1 += masks[i][c - 1][j].pixel ? 1 : 0;
        sum2 += masks[i][j][c - 1].pixel ? 1 : 0;
      }

      // Make sure we have the smallest number in $sum1
      if (sum1 > sum2) {
        // XOR Swap
        const t = sum1;
        sum1 = sum2;
        sum2 = t;
      }

      penalty[i] = sum1 * 16 + sum2;
    }

    // We want the biggest number
    let key = 0;
    for (let i = 1; i < penalty.length; i++) {
      if (penalty[i] > penalty[key]) {
        key = i;
      }
    }

    return key;
  }
}

/**
 * Class reprensenting the masking for Full code.
 */
class BCGqrcodeCodeMaskFull extends BCGqrcodeCodeMaskBase {
  private readonly maskConditions: BCGqrcodeMaskFunction[] = [
    (x, y) => (x + y) % 2 === 0,
    (_, y) => y % 2 === 0,
    (x, _) => x % 3 === 0,
    (x, y) => (y + x) % 3 === 0,
    (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
    (x, y) => ((y * x) % 2) + ((y * x) % 3) === 0,
    (x, y) => (((y * x) % 2) + ((y * x) % 3)) % 2 === 0,
    (x, y) => (((y + x) % 2) + ((y * x) % 3)) % 2 === 0
  ];

  public constructor(qrInfo: BCGqrcodeInfo, maskId: number) {
    super(qrInfo, maskId);
  }

  protected getMaskConditions(): BCGqrcodeMaskFunction[] {
    return this.maskConditions;
  }

  /**
   * Condition 1: Adjacent modules in row/column in same color.
   * Condition 2: Block of modules in same color.
   * Condition 3: Existence of the pattern.
   * Condition 4: Proportion of the dark module in the entire symbol.
   *
   * Condition 1
   * We analyze row by row and column by column to find 6 or more
   * pixels of the same color.
   *
   * Condition 2
   * We have to find blocks bigger than 2x2
   * We do not do this since it's really cpu consuming.
   *
   * Condition 3
   * We check if we have an existence of the pattern.
   * To do this, we use a state machine that remembers if we find
   * 1:1:3:1:1 (dark:light:dark:light:dark) preceded or followed by 4 light
   *
   * Condition 4
   * We save the number of black pixel and we check the value $k
   * 50 ± (5 × k)% to 50 ± (5 × (k + 1))%
   */
  protected applyMaskConditions(masks: BCGqrcodePixel[][][]): number {
    const c = BCGqrcodeInfo.getSize(this.qrInfo);
    const numberOfMasks = 8;
    const condition3StateMachine = new BCGqrcodeCondition3StateMachine();

    const penalty1: number[] = Array(numberOfMasks).fill(3);
    const penalty2: number[] = Array(numberOfMasks).fill(0);
    const penalty3: number[] = Array(numberOfMasks).fill(0);
    const penalty4: number[] = Array(numberOfMasks).fill(0);
    for (let i = 0; i < numberOfMasks; i++) {
      let black = 0;

      for (let x = 0; x < c; x++) {
        condition3StateMachine.reset();

        let counter = 0;
        let color = masks[i][x][0].pixel;

        for (let y = 0; y < c; y++) {
          if (masks[i][x][y].pixel) {
            black++;
          }

          if (condition3StateMachine.insert(masks[i][x][y].pixel)) {
            penalty3[i] += 40;
          }

          if (masks[i][x][y].pixel === color) {
            counter++;
          } else {
            if (counter > 5) {
              penalty1[i] += counter - 5;
            }

            color = masks[i][x][y].pixel;
            counter = 1;
          }
        }

        if (counter > 5) {
          penalty1[i] += counter - 5;
        }
      }

      for (let y = 0; y < c; y++) {
        condition3StateMachine.reset();

        let counter = 0;
        let color = masks[i][0][y].pixel;

        for (let x = 0; x < c; x++) {
          if (condition3StateMachine.insert(masks[i][x][y].pixel)) {
            penalty3[i] += 40;
          }

          if (masks[i][x][y].pixel === color) {
            counter++;
          } else {
            if (counter > 5) {
              penalty1[i] += counter - 5;
            }

            color = masks[i][x][y].pixel;
            counter = 1;
          }
        }

        if (counter > 5) {
          penalty1[i] += counter - 5;
        }
      }

      // Calculates the penalty4. abs(intval(((black/total) * 100) - 50) / 5))
      const k = Math.abs(Math.floor(((black / (c * c)) * 100 - 50) / 5));
      penalty4[i] = 10 * k;
    }

    const final: number[] = Array(numberOfMasks).fill(0);
    for (let i = 0; i < numberOfMasks; i++) {
      final[i] += penalty1[i];
      final[i] += penalty2[i];
      final[i] += penalty3[i];
      final[i] += penalty4[i];
    }

    // We want the smallest number
    let key = 0;
    for (let i = 1; i < final.length; i++) {
      if (final[i] < final[key]) {
        key = i;
      }
    }

    return key;
  }
}

/**
 * State machine for condition 3 in masking.
 * This checks if we have 1 : 1 : 3 : 1 : 1 (d:l:d:l:d)
 * preceded by 4 light modules (path 1) or followed by
 * 4 light modules (path 2).
 */
class BCGqrcodeCondition3StateMachine {
  private length1: number = 0;
  private length2: number = 0;

  /**
   * Constructor. Resets the path length.
   */
  constructor() {
    this.reset();
  }

  /**
   * Resets the path.
   */
  reset(): void {
    this.length1 = 0;
    this.length2 = 0;
  }

  /**
   * Verifies if we have a matching path for 1 or 2 based
   * on the input pixelColor.
   *
   * @param pixelColor True if dark.
   * @return True if dark.
   */
  insert(pixelColor: boolean): boolean {
    let pattern = false;
    pattern ||= this.doPath1(pixelColor);
    pattern ||= this.doPath2(pixelColor);

    return pattern;
  }

  private doPath1(pixelColor: boolean): boolean {
    switch (this.length1) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 5:
      case 9:
        // Wrong color
        if (pixelColor) {
          this.length1 = 0;
          return false;
        }

        break;
      case 4:
      case 6:
      case 7:
      case 8:
      case 10:
        // Wrong color
        if (!pixelColor) {
          this.length1 = 0;
          return false;
        }

        break;
    }

    if (this.length1 === 10) {
      this.length1 = 0;
      return true;
    }

    this.length1++;

    return false;
  }

  private doPath2(pixelColor: boolean): boolean {
    switch (this.length2) {
      case 1:
      case 5:
      case 7:
      case 8:
      case 9:
      case 10:
        // Wrong color
        if (pixelColor) {
          this.length2 = 0;
          return false;
        }

        break;
      case 0:
      case 2:
      case 3:
      case 4:
      case 6:
        // Wrong color
        if (!pixelColor) {
          this.length2 = 0;
          return false;
        }

        break;
    }

    if (this.length2 === 10) {
      this.length2 = 0;
      return true;
    }

    this.length2++;

    return false;
  }
}

class Seq {
  constructor(
    public sequence: string,
    public amount: number = 0,
    public pos: number = 0
  ) {}
}

namespace BCGqrcode {
  /**
   * The size type.
   */
  export enum Size {
    /**
     * The code will be the smallest possible.
     */
    Smallest,

    /**
     * The code will be in Micro mode.
     */
    Micro,

    /**
     * The code will be in Full mode.
     */
    Full
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
     * The code will follow the GS1 standard. The second argument is not used. Separate GS1 identifiers by %. To write a %, write it double %%.
     */
    GS1,

    /**
     * The code will follow the AIM standard. The second argument must be used, it is the application indicator. It must be a letter (string) or 2 digits (integer).
     */
    AIM
  }
}

export { BCGqrcode };
