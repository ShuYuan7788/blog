export default {
    getValue (key) {
        var v = sessionStorage.getItem(key);
        console.log("getValue",v)
        if (v && typeof(v) !== "undefined" && v !== "undefined") {
            return JSON.parse(v);
        }
    },
    setValue (key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    },
    removeValue (key) {
        sessionStorage.removeItem(key);
    },
    clearAll() {
        sessionStorage.clear();
    }
};
