export const decimate = function(arr, ratio) {
    if (ratio < 1) return arr;
    if (ratio >= arr.length) return [arr[0], arr[arr.length - 1]];
    let i = 0;
    const decimated = [];
    while (Math.floor(i) < arr.length) {
        if (i + ratio < arr.length) {
            decimated.push(arr[Math.floor(i)]);
        } else {
            decimated.push(arr[arr.length - 1]);
        }
        i += ratio;
    }
    return decimated;
}
