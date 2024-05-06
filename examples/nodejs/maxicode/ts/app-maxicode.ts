import { BCGColor, BCGDrawing, BCGFont, BCGLabel } from '@barcode-bakery/barcode-common';
import { BCGmaxicode } from '@barcode-bakery/barcode-maxicode';
import { createSurface, toBuffer } from '@barcode-bakery/barcode-node-common';
import { createServer } from 'http';
import { parse } from 'querystring';

const defaultText = 'MaxiCode';

// Loading Font
const font = new BCGFont('Arial', 18);

// The arguments are R, G, B for color.
const colorBlack = new BCGColor(0, 0, 0);
const colorWhite = new BCGColor(255, 255, 255);

const getDrawing = function (text: string) {
  try {
    // Label, this part is optional
    const label = new BCGLabel();
    label.setFont(font);
    label.setPosition(BCGLabel.Position.Bottom);
    label.setAlignment(BCGLabel.Alignment.Center);
    label.setText(text);

    const code = new BCGmaxicode();
    code.setScale(3);
    code.setMode(4);
    code.setQuietZone(true);
    code.setBackgroundColor(colorWhite); // Color of spaces
    code.setForegroundColor(colorBlack); // Color of bars

    code.addLabel(label);

    code.parse(text); // Text

    const drawing = new BCGDrawing(createSurface, colorWhite);
    drawing.draw(code);

    return drawing;
  } catch (exception) {
    const drawing = new BCGDrawing(createSurface, colorWhite);
    drawing.drawException(exception);

    return drawing;
  }
};

/*
// This is how you would save to a file.
const drawing = getDrawing(defaultText);
save(drawing, 'image.png', BCGDrawing.ImageFormat.Png, function () {
  console.log('Done.');
});
*/

createServer(function (request, response) {
  const drawing = getDrawing(parse(request.url || '').query?.toString() || defaultText);
  toBuffer(drawing, BCGDrawing.ImageFormat.Png, function (err: Error | null, buffer: Buffer) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(buffer);
  });
}).listen(8124);
console.log('Server running at http://127.0.0.1:8124/');
