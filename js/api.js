(function(){
    function baseRequest(uri,data,fn,errorfn,contentType){
        $.ajax({
            url: uri,
            type: "POST",
            dataType: "json",
            data: data,
            contentType: contentType,
            complete: function (xhr, textStatus) {
                //session timeout
                if (xhr.status == 911) {
                    window.location = "timeout";
                    return;
                }
            },
            success: function (data) {
                if(fn){
                    fn(data);
                }
            },
            error: function () {
                console.log('data:',data,'error',arguments);
                if(errorfn){
                    errorfn.apply(this,arguments);
                }else{
                    $.messager.alert("提示", "操作失败！", "error");
                }
            }
        });
    }
    function baseFormRequest(uri,data,fn,errorfn){
        var contentType="application/x-www-form-urlencoded;charset=utf-8";
        baseRequest(uri,data,fn,errorfn,contentType);
    }
    function baseJSONRequest(uri,data,fn,errorfn){
        var contentType="application/json;charset=utf-8";
        baseRequest(uri,JSON.stringify(data),fn,errorfn,contentType);
    }
    function upload(uri,formData,fn,errorfn){
        $.ajax({
            url: uri,
            data: formData,
            cache: false,
            async: true,
            type: "POST",
            dataType: 'json',
            processData: false,
            contentType: false,
            complete: function (xhr, textStatus) {
                //session timeout
                if (xhr.status == 911) {
                    window.location ="timeout";
                    return;
                }
            },
            success: function (data) {
                if(fn){
                    fn(data);
                }
            },
            error: function (err) {
                console.log('data:',data,'error',arguments);
                if(errorfn){
                    errorfn.apply(this,arguments);
                }else{
                    $.messager.alert("提示", "操作失败！", "error");
                }
            }
        });
    }
    function download(uri,data){
        var url=uri;
        var iframe=document.createElement("iframe");
        if(data){
            var form=document.createElement("form");
            form.setAttribute("action",url);
            for(var p in data){
                var input=document.createElement("input");
                input.setAttribute("type","hidden");
                input.setAttribute("name",p);
                input.setAttribute("value",data[p]);
                form.append(input);
            }
            iframe.append(form);
            document.body.append(iframe);
            form.submit();
        }else{
            iframe.setAttribute("src",url);
            document.body.append(iframe);
        }
        iframe.remove();
    }
    window.API={
       sms:{
        downloadAddressee:function(data){
            download("sms/downloadAddressee",data);
        },
        sendSmsBatchPlan:function(data,fn,errorFn){
            baseFormRequest("sms/sendSmsBatchPlan",data,fn,errorFn);
        },
        auditSmsBatchPlan:function(data,fn,errorfn){
            baseJSONRequest('sms/auditSmsBatchPlan',data,fn,errorfn);
        },
        queryBatchSize:function(data,fn,errorFn){
            baseFormRequest("sms/queryBatchSize",data,fn,errorFn);
        },
        saveSmsBatchPlan:function(data,fn,errorFn){
            baseFormRequest("sms/saveSmsBatchPlan",data,fn,errorFn);
        },
        importAddressee:function(formData,fn,errorFn){
            upload("sms/importAddressee",formData,fn,errorFn);
        },
        deleteSmsBlacklist:function(data,fn,errorFn){
            baseFormRequest("sms/deleteSmsBlacklist",data,fn,errorFn);
        },
        saveSmsBlacklist:function(data,fn,errorFn){
            baseFormRequest("sms/saveSmsBlacklist",data,fn,errorFn);
        },
        updateSmsTemplate:function(data,fn,errorFn){
            baseFormRequest("sms/updateSmsTemplate",data,fn,errorFn);
        },
        updateSmsTemplateStatus:function(data,fn,errorFn){
            baseFormRequest("sms/updateSmsTemplateStatus",data,fn,errorFn);
        },
        updateSmsTemplateEnable:function(data,fn,errorFn){
            baseFormRequest("sms/updateSmsTemplateEnable",data,fn,errorFn);
        },
        saveSmsTemplate:function(data,fn,errorFn){
            baseFormRequest("sms/saveSmsTemplate",data,fn,errorFn);
        }
       } 
    }

})();
