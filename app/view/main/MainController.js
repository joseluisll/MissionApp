/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MissionApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox',
        'Ext.grid.Panel'
    ],

    alias: 'controller.main',

    init:function() {
      var me=this;
        me.setId('MainController');
        cmajs.init();
        //cmajs.runtimes.browser.mediator.publish();
        me.listen({
                'controller': {
                    '#IoController':{
                        'onProcessHTML5Message':function(evt) {
                            me.onProcessHTML5Message(evt);
                        }
                    }
                }

            }
        );

        Ext.create('Ext.data.Store', {
            storeId:'airbaseStore',
            fields:['id','name', 'coordinateX', 'coordinateY'],
            data: [
                //// long, lat
                {"id":generateUUID(),"name":"Ramstein", "coordinateX":"-10764594.0", "coordinateY":"4523072.0"},//COORDINATE OF SOMEWERE IN BOSTON
                {"id":generateUUID(),"name":"Aviano", "coordinateX":"-10664594.0", "coordinateY":"4623072.0"},//COORDINATE OF SOMEWERE IN BOSTON

            ]
        });

        function generateUUID(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }

        var cmp=Ext.create('Ext.grid.Panel', {
            region:'center',
            itemId:'AIRBASE_TABLE',
            title: 'Airbase Table',
            store: Ext.data.StoreManager.lookup('airbaseStore'),
            columns: [
                {header: 'id',  dataIndex: 'id', editor: 'textfield',allowBlank: false},
                {header: 'Name',  dataIndex: 'name', editor: 'textfield',allowBlank: false},
                {header: 'CoordinateX', dataIndex: 'coordinateX', flex:1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {header: 'CoordinateY', dataIndex: 'coordinateY',flex:1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }
            ],
            columnLines:true,
            selModel: 'rowmodel',
            plugins: {
                ptype: 'rowediting',
                clicksToEdit: 1
            }
            //height: 700,
            //width: 600
        });

        cmp.on('select',me.onRowSelect,me);
        cmp.on('edit',me.onRowUpdate,me);



        var v=Ext.ComponentQuery.query('#MISSION_DATA_PANEL');
        var vc=v[0];
        vc.add(cmp);
    },
    publishFeatures:function() {
        var me=this;
        var features=[];

        var table=Ext.ComponentQuery.query('#AIRBASE_TABLE')[0];

        var model_objects=table.getStore().getData();

        var index=0;
        for(index=0;index<model_objects.items.length;++index)
        {
            var object=model_objects.items[index];
            object.data.operation='PUBLISH_FEATURE';
            me.fireEvent('onMessageRequest',Ext.JSON.encode(object.data),me);
            //console.debug(Ext.JSON.encode(object.data));
        }

    },
    onRowSelect:function(th, record, index, eOpts ) {
        //I would like to send and event so that the MAP SELECTS THE MATCHING FEATURE
        var me=this;
        var object=new Object();
        object.operation='FEATURE_SELECTED';
        object.id=record.id;
        me.fireEvent('onMessageRequest',Ext.JSON.encode(object),me);
        console.debug(Ext.JSON.encode(object));
    },
    onRowUpdate:function( editor, context, eOpts) {
        var me=this;
        var object=new Object();
        var record=context.record;
        //A row has been updated. We can propagate this update to other components. var object=new Object();
        object.operation='FEATURE_UPDATED';
        object.id=record.id;
        object.name=record.name;
        object.coordinateX=record.coordinateX;
        object.coordinateY=record.coordinateY;
        me.fireEvent('onMessageRequest',Ext.JSON.encode(object),me);
        console.debug(Ext.JSON.encode(object));
    },
    onFeatureSelected:function (e) {
        var table=Ext.ComponentQuery.query('#AIRBASE_TABLE')[0];
        var sel=table.getSelectionModel();

        //I need to look for the record first. INDEX must be a number
        var model_objects=table.getStore().getData();
        var found=false;
        for(index=0;index<model_objects.items.length;++index)
        {
            var object=model_objects.items[index];
            if(object.id=== e.id){
                //FOUND IT!!!
                found=true;
                break;
            }
        }
        if(found) {
            sel.select(index, true, true);
        }

    },
    createFeature:function(jsonObject){
        var me=this;
        var table=Ext.ComponentQuery.query('#AIRBASE_TABLE')[0];

        //1.- validate parameters

        //2.- see if it already exists
        var model_objects=table.getStore().getData();
        var found=false;
        for(index=0;index<model_objects.items.length;++index)
        {
            var object=model_objects.items[index];
            if(jsonObject.id=== object.id){
                //FOUND IT!!!
                found=true;
                break;
            }
        }
        if(found) {
            console.log('Feature already exists...');
            return;
        }

        //3.- if not, create it
        var model_store=table.getStore();
        model_store.add(jsonObject);


        console.log('Added a new Feature from the MAPAPP.');

    },

    onClickButton: function (btn) {
        var me=this;
        //implement button callbacks.
        if(btn.itemId==='BTN_OPEN_MAPAPP'){
            //WE WOULD LIKE THAT THE MISSION CONTROLLER OPENS THE MAP AND ESTABLISHED THE COMMUNICATION CHANNEL WITH THE WINDOW.
            this.fireEvent('onOpenMapApp',this);
        }else if(btn.itemId==='PUBLISH_FEATURES') {
            me.publishFeatures();
        }else if(btn.itemId==='ADD_AIRBASE') {


            var store = Ext.data.StoreManager.lookup('airbaseStore');
            object=store.add({"id":generateUUID(),"name":"EDITNAME", "coordinateX":"0.0", "coordinateY":"0.0"});
            //object.operation='ADD_AIRBASE';
            //this.fireEvent('onMessageRequest',Ext.JSON.encode(object),this);
        }

        function generateUUID(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }


    },
    onProcessHTML5Message:function(e) {
        var me=this;
        var event_panel = Ext.ComponentQuery.query('#MISSION_EVENT_PANEL')[0];
        var label=Ext.create ('Ext.form.Label', {
                html: '<p>'+ e+'</p>'
            }
        );
        event_panel.add(label);
        var evt=Ext.JSON.decode(e);

        if(evt.operation==='FEATURE_SELECTED') {
            me.onFeatureSelected(evt);
            return;
        }

        if(evt.operation==='PUBLISH_FEATURE'){
            me.createFeature(evt)
            return;
        }
    }


});
