/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MissionApp.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'MissionApp.view.main.MainController',
        'MissionApp.view.main.MainModel',
        'Ext.grid.Panel'
    ],

    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },
    itemId: 'MAIN_CONTAINER',
    items: [
        {//FIRST THE WEST REGION. IT IS THE NAVIGATION TOOL BAR
            //IN THIS CASE, THERE IS NO MAIN WINDOW YET.
            xtype: 'panel',
            bind: {
                title: '{name}'
            },
            region: 'west',
            width: 250,
            split: true,
            items: [{
                html: '<ul><li>GROUP OF CONTROL BUTTONS</li></ul>'
            },
                {
            tbar: [{
                text: 'Open Map Application',
                itemId: 'BTN_OPEN_MAPAPP',
                handler: 'onClickButton'
            }]},
                {
                    html: '<ul><li>GROUP OF MISSION OPERATIONS</li></ul>'
                },
                {
                    tbar: [{
                        text: 'Publish Features',
                        itemId: 'PUBLISH_FEATURES',
                        handler: 'onClickButton'
                    },{
                        text: 'Add Airbase',
                        itemId: 'ADD_AIRBASE',
                        handler: 'onClickButton'
                    }]}
            ]
        },{
            xtype:'panel',
            region:'center',
            itemId:'MISSION_DATA_PANEL',
            split:true
        },{
            xtype: 'panel',
            itemId:'MISSION_EVENT_PANEL',
            region:'south',
            width:250,
            split:true,
            height:250,
            autoScroll:true,
            items: [{
                html: '<p><ul><li>LIST OF EVENTS</li></ul></p>'
            }
            ]

        }
    ]
});
