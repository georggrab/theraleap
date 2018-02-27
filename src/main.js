"use strict";
exports.__esModule = true;
var leapmotion_1 = require("./leapmotion");
var vue_1 = require("vue");
var leap = require("leapjs");
require("es6-promise/auto");
var LeapDebugInterface_vue_1 = require("@app/ui/LeapDebugInterface.vue");
var controllerSettings = {
    host: '127.0.0.1',
    port: 6437,
    frameEventName: 'deviceFrame',
    enableGestures: true
};
var driver = new leapmotion_1.LeapDriver(controllerSettings, leap);
var conn = driver.establishMonitoredConnection().subscribe(function (state) {
    console.log('State of Connection:', state);
});
new vue_1["default"]({
    el: '#app',
    render: function (render) { return render(LeapDebugInterface_vue_1["default"]); },
    provide: { driver: driver }
});
//# sourceMappingURL=main.js.map