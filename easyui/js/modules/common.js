function resetViewModel(formEl,fields){
    var fieldEls=formEl.find("input:text,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        if(!fields||$.inArray(name,fields)>=0){
            $(dom).val('');
        }
    });
}
function setViewModel(formEl,data,resetIfAbsent){
    var fieldEls=formEl.find("input:text,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        var value=data[name];
        if(value!=null){
            $(dom).val(value);
        }else if(resetIfAbsent){
            $(dom).val('');
        }
    });
}
function disableViewField(formEl,fields,disabled){
    var fieldEls=formEl.find("input:text,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        if($.inArray(name,fields)>=0){
            $(dom).attr("disabled",disabled);
        }
    });
}

function getViewModel(formEl){
    var fieldEls=formEl.find("input:text,input:radio:checked,select,textarea");
    var model={};
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        var value=$(dom).val();
        model[name]=value;
    });
    return model;
}

function formMV(formEl,option){
    var mv={
        formEl:formEl,
        getModel:function(){
            return getViewModel(this.formEl);
        },on:function(event,fn){
            var btnEl=this.formEl.find(":button[name=action-"+event+"]");
            if(btnEl.length){
                btnEl.on("click",fn);
            }
        }
    };
    if(option&&$.isPlainObject(option)){
        mv=$.extend(mv,option);
        mv.formEl.find(":button[name^=action-]").each(function(i,dom){
            var name=$(dom).attr("name");
			console.log('name:'+name);
            var eventName=name.split('-')[1];
            var handle=mv[eventName];
            if(handle&&$.isFunction(handle)){
                $(dom).on("click",function(){
                    handle.apply(mv);
                });
            }
        });

    }
    return mv;
}
function dataTableMV(formEl,dataTableEl,uri,option){
    var mv=formMV(formEl,option);
    if(dataTableEl&&dataTableEl.length){
        mv=$.extend(mv,{
            render:function(){
                dataTableEl.datagrid("load",this.getModel());
            },getSelectedData:function(){
                return dataTableEl.datagrid('getSelected');
            },init(){
                dataTableEl.datagrid({
                    url:app.context.contextPath+uri,
                    loadFilter: datagridLoadFilter,
                    queryParams:this.getModel(),
                    data:[]
                });
            }
        });
    }
    if(option&&$.isPlainObject(option)){
        mv=$.extend(mv,option);
    }
    return mv;
}
function datagridLoadFilter(result){
    if($.isArray(result)){
        return{
            rows:result,
            total:result.length
        };
    }
    if(result.rows){
        return result;
    }
    if (result.code != "0000") {
        $.messager.alert("提示", result.message, "error");
        return{
            rows:[],
            total:0
        };
    }
    var useData=result.data||[];
    if ($.isPlainObject(useData)){
        return useData;
    } else {
        return {
            rows:useData,
            total:useData.length
        };
    }
}

//检查输入的是不是数字，最大长度为10位数据
function checknumeric10(str){
    var checks=new RegExp("^[1-9]\\d{0,9}$");
    return checks.test(str);
}
/**
 * 打开对话框
 */
function createDlg($dlg, title, width, closeFunc) {
    $dlg.dialog({
        top: "40px",
        title: title,
        width: width,
        draggable: false,
        resizable: false,
        cache: false, //禁止缓存
        closed: false, //默认不弹出
        modal: true, //模式化窗口
        shadow: false, //是否显示隐藏。若dialog的宽高是动态变化的，shadow不会自动更新。这种情况下最好设置为false。否则要手动处理
        onClose: closeFunc
    });
    $dlg.show();
    $dlg.window('center');
}
/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
function photoCompress(file, objDiv) {
    var ready = new FileReader();
    //开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE
    //如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容
    ready.readAsDataURL(file);
    ready.onload = function () {
        var re = this.result;
        canvasDataURL(re, objDiv)
    }
}

function canvasDataURL(path, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function () {
        // 默认按尺寸压缩
        var w = img.width, h = img.height;
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(this, 0, 0, w, h);
        // quality值越小，所绘制出的图像越模糊
        var quality = 1;
        var base64 = canvas.toDataURL("image/jpeg", quality);

        var blob = convertBase64UrlToBlob(base64);
        while (blob.size > 3 * 1024 * 1024) {
            quality -= 0.05;
            base64 = canvas.toDataURL("image/jpeg", quality);
            blob = convertBase64UrlToBlob(base64);
        }
        // 回调函数返回base64的值
        callback(blob);
    }
}

//打开新的tab
function Open(tabId, text, url) {
    if (null == url || url.length <= 0) {
        return;
    }
    var jq = top.jQuery;
    var content = '<iframe name="' + text + '"id="' + tabId + '"src="' + url
        + '" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>';
    if (jq("#tabs").tabs('exists', text)) {
        jq("#tabs").tabs('select', text);
        var tab = jq("#tabs").tabs('getSelected');
        jq("#tabs").tabs('update', {
            tab: tab,
            options: {
                title: text,
                content: content
            }
        });
    }
    else {
        jq("#tabs").tabs('add', {
            title: text,
            closable: true,
            cache: false,
            content: content
        });
    }
}