import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as idV4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from 'sharp';

class TicketPDFC {
  static async finalizeBooking(req, res, next) {
    try {
      const {
        moviePhoto, movieTitle, duration, date, time, row, seat, price, userEmail,
      } = req.body;

      const filename = fileURLToPath(import.meta.url);
      const dirname = path.dirname(filename);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([977, 314]);

      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawRectangle({
        x: 0,
        y: 0,
        width: 977,
        height: 314,
        color: rgb(0.18, 0.19, 0.20),
      });

      try {
        const response = await axios.get(`http://localhost:4000/${moviePhoto}`, { responseType: 'arraybuffer' });
        const imageBytes = response.data;
        let image;
        if (moviePhoto.endsWith('.png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (moviePhoto.endsWith('.jpg') || moviePhoto.endsWith('.jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (moviePhoto.endsWith('.webp')) {
          const pngBuffer = await sharp(imageBytes).png().toBuffer();
          image = await pdfDoc.embedPng(pngBuffer);
        } else {
          throw new Error('Unsupported image format');
        }

        const imageWidth = 177;
        const imageHeight = 225;
        const imageX = 40;
        const imageY = 44;
        const borderRadius = 20;

        page.drawImage(image, {
          x: imageX + borderRadius,
          y: imageY + borderRadius,
          width: imageWidth - 2 * borderRadius,
          height: imageHeight - 2 * borderRadius,
        });

        page.drawSvgPath(
          `M${imageX + borderRadius},${imageY} 
    h${imageWidth - 2 * borderRadius} 
    a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius} 
    v${imageHeight - 2 * borderRadius} 
    a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},${borderRadius} 
    h-${imageWidth - 2 * borderRadius} 
    a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},-${borderRadius} 
    v-${imageHeight - 2 * borderRadius} 
    a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}`,
          {
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          },
        );
      } catch (imageError) {
        console.error('Error loading image:', imageError);
      }

      page.drawText(movieTitle, {
        x: 240,
        y: 230,
        size: 28,
        font: titleFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText(`$${price}`, {
        x: 850,
        y: 230,
        size: 28,
        font: titleFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText(duration, {
        x: 240,
        y: 190,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText('Theater', {
        x: 240,
        y: 160,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });
      page.drawText('Play Cinema San Jose, CA', {
        x: 240,
        y: 140,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText('Date', {
        x: 240,
        y: 110,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });
      page.drawText(date, {
        x: 240,
        y: 90,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText('Time', {
        x: 400,
        y: 110,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });
      page.drawText(time, {
        x: 400,
        y: 90,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      page.drawText(`Row: ${row}`, {
        x: 240,
        y: 60,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });
      page.drawText(`Seat: ${seat}`, {
        x: 400,
        y: 60,
        size: 16,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      const qrCodeWidth = 150;
      const qrCodeHeight = 150;
      const qrCodeX = 750;
      const qrCodeY = 70;

      page.drawRectangle({
        x: qrCodeX,
        y: qrCodeY,
        width: qrCodeWidth,
        height: qrCodeHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText('QR Code', {
        x: qrCodeX + 25,
        y: qrCodeY + 70,
        size: 12,
        font: textFont,
        color: rgb(0.0588, 0.5098, 0.3921),
      });

      const pdfBytes = await pdfDoc.save();
      const fileName = `${idV4()}-${userEmail}.pdf`;
      const pdfPath = path.join(dirname, '..', 'tickets', fileName);

      const ticketsDir = path.join(dirname, '..', 'tickets');
      if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
      }

      fs.writeFileSync(pdfPath, pdfBytes);

      res.json({
        status: 'ok',
        fileName,
      });
    } catch (e) {
      console.error('Error creating PDF:', e);
      next(e);
    }
  }
}

export default TicketPDFC;
