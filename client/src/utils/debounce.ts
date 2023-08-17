export const debounce = function (func: () => void, delay: number) {
    let timer: any = null;
    return function() {
        if (timer != null) clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    }
}
