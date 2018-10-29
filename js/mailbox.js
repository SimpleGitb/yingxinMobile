var Unid =[];
var pageMax,pageMax2;
var n = 1,f = 1;
var loading = false;  //状态标记
$(".content-padded").height($(".weui-tab__bd-item").height());
doAjax();
doAjax2();
$(".infinite").infinite().on("infinite", function() {
	
	var self = this;
  if(loading) return;
  loading = true;
  $(".weui-loadmore").css("visibility","visible");
  setTimeout(function() {
  	
  	if($(self).find(".doc-head").text()=="消息列表1"){
    		  n++;
    		  if(n <= pageMax){
				    	doAjax();
				    }else{
				    	$(".weui-panel__ft1").css("display","block");
				    }
    	}else if($(self).find(".doc-head").text()=="消息列表2"){
    		f++;
    		if(f <= pageMax2){
				    	doAjax2();
				    }else{
				    	$(".weui-panel__ft2").css("display","block");
				    }
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
    type: "get",
    url: "../SmsUnReadList.txt",  // /ZXData/api.ashx?action=info
    xhrFields: {withCredentials: true },
    dataType: "json",
    success: function (data) {
        switch (data.state) {
            case 1:
            	pageMax = data.pageMax;
            	console.log(pageMax);
                var UnReadList = "";
                data.list.forEach(function(Unli){
                	Unid.push({ "content": Unli.content, "id": Unli.id });
                	UnReadList += `
                		<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" onclick="Modal(${Unli.id})">
					      <div class="weui-media-box__bd">
					        <h4 class="weui-media-box__title">${Unli.title}</h4>
					        <span class="weui-badge" style="position: absolute;top: 0em;right: 1em; background-color: red;width:">1</span>
					        
					      	<p class="weui-media-box__desc">${Unli.time}</p>
					      </div>
					    </a>
                	`;
                })
                $(".UnReadList").append(UnReadList);
                break;
            case 0:
                alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
                break;
            default: $.alert(data.msg); break;
        }
    },
    error: function (msg) {
        $.alert('本次请求失败，请稍后再试！');
    }
});
}
function doAjax2(){
	$.ajax({
    type: "get",
    url: "../SmsReadList.txt",  // /ZXData/api.ashx?action=info
    xhrFields: {withCredentials: true },
    dataType: "json",
    success: function (data) {
        switch (data.state) {
            case 1:
            		pageMax2 = data.pageMax;
                var ReadList = "";
                data.list.forEach(function(li){
                	ReadList += `
                		<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
					      <div class="weui-media-box__bd">
					        <h4 class="weui-media-box__title">${li.title}</h4>
					        <p class="weui-media-box__desc">${li.content}</p>
					      	<p class="weui-media-box__desc">${li.time}</p>
					      </div>
					    </a>
                	`;
                })
                $(".ReadList").append(ReadList);
                break;
            case 0:
                alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
                break;
            default: $.alert(data.msg); break;
        }
    },
    error: function (msg) {
        $.alert('本次请求失败，请稍后再试！');
    }
});
}


function Modal(obj){
	for(var i = 0;i<Unid.length;i++){
		if(Unid[i].id == obj){
			$.alert(Unid[i].content);
		}
	}
	$.ajax({
	    type: "get",
	    url: "http://192.168.31.196:1314/ZXData/api.ashx?action=SmsRead",  // /ZXData/api.ashx?action=info
    	data: {"Id":obj},//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
	    xhrFields: {withCredentials: true },
	    dataType: "json",
	    success: function (data) {
	    	//未读消息提交，没给返回结果，后台完成
//	       setTimeout(function(){
//	       	$.alert(data.msg);
//	       },1000);
	    },
	    error: function (msg) {
	        $.alert('本次请求失败，请稍后再试！');
	    }
	});
}
