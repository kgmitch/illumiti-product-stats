sap.ui.define([
    'sap/ui/base/ManagedObject'
], function (MObj) {

   jQuery.sap.getObject("com.illumiti.dataentry.service", 0);

com.illumiti.dataentry.service.ServiceManager = {

    init: function(){
    }
};

com.illumiti.dataentry.service.ServiceManager.init();

return com.illumiti.dataentry.service.ServiceManager;

});