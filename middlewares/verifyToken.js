const jwt = require('jsonwebtoken');

const verifyToken = ( req , res , next ) => {
    const authHeader = req.headers.token;
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    if(authHeader) {
        jwt.verify( token , process.env.JWT_SECRET_KEY , ( error , user ) => {
            if(error) res.status(403).json("Token is invalid");
            req.user = user;
            next();
        });
    } else {
        return res.status(400).json('You are not authenticated user!');
    }
}

const authorization = ( req , res , next )  => {
    verifyToken( req , res , () => {
        
    if(req.user.id === req.params.id || req.user.isAdmin ){
        next();
    } else {
        res.status(403).json("UnAuthorized!");
    }
    
});
}


const verifyTokenAndAdmin = ( req , res , next ) => {
    verifyToken( req , res , () => {
        if( req.user.isAdmin ) {
            next();
        } else {
            res.status(500).json("You are not allowed to to that action");
        }
    });
}

module.exports = { verifyToken , authorization , verifyTokenAndAdmin }