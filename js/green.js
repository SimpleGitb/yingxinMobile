var item=[];
$.ajax({
      type: 'GET',
	    url:'http://192.168.1.105:1314'+'/ZXData/api.ashx?action=banklist',
	    dataType: 'json',
	    xhrFields: {withCredentials: true},
        success: function (data) {
	        switch (data.state) {
	                case 1:
	                data.bank.forEach(fetchLocation => item.push(fetchLocation.name) );
			                $(".bank").select({
												  title: "选择贷款银行",
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

var isOK = false;
$("#uploaderInput").change(function(){
			 var length = this.files.length;
			 console.log(length);
			 var src="";
			 var size = 0;
       var num = 0;
			  for(var i=0;i<length;i++){
//			         var name = this.files[i].name;
//			         var size = this.files[i].size;
			         var url = this.files;
			          src +=`<li class="weui-uploader__file img" style="background-image:url(${window.URL.createObjectURL(url[i])})" ></li>`;
			  				
			  				var name = this.files[i].name;
				        var Extension = name.substring(name.length - 4).toLowerCase();
				        if (Extension == ".jpg" || Extension == "jpeg" || Extension == ".png" || Extension == ".bmp")
				        {
				            num++;
				            size += this.files[i].size;
										console.log(size);
				        }
			  }
			  $("#uploaderFiles").prepend(src);
			  isOK = true;
		    if (num > 4)
		    {
		        isOK = false;
		        $.alert("文件数量超过4个");
		        $(".weui-uploader__input-box").siblings().remove()
//		        $(this).outerHTML=obj.outerHTML; 
		        return;
		    }
		    if (num < 4) {
		        isOK = false;
		        $.alert("有效文件数量不足4个，请一次性选择4个文件");
		        $(".weui-uploader__input-box").siblings().remove();
		        return;
		    }
		    if (size >= 10240000) {
        isOK = false;
        $.alert("上传的总文件大小不能超过10M");
        $(".weui-uploader__input-box").siblings().remove();
        return;
    }
		})

function submitFrom() {
		if (isOK == true)
      {
        var fd = new FormData();
        fd.append('bank',$('.bank').val());
        fd.append('number',$('.number').val());
        var files= $("#uploaderInput").get(0).files;
        if(files.length>0){
                //formData.append("files",files[0]);
                for(var i=0;i<files.length;i++){
                    fd.append('files',files[i]);
                } 
          }
        $.ajax({
            url: 'http://192.168.1.105:1314'+"/ZXData/api.ashx?action=greenup",
            type: "post",
            dataType: 'json',
            data: fd,
            processData: false,
            contentType: false,
            xhrFields: { withCredentials: true },
            success: function (data) {
            	console.log(fd);
                switch (data.state) {
                    case 0:
                        alertZx(data.msg, '/login.aspx?url=' + encodeURIComponent(window.location.href), 3000);
                        break;
                    default: $.alert(data.msg); break;
                }
            },
            error: function (res) {
                $.alert('本次请求失败，请稍后再试！');
            }
        });
    }
    else {
        $.alert('请选择文件上传！');
    }
}
