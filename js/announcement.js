var Mdata;
var pageMax;
var n = 1;
var loading = false;  //状态标记
doAjax();
$(document.body).infinite().on("infinite", function() {
  if(loading) return;
  loading = true;
  $(".weui-loadmore").css("visibility","visible");
  setTimeout(function() {
  	n++;
    if(n <= pageMax){
    doAjax();
    }else{
    	$(".weui-panel__ft").css("display","block");
    }
    loading = false;
    $(".weui-loadmore").css("visibility","hidden");
  }, 1000);   //模拟延迟
});
if(loading == false){
	$(".weui-loadmore").css("visibility","hidden");
}
function doAjax(){	
$.ajax({
  type: 'GET',
    url:'http://192.168.31.196:1314'+'/ZXData/api.ashx?action=articleList&page='+n,
    dataType: 'json',
    xhrFields: {withCredentials: true},
    success: function (data) {
        switch (data.state) {
                case 1:
                console.log(data);
               		Mdata=data;
               		pageMax = data.pageMax;
               		fectName();
                    break;
                case 0:
                    alertZx(data.msg, '/login.aspx?url=' + encodeURIComponent(window.location.href), 3000);
                    break;
                default: $.alert(data.msg); break;
            } 
    },		
    error: function (XMLHttpRequest) {
        $.alert('本次请求失败，请稍后再试！');
    }
});
}

function fectName(){
	var str="";
	Mdata.list.forEach(function(list){
		str +=`
		<a href="detail.html?MenuId=${list.menuId}&articleId=${list.articleId}" class="weui-media-box weui-media-box_appmsg">
		      <div class="weui-media-box__bd">
		        <h4 class="weui-media-box__title">${list.title}</h4>
		        <p class="weui-media-box__desc">学生处 ${list.time}</p>
		      </div>
		      <div class="weui-media-box__hd">
		        <img class="weui-media-box__thumb" src="../img/cover.png">
		      </div>
		    </a>
		`;
	})
	$(".weui-panel__bd").append(str);
}

