angular.module('options',['ngMaterial', 'LocalStorageModule']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
});



window.addEvent("domready", function () {



    var settings = new Store('settings'),
        fancySettings = {};
    console.log(settings.get('template'));
    new FancySettings.initWithManifest(function (settings) {
        fancySettings = settings;
        settings.manifest.addTemplate.addEvent("action", function () {
            settings.create({
                "tab": i18n.get("templates"),
                "group": i18n.get("templates"),
                "name": "template_2",
                "type": "textarea",
                "text": i18n.get("template_text")
            });
            test();
            console.log(settings);
        });
    });
    function test() {
        console.log(settings);
    }

    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
    */
});
