(function () {

  // 创建命名空间，并暴露框架
  var namespace = 'ellaH5';
  window[namespace] = window[namespace] || {};

  /**
   * DEMO: localhost?name=xu&age=28
   * ellaH5.getQuery() 获取所有参数，返回对象 {name:'xu',age:'28'}
   * ellaH5.getQuery('name') 获取指定参数，返回 'xu'
   * ellaH5.getQuery('name') 获取指定参数，返回 'xu'
   */
  function getQuery(name) {
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
        if (name == getParameterName(paraNames[i])) {
          value = getParameterValue(paraNames[i])
        }
      }
      return value;
    } else {
      var all = {};
      for (var i = 0; i < paraNames.length; i++) {
        if (paraNames[i].indexOf('=') != -1 && paraNames[i].indexOf('=') != 0) {
          var value = getParameterValue(paraNames[i]);
          var name = getParameterName(paraNames[i]);
          all[name] = value;
        }
      }
      return all;
    }
  }

  function getParameterName(str) {
    var start = str.indexOf("=");
    if (start == -1) {
      return str;
    }
    return str.substring(0, start);
  }

  function getParameterValue(str) {
    var start = str.indexOf("=");
    if (start == -1) {
      return "";
    }
    return str.substring(start + 1);
  }

  window[namespace].getQuery = getQuery;

}.call(this))