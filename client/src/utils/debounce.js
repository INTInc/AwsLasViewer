export const debounce = function (func, delay) {
    let timer = null;
    return function() {
        if (timer != null) clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    }
}
