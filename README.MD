# 说明

九宫格解锁，不支持pc

演示[demo](https://uncoder-fe.github.io/unlock-screen/)
# 使用方法

```js
const unlockScreen = createUnLockScreen({
    container: document.body,
    width: window.innerWidth,
    style: {
        color: 'blue',
        lineWidth: 2
    },
    callback: (rel) => {
        console.log("ahhhhhh", rel);
    }
});
```