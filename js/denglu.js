function submitFrom(){
    var $ksh = $(".ksh"),$password = $(".password"),$name = $(".xm"),$code = $(".code");
    var ksh = $ksh.val(),password = $password.val(),xm = $name.val(),code = $code.val();
    if(!ksh || ksh == ""){
        $.alert("请输入考生号");
        return;
    }
    if(!password || password == ""){
        $.alert("请输入密码");
        return;
    }
    if(!xm || xm == ""){
        $.alert("请输入用户名");
        return;
    }
    if(!code || code == ""){
        $.alert("请输入验证码");
        return;
    }
 $.ajax({
	    type: "GET",
	    url: 'http://192.168.31.196:1314'+'/ZXData/api.ashx?action=login',
	    data: {"ksh":ksh,"xm":xm,"pass":password,"code":code},//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
	    dataType: "json",//后台处理后返回的数据格式
	    xhrFields: {withCredentials: true},
	    success: function (data) {
		    switch (data.state) {
		        case 1:
		        		$.alert(data.msg);
		        		window.location.href='url/index.html';//正确登录后页面跳转至 
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
$(function(){
    document.onkeydown=keyDownSearch;
    function keyDownSearch(e) {
        // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            $('.weui-btn').click();
            return false;
        }
        return true;
    }
});