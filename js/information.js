$(".num").select({
  title: "选择人数",
  items: ["0","1", "2", "3", "4", "5", "6","7","8","9"]
});
$(".my-input").calendar();
$(".my-time").picker({    //开始时间初始化
    title: "请选择开始时间",
    cols: [
        {
            textAlign: 'center',
            values: ['00', '01', '02', '03', '04', '05', '06', '07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
            //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
        },
{
      textAlign: 'center',
      values: [':']
   },
        {
            textAlign: 'center',
            values: [':00', '01', '02', '03', '04', '05', '06', '07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']
        },
{
    textAlign: 'center',
    values: [':']
},
 
        {
            textAlign: 'center',
            values: [':00', '01', '02', '03', '04', '05', '06', '07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59']
        }
    ]
});
$(".transport").select({
  title: "选择交通方式",
  items: ["火车", "汽车", "动车"]
});
$.ajax({
      type: 'GET',
	    url:'http://192.168.1.110:1314'+'/ZXData/api.ashx?action=getregister',
	    dataType: 'json',
	    xhrFields: {withCredentials: true},
        success: function (data) {
	        if(data.state==1){
	        	console.log(data);
	        	$(".my-input").val(data.bdrq);
	        	$(".transport").val(data.jtfs);
						$(".my-time").val(data.dzsj);
						$(".location").val(data.dzdd);
						$(".num").val(data.sxrs);
						if(data.isby==1){$(".weui-check").attr("checked",true)}else{$(".weui-check").attr("checked",false)}
					  
	        }
        },		
        error: function (XMLHttpRequest) {
            $.alert('本次请求失败，请稍后再试！');
        }
   });
var item=[];
$.ajax({
      type: 'GET',
	    url:'http://192.168.1.110:1314'+'/ZXData/api.ashx?action=registersite',
	    dataType: 'json',
	    xhrFields: {withCredentials: true},
        success: function (data) {
	        switch (data.state) {
	                case 1:
	                data.site.forEach(fetchLocation => item.push(fetchLocation.site) );
	                $(".location").select({
										  title: "选择到站地点",
										  items: item
										});
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
function submitFrom(){
	var data = $(".my-input").val();
	var transport = $(".transport").val();
	var time = $(".my-time").val();
	var locat =$(".location").val();
	var num = $(".num").val();
	var check = $(".weui-check").is(':checked');
	if($(".weui-check").is(':checked')){var check=1;}else{var check=0};
	var Mdata={'bdrq':data,'dzsj':time,'sxrs':num,'jtfs':transport,'dzdd':locat,'Isby':check};
	console.log(check);
	console.log(Mdata);
	if(locat==""||data==""||transport==""||time==""||num==""){
		$.alert("信息不能为空");
		return false;
	}else{
		$.ajax({
	            type: "GET",//数据发送的方式（post 或者 get）
	            url: 'http://192.168.1.110:1314'+'/ZXData/api.ashx?action=register',//要发送的后台地址
	            data: Mdata,//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
	            dataType: "json",//后台处理后返回的数据格式
	            xhrFields: {withCredentials: true},
	            success: function (data) {//ajax请求成功后触发的方法
	               
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

}