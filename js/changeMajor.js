var Mdata;
$.ajax({
    type: "get",
    url: "../info.txt",  // /ZXData/api.ashx?action=info
    xhrFields: {withCredentials: true },
    dataType: "json",
    success: function (data) {
        switch (data.state) {
            case 1:
                Mdata = data;
                fetchData();
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
function fetchData(){
	$(".xm").html(Mdata.xm);
	$(".xb").html(Mdata.xb);
	$(".ksh").html(Mdata.ksh);
	$(".yx").html(Mdata.yx);
	$(".zy").html(Mdata.zy);
	$(".bj").html(Mdata.bj);
}
var yxItem=[], zyItem=[], selectItem=[];
$.ajax({
    type: 'GET',
    url:'../zyList.txt', // /ZXData/api.ashx?action=zyList
    dataType: 'json',
    xhrFields: {withCredentials: true},
    success: function (data) {
        switch (data.state) {
                case 1:
                data.yx.forEach(fetchLocation => {
                	yxItem.push(fetchLocation.name);
                	selectItem1= {"yx":fetchLocation.name,"zy":fetchLocation.zy};
                	selectItem.push(selectItem1);
                } );
                console.log(yxItem);
                
                $(".intoYx").select({
							  title: "选择转入院系",
							  items: yxItem
							});
				$(".intoYx").change(function(){
					zyItem=[];
					$(".intoZy").val("");
					for(var i = 0;i < selectItem.length;i++){
	                	if(selectItem[i].yx == $(".intoYx").val()){
	                		selectItem[i].zy.forEach(function(zy){
	                			zyItem.push(zy.name);
	                		})
	                		console.log(zyItem);
	                		$(".intoZy").select({
								  title: "选择转入专业",
								  items: zyItem
								});
							$(".intoZy").select("update", { items: zyItem })
	                	}
	                }
				})
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
    NewZY = $(".intoZy").val();
    if (NewZY.length == 0) {
        $.alert('请选择需转入的专业');
        return;
    }
    if (Mdata.zy == NewZY) {
        $.alert('新专业不能与原专业相同');
        return;
    }
    var ForReason = $("textarea").val();
    if (ForReason.length == 0) {
        $.alert('请输入申请理由');
        return;
    }
    $.ajax({
        type: "get",
        url: "http://zfbtest.3w.dkys.org/ZXData/api.ashx?action=ZZYSQ&new=" + NewZY + "&cause=" + ForReason,
        dataType: "json",
        xhrFields: {withCredentials: true},
        success: function (data) {
            switch (data.state) {
                case 0:
                    alertZx(data.msg, '/login.html?url=' + encodeURIComponent(window.location.href), 3000); break;
                default: $.alert(data.msg); break;
            }
        },
        error: function (stat) {
            $.alert('本次请求失败，请稍后再试！');
        }
    });
}