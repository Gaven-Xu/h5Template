/**
 * localhost?name=xu&age=28
 * urlHandle.getParameter() 获取所有参数，返回对象 {name:'xu',age:'28'}
 * urlHandle.getParameter('name') 获取指定参数，返回 'xu'
 */
var urlHandle = {

  getParameter: function (name) {
    var url = document.location.href;
    var start = url.indexOf("?") + 1;
    if (start == 0) {
      return "";
    }
    var value = "";
    var queryString = url.substring(start);
    var paraNames = queryString.split("&");
    if (name) {
      for (var i = 0; i < paraNames.length; i++) {
        if (name == urlHandle.getParameterName(paraNames[i])) {
          value = urlHandle.getParameterValue(paraNames[i])
        }
      }
      return value;
    } else {
      var all = {};
      for (var i = 0; i < paraNames.length; i++) {
        if (paraNames[i].indexOf('=') != -1 && paraNames[i].indexOf('=') != 0) {
          var value = urlHandle.getParameterValue(paraNames[i]);
          var name = urlHandle.getParameterName(paraNames[i]);
          all[name] = value;
        }
      }
      return all;
    }
  },

  getParameterName: function (str) {
    var start = str.indexOf("=");
    if (start == -1) {
      return str;
    }
    return str.substring(0, start);
  },

  getParameterValue: function (str) {
    var start = str.indexOf("=");
    if (start == -1) {
      return "";
    }
    return str.substring(start + 1);
  }

}