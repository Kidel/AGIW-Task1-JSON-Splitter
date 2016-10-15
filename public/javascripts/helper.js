function lastElem(arr) {
    return arr[arr.length - 1];
}
if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}