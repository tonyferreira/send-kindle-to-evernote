var fs          = require('fs');
var csv         = require('csv-parser');
var nodemailer  = require("nodemailer");
var books       = [];
var index       = 0;


var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tferreira92879@gmail.com",
        pass: "pdovbidnttqkgkhw",
    },
});


fs.createReadStream('books.csv')
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