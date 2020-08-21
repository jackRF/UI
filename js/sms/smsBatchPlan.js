$(document).ready(function(){
    var importMV=formMV($("#importForm"),{
        el:$("#importDlg"),
        getModel(){
           var fileEl=this.formEl.find("input:file");
           var fileName=fileEl.val();
           var formData = new FormData();
           formData.append("file",fileEl.get(0).files[0]);
           return {
            fileName:fileName,
            formData:formData
           }
        },
        show:function(data){
            this.data=data;
            window.top.createDlg(this.el, "收信人上传", 300);
        },cancel(){
            this.el.dialog('close');
        },save(){
            var me=this;
            var data=this.getModel();
            var fileName=data.fileName;
            if (!fileName){
                $.messager.alert("提示", '请上传文件！', "error");
                return;
            }
            var reg =/^.*\.(?:xls|xlsx)$/i;
            if(!reg.test(fileName)){
                $.messager.alert("提示", "请上传Excel文件！", "error");
                return;
            }
            API.sms.importAddressee(data.formData,function(result){
                if (!result.success) {
                    $.messager.alert("提示", result.message||result.retMsg, "error");
                    return;
                }
                me.cancel();
                var addresseeValue=result.data[0];
                var batchSize=result.data[1];
                editMV.setAddresseeValue(addresseeValue,batchSize);
            });
        }
    });
    var labelMV=formMV($("#labelForm"),{
        el:$("#labelDlg"),
        useEl:$("#labelUse"),
        treeEl:$("#labelTree"),
        init:function(){
            this.useEl.on("click","li",function(event){
                if($(event.target).hasClass("selected")){
                    $(event.target).removeClass("selected");
                }else{
                    $(event.target).addClass("selected");
                }
            });
            this.treeEl.tree({
                onBeforeCheck:function(node, checked){
                    if($(node.target).hasClass("used")){
                        return false;
                    }
                }
            });
        },
        getChecked:function(){
            return this.treeEl.tree('getChecked');
        },getModel:function(){
            var labels=[];
            this.useEl.find("li").each(function(i){
                var text=$.trim($(this).text());
                var symbol=$(this).data().symbol;
                if(labels.length&&!symbol){
                   if(!$.inArray(labels[labels.length-1],['(',')','或','且'])>=0){
                    labels.push(',');
                   }
                }
                labels.push(text);
            });
            return {labelValue:labels.join('')};
        },
        show:function(){
            window.top.createDlg(this.el, "标签选择", 700);
        },operate1:function(event){
            var me=this;
            var data=this.getChecked();
            if(!data.length){
                $.messager.alert("提示", "请选择标签！", "error");
                return;
            }
            $.each(data,function(i,item){
                me.treeEl.tree("uncheck",item.target);
                $(item.target).addClass("used");
                me.useEl.append('<li>'+item.text+'</li>');
            });
        },operate2:function(e,all){
            var me=this;
            var sels;
            if(all){
                sels=this.useEl.find("li");
            }else{
                sels=this.useEl.find("li.selected");
                if(!sels.length){
                    $.messager.alert("提示", "请选择要移除的标签！", "error");
                    return;
                }
            }
            sels.each(function(i){
                if(!$(this).data().symbol){
                    var text=$.trim($(this).text());
                    me.treeEl.find(".tree-node .tree-title").each(function(i){
                        if($.trim($(this).text())==text){
                            $(this).parent().removeClass("used");
                            return false;
                        }
                   });
                }
                $(this).remove();
            });
        },operate3:function(){
            this.useEl.append('<li data-symbol="true">(</li>');
        },operate4:function(){
            this.useEl.append('<li data-symbol="true">)</li>');
        },operate5:function(){
            this.useEl.append('<li data-symbol="true">或</li>');
        },operate6:function(){
            this.useEl.append('<li data-symbol="true">且</li>');
        },hide:function(){
            this.el.dialog('close');
        },complete:function(){
            var me=this;
            var data=this.getModel();
            if(!data.labelValue){
                $.messager.alert("提示", "请选择标签！", "error");
                return;
            }
            editMV.setAddresseeValue(data.labelValue);
            me.operate2(null,true);
            me.hide();
        }
    });
    labelMV.init();
    window.app=window.app||{};
    $.extend(window.app,{
        mv:mv,
        editMV:editMV
    });
});
window.batchNoView=function(value, row, index) {
    return '<a href="javascript:void(0);" onclick="app.mv.viewOrEdit('+index+')">'+value+'</a>';
};
window.operateView=function(value, row, index) {
    var status=row.status;
    if(status=='1'||status=='4'){
        if(row.fixedTime=='0'){
            var text=status=='1'?"立即发送":'重新发送';
            return '<input type="button" class="button" onclick="app.mv.send('+index+')" value="'+text+'" /><br/>';
        }
    }
};
window.addresseeView=function(value,row,index){
    var text=statusView({1:'全量客户.xlsx',2:'标签筛选.xlsx',3:'收信人列表.xlsx'})(row.addresseeType);
    return '<a href="javascript:void(0);" onclick="app.mv.downloadAddressee('+index+')">'+text+'</a>';
};
window.smsPlanStatusView=statusView({0:"待审核",1:"审核通过",2:"审核不通过",3:"已发送短信通道",4:"发送失败"});
window.fixedTimeView=statusView({0:"立即发送",1:"定时发送"});
window.contentView=tooltipView;