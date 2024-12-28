const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const app=express();
app.use(cookieParser());
app.use(bodyParser.json({limit:'50mb'}));
const userRoutes=require('./routes/UserRoutes');
const uploadRoutes=require('./routes/uploadRoutes');
const searchRoutes=require('./routes/SearchRoutes');
const friendsRoutes=require('./routes/FriendsRoutes');
const GlobalErrorMiddleWare = require('./middileWares/globalErrorMiddleware');

app.use('/user',userRoutes);
app.use('/upload',uploadRoutes);
app.use('/search',searchRoutes);
app.use('/friend',friendsRoutes);


app.use(GlobalErrorMiddleWare);

module.exports=app;