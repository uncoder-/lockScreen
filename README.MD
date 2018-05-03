# 说明
九宫格解锁

# 使用方法

```js
const lockScreen = createLockScreen({
    container: document.body,
    width: 258,
    style: {
        color: 'blue',
        lineWidth: 2
    },
    callback: (rel) => {
        console.log("结果", rel);
    }
});
```