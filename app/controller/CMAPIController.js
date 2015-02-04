/**
 * Created by Jose Luis on 26/01/2015.
 */
Ext.define('MissionApp.controller.CMAPIController', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me=this;
        this.runtimes=[cmajs.runtimes.browser];
        cmajs.init(me);
        cmajs.subscribe([{
            channel: "map.message.complete",
            callback: me.handleMessageComplete
        }, {
            channel: "map.message.progress",
            callback: me.handleMessageProgress
        }]);
    },
    handleMessageComplete:function(args) {

    },
    handleMessageProgress:function(args) {

    }

});