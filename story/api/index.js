const express = require("express");
const app = express();


const dotenv = require("dotenv");
const mongoose = require("mongoose")
const hostelRoute = require("./routes/hostels");

const categoryRoute = require("./routes/categories");
const multer = require("multer");
const { application } = require("express");
const path = require("path");
const crypto = require("crypto");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect('mongodb://storydb:27017/Story', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err);
	process.exit();
});


var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: "storyobjectdb",
    port: 9000,
    useSSL: false,
    accessKey: 'ILdloFV62IoAlMOV',
    secretKey: 'bKSQ8DzAZO1wsP5Q9kikl8IBHMAXigZz'
});

minioClient.bucketExists('mybucket', function(err, exists) {
  if (err) {
    return console.log(err)
  }
  if (exists) {
    return console.log('Bucket exists.')
  }
})
let minioBucketName = 'mybucket';


(async () => {
    
    await minioClient.makeBucket(minioBucketName, "hello-there").catch((e) => {
        console.log("error");
    });

    const bucketsList = await minioClient.listBuckets();
    console.log("hhh" );
})();

var globalVariable={
  uuid: crypto.randomUUID()
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
       cb(null, "images");
  },
  filename: (req, file, cb) => {

    cb(null, file.originalname);
 
  },
});

const upload = multer({storage: storage });

app.post("/api/uploadstory", upload.single('file'), (req, res) => {

    
  const directoryPath = path.join('./images/',req.file.filename);
  
console.log(req.file.filename)
  minioClient.fPutObject('mybucket', req.file.filename, directoryPath, function(err, objInfo) {
    if(err) {
        return console.log(err)
    }
    console.log("Success", objInfo.etag, objInfo.versionId)
})
  res.send(req.file)
}, (error, req, res, next) => {

  

  console.log(req.file)
 
  res.status(400).send({ error: error.message })
})

app.get("/api/getstory/:id", (req, res)=> {
  
  try {
      let data;
       minioClient.getObject("mybucket", req.params.id, (err, objStream) => {
         
          if(err) {
              return res.status(404).send({ message: "Image not found" });
          }
          objStream.on('data', (chunk) => {
              console.log("eta error 1?");
              data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);

          });
          console.log(req.params.id);
     
          objStream.on('end', () => {
              res.writeHead(200, { 'Content-Type': 'image/png' });
              res.write(data);
              res.end();
          });
      });
  } catch (error) {
      res.status(500).send({ message: "Internal Server Error at fetching image" });
  }
});

app.use("/api/hostels", hostelRoute);

app.use("/api/categories", categoryRoute);

app.use('/',(req,res,next) => {

  return res.status(200).json({"msg":"Hello from story"})

})

app.listen("8002", () => {
    console.log("Story Backend is running on 8002");
  });

  const videoStorage = multer.diskStorage({
    destination: 'images', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000   // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})




