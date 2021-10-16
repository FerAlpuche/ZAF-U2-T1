let principal = $("#principal");
let news = $("#news");
let url = window.location.href
let swDirect = "/ZAF-U2-T1/sw.js"

if(navigator.serviceWorker){
    console.log("Todo good!!");
    if(url.includes('localhost')){
        swDirect = "/sw.js"
    }
    navigator.serviceWorker.register(swDirect)  
}else{    
    console.log("Todo bad!!")
}

$(".btn-seguir").on("click", function(e){
    e.preventDefault();
    principal.fadeOut(function(){
        news.slideDown(1000)
    })
});

$(".btn-return").on("click", function(){
    news.fadeOut(function(){
        principal.slideDown(1000)
    })
})