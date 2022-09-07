const jwt = require("jsonwebtoken");

const config = process.env;


// const verifyToken = (req,res,next) => {
//      console.log("hi")
//      var ret;    
//      jwt.verify(req.body.token, "secret",
//              (err, decoded) => {
//                  if(err)
//                      ret = { status: false, message: 'Token authentication failed' };
//                  else{
//                      ret = decoded;
//                  }
//              }
//          )
//      return res.send(ret);
// };

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  console.log(token)
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
  module.exports = verifyToken;