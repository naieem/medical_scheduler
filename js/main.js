var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

angular.module('ionicApp', ['ionic', 'ngCordova', 'ion-datetime-picker','ion-floating-menu','firebase'])

.config(function() {
    var config = {
        apiKey: "AIzaSyDictE2wD4RIQtuaPURvO1gcvzQqLC-Sok",
        authDomain: "medical-login.firebaseapp.com",
        databaseURL: "https://medical-login.firebaseio.com",
        projectId: "medical-login",
        storageBucket: "medical-login.appspot.com",
        messagingSenderId: "854763670874"
    };
    firebase.initializeApp(config);
})
.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            //StatusBar.hide();
            StatusBar.styleDefault();
        }

    });

    $ionicPlatform.registerBackButtonAction(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $ionicPopup.show({
            title: 'Exit Scheduler?',
            template: 'Are you sure you want to exit Scheduler?',
            buttons: [{
                text: 'Cancel',
                type: 'button-royal button-outline',
            }, {
                text: 'Ok',
                type: 'button-royal',
                onTap: function() {
                    ionic.Platform.exitApp();
                }
            }]
        });
    }, 100);
});
