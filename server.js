import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';

const app= express();


    // Configuration   --> ye maine cloudinary website se copy kiya hai
    cloudinary.config({ 
        cloud_name: 'dzyi42yi2', 
        api_key: '147389134518581', 
        api_secret: 'WA7TyviyxzL40Ms2caWYNEMyN8U' // Click 'View API Keys' above to copy your API secret
    });

mongoose.connect("mongodb+srv://vivekmani2904:bFWC1R4Etj2598nh@cluster0.diyrsmn.mongodb.net/",{
    dbName:"Nodejs_Mastery_Course",
}
).then(()=>console.log("MongoDb connected..!"))
.catch((err)=>console.log(err));

//style.css ka use kar rahe hai yaha hum jo ki public me hai
app.use(express.static("public"));

//rendering ejs file
app.get('/',(req,res)=>{
    res.render('index.ejs',{url:null})
})

//disk storage -->copy kiya gya h multer website se
const storage = multer.diskStorage({
    // destination: "./public/uploads",
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null,file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({storage: storage})

//make schema
const imageSchema = new mongoose.Schema({
    filename: String,
    public_id: String,
    imageUrl: String
})

const File = mongoose.model("cloudinary",imageSchema)



app.post('/upload', upload.single('file'), async (req, res)=> {
    const file = req.file.path

    const cloudinaryRes = await cloudinary.uploader.upload(file,{
        folder:"NodeJS_Mastery_Course"
    })

    //save to database
    const db = await File.create({
        filename:file.originalname,
        public_id: cloudinaryRes.public_id,
        imageUrl: cloudinaryRes.secure_url,
    })

    res.render("index.ejs",{url:cloudinaryRes.secure_url})

    // res.json({message:'file uploaded',cloudinaryRes})
});
const port=1000;
app.listen(port,()=>console.log(`server is running pon the port ${port}`))
