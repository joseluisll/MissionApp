Ext.define('MissionApp.controller.IoController', {
    extend: 'Ext.app.Controller',

    init:function() {
        var me = this;
        me.mapwindow=null;
        me.keepalive=null;
        me.keepaliveerror=false;

        me.listen(
            {
                'controller': {
                    '#MissionController': {
                        'onEstablishCommunication':function(e) {
                            me.onEstablishCommunication(e);
                        },
                        'onMessageRequest':function(e) {
                            me.onMessageRequest(e);
                        }
                    }

                }
            }

        );

        //REGISTER THE MESSAGE HANDLER
        if (window.addEventListener){ //handle different browsers case
            window.addEventListener("message",function(evt) {
                console.log('IoController recibe un mensaje...'+evt.data);
                me.fireEvent('onProcessHTML5Message',Ext.JSON.decode(evt.data),me);
            }, false);

        } else {
            window.attachEvent("onmessage",function(evt) {
                console.log('IoController recibe un mensaje...'+evt.data);
                me.fireEvent('onProcessHTML5Message',Ext.JSON.decode(evt.data),me);
            }, false);
        }

    },
    //REAL OPERATIONS
    establishCommunication:function () {
        var me = this;
        //ESTABLISH THE MESSAGING CHANNEL!!!

        //IF WE HAVE AN ACTIVE COMMUNICATION, THEN IGNORE THE REQUEST.
        if(me.keepalive!==null && me.keepalive!== undefined) {
            console.info('There is already a MAP APP.');
            return;
        }
        var object=new Object();
        object.operation='MISSIONAPP_KEEPALIVE';
        me.keepalive = function(){

            if(me.mapwindow.closed===true || me.mapwindow===null || me.mapwindow===undefined ){
                console.info('The MAPAPP window has been closed...');
                me.mapwindow=null;
                me.keepalive=null;
                me.fireEvent('onKeepAliveError',me);
                runner.destroy();
                return;
            }
            try {
                var ret=me.mapwindow.postMessage(Ext.JSON.encode(object), window.location.href);
            }catch(error) {
                console.error('KeepAlive with the MAPAPP is not working well...');
                me.fireEvent('onKeepAliveError',me);
            }
        }
        var task = {
            run: me.keepalive,
            interval: 10000 //10 second
        }
        var runner = new Ext.util.TaskRunner();
        runner.start(task);
    },



    //EVENT HANDLERS
    onEstablishCommunication:function(evt) {
        var me = this;

        me.mapwindow=evt;
        //NOTHING TO DO RELATED WITH THE EVENT JUST INVOKE OPERATION;
        me.establishCommunication();
    },
    onMessageRequest:function (jsonMessage) {
        var me = this;

        if (me.mapwindow !== undefined) {
            var res = me.mapwindow.postMessage(jsonMessage, window.location.href);
        }
    }

});
