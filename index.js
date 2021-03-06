function createUnLockScreen(config) {
    // 点
    function Dot(x, y, index, radius) {
        const d = {};
        d.index = index;
        d.x = x;
        d.y = y;
        d.radius = radius;
        d.rectArea = { x0: x - radius, y0: y - radius, x1: x + radius, y1: y + radius }
        return d;
    }
    // 生成点
    function genarateDots(realSize) {
        const size = realSize / 3;
        const radius = size * 0.4;
        const dots = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const index = i * 3 + j + 1;
                const x = size * j + size / 2;
                const y = size * (i + 1) - size / 2;
                const dot = Dot(x, y, index, radius);
                dots.push(dot);
                strokeDot(dot, { color: '#999', lineWidth: 2 });
            }
        }
        // 缓存
        const bgCache = ctx.getImageData(0, 0, realSize, realSize);
        ctx.clearRect(0, 0, realSize, realSize);
        return { dots, bgCache };
    }
    // 画点
    function strokeDot(dot, style) {
        // 画点
        ctx.save();
        ctx.strokeStyle = style ? style.color : defaultStyle.color;
        ctx.lineWidth = style ? style.lineWidth : defaultStyle.lineWidth;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    // 画线
    function strokeLine(lastPoint, eventPoint) {
        ctx.save();
        ctx.strokeStyle = defaultStyle.color;
        ctx.lineWidth = defaultStyle.lineWidth;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(eventPoint.x, eventPoint.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    // 相对位置换算真实位置
    function returnRealPosition(event) {
        const { type, targetTouches, target } = event;
        const { left, top } = target.getBoundingClientRect();
        const touchPoint = targetTouches[0];
        const x = (touchPoint.clientX - left) * radio;
        const y = (touchPoint.clientY - top) * radio;
        return { x, y };
    }
    // 触点位置
    function isInArea(event) {
        const { x, y } = returnRealPosition(event);
        let dot = null;
        for (let i = 0; i < dots.length; i++) {
            const { x0, y0, x1, y1 } = dots[i].rectArea;
            if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
                dot = dots[i];
                break;
            }
        }
        return dot;
    }
    // 九宫格返回某个数字（上/下/左/右）得数字
    function returnAroundNumber(number) {
        // 行
        const row = parseInt(number / 3);
        // 列
        const column = parseInt(number % 3);
        // console.log("number位置", row, column);
        let top = 0, left = 0, right = 0, bottom = 0;
        // 上面
        if (row != 0) {
            top = (row - 1) * 3 + column;
        }
        // 下面
        if (row != 2) {
            bottom = (row + 1) * 3 + column;
        }
        // 左边
        if (column != 0) {
            left = number - 1;
        }
        // 右边
        if (column != 2) {
            right = number + 1;
        }
        return [top, right, bottom, left]
    }
    // 清空
    function clear() {
        ctx.putImageData(bgCache, 0, 0);
    }
    // 事件绑定
    function touchstart(event) {
        const point = isInArea(event);
        if (!touchStatus && point) {
            touchStatus = true;
            selectPointsArry.push(point);
            strokeDot(point);
            drawCache = ctx.getImageData(0, 0, realSize, realSize);
        }
        // console.log("start");
    }
    function touchmove(event) {
        if (touchStatus) {
            // 恢复
            ctx.putImageData(drawCache, 0, 0);
            const point = isInArea(event);
            if (point) {
                // 检测触点索引是否已经在列表里了
                if (selectPointsArry.find(item => item.index == point.index)) {
                    return;
                }
                // 加入索引
                selectPointsArry.push(point);
                for (let i = 0; i < selectPointsArry.length; i++) {
                    strokeDot(point);
                    if (selectPointsArry[i + 1]) {
                        strokeLine(selectPointsArry[i], selectPointsArry[i + 1]);
                    }
                }
                drawCache = ctx.getImageData(0, 0, realSize, realSize);
            } else if (!point && selectPointsArry.length < 9) {
                const { x, y } = returnRealPosition(event);
                strokeLine(selectPointsArry.slice(-1)[0], { x, y });
            }
        }
        // console.log("move");
    }
    function touchend(event) {
        if (touchStatus) {
            touchStatus = false;
            if (selectPointsArry.length < 9) {
                clear();
            } else {
                // success
                const result = selectPointsArry.map(item => item.index);
                callback(result)
            }
            // console.log("end");
        }
    }
    function touchcancel(event) {
        touchend(event);
        // console.log("cancel");
    }
    const addEvent = (el) => {
        el.addEventListener("touchstart", touchstart);
        el.addEventListener("touchmove", touchmove);
        el.addEventListener("touchend", touchend);
        el.addEventListener("touchcancel", touchcancel);
    }

    // 故事从此行开始。
    const canvas = document.createElement('canvas');
    const { container, width, callback } = config;
    const defaultStyle = { color: 'red', lineWidth: 1, ...config.style };
    const radio = window.devicePixelRatio || 2;
    const realSize = (width >= 406 ? 406 : width) * radio;
    canvas.setAttribute('width', realSize);
    canvas.setAttribute('height', realSize);
    // 高清
    canvas.style.width = `${realSize / radio}px`;
    canvas.style.height = `${realSize / radio}px`;

    const ctx = canvas.getContext('2d');
    const { bgCache, dots } = genarateDots(realSize);
    // 初始化渲染
    ctx.putImageData(bgCache, 0, 0);
    // 声明事件需要的变量
    let touchStatus = false;
    let selectPointsArry = [];
    let drawCache = null;
    // 监听
    addEvent(canvas);
    // 插入
    container.appendChild(canvas);
    return {
        clear
    }
}