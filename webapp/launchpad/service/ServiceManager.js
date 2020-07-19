sap.ui.define([
    'sap/ui/base/ManagedObject'
], function (MObj) {

   jQuery.sap.getObject("com.illumiti.launchpad.service", 0);

com.illumiti.launchpad.service.ServiceManager = {

    init: function(){
    },
    loadFile: function(url){

        var file;
        $.ajax({
            url:url,
            async: false,
            crossDomain: true
        }).done(function(data) {
            file = data;
        }).fail(function(ex) {
            file = null;
            console.log(ex, "Error loading file: Response is undefined " + url);
        });

        return file;

    },    
    loadTiles: function(){
        return [
            {
                "id": "dataentry", 
                "appId": "dataentry", 
                "title": "Data Entry",
                "subtitle": "Enter statistics",
                "footer": "Some footer",
                "unit": "",
                "kpivalue": 0,
                "scale": "",
                "color": "Good",
                "trend": "Up",
                "inactive": false,
                "icon": "sap-icon://form",
                "headerImage": ""
            },
            {
                "id": "appAnalytics", 
                "appId": "app2", 
                "title": "Analytics",
                "subtitle": "Show analytics",
                "footer": "Another footer",
                "unit": "",
                "kpivalue": 1,
                "scale": "",
                "color": "Good",
                "trend": "Up",
                "inactive": false,
                "icon": "sap-icon://kpi-corporate-performance",
                "headerImage": ""
            }
        ];

        var file = this.loadFile('webapp/launchpad/models/tiles.json');
        return file;        
    }
};

com.illumiti.launchpad.service.ServiceManager.init();

return com.illumiti.launchpad.service.ServiceManager;

});