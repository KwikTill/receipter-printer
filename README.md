
# receipt-printer

## Installation
```bash
npm install @kwiktill/receipt-printer --registry=https://registry.kwiktill.com
```

## Example
```javascript
const Printer = require('@kwiktill/receipt-printer');

const printer = new Printer({
   dotsPerLine: 576,
   templatePath: `${__dirname}/test.ejs`
});


(async () => {

   try {
      await printer.init();
      await printer.print({});
   } catch (err) {
      console.log(err);
   }

})();
```