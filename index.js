
function LockScreen(config) {
    var SW = window.innerWidth;
    var config = config;
    var myCanvas = document.querySelector(config.el);
    myCanvas.setAttribute('height', SW);
    myCanvas.setAttribute('width', SW);
    var myCtx = myCanvas.getContext('2d');
    // 配置、
    var col = 3;
    var row = 3;
    var width = SW / 3;
    var radius = 30;
    var selectDots = [];
    // 生成点集、
    function generateDots() {
        let dots = [];
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                let dot = {};
                dot.index = i * 3 + j;
                dot.x = width * j + width / 2;
                dot.y = width * (i + 1) - width / 2;
                dot.radius = radius;
                dot.select = false;
                dot.area = { x0: dot.x - radius, y0: dot.y - radius, x1: dot.x + radius, y1: dot.y + radius };
                dots.push(dot);
            }
        }
        console.log(dots);
        return dots;
    }
    // 画圈、
    function drawCircle(dots) {
        myCtx.clearRect(0, 0, SW, SW);
        for (let i = 0; i < dots.length; i++) {
            // console.log(dots[i].x, dots[i].y, dots[i].radius)
            if (dots[i].select) {
                myCtx.save();
                myCtx.strokeStyle = 'red';
                myCtx.beginPath();
                myCtx.arc(dots[i].x, dots[i].y, 10, 0, 2 * Math.PI);
                myCtx.stroke();

                myCtx.beginPath();
                myCtx.arc(dots[i].x, dots[i].y, dots[i].radius, 0, 2 * Math.PI);
                myCtx.stroke();
                myCtx.restore();
            } else {
                myCtx.beginPath();
                myCtx.arc(dots[i].x, dots[i].y, dots[i].radius, 0, 2 * Math.PI);
                myCtx.closePath();
                myCtx.stroke();
            }
        }
    }
    function drawHistoryLine(selectDots) {
        myCtx.save();
        myCtx.strokeStyle = 'red';
        //历史画线
        if (selectDots.length >= 2) {
            for (let i = 0; i < selectDots.length - 1; i++) {
                let startDot = fooDots[selectDots[i]];
                let endDot = fooDots[selectDots[i + 1]];

                myCtx.beginPath();
                myCtx.moveTo(startDot.x, startDot.y);
                myCtx.lineTo(endDot.x, endDot.y);
                myCtx.closePath();
                myCtx.stroke();
            }
        }
        myCtx.restore();
    }
    // 画线
    function drawMoveLine(fooDots, selectDots, end) {
        // 校验是否全部已选
        if (fooDots.length == selectDots.length) { return; }

        myCtx.save();
        myCtx.strokeStyle = 'red';
        // 运动画线
        var start = fooDots[selectDots[selectDots.length - 1]];

        myCtx.beginPath();
        myCtx.moveTo(start.x, start.y)
        myCtx.lineTo(end.clientX, end.clientY)
        myCtx.closePath();

        myCtx.stroke();
        myCtx.restore();
    }
    // 检测触点是否在圈内
    function dotTest(dots, touchPoint) {
        let index = '';
        let x = touchPoint.clientX;
        let y = touchPoint.clientY;
        for (let i = 0; i < dots.length; i++) {
            let item = dots[i];
            if (x > item.area.x0 && x < item.area.x1 && y > item.area.y0 && y < item.area.y1 && !item.select) {
                // console.log('true');
                item.select = true;
                selectDots.push(item.index);
            }
        }
        return dots;
    }
    // 程序运行起点、
    var dots = generateDots();
    var fooDots = JSON.parse(JSON.stringify(dots));
    drawCircle(dots);
    // 绑定事件、
    myCanvas.addEventListener("touchstart", function (event) {
        // console.log('start');
        fooDots = dotTest(fooDots, event.touches[0]);
        drawCircle(fooDots);
    });
    myCanvas.addEventListener("touchmove", function (event) {
        // console.log('move');
        fooDots = dotTest(fooDots, event.touches[0]);
        drawCircle(fooDots);
        drawHistoryLine(selectDots);
        drawMoveLine(fooDots, selectDots, event.touches[0]);
        // console.log(,event.touches[0]);
        // drawLine(event.touches[0].clientX,event.touches[0].clientY)
    });
    myCanvas.addEventListener("touchend", function (event) {
        drawCircle(fooDots);
        drawHistoryLine(selectDots);
    });
}