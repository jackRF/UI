//是否是日期类型
function isDate(date) {
    if (date && (date instanceof Date)) {
        return !isInvalidDate(date);
    }
};
//是否是无效的日期类型
function isInvalidDate(date) {
    var milliseconds = date.getTime();
    return milliseconds != milliseconds;
}
//日期格式化
function formatDate(date, format) {
    if (!isDate(date)) { return; }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "h+": date.getHours() >= 12 ? date.getHours() - 11 : date.getHours() + 1,
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    }
    format = format || 'yyyy-MM-dd';
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//字符串转化为日期
function parseDate(dateStr, format) {
    if (!dateStr || Object.prototype.toString.call(dateStr) !== '[object String]') { return; }
    var date = new Date(0);
    date.setTime(date.getTimezoneOffset() * 60000);//1970-01-01 00:00:00
    var field = {
        y: "setFullYear",
        M: "setMonth",
        d: "setDate",
        H: "setHours",
        m: "setMinutes",
        s: "setSeconds",
        S: "setMilliseconds"
    };
    format = format || 'yyyy-MM-dd';
    var value = {};
    format.replace(/(y+)|(M{1,2})|(d{1,2})|(H{1,2})|(m{1,2})|(s{1,2})|(S{1,3})/g, function () {
        var match = arguments;
        var flag = match[0];
        var f = flag.charAt(0);
        var v = Number(dateStr.substr(match[match.length - 2], flag.length));
        value[f] = f == 'M' ? --v : v;
    });
    for (var f in value) {
        (date[field[f]])(value[f]);
    }
    return date;
}
//比较两个日期的大小date1>date2 返回值大于0; date1<date2 返回值小于0; date1=date2 返回值等于0
function compareDate(date1, date2) {
    if (isDate(date1) && isDate(date2)) {
        return date1.getTime() - date2.getTime();
    }
}
