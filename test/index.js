console.clear();


const Printer = require('../index.js');

const printer = new Printer({
   dotsPerLine: 576,
   templatePath: `${__dirname}/../test.ejs`
});


(async () => {

   try {
      await printer.init();
      await printer.print({});
   } catch (err) {
      console.log(err);
   }

})()