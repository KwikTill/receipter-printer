console.clear();


const Printer = require('../index.js');


const dotsPerLine = parseInt(process.env.DOTS_PER_LINE) || 576

const printer = new Printer({
   dotsPerLine,
   templatePath: `${__dirname}/../test.ejs`
});


(async () => {

   try {

      await printer.init();
      await printer.print();

   } catch (err) {
      console.log(err);
   }

})()