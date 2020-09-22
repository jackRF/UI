function desensitization(value,tailSize){
    value=value||'';
    var headSize=value.length-tailSize;
    var tail=value.substring(headSize);
    var head='';
    for(var i=0;i<headSize;i++){
        head+='*';
    }
    return head+tail;
}
function urlView(option){
    return function(value,row,index){
        var target='';
        if(option.target){
            target='target="'+option.target+'"';
        }
        var url=option.url||option.href;
        var text=option.text;
        if(url&&$.isFunction(url)){
            url=url.apply(option,[value,row,index]);
        }
        if(text&&$.isFunction(text)){
            text=option.text(value,row,index);
        }
        return '<a '+target+' href="'+url+'">'+text+'</a>';
    }
}
function statusView(statusMap,def){
    return function(value) {
        if(value==null){
            return def==null?value:def;
        }
        if(value.indexOf(",")>=0){
            value=value.split(",");
        }
        if($.isArray(value)){
            var r=[];
            for(var item of value){
                if(item){
                    r.push(statusMap[item]);
                }
            }
            return r.length?r.join(', '):def;
        }
        for(var p in statusMap){
            if(p==value){
                return statusMap[p];
            }
        }
        return def==null?value:def;
    };
}
function tooltipView(value){
    return '<span title="' + (value || "") + '" class="easyui-tooltip">' + (value || "") + '</span>';
}
function validateNumberGtEq(val,fileName,required){
    if(!val){
        if(required===false){
            return true;
        }
        $.messager.alert("提示", fileName+"不能为空！", "error");
        return false;
    }
    var nVal=Number(val);
    if(isNaN(nVal)){
        $.messager.alert("提示", fileName+"必须为数字！", "error");
        return false;
    }
    if(nVal<0){
        $.messager.alert("提示", fileName+"不能小于0！", "error");
        return false;
    }
    return true;
}
function resetViewModel(formEl,fields){
    var fieldEls=formEl.find("input:text,input:checked,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        if(!fields||$.inArray(name,fields)>=0){
            var type=$(dom).attr("type");
            if(type=='radio'||type=='checkbox'){
                $(dom).prop('checked',false);
            }else{
                $(dom).val('');
            }
            
        }
    });
}
function setViewModel(formEl,data,resetIfAbsent){
    var fieldEls=formEl.find("input:text,input:radio,input:checkbox,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        var type=$(dom).attr("type");
        var value=data[name];
        if(value!=null){
            if(type=='radio'||type=='checkbox'){
                $(dom).prop('checked',value==$(dom).val());
            }else{
                $(dom).val(value);
            }
        }else if(resetIfAbsent){
            if(type=='radio'||type=='checkbox'){
                $(dom).prop('checked',false);
            }else{
                $(dom).val('');
            }
        }
    });
}
function disableViewField(formEl,fields,disabled){
    var fieldEls=formEl.find("input:text,input:radio,input:checkbox,select,textarea");
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        if($.inArray(name,fields)>=0){
            $(dom).prop("disabled",disabled);
        }
    });
}

function getViewModel(formEl){
    var fieldEls=formEl.find("input:text,input:radio:checked,input:checkbox:checked,select,textarea");
    var model={};
    fieldEls.each(function(i,dom){
        var name=$(dom).attr("name");
        var type=$(dom).attr("type");
        var value=$(dom).val();
        if(type=='checkbox'){
            var tempValues=model[name]=model[name]||[];
            tempValues.push(value);
        }else{
            model[name]=value;
        }
        
    });
    return model;
}
function dataMV(el,option){
    var fieldEls=el.find("span[data-name]");
    var mv={
        el:el,
        fieldEls:fieldEls,
        setModel(data){
            fieldEls.each(function(i,dom){
                var name=$(dom).attr("data-name");
                var value=data[name];
                $(dom).text(value!=null?value:'');
            });
        }
    };
    if(option&&$.isPlainObject(option)){
        mv=$.extend(mv,option);
    }
    return mv;
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
        },displayTr:function(i,value){
            if(value===true||value===false){
                value=value?'':'none';
            }
            formEl.find("table tr").eq(i).css({display:value});
        }
    };

    if(!option||!$.isPlainObject(option)){
        return mv;
    }
    mv=$.extend(mv,option);
    mv.formEl.find(":button[name^=action-]").each(function(i,dom){
        var name=$(dom).attr("name");
        var eventName=name.split('-')[1];
        var handle=mv[eventName];
        if(!handle||!$.isFunction(handle)){
            return;
        }
        $(dom).on("click",function(event){
            handle.apply(mv);
        });
    });
    var handleChange=mv.handleChange;
    if(handleChange&&$.isFunction(handleChange)){
        formEl.on("change","input,select,textarea",function(event){
            var name=$(this).attr("name");
            handleChange.apply(mv,[event,name]);
        });
    }
    return mv;
}
function dataTableMV(formEl,dataTableEl,uri,option){
    var mv=null;
    if(formEl){
        mv=formMV(formEl,option);
    }else{
        mv=option;
    }
    if(!dataTableEl||!dataTableEl.length){
        return mv;
    }
    mv=$.extend(mv,{
        dataTableEl:dataTableEl,
        datagridFn:function(){
            dataTableEl.datagrid.apply(dataTableEl,arguments);
        },
        render:function(){
            dataTableEl.datagrid("load",this.getModel());
        },getSelectedData:function(all){
            if(all){
                return dataTableEl.datagrid('getSelections');
            }
            return dataTableEl.datagrid('getSelected');
        },getRows:function(i){
            var rows=dataTableEl.datagrid('getRows');
            if(i||i==0){
                return rows[i];
            }
            return rows;
        },init(){
            var optionGrid=option&&option.option||{};
            optionGrid=$.extend(optionGrid,{
                url:uri,
                loadFilter: option&&option.datagridLoadFilter||datagridLoadFilter,
                queryParams:this.getModel()
            });
            dataTableEl.datagrid(optionGrid);
        }
    });
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