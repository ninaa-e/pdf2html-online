const pdf2html = require('pdf2html');
const fileUpload = require("express-fileupload");
const path = require("path");
require('dotenv').config()

const port = process.env.SERVER_PORT || 3000;
const ip = process.env.SERVER_IP || "127.0.0.1";

let relpath = process.env.SERVER_REL_PATH || null;

if(relpath == null)
    throw new Error("Required SERVER_REL_PATH in .env");


async function convert(fn) {
    return (await pdf2html.html(fn));
}

const express = require('express')
const app = express()

app.listen(port,ip, () => {
    console.log(`Server listening on port ${port} at ${ip}`);
  });

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));

app.post(relpath+'/upload/', async function(req, res) {
    
    if(req.files.pdf)
    {
        var data = await convert(req.files.pdf.tempFilePath);
        if(data)
            res.json({status:"success",data: data})
        else
            res.json({status: "error"})

    }
    else
        res.json({status: "error"})

});
app.get(relpath+"/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
  