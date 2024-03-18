const fs          = require('fs');
const csv         = require('csv-parser');
const file        = 'kindle_books_20240317.csv';
const nodemailer  = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tferreira92879@gmail.com",
        pass: "pdovbidnttqkgkhw",
    },
});

var books = [];
var index = 0;

fs.createReadStream(file)
    .pipe(csv())
    .on('data', (book) => {
        books.push(book);
    })
    .on('end', () => {
        sendToEvernote();
    });

function sendToEvernote() {

    if (index >= 100){
        return;
    }

    const book = books[index];

    if (book) {

        console.log(book.title);

        const email = {
            from: "tferreira92879@gmail.com",
            to: "tferreira92.30c37@m.evernote.com",
            subject: book.title + " @Kindle",
            text: "",
        };

        transporter.sendMail(email, (err, info) => {
            if (err) {
                console.error(err.message + ' at index: ' + index);
            } else {
                index++;
                sendToEvernote();
            }
        });
    }
}