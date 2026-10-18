const checkauth= (req,res,next)=>{
    if(!req.session||!req.session.student){
        return res.status(401).json({
            success:false,
            msg:"Please Log in to access this resourse."
        });
    }
    next();
}

module.exports={checkauth};