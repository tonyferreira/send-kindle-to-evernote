var fs          = require('fs');
var csv         = require('csv-parser');
var nodemailer  = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tferreira92879@gmail.com",
        pass: "pdovbidnttqkgkhw",
    },
});


var books       = [];
var index       = 351;
var iteration   = 0;
var iterations  = 87;

fs.createReadStream('books.csv')
    .pipe(csv())
    .on('data', (book) => {
        books.push(book);
    })
    .on('end', () => {
        sendToEvernote();
    });

function sendToEvernote() {

    // limit the number of books processed to avoid resource limits (gmail, evernote)
    if (iteration > iterations) {
        console.log('done');
        return;
    }

    const book = books[index];

    if (book) {

        console.log(`[${index}] ${book.title}`);

        const email = {
            from: "tferreira92879@gmail.com",
            to: "tferreira92.30c37@m.evernote.com",
            subject: book.title + " @Kindle",
            text: "",
        };

        transporter.sendMail(email, (err, info) => {
            if (err) {
                console.error(index + ': ' + err.message);
            } else {
                index++;
                iteration++;
                sendToEvernote();
            }
        });
    }
}