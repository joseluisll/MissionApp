/**
 * Created by Jose Luis on 26/01/2015.
 */
Ext.define('MissionApp.controller.CMAPIController', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me=this;
        var object=new Object();
        object.runtimes=[cmajs.runtimes.browser.pubSub];
        cmajs.init(object);
        cmajs.subscribe([{
            channel: cmajs.channels.MAP_ERROR,
            callback: me.handleMessageComplete
        }, {
            channel: cmajs.channels.MAP_MESSAGE_PROGRESS,
            callback: me.handleMessageProgress
        }]);
        cmajs.publish({
            channel:cmajs.channels.MAP_ERROR,
            message:cmapi.channel[cmajs.channels.MAP_ERROR].examples[0]
            }
        );
    },
    handleMessageComplete:function(args) {
        console.log('Browser runtime handleMessageComplete.');
    },
    handleMessageProgress:function(args) {
        console.log('Browser runtime handleMessageProgress.');

    }

});