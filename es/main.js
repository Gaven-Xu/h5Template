(function () {

  try {

    // 检测设备类型
    let { isInApp, mobileType } = checkEnvironment();
    console.log(isInApp, mobileType);
    // TODO: 模拟在APP中，上线之前去掉
    isInApp = true;

    // 项目配置.
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
    ellaH5.options = {
      id: 'AlertBox',
      style: {
        width: '5.23rem',
        padding: '.17rem .48rem',
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

      totalList.forEach((weekData, index, totalList) => {

        let top = '';
        let content = '';
        let { bookList } = weekData, normalBookList = bookList;

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
            <div class="book-cover" style="background:#39b3f3 url(${book.cover}) center no-repeat;">
              <div class="hot">推荐</div>
            </div>
            <div class="book-content">
              <div class="book-name">《${book.name}》</div>
              <div class="book-desc">${book.desc}</div>
              <div class="book-btn ${book.checked ? 'checked' : ''}" data-code="${book.code}"></div>
            </div>
          </div>
        `;
          normalBookList = normalBookList.slice(1);
        }
        console.log(index, totalList.length)

        // 创建图书列表
        normalBookList.forEach((book, index, bookLish) => {
          content += `
          <div class="book" ${index === 3 ? 'style="clear:both"' : ''}>
            <div class="cover" style="background:#39b3f3 url(${book.cover}) center no-repeat;">
              <div>
                <div class="book-btn ${book.checked ? 'checked' : ''}" data-code="${book.code}"></div>
              </div>
            </div>
            <div class="name">${book.name}</div>
          </div>
        `;
        })

        // 生成weeks代码串
        result += `
        <div class="week week${index}">
            <div class="tag"></div>
            <div class="title">
              <span>${weekData.time}</span>
              ${titles[index]}
            </div>
            ${top}
            <img class="divide" src="./images/divide.png"/>
            <div class="content">
              ${content}
            </div>
        </div>
      `;
      })

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

    // 声明调用：主函数
    function init() {
      // 调用：创建页面方法
      let doms = createWeeks(fakeData());
      document.getElementById('Weeks').innerHTML = doms;
      // 绑定点击事件
      let btns = document.querySelectorAll('.book-btn');
      btns.forEach(btn => {
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

          ellaH5.alert(message, {
            onConfirm: function () {
              console.log(that.dataset.code);
              if (isInApp) {
                console.log('App 内回调方法')
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
      })
    }
    window.init = init;

    // TODO: 模拟请求到数据之后的回掉
    window.setTimeout(function () {
      init();
      document.getElementById('Loading').style.display = 'none';
      document.getElementById('Loading').remove();
      document.documentElement.style.height = null;
      document.documentElement.style.overflow = null;
    }, 1300);

  } catch (err) {
    alert(err)
  }

})()