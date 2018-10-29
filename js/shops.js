var jxcm="", Mdata;
$(".weui-col-33").click(function () {
    $(this).addClass("border-color").siblings().removeClass("border-color");
    jxcm = $(this).find("span").text();
    Mdata = {"size":jxcm};
})
$.ajax({
    type: "get",
    url: "http://zfbtest.3w.dkys.org/ZXData/api.ashx?action=info",
    xhrFields: {withCredentials: true },
    dataType: "json",
    success: function (data) {
        switch (data.state) {
            case 1:
                if (data.jxcm !=""){
                	$(".weui-btn_primary").css({"background":"#c7c7cc"});
			        $(".weui-btn_primary").mousedown(function(){
			        	$(this).css("color","white");
			        })
					$(".weui-btn_primary").removeAttr('onclick');
                }
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

function submitJxcm() {
    $.ajax({
        type: "get",
        url: "http://zfbtest.3w.dkys.org/ZXData/api.ashx?action=jxfz",
        xhrFields: { withCredentials: true },
        data: Mdata,
        dataType: "json",
        success: function (data) {
            switch (data.state) {
                case 1:
                    $.alert(data.msg);
                    break;
                case 0:
                    alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
                    break;
                default: $.alert(data.msg); break;
            }
        },
        error: function (XMLHttpRequest) {
            $.alert('本次请求失败，请稍后再试！');
        }
    });
}



var listLen, listVal;
$.ajax({
    type: "get",
    url: "../goodslist.txt",
    xhrFields: {withCredentials: true },
    dataType: "json",
    success: function (data) {
        switch (data.state) {
            case 1:
        		var goodslist = "";
        		listLen = data.list.length;
        		listVal = data;
        		console.log(listLen);
                data.list.forEach(function(goods,index){
                	goodslist += `
                		<div class="weui-media-box weui-media-box_appmsg" style="background: RGB(245,245,245);">
					      <div class="weui-media-box__hd">
					        <img class="weui-media-box__thumb" id="Field" src="http://zfbtest.3w.dkys.org/ZXData/api.ashx?action=ShopPic&Img=${goods.goodsImg}">
					      </div>
					      <div class="weui-media-box__bd">
					        <h4 class="weui-media-box__title">${goods.goodsName}</h4>
					        <p class="weui-media-box__desc" style="line-height: 18px;">
					        	颜色:【白色+彩线】  <br />
					        	尺寸：1.2米*2米
					        </p>
					      	<p>￥${goods.price}</p>
					      </div>
					    </div>
					    <div class="weui_panel_ft">
					    	<div class="weui-cell">
					            <div class="weui-cell__bd">
					              <p>购买数量</p>
					            </div>
					            <div class="weui-cell__ft">
					              <div class="weui-count">
					                <a class="weui-count__btn weui-count__decrease"></a>
					                <input readonly="readonly" class="weui-count__number num${index}" type="number" value="1">
					                <a class="weui-count__btn weui-count__increase"></a>
					              </div>
					            </div>
					          </div>
					    </div>
                	`;
                })
               	if(goodslist != ""){
               		$(".goodslist").html(goodslist);
               	}
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
var payType = "alipay";
var shopData=[];
if ($("input[name='radio1']:checked").val() == "weixin") {
    payType = "weixin";
}
if ($("input[name='radio1']:checked").val() == "alipay") {
    payType = "alipay";
}

//提交自购商品
function confirmBuy(){
shopData = [];
for(i=0;i<listLen;i++){
	if($(".num"+i+"").val()>0){
		shopData1={"goodsSn":listVal.list[i].goodsSn,"goodsCount":$(".num"+i+"").val()};
	    shopData.push(shopData1);
	}
}
console.log(shopData);
if(shopData==""){
	$.alert("购物车暂无商品！");
}
//提交自购商品
setTimeout(function(){
	var shopDatajson=JSON.stringify(shopData);
    var base = new Base64(); 
    var result2 = base.encode(shopDatajson);
    console.log(result2);
	$.ajax({
	    type: "get",
	    url: "http://zfbtest.3w.dkys.org/pay/Pay.ashx?action=shop",
	    xhrFields: {withCredentials: true},
	    data: {PayType: payType,info:result2 },
	    dataType: "json",
	    success: function (data) {
	    	switch (data.state) {
	            case 1:
	                $.alert(data.msg);
	                break;
	            case 0:
	                alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
	                break;
	            default: $.alert(data.msg); break;
	        }
	    },
	    error: function (msg) {//ajax请求失败后触发的方法
	        $.alert(msg);//弹出错误信息
	        }
	   });
},500);
};

var MAX = 10, MIN = 0;
$("body").delegate(".weui-count__decrease","click", function(e){
	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    var number = parseInt($input.val() || "0") - 1
    if (number < MIN) number = MIN;
    $input.val(number)
});
$("body").delegate(".weui-count__increase","click", function(e){
	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    var number = parseInt($input.val() || "0") + 1
    if (number > MAX) number = MAX;
    $input.val(number)
});