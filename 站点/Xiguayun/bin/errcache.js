var errpc=require('./errrsp.js');
module.exports=function(fn,res){
    try{
        console.info('fn');
        fn();
    }catch (e){
        errpc(res,{message:"出现程序错误",status:"E_SERVER_ERROR"},500);
    }
};
