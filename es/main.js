(function () {

  // 检测设备类型
  let { isInApp, mobileType } = checkEnvironment();
  // TODO: 模拟在APP中，上线之前去掉
  isInApp = true;

  // 项目配置.
  let api = 'http://dev.ellabook.cn/rest/api/service';
  let downloadLink = 'http://www.baidu.com';
  let modalTitle = "订阅成功", modalContent = "感谢喜欢这本书，绘本上线当天会通知您来看哦！", modalNotice = "";
  if (!isInApp) {
    modalContent = "下载咿啦看书APP查看完整绘本书单";
    modalNotice = "新用户免费赠送绘本大礼包哦";
    document.querySelector('.weixin').style.display = 'block';
    document.querySelector('.weixin').onclick = function () {
      window.open(downloadLink);
    }
  }

  // // 弹窗属性配置
  window.ellaH5.options = {
    id: 'AlertBox',
    style: {
      width: '70%',
      left: '10%',
      top: '35%',
      transform: 'translate(0,0)',
      webkitTransform: 'translate(0,0)',
      padding: '5%',
      backgroundColor: '#ffffff',
      borderRadius: '0.21rem'
    },
    maskStyle: {
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    confirmText: "好的",
    confirmStyle: {
      display: 'block',
      width: '1.56rem',
      height: '.6rem',
      background: '#5baaf3',
      textAlign: 'center',
      lineHeight: '.6rem',
      borderRadius: '.32rem',
      margin: '.3rem auto 0',
      color: '#fff'
    }
  }

  // 声明：创建页面方法
  function createWeeks(totalList) {

    let result = '';
    let titles = [
      `<span>放假啦~~让宝宝在假期开始时</span>
      <span>放松身心，准备迎接美好的寒假生活</span>`,

      `<span>马上就要过年啦~~我们又长大了一岁</span>
      <span>多学些人文知识，在假期增长宝宝的眼界！</span>`,

      `<span>过年啦~~大家春节快乐</span>
      <span>带宝宝一起来了解中国传统的过年习俗吧</span>`,

      `<span>假期接近尾声了，别难过</span>
      <span>打开绘本，继续奇妙的梦幻之旅</span>`,

      `<span>开学恐惧症？不怕</span>
      <span>每天一部动画书，给你假期好心情</span>`
    ]

    for (let index = 0; index < totalList.length; index++) {
      const weekData = totalList[index];

      let top = '';
      let content = '';
      let { winterVacationBooksDto: bookList } = weekData, normalBookList = bookList;

      /**
       * 区分最后一周
       * 如果不是最后一周，则是top(1)+content(6)的结构
       * 如果是最后一周，则是cotent(3)的结构
       */
      if (index !== totalList.length - 1) {
        let book = bookList[0];
        // 创建 推荐图书
        top = `
            <div class="top">
              <div class="book-cover" style="background:#39b3f3 url(${book.bookCoverUrl}) center no-repeat/cover;">
                <div class="hot">推荐</div>
              </div>
              <div class="book-content">
                <div class="book-name">《${book.bookName}》</div>
                <div class="book-desc">${book.bookIntroduction}</div>
                <div class="book-btn ${book.subscribeStatus === 'YES' ? 'checked' : ''}" data-code="${book.bookCode}"></div>
              </div>
            </div>
          `;
        normalBookList = normalBookList.slice(1);
      }

      // 创建图书列表
      normalBookList.forEach((book, index, bookLish) => {
        content += `
            <div class="book" ${index === 3 ? 'style="clear:both"' : ''}>
              <div class="cover" style="background:#39b3f3 url(${book.bookCoverUrl}) center no-repeat/cover;">
                <div>
                  <div class="book-btn ${book.subscribeStatus === 'YES' ? 'checked' : ''}" data-code="${book.bookCode}"></div>
                </div>
              </div>
              <div class="name">${book.bookName}</div>
            </div>
          `;
      })

      // 生成weeks代码串
      result += `
          <div class="week week${index}">
              <div class="tag"></div>
              <div class="title">
                <span>${weekData.planTitle.substr(5)}</span>
                ${titles[index]}
              </div>
              ${top}
              <img class="divide" src="./imgs/divide.png"/>
              <div class="content">
                ${content}
              </div>
          </div>
        `;
    }
    return result;
  }

  // 声明：设备类型检测
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

  // 声明调用：主函数,根据服务端数据，创建页面
  function init(data) {
    // 调用：创建页面方法

    let doms = createWeeks(data);
    document.getElementById('Weeks').innerHTML = doms;
    // 绑定点击事件
    let btns = document.querySelectorAll('.book-btn');

    try {
      for (var index = 0; index < btns.length; index++) {
        var btn = btns[index];
        btn.onclick = function (e) {

          let that = this;

          let message = `
          <div class="mail"></div>
          <div>
          <div class="title">${modalTitle}</div>
          <div class="content">${modalContent}</div>
          <div class="notice">${modalNotice}</div>
          </div>
          `;

          window.ellaH5.alert(message, {
            onConfirm: function () {
              if (isInApp) {
                $.post(api, {
                  method: 'ella.activity.subscribeBooks',
                  content: JSON.stringify({
                    uid: urlHandle.getParameter('uid'),
                    bookCode: that.dataset.code
                  })
                }, function (res) {
                  res = JSON.parse(res);
                  if (res.status !== "1") {
                    window.ellaH5.alert(res.message, {
                      style: { color: '#fff' },
                      timeout: 1500
                    })
                  }
                })

              } else {
                window.open(downloadLink)
              }
              // 按钮状态
              if (!that.classList.contains('checked')) {
                that.classList.add('checked')
              }
            }
          });

        }
      }
    } catch (err) {
      alert(err)
    }

  }

  // TODO: 模拟请求到数据之后的回掉
  $.post(api, {
    method: 'ella.activity.getWinterVacationBooks',
    content: JSON.stringify({
      uid: urlHandle.getParameter('uid')
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
      document.documentElement.style.height = null;
      document.documentElement.style.overflow = null;
    }
  })

})()