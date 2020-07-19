sap.ui.define([
    'sap/ui/base/ManagedObject'

], function (MObj) {

   jQuery.sap.getObject("com.illumiti.shell.service", 0);

com.illumiti.shell.service.ServiceManager = {

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


};

com.illumiti.shell.service.ServiceManager.init();

return com.illumiti.shell.service.ServiceManager;

});