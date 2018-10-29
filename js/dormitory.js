var Did = [];
$.ajax({
        type: 'GET',
		url:'../dor.txt',
		dataType: 'json',
		xhrFields: { withCredentials: true },
		success: function (data) {
		    switch (data.state) {
		            case 1:
		            	var Dom_str ="";
		            	data.list.forEach( fj_list => {
		            		Did.push({ "name": 'select_' + fj_list.ssid, "id": fj_list });
		            		Dom_str += `
		            			<a href="javascript:void(0);" id="select_${fj_list.ssid}" class="weui-flex" onclick="transForbeds(${fj_list.ssid})">
								  <div class="weui-flex__item">
								  	<div class="weui-media-box weui-media_text">
								      <h4 class="weui-media-box__title">${fj_list.qh}-${fj_list.dh}-${fj_list.fjh}</h4>
						        	  <p class="weui-media-box__desc">剩余床位  <span> ${fj_list.cwsy}/${fj_list.cwsl}</span>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 培养层次   <span>专科</span></p>
						        	  <p class="weui-media-box__desc">院系    &nbsp;<span>${fj_list.yx}</span></p>
								    </div>
								  </div>
								</a>
		            		`;
		            	})
		            	$(".Dom_str").append(Dom_str);
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
var click = 0;
function transForbeds(key){
	$(".Dom").css("display","none");
	$(".beds").css("display","block");
	click++
	for (var i = 0; i < Did.length; i++){
		if(Did[i].name == "select_"+key){
//			console.log(Did[i].id.bed);
			var cws= "";
			Did[i].id.bed.forEach(function(cw){
				if(cw.isin == 1){
					cws += `
					<div class="weui-cell">
					    <div class="weui-cell__bd weui-cell_primary" style="color: #999">
					      <p>${cw.id}号床(已被选)</p>
					    </div>
			        </div>
				`;
				}else{
					cws += `
					<div class="weui-cell">
					    <div class="weui-cell__bd weui-cell_primary" id="${cw.id}" onclick="cw_Select(this)">
					      <p>${cw.id}号床</p>
					    </div>
			        </div>
				`;
				}
				
			})
			var beds = `
				<div class="weui-cell">
			    <div class="weui-cell__bd" style="text-align: left;color: #999;">
			      <p>宿舍楼</p>
			    </div>
			    <div class="weui-cell__ft" style="color: #000000;">${Did[i].id.qh}</div>
			  </div>
			  <div class="weui-cell">
			    <div class="weui-cell__bd" style="text-align: left;color: #999;">
			      <p>楼栋号</p>
			    </div>
			    <div class="weui-cell__ft" style="color: #000000;">${Did[i].id.dh}</div>
			  </div>
			  <div class="weui-cell">
			    <div class="weui-cell__bd" style="text-align: left;color: #999;">
			      <p>房间</p>
			    </div>
			    <div class="weui-cell__ft fjh" style="color: #000000;">${Did[i].id.fjh}</div>
			  </div>
			  <div class="weui-cell">
			    <div class="weui-cell__bd weui-cell_primary" style="text-align: left;">
			      <p class="bed-title">请选择床位</p>
			    </div>
			  </div>
			  ` + cws + `
			  <div style="width: 100%;height: 15px;background:RGB(244,244,244);"></div>
			  <a href="javascript:;" class="weui-btn weui-btn_primary" onclick="submitFrom()">提交</a>
			`;
		}
	}
	$(".beds").html(beds);
}
function back(){
	if(click != 0){
		$(".Dom").css("display","block");
		$(".beds").css("display","none");
		click = 0;
	}else{
		history.back();
	}
}
var fjh;
var cw_id;
function cw_Select(obj){
	$(".weui-cell_primary").removeClass("color");
	$(obj).addClass("color");
	cw_id = $(obj).attr("id");
}
function submitFrom(){
var fjh = $(".fjh").text();
var Mdata = {"ssId":fjh,"cwh":cw_id}
console.log(Mdata);
$.ajax({
    type: "GET",
    url: 'http://zfbtest.3w.dkys.org'+'/ZXData/api.ashx?action=ssIn',
    data: Mdata,//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
    dataType: "json",
    xhrFields: {withCredentials: true},
    success: function (data) {
    switch (data.state) {
        case 1:
        		$.alert(data.msg);
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
