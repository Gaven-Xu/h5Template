(function () {
  // 项目配置.
  // console.log(window.ellaBookH5IP + '/rest/api/service')

  let api = window.ellaBookH5IP ? window.ellaBookH5IP + '/rest/api/service' : 'http://118.31.171.207:9000/rest/api/service';
  let exchangeCode = "";
  let thirdCode = "";
  let thirdType = "";

  /** 
   * @function initVipData
   * @description 创建积分换会员dom
   * @param {Array} totalList 总课表数组
   * @returns {DOM} 用户模块和积分换会员模块页面信息
   */
  function initVipData(data) {
    let result = '';
    let members = "";
    data.list.forEach((item, index) => {
      members += `
          <div class="memberItem" data-params=${item.exchangeCode + ',' + item.thirdCode + ',' + item.thirdType} data-info=${item.activeTime + ',' + item.points + ',' + data.userInfo.pointsBalance}>
          <div class="countsInfo">
            <p>${item.title}</p>
            <p>原价：<span>${item.price}元</span></p>
          </div>
          <div class="counts">${item.points} 积分</div>
        </div>
        `;
    })


    result += `
        <div class="header">

        <img src=${!!data.userInfo.userAvatar ? data.userInfo.userAvatar : "./imgs/defualtPho.png"} />
        <div class="headTxt">
          <p>${data.userInfo.userNick}</p>
          <p>剩余会员：<span>${data.userInfo.vipLeftDays}天</span></p>
        </div>
      </div>
      <div class="members">
        <p class="title">积分换会员</p>
        <div class="membersMain">
         ${members}
        </div>

      </div>`

    return result;
  }

  /** 
   * @function checkEnvironment
   * @description 检测设备类型
   * @returns {string} iPhone|Android|other
   */
  function checkEnvironment() {
    let isInApp, mobileType;
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      if (!!window.webkit && !!window.webkit.messageHandlers && !!window.webkit.messageHandlers.showSharePop) {
        isInApp = true;
      }
      mobileType = "iPhone";
    } else if (/(Android)/i.test(navigator.userAgent)) {
      if (!!window.WebView && !!window.WebView.showSharePop) {
        isInApp = true;
      }
      mobileType = "Android";
    } else {
      isInApp = false;
      mobileType = "other";
    }

    window.isInApp = isInApp;
    window.mobileType = mobileType;
    return {
      isInApp: !!isInApp,
      mobileType
    }
  }

  /**
   * @function init
   * @description 主函数,根据服务端数据，创建页面
   * @params {object} data 服务端返回的积分换会员数据
   */
  function init(data) {
    /** 调用：创建页面方法 */

    let doms = initVipData(data);
    $(".memberIntroduce").before(doms)
    /** 点击弹出积分换会员弹窗*/
    $(".memberItem").on("click", function () {
      $(".memberModal").css({ display: "block" })
      $(".shade").css({ display: "block" })
      console.log($(this).data("info"))
      let arr = $(this).data("info").split(",");

      let activeTime = arr[0];
      let points = arr[1];
      let pointsBalance = arr[2];


      $(".lastPoint").html(pointsBalance);
      $(".activeTime").html(activeTime);
      $(".points").html(points);
      let arr2 = $(this).data("params").split(",");
      exchangeCode = arr2[0];
      thirdCode = arr2[1];
      thirdType = arr2[2];

    })
    /**关闭积分换会员弹窗 */
    $(".close").on("click", function () {
      $(".memberModal").css({ display: "none" })
      $(".shade").css({ display: "none" })
    })
    /**立即支付 */
    $(".save").on("click", function () {
      $.post(api, {
        method: 'ella.order.pointsExchange',
        content: JSON.stringify({

          // uid: "U201801241526127604534",
          // uid: "U201801200000128",
          exchangeCode,
          thirdCode,
          thirdType
        }),
        uid: ellaH5.getQuery('uid'),
        channelCode: "H5",
        token: "guest"
      }, function (res) {
        res = JSON.parse(res);
        if (res.status === "1") {
          $(".j-pop").css({ "display": "block" });
          $(".j-pop").html("支付成功！");
          setTimeout(function () {
            $(".j-pop").css({ "display": "none" });
            location.reload(true);
          }, 2000)
        } else {
          $(".j-pop").css({ "display": "block" });
          $(".j-pop").html(res.message);
          setTimeout(function () {
            $(".j-pop").css({ "display": "none" });

          }, 2000)
        }
      })
    })

  }
  $.post(api, {
    method: 'ella.user.listVipExchangeMenu',
    content: JSON.stringify({
      uid: ellaH5.getQuery('uid')
      // uid: "U201801241526127604534",
      // uid: "U201801200000128"
    })

  }, function (res) {
    res = JSON.parse(res);
    if (res.status === "0") {
      window.ellaH5.alert(res.message, {
        style: { color: '#fff' },
        timeout: 1500
      })
    } else {
      init(res.data);
      document.getElementById('Loading').style.display = 'none';
      document.getElementById('Loading').remove();
    }
  })

})()