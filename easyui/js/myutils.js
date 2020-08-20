//超时重置触发
document.documentElement.onkeydown=window.parent.resetTime;
  
document.documentElement.onclick=window.parent.resetTime; 
//超时重置触发

function formatterMobile(value, row, index){  
    if(row.REGMOBILE != null){  
        return "****"+row.REGMOBILE.substr(row.REGMOBILE.length-4, 4);  
    }else if(row.TRANSMOBILE != null){  
        return "****"+row.TRANSMOBILE.substr(row.TRANSMOBILE.length-4, 4);  
    }else if(row.MOBILENO != null){  
        return "****"+row.MOBILENO.substr(row.MOBILENO.length-4, 4);  
    }else{  
        return "";  
    }  
};

function formatterId(value, row, index){  
    if(row.IDNO != null){  
        return "****"+row.IDNO.substr(row.IDNO.length-4, 4);  
    }else{  
        return "";  
    }  
}; 

var Loading = {
	    css : {
	        masklayer : {'height':'100%','width':'100%','z-index':'9999','position':'fixed','top':'0px','left':'0px','background-color':'#ecf7fc','filter':'alpha(opacity=50)','opacity':'0.5'},
	        dialog : {'position':'fixed','z-index':'9999','modal':'true','text-align':'center','vertical-align':'middle','padding':'10px','filter':'alpha(opacity=90)','opacity':'0.9'},
	        label : {'color':'#356999','font-size': '14px','display':'block','margin-top':'10px', 'font-weight':'bold'}
	    },
	    
	    dom : {
	        body : 'body',
	        masklayer : $('<div></div>'),    //遮罩层
	        dialog : $('<div></div>'),        //弹出层
	        img : $('<img alt="img" />'),    //加载中图片
	        label : $('<label>数据加载中...</label>')    //显示文字
	    },
	    
	    /**
	     * 展示数据加载
	     * @param msg
	     */
	    show : function(msg){
	        Loading.dom.label.html(msg);
	        //loading图片
			var path = Loading.getRootPath();
	        Loading.dom.img.attr("src", Loading.getRootPath() + "/img/loading.gif");
	        
	        $("html").css("overflow", "hidden");
	        Loading.dom.masklayer.css(Loading.css.masklayer);
	        Loading.dom.dialog.css(Loading.css.dialog);
	        Loading.dom.label.css(Loading.css.label);
	                
	        Loading.dom.img.appendTo(Loading.dom.dialog);
	        Loading.dom.label.appendTo(Loading.dom.dialog);
	        Loading.dom.masklayer.appendTo(Loading.dom.body);
	        Loading.dom.dialog.appendTo(Loading.dom.body);
	        var ss = Loading.dom.body;
	        var page = Loading.GetPageSize();
	        var scorll = Loading.GetPageScroll();
	        var left = ((page.WinW - Loading.dom.dialog.width()) / 2 + scorll.X) + "px";
	        var top = ((page.WinH - Loading.dom.dialog.height()) / 3) + "px";
	        Loading.dom.dialog.css({"top":top, "left":left});
	    },
	    
	    /**
	     * 关闭数据加载
	     */
	    close : function(){
	        $("html").css("overflow", "auto");
	        Loading.dom.masklayer.remove();
	        Loading.dom.dialog.remove();
	    },
	    
	    // 获取页面大小
	    GetPageSize : function() {
	        var scrW = 1280, scrH = 768;
	        if (window.innerHeight && window.scrollMaxY) {
	            // Mozilla
	            scrW = window.innerWidth + window.scrollMaxX;
	            scrH = window.innerHeight + window.scrollMaxY;
	        } else if (document.body.scrollHeight > document.body.offsetHeight) {
	            // all but IE Mac
	            scrW = document.body.scrollWidth;
	            scrH = document.body.scrollHeight;
	        } else if (document.body) { // IE Mac
	            scrW = document.body.offsetWidth;
	            scrH = document.body.offsetHeight;
	        }

	        var winW = 0, winH = 0;
	        if (window.innerHeight) { // all except IE
	            winW = window.innerWidth;
	            winH = window.innerHeight;
	        } else if (document.documentElement
	                && document.documentElement.clientHeight) {
	            // IE 6 Strict Mode
	            winW = document.documentElement.clientWidth;
	            winH = document.documentElement.clientHeight;
	        } else if (document.body) { // other
	            winW = document.body.clientWidth;
	            winH = document.body.clientHeight;
	        }

	        // for small pages with total size less then the viewport
	        var pageW = (scrW < winW) ? winW : scrW;
	        var pageH = (scrH < winH) ? winH : scrH;

	        return {
	            PageW : pageW,
	            PageH : pageH,
	            WinW : winW,
	            WinH : winH
	        };
	    },

	    // 获取滚动条位置
	    GetPageScroll : function() {
	        var x = 0, y = 0;
	        if (window.pageYOffset) {
	            // all except IE
	            y = window.pageYOffset;
	            x = window.pageXOffset;
	        } else if (document.documentElement
	                && document.documentElement.scrollTop) {
	            // IE 6 Strict
	            y = document.documentElement.scrollTop;
	            x = document.documentElement.scrollLeft;
	        } else if (document.body) {
	            // all other IE
	            y = document.body.scrollTop;
	            x = document.body.scrollLeft;
	        }
	        return {
	            X : x,
	            Y : y
	        };
	    },
	    
	    getRootPath : function(){    
	        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp    
	        var curWwwPath=window.document.location.href;    
	        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp    
	        var pathName=window.document.location.pathname;    
	        var pos=curWwwPath.indexOf(pathName);    
	        //获取主机地址，如： http://localhost:8083    
	        var localhostPaht=curWwwPath.substring(0,pos);    
	        //获取带"/"的项目名，如：/uimcardprj    
	        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);    
	        return(localhostPaht+projectName);
	    }
	};
function loadMask() {
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html("请稍候。。。").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
}
function unLoadMask() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}
