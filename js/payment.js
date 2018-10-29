$.ajax({
    type: 'GET',
    url: '../new_file.txt',
    dataType: 'json',
    xhrFields: { withCredentials: true },
    success: function (data) {
        switch (data.state) {
            case 1:
                var str = "";
                var xyk_opt = "";
                data.list.forEach((cur, index, Array) => {
                    for (var key in cur) {
                        if (cur[key].sfkx == 0) {
                            if (cur[key].info.length == 1) {
                                str += `
		               				<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
											      <div class="weui-media-box__hd">
											        <img class="weui-media-box__thumb" src="/res/mobile/img/cover.png">
											      </div>
											      <div class="weui-media-box__bd">
											        <h4 class="weui-media-box__title">${cur[key].xm}</h4>
											        <p class="weui-media-box__desc">应缴金额：<span>￥${cur[key].info[0].je}</span>
											        	&nbsp;&nbsp;已交金额：<span>￥${cur[key].sjje}</span>
											        </p>
											      </div>
											    </a>
		               			`;
                            } else {
                                var selectList ="";
                                var ti = 0;
                                cur[key].info.forEach(info => {
                                    if (ti == 0) {
                                        cid.push({ "name": 'select_' + key, "id": info.id });
                                    } ti++;
                                    selectList += `<option value="${info.je}" id="${info.id}">${info.fy}</option>`;
                                })
                                var yj = '';
                                if (cur[key].sjje > 0) {
                                    yj=' style="width: 110px; background-color: #EEEEEE;" disabled = "disabled"';
                                }
                                str += `
		               					<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
												      <div class="weui-media-box__hd">
												        <img class="weui-media-box__thumb" src="/res/mobile/img/cover.png">
												      </div>
												      <div class="weui-media-box__bd">
												        <h4 class="weui-media-box__title">${cur[key].xm}</h4>
												        <p class="weui-media-box__desc">金额：<span class="JE_select_`+ key + `">￥${cur[key].info[0].je}</span>
												        	&nbsp;&nbsp;已交：<span>${cur[key].sjje}</span>
												        </p>
												      </div>
												      <div class="weui-cell_select">
													    <div class="weui-cell_bd weui-cell_primary">
                                                            <select class="weui-select `+ key + `" id="select_` + key + `" onclick="MoreXM('select_` + key + `');"` + yj+`>` + selectList + `</select>
													  </div>  
                                                        </div>
												    </a>
		               				`;
                            }
                        }
                        else {
                            var selectList = "<option id='0' value='0'>不选择</option>";
                            cur[key].info.forEach(info => {
                                selectList += `<option value="${info.je}" id="${info.id}">${info.fy}</option>`;
                            })
                            str += `
		               					<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
												      <div class="weui-media-box__hd">
												        <img class="weui-media-box__thumb" src="/res/mobile/img/cover.png">
												      </div>
												      <div class="weui-media-box__bd">
												        <h4 class="weui-media-box__title">${cur[key].xm}</h4>
														<p class="weui-media-box__desc">金额：<span class="JE_select_`+ key + `">￥0</span>
												        	&nbsp;&nbsp;已交：<span>${cur[key].sjje}</span>
												        </p>
												      </div>
														<div class="weui-cell_select">
													    <div class="weui-cell_bd weui-cell_primary">
                                                            <select class="weui-select `+ key + `" id="select_` + key + `" onclick="MoreXM('select_` + key + `');">` + selectList + `</select>
													  </div>  
                                                        </div>
												    </a>
		               				`;
                        }
                    }
                })
                $(".weui-panel__bd").prepend(str);
                // $(".accomm").append(accomm_opt);
                $(".xyk").append(xyk_opt);

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


var cid = [];
var did = -1;
function MoreXM(element) {
    var id = $("#" + element + " option:selected").attr("id");
    $(".JE_" + element).html("￥" + $("#" + element).val());
    if (id != did) {
        did = id;
        if (cid.length > 0) {
            var Isin = false;
            for (var i = 0; i < cid.length; i++) {
                if (cid[i].name == element) {
                    Isin = true;
                    if (id == 0) {
                        delete cid[i];
                        cid.splice(i, 1);
                        break;
                    }
                    cid[i].id = id;
                    break;
                }
            }
            if (Isin == false && id != 0) {
                var t = { "name": element, "id": id };
                cid.push(t);
            }
        }
        else if (id != 0) {
            var t = { "name": element, "id": id };
            cid.push(t);
        }
    }
}

function submitFrom() {
    var payType = "alipay";

    if ($("input[name='radio1']:checked").val() == "weixin") {
        payType = "weixin";
    }
    if ($("input[name='radio1']:checked").val() == "alipay") {
        payType = "alipay";
    }

    var InfoId = [];
    for (var i = 0; i < cid.length; i++) {
        InfoId.push({ "id": parseInt(cid[i].id) });
    }
    console.log(JSON.stringify(InfoId));
    var base = new Base64();
    var result2 = base.encode(JSON.stringify(InfoId));
    $.ajax({
        url: 'http://zfbtest.3w.dkys.org'+"/pay/pay.ashx?action=xf",
        type: "get",
        dataType: 'json',
        data: { PayType: payType,PaySrc:"wap",info: result2 },
        xhrFields: { withCredentials: true },
        success: function (data) {
            switch (data.state) {
            	case 1:
            	    $.alert(base.decode(data.data));
            		break;
                case 0:
                    alertZx(data.msg, '/mobile/login.html?url=' + encodeURIComponent(window.location.href), 3000);
                    break;
                default: $.alert(data.msg); break;
            }
        },
        error: function (res) {
            $.alert('本次请求失败，请稍后再试！');
        }
    });
}
