
const escpos = require('escpos');
const USB = require('./escpos-usb');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs').promises;
const uuid = require('uuid')

escpos.USB = USB;


class ReceiptPrinter {

   _prepareImage(path) {
      return new Promise((resolve, reject) => {
         try {
            escpos.Image.load(path, (img) => {

               if (!img) {
                  reject(new Error('Failed to prepare the image'));
                  return;
               }

               resolve(img);

            });
         } catch (err) {
            reject(err);
         }
      });
   }

   async print(data) {

      if (!this._initialized)
         throw new Error('Printer not initialized');

      // creating page
      const page = await this._browser.newPage();

      // set receipt size
      await page.setViewport({
         width: this._dotsPerLine,
         height: this._dotsPerLine,
      });

      // generating html
      const templateData = await fs.readFile(this._templatePath, { encoding: 'utf-8' });
      const html = ejs.render(templateData, data);

      await page.setContent(html);

      // taking the screenshot
      const screenshotPath = `${__dirname}/${uuid}.png`;

      await page.screenshot({
         fullPage: true,
         path: screenshotPath,
      });


      // print
      const img = await this._prepareImage(screenshotPath)
      await this._printer.image(img);
      this._printer.cut().close();

      // removing the screenshot from the disk
      await fs.unlink(screenshotPath);

      await page.close();

   }

   init() {
      return new Promise((resolve, reject) => {
         const device = new escpos.USB();
         
         device.open(async err => {

            if (err) {
               reject(err);
               return;
            }

            this._device = device;
            this._printer = new escpos.Printer(device);


            try {
               this._browser = await puppeteer.launch();
               this._initialized = true;
               resolve();
            } catch (err) {
               reject(err);
            }

         });
      });
   }

   /**
    * 
    * @param {Object} param0 
    * @param {number} param0.dotsPerLine The printer resolution
    * @param {templatePath} param0.templatePath The path to the ejs receipt template
    */
   constructor({ dotsPerLine, templatePath }) {
      this._dotsPerLine = dotsPerLine;
      this._templatePath = templatePath
      this._initialized = false;
   }
}

module.exports = ReceiptPrinter;