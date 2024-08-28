const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", 'ejs');

app.get("/", (req, res) => {
    const filesDir = path.join(__dirname, 'files');
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to scan directory");
        }
        res.render("index", { files: files });
    });
});

app.post("/create", (req, res) => {
    
    fs.writeFile(`./files/${req.body.title}.txt`, req.body.details, (err) => {
        if (err) {
            return res.status(500).send("Unable to create file");
        }
        res.redirect('/');
    });
});

app.get("/file/:filename", (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return res.status(500).send("Unable to read file");
        }
        res.render('show', { filename: req.params.filename, filedata: fileData });
    });
});


    app.post("/delete", (req, res) => {
        const filePath = path.join(__dirname, 'files', req.body.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).send("Unable to delete file");
            }
            res.redirect('/');
        });
    });

    app.get("/edit/:filename",(req,res)=>{
        res.render('edit',{filename: req.params.filename});

    })
    

    app.post("/edit",(req,res)=>{
        fs.rename(`./files/:${req.body.oldname}`,`./files/:${req.body.newname}`,(err)=>{
            res.redirect("/");  
            
        })
        // console.log(req.body);
        
    })
    


app.listen(2000, () => console.log("Server started on port 2000"));
