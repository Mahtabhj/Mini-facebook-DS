const router = require("express").Router();

const Hostel = require("../models/Hostel");

// function minio() {
//   return new Minio.Client({
//     endPoint: "storyobjectdb",
//     port: 9000,
//     useSSL: false,
//     accessKey: 'ILdloFV62IoAlMOV',
//     secretKey: 'bKSQ8DzAZO1wsP5Q9kikl8IBHMAXigZz'
//   });
// }
//CREATE POST
router.post("/", async (req, res) => {
  const newHostel = new Hostel(req.body);
  
  try {
    const savedHostel = await newHostel.save();
    
    res.status(200).json(savedHostel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (hostel.username === req.body.username) {
      try {
        const updatedHostel = await Hostel.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedHostel);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (hostel.username === req.body.username) {
      try {
        await hostel.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    res.status(200).json(hostel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/:id", async (req, res) => {
// console.log(req.params.id);

//   try {
//     let data;
//      minioClient = minio();
     
//      minioClient.getObject("mybucket", req.params.id, (err, objStream) => {
       
//         if(err) {
//             return res.status(404).send({ message: "Image not found" });
//         }
//         objStream.on('data', (chunk) => {
//             console.log("eta error 1?");
//             data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
//         });
//         console.log(req.params.id);
   
//         objStream.on('end', () => {
//             res.writeHead(200, { 'Content-Type': 'image/png' });
//             res.write(data);
//             res.end();
//         });
//     });
// } catch (error) {
//     res.status(500).send({ message: "Internal Server Error at fetching image" });
// }
// });
//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let hostels;
    if (username) {
      hostels = await Hostel.find({ username });
    } else if (catName) {
      hostels = await Hostel.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      hostels = await Hostel.find();
    }
    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json(err);
  }
});



// var getImage = ( (req,res) =>{

//   try {
//       let data;
//        minioClient = minio();
//        minioClient.getObject("mybucket", req.params.id, (err, objStream) => {
         
//           if(err) {
//               return res.status(404).send({ message: "Image not found" });
//           }
//           objStream.on('data', (chunk) => {
//               console.log("eta error 1?");
//               data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);

//           });
//           console.log(req.params.id);
     
//           objStream.on('end', () => {
//               res.writeHead(200, { 'Content-Type': 'image/png' });
//               res.write(data);
//               res.end();
//           });
//       });
//   } catch (error) {
//       res.status(500).send({ message: "Internal Server Error at fetching image" });
//   }
// });


module.exports = router;