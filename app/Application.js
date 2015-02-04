/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('MissionApp.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'MissionApp.controller.IoController',
        'MissionApp.controller.MissionController',
        'MissionApp.controller.CMAPIController'
    ],
    
    name: 'MissionApp',

    controllers:[
        //I ADD A REFERENCE TO ALL CONTROLLERS
        'IoController','MissionController'
    ],
    views: [
        //THERE IS NO NEED TO REFERENCE THE MAINVIEW!!!Also, the View Controller will communicate with the rest of the controllers
        //by events.
    ],

    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
        window.name='MISSION_APP_WINDOW';
    }
});
