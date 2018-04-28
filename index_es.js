createLockScreen({
    container: document.body,
    width: 250,
});

function createLockScreen(config) {
    // 点
    function Dot(x, y, radius) {
        const d = {};
        d.x = x;
        d.y = y;
        d.radius = radius;
        d.areaReact = { x0: x - radius, y0: y - radius, x1: x + radius, y1: y + radius }
        return d;
    }
    // 画点
    function strokeDot(dot, style) {
        // 画点
        ctx.save();
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.lineWidth || 1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    // 背景
    function genarateBackground(realSize) {
        const size = realSize / 3;
        const radius = size * 0.3;
        const bgDots = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = size * j + size / 2;
                const y = size * (i + 1) - size / 2;
                const dot = Dot(x, y, radius);
                bgDots.push(dot);
                strokeDot(dot, { color: '#999', lineWidth: 4 });
            }
        }
        // 缓存
        const bgCache = ctx.getImageData(0, 0, realSize, realSize);
        ctx.clearRect(0, 0, realSize, realSize);
        return { bgDots, bgCache };
    }
    // 检测触点位置
    function checkPointPosition(event) {
        const { type, targetTouches, target } = event;
        const { left, top } = target.getBoundingClientRect();
        const touchPoint = targetTouches[0];
        console.log(touchPoint.clientX - left) * radio, (touchPoint.clientY - top) * radio;
    }
    // 事件绑定
    function addEvent(el) {
        el.addEventListener("touchstart", (event) => {
            event.preventDefault()
            event.stopPropagation();
            return false;
            // if (true) {
            //     event.stopPropagation()
            //     event.stopImmediatePropagation();
            //     // debugger
            //     return false;
            // }
            // touchStatus = true;
            // checkPointPosition(event);
            // debugger
            // console.log("start");
        });
        el.addEventListener("touchmove", (event) => {
            console.log("move");
        });
        el.addEventListener("touchend", (event) => {
            console.log("end");
        });
    }

    // 故事从此行开始。。。。。。。。。。。。。。。。。。
    const canvas = document.createElement('canvas');
    const { container, width } = config;
    const radio = window.devicePixelRatio || 2;
    const realSize = width * radio;
    canvas.setAttribute('width', realSize);
    canvas.setAttribute('height', realSize);
    // canvas.style.width = `${width}px`;
    // canvas.style.height = `${width}px`;
    const scale = 1 / radio;
    canvas.style.transform = `scale(${scale})translate(-${scale * 100}%,-${scale * 100}%)`;
    const ctx = canvas.getContext('2d');
    const { bgCache, bgDots } = genarateBackground(realSize);
    ctx.putImageData(bgCache, 0, 0)
    // 定义事件变量
    let touchStatus = true;
    let touchPoint = null;
    // 监听
    addEvent(canvas);
    // 插入
    container.appendChild(canvas);
}

// export default { createLockScreen }