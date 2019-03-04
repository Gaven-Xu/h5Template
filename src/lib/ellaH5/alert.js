(function () {

  // 创建命名空间，并暴露框架
  var namespace = 'ellaH5';
  window[namespace] = window[namespace] || {};

  // 定时器存储器
  window[namespace].alertTimeout = null;

  // 配置的暴露方法
  window[namespace].alertOptions = {};

  /**
   *
   * @param {string}  value       需要弹出的内容，字符串
   * @param {object} props
   * @param {string}  id
   * @param {object}  style       样式，按照js的css格式写
   * @param {number}  timeout     多长时间之后隐藏 ms
   * @param {object}  closeStyle  样式，按照js的css格式写 ， 根据timeout来判断
   * @param {function} onBefore   打开之前执行
   * @param {function} onOpened   打开之后执行
   * @param {function} onClosed   关闭之后执行
   * @param {function} onConfirm  确认按钮点击之后的回调事件 ， 根据timeout来判断 ， 需要返回true或者false
   * @param {object} confirmStyle  确认按钮样式
   * @param {string} confirmText  确认按钮文本
   * @param {function} onCancel   取消按钮点击之后的回调事件 ， 根据timeout来判断
   * @param {object} cancelStyle   取消按钮样式
   * @param {string} cancelText   取消按钮文本
   * @param {object} maskStyle   遮罩样式
   * @param {function} onMaskClick   遮罩点击回调
   * @param {function} timeCallback   定时器之后的回调
   *
   * @ps clearAlert为清楚alert弹窗的方法，未暴露，自带回调，会判断onClosed方法，并执行
   */
  window[namespace].alert = function (value, _props) {

    var props = {
      ...window[namespace].alertOptions,
      ..._props,
    }

    /**
     * 处理 props.onBefore
     */
    var beforeCallback = props.onBefore;
    if (beforeCallback) {
      beforeCallback()
    }

    props = props || 'Hello World!'; // 防止传入undefined 或者null 的报错

    /**
     * 处理 maskStyle
     */
    var alertContainer = document.createElement('div');
    var maskStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(255, 255, 255, 0.5)",
    }
    if (props.maskStyle) {
      for (var key in props.maskStyle) {
        if (props.maskStyle.hasOwnProperty(key)) {
          // 遍历用户传递的属性，依次覆盖或者添加
          maskStyle[key] = props.maskStyle[key]
        }
      }
    }
    // alertContainer.setAttribute('style', createStyleString(maskStyle));
    addStyle(alertContainer, maskStyle)

    var alertModal = document.createElement('div');
    alertContainer.appendChild(alertModal)

    /**
     * 处理 onMaskClick
     */
    alertContainer.addEventListener('click', function (e) {
      if (this === e.target) {
        if (typeof props.onMaskClick == 'function') {
          props.onMaskClick()
        } else {
          clearAlert(props.id || 'alertModal', props.onClosed)
        }
      }
    })
    alertContainer.addEventListener('touchmove', function (e) {
      e.preventDefault();
    })

    /**
     * 处理 props.content
     * 如果没有按对象传值，直接传字符串
     */
    // alertModal.innerHTML = props.content || props;
    var contentText = document.createElement('div');
    contentText.setAttribute('class', 'content');
    if (typeof value === 'string') {
      contentText.innerHTML = value;
    } else if (value.nodeType && value.nodeType === 1) {
      contentText.appendChild(value);
    }
    alertModal.appendChild(contentText)

    /**
     * 处理 props.id
     */
    alertContainer.setAttribute('id', props.id || 'alertModal');

    /**
     * 处理 props.style
     * 如果没有传递style，则用一下默认的
     * 不需要按js的驼峰规范来写style名，直接加上字符串引号
     */
    var style = {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      webkitTransform: 'translate(-50%,-50%)',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      fontSize: '13px',
      borderRadius: '8px',
      cursor: 'default'
    }
    if (props.style) {
      for (var key in props.style) {
        if (props.style.hasOwnProperty(key)) {
          style[key] = props.style[key]
        }
      }
    }
    // alertModal.setAttribute('style', createStyleString(style));
    addStyle(alertModal, style)

    /**
     * 处理 props.timeout
     * 如果没有传timeout值，则默认为null
     * 如果ms存在，则根据ms增加或者重新定义倒计时
     * 如果ms不存在，则显示遮罩层，显示关闭按钮
     */
    var ms = props.timeout || null;
    if (ms) {
      // 先清除可能存在的弹窗，再增加弹窗
      clearAlert(props.id || 'alertModal', props.onClosed)
      window[namespace].alertTimeout = setTimeout(function () {
        clearAlert(props.id || 'alertModal', props.onClosed);
        if (props.timeCallback) props.timeCallback();
      }, ms)
    } else {

      /**
       * 创建关闭按钮，实际意义上，这个是取消按钮
       * 处理props.closeStyle 和 props.onCancel
       * 仅仅当timeout不存在的时候，出现关闭按钮，需要手动关闭
       */
      var closeX = document.createElement('div');
      closeX.setAttribute('class', 'close');
      closeX.innerHTML = 'x';
      var closeStyle = {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        font: '14px/17px \'黑体\'',
        width: '20px',
        height: '20px',
        textAlign: 'center',
        background: '#fff',
        color: '#000',
        borderRadius: '50%',
        boxShadow: '0 0 1px #000'
      }
      if (props.closeStyle) {
        for (var key in props.closeStyle) {
          if (props.closeStyle.hasOwnProperty(key)) {
            // 遍历用户传递的属性，依次覆盖或者添加
            closeStyle[key] = props.closeStyle[key]
          }
        }
      }
      // closeX.setAttribute('style', createStyleString(closeStyle));
      addStyle(closeX, closeStyle);

      closeX.onclick = function (e) {
        if (this === e.target)
          clearAlert(props.id || 'alertModal', props.onClosed);
      }
      alertModal.insertBefore(closeX, contentText)


      /**
       * 创建确认按钮
       * 处理props.onConfirm
       * 仅仅当timeout不存在的时候,并且有onConfirm参数时,出现确认按钮
       */
      if (props.onConfirm) {

        var confirmBtn = document.createElement('div');
        confirmBtn.setAttribute('class', 'confirm');
        confirmBtn.innerHTML = props.confirmText || '确认';
        var confirmStyle = {
          background: 'rgba(255, 255, 255, 0.65)',
          color: '#000',
          display: 'inline-block'
        }
        if (props.confirmStyle) {
          for (var key in props.confirmStyle) {
            if (props.confirmStyle.hasOwnProperty(key)) {
              // 遍历用户传递的属性，依次覆盖或者添加
              confirmStyle[key] = props.confirmStyle[key]
            }
          }
        }
        // confirmBtn.setAttribute('style', createStyleString(confirmStyle));
        addStyle(confirmBtn, confirmStyle);

        confirmBtn.onclick = function (e) {
          /**
           * 处理 props.onConfirm
           */
          if (this === e.target) {
            var confirmCallback = props.onConfirm;
            if (confirmCallback) {
              confirmCallback(props);
            }
            clearAlert(props.id || 'alertModal', props.onClosed)
          }

        }
        alertModal.appendChild(confirmBtn)
      }

      /**
       * 创建取消按钮
       * 处理props.onCancel
       * 仅仅当timeout不存在的时候,并且有onCancel参数时,出现取消按钮
       */
      if (props.onCancel) {

        var cancelBtn = document.createElement('div');
        cancelBtn.setAttribute('class', 'cancel');
        cancelBtn.innerHTML = props.cancelText || '取消';
        var cancelStyle = {
          background: 'rgba(255, 255, 255, 0.65)',
          color: '#000',
          display: 'inline-block'
        }
        if (props.cancelStyle) {
          for (var key in props.cancelStyle) {
            if (props.cancelStyle.hasOwnProperty(key)) {
              // 遍历用户传递的属性，依次覆盖或者添加
              cancelStyle[key] = props.cancelStyle[key]
            }
          }
        }
        // cancelBtn.setAttribute('style', createStyleString(cancelStyle));
        addStyle(cancelBtn, cancelStyle);

        cancelBtn.onclick = function (e) {
          /**
           * 处理 props.onCancel
           */
          if (this === e.target) {
            var cancelCallback = props.onCancel;
            if (cancelCallback) {
              cancelCallback(props)
            }
            clearAlert(props.id || 'alertModal', props.onClosed)
          }

        }
        alertModal.appendChild(cancelBtn)
      }

    }

    document.body.appendChild(alertContainer);

    /**
     * 处理 props.onOpened
     */
    var opendCallback = props.onOpened;
    if (opendCallback) {
      setTimeout(function () {
        opendCallback(props)
      }, 50)
      // 这个确实是在打开之后执行的，弹窗标签已经加入到页面，但是会被alert阻断，所以，这个增加了一个50ms的延迟，主要是针对alert
      // 对于 onClosed 也是一样
    }
  }

  /**
   * 清除原弹窗
   * @param {string} id
   * @param {function} callback
   */
  var clearAlert = function (id, callback) {
    var node;
    if (node = document.getElementById(id)) {
      document.body.removeChild(node);
    };
    if (window[namespace].alertTimeout) {
      clearTimeout(window[namespace].alertTimeout)
    }
    if (callback) {
      setTimeout(function () {
        callback()
      }, 50)
    }
  }

  /**
   * 遍历添加样式
   */
  function addStyle(target, styleObj) {
    for (var key in styleObj) {
      target.style[key] = styleObj[key];
    }
  }

}.call(this))
