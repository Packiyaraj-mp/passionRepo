const AsyncoronizeErrorHandler = require("../middileWares/AsyncoranizeErrorHandler");
const friendsModel = require('../mongoShema/friendsShema');
const videoPostModel = require('../mongoShema/uploadVideoShema');
const aws=require('aws-sdk');

const s3=new aws.S3({
accessKeyId:process.env.AWS-ACCESS_KEY,
secretAccessKey:process.env.AWS-SECRET_ACCESS_KEY,
region:'us-east-1'
});

const getVideosWorker=AsyncoronizeErrorHandler(
    async(req,res,next)=>{
    let videosUrl=[];
    let data=[];
    
    const user=await friendsModel.findOne({userId:req.user._id}).select({friendsIds:{$slice:5}});
    
    if(user){
    
    const friendsId=user.friendsIds.map(ele=>String(ele));
    
    
    const newData=await Promise.all(
      friendsId.map(id=>
        videoPostModel.find({posterId:id})
        .limit(2)
      )
    );
    data=newData.flat();
    
    if(data){
    for(const doc of data){
        const params={Bucket:'shomoimageunit1', Key:doc.videoKey,Expires:60 * 60};
        
        const url=await s3.getSignedUrl('getObject',params);
        videosUrl.push( 
           {
            dimention:doc.dimention,
            url,
            posterId:doc.posterId,
            poster:doc.poster,
            text:doc.text,
            success:true,
            date:doc.createdAt
          })
        }
    }
    
    res.status(200).json({
    videos:videosUrl?videosUrl:[]
    });
    
    }
    }
);

module.exports=getVideosWorker;