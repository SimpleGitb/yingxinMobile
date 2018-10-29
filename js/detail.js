var menuId = GetQueryString("MenuId");
var articleId = GetQueryString("articleId");
$.ajax({
      type: 'GET',
	    url:'http://zfbtest.3w.dkys.org'+'/ZXData/api.ashx?action=article&MenuId=' + menuId + '&Id=' + articleId,
	    dataType: 'json',
	    xhrFields: {withCredentials: true},
        success: function (data) {
	        switch (data.state) {
	                case 1:
	               		$(".weui-media-box__title").html(data.title);
	               		var base = new Base64();
                    var result2 = base.decode(data.content);
                    $("pre").html(result2);
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