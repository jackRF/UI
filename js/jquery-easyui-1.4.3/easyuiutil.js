/**
* EasyUI DataGrid根据字段动态合并单元格
* 参数 tableID 要合并table的id
* 参数 colList 要合并的列,用逗号分隔(例如："name,department,office");
*/
function mergeCellsByField(tableID, colList) {
    var ColArray = colList.split(",");
    var tTable = $("#" + tableID);
    var TableRowCnts = tTable.datagrid("getRows").length;
    var tmpA;
    var tmpB;
    var PerTxt = "";
    var CurTxt = "";
    var alertStr = "";
    for (j = ColArray.length - 1; j >= 0; j--) {
        PerTxt = "";
        tmpA = 1;
        tmpB = 0;

        for (i = 0; i <= TableRowCnts; i++) {
            if (i == TableRowCnts) {
                CurTxt = "";
            }
            else {
                CurTxt = tTable.datagrid("getRows")[i][ColArray[j]];
            }
            if (PerTxt == CurTxt) {
                tmpA += 1;
            }
            else {
                tmpB += tmpA;
                
                tTable.datagrid("mergeCells", {
                    index: i - tmpA,
                    field: ColArray[j],
                    rowspan: tmpA,
                    colspan: null
                });
                tTable.datagrid("mergeCells", { //根据ColArray[j]进行合并
                    index: i - tmpA,
                    field: "Ideparture",
                    rowspan: tmpA,
                    colspan: null
                });
               
                tmpA = 1;
            }
            PerTxt = CurTxt;
        }
    }
}

/**
* EasyUI DataGrid根据字段动态合并单元格
* 参数 tableID 要合并table的id
* 参数 colList 要合并的列,用逗号分隔(例如："name,department,office");
*/
function mergeCellsBySerialno(tableID, colList) {
	var ColArray = colList.split(",");
    var tTable = $("#" + tableID);
    var TableRowCnts = tTable.datagrid("getRows").length;
    var PerTxt = "";
    var CurTxt = "";
    var alertStr = "";
    PerTxt = "";
    var tmpA = 1;
    var h = 0;
	for (i = 0; i <= TableRowCnts; i++) {
		var transferserialno ="";
		if(i == TableRowCnts ){
			for (j = 0;j<ColArray.length;j++){
				tTable.datagrid("mergeCells", {
					index : i - tmpA,
					field : ColArray[j],
					rowspan : tmpA,
					colspan : null
				});
			}
			tmpA = 1;
		}else{
			transferserialno = tTable.datagrid("getRows")[i]['transferserialno'];
		}
		if(transferserialno == "undefined" || transferserialno == '' || transferserialno == null){
			continue;
		}
		if (i == TableRowCnts) {
			CurTxt = "";
		} else {
			CurTxt = tTable.datagrid("getRows")[i]['transferserialno'];
		}
		if (PerTxt == CurTxt) {
			tmpA =tmpA + 1;
		} else {
			for (j = 0;j<ColArray.length;j++){
				tTable.datagrid("mergeCells", {
					index : i - tmpA,
					field : ColArray[j],
					rowspan : tmpA,
					colspan : null
				});
			}
			tmpA = 1;
		}
		PerTxt = CurTxt;
	}
}