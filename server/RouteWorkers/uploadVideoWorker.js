const aws=require('aws-sdk');
const AsyncoronizeErrorHandler = require('../middileWares/AsyncoranizeErrorHandler');
const GlobalErrorClass = require('../middileWares/errorClass');
const videoPostModel = require('../mongoShema/uploadVideoShema');


const s3=new aws.S3({
accessKeyId:process.env.AWS-ACCESS_KEY,
secretAccessKey:process.env.AWS-SECRET_ACCESS_KEY,
region:'us-east-1'
});

const uploadWorker=AsyncoronizeErrorHandler(
async(req,res,next)=>{
const {uploadData}=req.body;
const user=req.user;

let urlPath="";

        
const buffer=Buffer.from(uploadData.url,'base64');
const params={
Bucket:'shomoimageunit1',
Key:`${Date.now()}.mp4`,
Body:buffer,
ContentType:'video/mp4',
ACL:'private'
};
                
const data=await s3.upload(params).promise();


const Keyparams={
Bucket:'shomoimageunit1',
Key:data.Key,
Expires:60 * 60
}


s3.getSignedUrl('getObject',Keyparams,async(err,url)=>{
if(err){
return next(new GlobalErrorClass(400,'Error in generating url'))
}
urlPath=url;

}
);

const uploadNewPost=await videoPostModel.create({
    posterId:user._id,
    poster:user.name,
    videoKey:data.Key,
    text:uploadData.text,
    dimention:uploadData.dimention
    });

 

   return res.status(200).json({
    url:urlPath,
    posterId:uploadNewPost.posterId,
    poster:uploadNewPost.poster,
    text:uploadNewPost.text,
    dimention:uploadNewPost.dimention,
    success:true,
    date:uploadNewPost.createdAt
    })

}
);


module.exports=uploadWorker;