Ext.define('MissionApp.controller.MissionController', {
    extend: 'Ext.app.Controller',

      //INITIALIZATION AND OVERRIDES
    init: function () {
        var me = this;
        me.mapwindow=null; //THIS WILL CONTAIN THE map window object.

        //SetUp event listeners. Events will be fired by the view when buttons are clicked.
        //The controller implements the actual operation!!!

        me.listen({
            controller: {
                '#MainController': {
                    onOpenMapApp:function (e) {
                        me.onOpenMapApp(e);
                    },
                    onMessageRequest:function (e) {
                        me.onMessageRequest(e);
                    }
                },
                '#IoController': {
                    onProcessHTML5Message:function(e) {
                        me.onProcessHTML5Message(e);
                    },
                    'onKeepAliveError':function(e) {
                        me.onKeepAliveError(e);
                    }
                }
            }

        });

    },

    //REAL OPERATIONS!!!!

    openMapApp:function() {
        var stillvalid=false;
        var isnew=true;
        var me = this;

        if(me.mapwindow!==null) {
           //TEST IF IT IS VALID
            try {
                //READ A PROPERTY
                //console.debug(me.mapwindow.opener);
                stillvalid=true;
                isnew=false;

            }catch(error) {
                console.error(error);
                me.mapwindow=null;
                var stillvalid=false;
                isnew=true;
            }
        }else {
            //IT IS THE FIRST TIME THAT THE WINDOW IS OPENED.
            me.mapwindow = window.open(window.location.origin+'/MapApp/index.html', 'MAP_APP_WINDOW', null, false);
            isnew=true;
        }

        //ONCE THE MAP IS OPENED, I REQUEST THE IO CONTROLLER TO OPEN THE COMMUNICATION CHANNEL FIRING AN EVENT.
        if(stillvalid || isnew ) {
            me.fireEvent('onEstablishCommunication',me.mapwindow,me);
        }else {
            console.error('The communication is no longer valid');
        }
    },
    processHTML5Message:function(e) {
        //SEE WHAT IS TO BE DONE BY THE MISSION CONTROLLER WITH THIS MESSAGE?
        var me = this;
    },

    //EVENT HANDLERS
    onKeepAliveError:function(e) {
        var me=this;
        //Received when the mapapp is closed. It is fired by the IOController keepalive task
        me.mapwindow=null;
    },
    onOpenMapApp:function(e) {
        var me = this;
    //EVENT TO open the MAP
        //LETS CALL THE REAL OPERATION, NOTHING MORE IS TO BE DONE.
        me.openMapApp();
    },
    onMessageRequest:function(jsonMessage) {
        var me = this;

        me.fireEvent('onMessageRequest', jsonMessage,me);
    },
    onProcessHTML5Message:function(e) {
        var me = this;
        me.processHTML5Message(e)
    }
});
