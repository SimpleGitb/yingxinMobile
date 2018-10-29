var Mdata;

$(function(){
	$.ajax({
		    type: 'GET',
		    url: '../info.txt',
		    dataType: 'json',
		    xhrFields: {withCredentials: true},
		    success:function(data) {
		    	Mdata=data;
				switch (data.state) {
	                case 1:
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
});


function fectName(){
	$(".xm").html(Mdata.xm);
	$(".xb").html(Mdata.xb);
	$(".sfz").html(Mdata.sfz);
	$(".mz").html(Mdata.mz);
	$(".zzmm").html(Mdata.zzmm);
	$(".age").html(Mdata.age);
	$(".byxx").html(Mdata.byxx);
	$(".dh").html(Mdata.dh);
	$(".jtdz").html(Mdata.jtdz);
	$(".xfzt").html(Mdata.xfzt);
	$(".yx").html(Mdata.yx);
	$(".zy").html(Mdata.zy);
	$(".bj").html(Mdata.bj);
	$(".ssqh").html(Mdata.ss.ssqh);
	$(".ldbh").html(Mdata.ss.ldbh);
	$(".dybh").html(Mdata.ss.dybh);
	$(".lcbh").prepend(Mdata.ss.lcbh);
	$(".fjbh").html(Mdata.ss.fjbh);
	$(".cwh").html(Mdata.cwh);
	$(".zxsjh").html(Mdata.zxsjh);
	
}
$.ajax({
    type: 'GET',
    url:'http://192.168.31.196:1314'+'/ZXData/api.ashx?action=buyList',
    dataType: 'json',
    xhrFields: {withCredentials: true},
    success:function(data) {
    	var str="";
    	 switch (data.state) {
                case 1:
                    data.list.forEach(function(lt){
		    			str+=`
		    			    <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
						      <div class="weui-media-box__hd">
						        <img class="weui-media-box__thumb" id="Field" src="../img/barr1.jpg">
						      </div>
						      <div class="weui-media-box__bd">
						        <h4 class="weui-media-box__title">${lt.goodsName}<span>￥${lt.price}</span></h4>
						        <p class="weui-media-box__desc" style="margin-top: 5px;">
						        	颜色：白色  <span class="size">尺码：L</span>
						     
						        <div class="weui-time">${lt.time}  <span>×${lt.goodsCount}</span></div>
						        </p>
						      </div>
						    </a>
		    			`;
		    		})
		    		$(".shop-list").append(str);
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