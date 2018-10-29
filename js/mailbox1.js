var UnReadData = [];
var ReadData = [];
var Page = 1;
var loading = false;
var UnReadPage = 1;
var ReadPage = 1;
var UnReadMaxPage = 0;
var ReadMaxPage = 0;
UnRead();
Read();

$(".content-padded").height($(".weui-tab__bd-item").height());

function UnRead() {
    $.ajax({
        type: "get",
        url: "http://192.168.31.196:1314/ZXData/api.ashx?action=SmsUnReadList&page=" + UnReadPage + "&count=" + 7,
        xhrFields: { withCredentials: true },
        dataType: "json",
        success: function (data) {
            switch (data.state) {
                case 1:
                console.log(data);
                    UnReadMaxPage = data.pageMax;
                    var UnReadList = "";
                    data.list.forEach(function (json, index) {
                        UnReadData.push({ "content": json.content, "id": json.id });
                        UnReadList += `
                		<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" onclick="Modal(${index},0)">
					      <div class="weui-media-box__bd" id="UnRead${index}">
					        <h4 class="weui-media-box__title">${json.title}</h4>
					        <span class="weui-badge" style="position: absolute;top: 1em;right: 1em; background-color: red;width:">1</span>
					      	<p class="weui-media-box__desc">${json.time}</p>
					      </div>
					    </a>
                	`;
                    })
                    $(".UnReadList").append(UnReadList);
                    break;
                case 2:
                console.log("2");
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
}
function Read() {
    $.ajax({
        type: "get",
        url: "http://192.168.31.196:1314/ZXData/api.ashx?action=SmsReadList&page=" + ReadPage + "&count=" + 7,
        xhrFields: { withCredentials: true },
        dataType: "json",
        success: function (data) {
            switch (data.state) {
                case 1:
                    ReadMaxPage = data.pageMax;
                    var ReadList = "";
                    data.list.forEach(function (json, index) {
                        ReadData.push({ "content": json.content, "id": json.id });
                        ReadList += `
                		<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" onclick="Modal(${index},1)">
					      <div class="weui-media-box__bd" id="Read${index}">
					        <h4 class="weui-media-box__title">${json.title}</h4>
					      	<p class="weui-media-box__desc">${json.time}</p>
					      </div>
					    </a>
                	`;
                    })
                    $(".ReadList").append(ReadList);
                    break;
                case 2:
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
}

function PageState(i) {
    Page = i;
}

function Modal(index, type) {
    if (type == 0) {
        $.alert(UnReadData[index].content);
        $("#UnRead" + index).find("span").hide();
        $.ajax({
            type: "get",
            url: "/ZXData/api.ashx?action=SmsRead",
            data: { "Id": UnReadData[index].id },
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: function (data) {
            },
            error: function (msg) {
                $.alert('本次请求失败，请稍后再试！');
            }
        });
    }
    else if (type == 1) {
        $.alert(ReadData[index].content);
    }
}

$(".infinite").infinite().on("infinite", function () {
    if (loading) return;
    loading = !loading;
    if (Page == 1) {
        UnReadPage++;
        console.log("gagaa");
        if (UnReadPage <= UnReadMaxPage) {
            $(".weui-loadmore").css("visibility", "visible");
            setTimeout(function () {
                UnRead();
                $(".weui-loadmore").css("visibility", "hidden");
                loading = !loading;
            }, 800);
        } else if ($(".UnReadList").html().indexOf("weui-panel__ft") == -1) {
            $(".UnReadList").append(`<div class="weui-panel__ft" style="display: block;">
                    <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                        <div class="weui-cell__bd">没有更多了~</div>
                    </a>
                </div>`);
            loading = !loading;
        }
    } else if (Page == 2) {
            ReadPage++;
            if (ReadPage <= ReadMaxPage) {
                $(".weui-loadmore").css("visibility", "visible");
                setTimeout(function () {
                    Read();
                    $(".weui-loadmore").css("visibility", "hidden");
                    loading = !loading;
                }, 800);
            } else if ($(".ReadList").html().indexOf("weui-panel__ft") == -1) {
                $(".ReadList").append(`<div class="weui-panel__ft" style="display: block;">
                    <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                        <div class="weui-cell__bd">没有更多了~</div>
                    </a>
                </div>`);
                loading = !loading;
            } 
    }
});
if (loading == false) {
    $(".weui-loadmore").css("visibility", "hidden");
}