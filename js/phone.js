var Pdata, Sdata;
//$(".tab-head a").click(function(){
//	$(this).addClass("active-a").siblings().removeClass("active-a");
//})
//$(".weui-col-33").click(function(){
//	$(this).addClass("border-color").siblings().removeClass("border-color");
//})

//$('.pagination').jqPagination({
//	link_string : '/?page={page_number}',
//	current_page: 1, 
//	max_page : 5,
//	page_string : '当前第{current_page}页,共{max_page}页',
//	paged : function(page) {
////	    console.log(page);
//	    }
//});
$.ajax({
	type: "get",
	url: "../phone.txt",
	xhrFields: {
		withCredentials: true
	},
	dataType: "json",
	success: function(data) {
		switch(data.state) {
			case 1:
				console.log(data);
				Pdata = data;
				break;
			case 0:
				alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
				break;
			default:
				$.alert(data.msg);
				break;
		}
	},
	error: function(msg) {
		$.alert('本次请求失败，请稍后再试！');
	}
});

function getData(isp) {
	if(Pdata != undefined) {
		var str = "";
		var i = 0;
		Pdata.mobile[isp - 1].list.forEach(function(m) {
			str += `<a onclick="NumSegment(${isp},${i})" class="${i}"><span>丨</span>${m.part}</a>`;
			i++;
		})
		$(".row1").html("<h2>请选择号段</h2>");
		$(".header1>span~").remove();
		$(".header1").append(str);
		return;
	} else {
		$.alert('无列表，请刷新后再试试！');
	}
};

function NumSegment(isp, partIndex) {
	$(".header1 a").css("color", "#000000");
	$("." + partIndex).css("color", "#2580d3");
	if(Pdata == undefined) {
		$.alert('无列表，请刷新后再试试！');
	} else {
		var i = 0;
		var str = `<div class="swiper-container"><div class="swiper-wrapper" style="padding: 0 10px;"><div class="swiper-slide">`;
		Pdata.mobile[isp - 1].list[partIndex].num.forEach(function(s) {
			i++;
			str += `
			      	<div class="weui-col-33 ${s.tell}" onclick="Num(${s.tell})">${s.tell}</div>    
            `;
			if(i >= 12) {
				str += `</div><div class="swiper-slide">`;
				i = 0;
			}
		})
		str += `</div></div><div class="swiper-pagination"></div></div>`;
		$(".row1").html("");
		$(".row1").append(str);
		var swiper = new Swiper('.swiper-container', {
			direction: 'vertical',
			pagination: {
				el: '.swiper-pagination',
				dynamicBullets: true,
			},
		});
	}
};

function Num(phoneId) {
	Sdata = {
		"tell": phoneId
	};
	$(".weui-col-33").css({
		border: "1px solid #ccc"
	});
	$("." + phoneId).css({
		border: "1px solid #2580d3"
	});
}

function submitFrom() {
	if(Sdata == undefined) {
		$.alert("未选择号码！");
	} else {
		$.ajax({
			type: "get",
			url: "http://192.168.31.196:1314/ZXData/api.ashx?action=mobileIn",
			data: Sdata,
			dataType: "json",
			success: function(data) {
				switch(data.state) {
					case 1:
						$.alert(data.msg);
						setTimeout(function() {
							window.location.reload();
						}, 2000);
						break;
					case 0:
						alertZx(data.msg, '/login.html?url=' + encodeURIComponent(window.location.href), 3000);
						break;
					default:
						$.alert(data.msg);
						break;
				}
			},
			error: function(stat) {
				$.alert('本次请求失败，请稍后再试！');
			}
		});
	}
}