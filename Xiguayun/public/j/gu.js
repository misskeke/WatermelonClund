$(function(){
    $.post("/register/finish",{wisChk: pdWisChk, sex:"-"},function(q){
        if(q.successful){
            window.location="/";
        }
    }, 'json');
});
