//urlinfo=window.location.href;
//offset=urlinfo.split("=");
//urlid=offset[1];
//console.log(urlinfo);
//console.log(urlid);


$.ajax({
        type: 'GET',
	    url:'../notice.txt',
	    dataType: 'json',
	    xhrFields: {withCredentials: true},
        success: function (data) {
	        switch (data.state) {
	                case 1:
	                    var base = new Base64(); 
			            var result2 = base.decode(data.content);
			            $(".weui-media-box__title").html(data.title);
			            $("pre").html(result2);
			            $("time").html(data.time);
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