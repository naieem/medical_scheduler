/**
 * [App Controller]
 * @param  {[type]} $scope           [description]
 * @param  {[type]} $ionicModal      [description]
 * @param  {Array}  ionicDatePicker
 */
angular.module('ionicApp').controller('AppCtrl', function($firebaseAuth, $cordovaNetwork, $firebaseArray, $rootScope, $scope, $ionicModal, $ionicPopup, $cordovaToast, $cordovaLocalNotification, $ionicSideMenuDelegate, $ionicLoading) {
    $scope.duty = [];
    $scope.mnth = [];
    $scope.search = [];
    var ref = firebase.database().ref();
    var backup = firebase.database().ref().child("backup");
    var backuparray = $firebaseArray(backup);
    var lists = $firebaseArray(ref);
    var auth = $firebaseAuth();
    var checklogin = auth.$getAuth();
    console.log(checklogin);
    if (checklogin) {
        $scope.loggedIn = true;
    } else {
        $scope.loggedIn = false;
    }

    for (var i = 0; i < month.length; i++) {
        $scope.mnth[i] = month[i];
    }
    $scope.showloader = function() {
        $ionicLoading.show({
            template: 'Please wait...',
        });
    };

    $scope.hideloader = function() {
        $ionicLoading.hide();
    };

    document.addEventListener("deviceready", function() {

        var type = $cordovaNetwork.getNetwork();

        var isOnline = $cordovaNetwork.isOnline();

        var isOffline = $cordovaNetwork.isOffline();
        // if(isOnline){
        //   $scope.duties = angular.fromJson(localStorage.getItem("duties"));
        //   for (var i = 0; i < $scope.duties.length; i++) {
        //     lists.$add($scope.duties[i]);
        //   }
        // }
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;
            isOnline = true;
            isOffline = false;
            alert("online");
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            var offlineState = networkState;
            isOffline = true;
            isOnline = false;
            alert("offline");
            auth.$signOut();
            $scope.loggedIn = false;
            $scope.uid = "";
        });

        $scope.duties = [];
        $scope.duties = angular.fromJson(localStorage.getItem("duties"));
        /**
         * [Modal for add,show and edit records]
         * @param  {[type]} modal) {                       $scope.modal [description]
         * @return {[type]}        [description]
         */
        $ionicModal.fromTemplateUrl('add.html', { scope: $scope }).then(function(modal) {
            $scope.modal = modal;
        });

        $ionicModal.fromTemplateUrl('edit.html', { scope: $scope }).then(function(modal) {
            $scope.edit_modal = modal;
        });
        $ionicModal.fromTemplateUrl('show.html', { scope: $scope }).then(function(modal) {
            $scope.show_modal = modal;
        });

        $ionicModal.fromTemplateUrl('login.html', { scope: $scope }).then(function(modal) {
            $scope.show_login_modal = modal;
        });

        $scope.syncWithFirebase = function() {
                if (!isOnline) {
                    alert("Your are not online.");
                    auth.$signOut();
                    $scope.loggedIn = false;
                    $scope.uid = "";
                } else if (!$scope.loggedIn) {
                    alert("You are not loggedIn");
                } else {
                    var child = ref.child($scope.uid);
                    child.$loaded().then(function(arr) {
                        if ($scope.duties.length > arr.length) {
                            for (var i = arr.length; i < $scope.duties.length; i++) {
                                child.$add($scope.duties[i]);
                            }
                        } else if ($scope.duties == null || $scope.duties == undefined || $scope.duties == '') {
                            for (var i = 0; i < arr.length; i++) {
                                // if (arr[i].$id != "backup") {
                                $scope.duties.push(arr[i]);
                                // }
                            }
                        }
                        $scope.hideloader();

                        // console.log('from loop in loaded', arr);
                        // console.log($scope.duties);
                        // for (var i = 0; i < $scope.duties.length; i++) {
                        // if (arr[i].$id != "backup") {
                        //     // $scope.duties.push(arr[i]);
                        //     // console.log("firebase arry",typeof(arr[i]));
                        //     // console.log("scope arry",typeof($scope.duties[i]));
                        //     var t=0;
                        //     if($scope.duties[i].amount === arr[i].amount){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].date === arr[i].date){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].fulldate === arr[i].fulldate){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].month === arr[i].month){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].place === arr[i].place){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].provider === arr[i].provider){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].random === arr[i].random){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].schedule === arr[i].schedule){
                        //         t++;
                        //     }
                        //     if($scope.duties[i].year === arr[i].year){
                        //         t++;
                        //     }
                        //     console.log(t);
                        //     if(t==9){
                        //         console.log('milche');
                        //     }
                        //     else{
                        //         console.log('na milenai');
                        //     }
                        // }
                        // }
                        // localStorage.setItem("duties", angular.toJson($scope.duties));
                        // localStorage.setItem("duties", $scope.duties);
                        // console.log('localstore', angular.fromJson(localStorage.getItem("duties")));
                    }).catch(function(error) {
                        console.log("Error:", error);
                    });
                }

            }
            /*
             * signin function for the auth user
             */
        $scope.signin = function(username, pass) {

            $scope.showloader();
            // console.log(username, pass);
            auth.$signInWithEmailAndPassword(username, pass).then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser);
                $scope.useremail = firebaseUser.email;
                $scope.uid = firebaseUser.uid;
                $scope.loggedIn = true;
                $scope.hideloader();
                $scope.show_login_modal.hide();
            }).catch(function(error) {
                console.error("Authentication failed:", error);
                $scope.hideloader();
            });
            // }
        }

        $scope.logout = function() {
            auth.$signOut();
            $scope.loggedIn = false;
        }
        $scope.update_paid = function(dt) {
            $scope.search.paid = dt;
        }
        $scope.update_date = function(dt) {
            $scope.search.date = dt;
        }
        $scope.update_month = function(dt) {
            $scope.search.month = dt;
        }
        $scope.update_year = function(dt) {
                $scope.search.year = dt;
            }
            /*
             * Order by date
             */
        $scope.orderByDate = function(item) {
            // console.log(item.fulldate);
            // var parts = item.fulldate.split('-');
            // var date = new Date(parseInt(parts[2], parseInt(parts[1]), parseInt(parts[0])));
            var date = new Date(item.fulldate);
            return date;
        };

        /**
         * [add_entry adding new duty list]
         * @param {[type]} event [description]
         */
        $scope.add_modal = function() {
                //event.preventDefault();
                //$scope.dte = '';
                $scope.show_add_true = true;
                $scope.modal.show();
            }
            /*
             *Show login modal
             */

        $scope.show_login_modal_log = function() {
            //event.preventDefault();
            //$scope.dte = '';
            alert(isOnline);
            alert(isOffline);
            if (isOffline) {
                alert("You are offline");
            } else {
                $scope.show_login_modal.show();
            }
        }
        $scope.add_entry = function(event) {
                event.preventDefault();
                if ($scope.duty.place == undefined || $scope.duty.place == "" || $scope.duty.dte == undefined || $scope.duty.dte == "" || $scope.duty.amount == undefined || $scope.duty.amount == "" || $scope.duty.provider == undefined || $scope.duty.provider == "" || $scope.duty.schedule == undefined || $scope.duty.schedule == "") {
                    $cordovaToast.showShortBottom('Please Provide All Information To Add Schedule').then(function(success) {}, function(error) {
                        alert(error);
                    });
                } else {
                    var temp_date = new Date($scope.duty.dte);
                    var paid = $scope.duty.paid ? true : false;
                    var mnth = month[temp_date.getMonth()];
                    var dt = temp_date.getDate();
                    var yr = temp_date.getFullYear();
                    //var rnd = randomString(5);
                    var rnd = Math.floor((Math.random() * 1000) + 1);

                    var data = {
                            place: $scope.duty.place,
                            fulldate: $scope.duty.dte,
                            schedule: $scope.duty.schedule,
                            provider: $scope.duty.provider,
                            amount: $scope.duty.amount,
                            month: mnth,
                            date: dt,
                            year: yr,
                            random: rnd,
                            paid: paid
                        }
                        // console.log(data);
                    $scope.duties.push(data);
                    $cordovaLocalNotification.schedule({
                        id: rnd,
                        title: 'Duty Notification',
                        text: 'You have a duty today in: ' + $scope.duty.place + ' Schedule: ' + $scope.duty.schedule,
                        firstAt: $scope.duty.dte
                    }).then(function(result) {
                        //alert(result);
                    });
                    $scope.duty = [];
                    //$scope.dte = '';
                    localStorage.setItem("duties", angular.toJson($scope.duties));
                    var t = angular.fromJson(localStorage.getItem('duties'));
                    // console.log(t);
                    $cordovaToast.showShortBottom('New Schedule Added').then(function(success) {}, function(error) {
                        alert(error);
                    });
                    $scope.modal.hide();
                }
            }
            /**
             * [delete description]
             * @param  {[int]} dt [ index of the array ]
             * @return {[type]}    [description]
             */
        $scope.delete = function(dt) {
                var dcsn = confirm("Do you want to delete!");
                if (dcsn == true) {
                    for (var i = 0; i < $scope.duties.length; i++) {
                        if ($scope.duties[i].random == dt) {
                            $scope.duties.splice(i, 1);
                            localStorage.setItem("duties", angular.toJson($scope.duties));
                            break;
                        }
                    }
                }
            }
            /**
             * [edit description]
             * @param  {[int]} dt [ index of the array]
             * @return {[type]}    [description]
             */
        $scope.edit = function(dt) {
                for (var i = 0; i < $scope.duties.length; i++) {
                    if ($scope.duties[i].random == dt) {
                        $scope.edit_data = [];
                        $scope.edit_data.place = $scope.duties[i].place;
                        $scope.edit_data.schedule = $scope.duties[i].schedule;
                        $scope.edit_data.provider = $scope.duties[i].provider;
                        $scope.edit_data.paid = $scope.duties[i].paid;
                        $scope.edit_data.amount = $scope.duties[i].amount;
                        $scope.edit_data.dte = new Date($scope.duties[i].fulldate);
                        $scope.edit_data.index = i;
                        $scope.edit_modal.show();
                        // console.log($scope.edit_data);
                        break;
                    }
                }
            }
            /**
             * [Update entry]
             * @param  {[type]} index [description]
             * @return {[type]}       [description]
             */
        $scope.edit_entry = function(index) {
            // console.log($scope.duties[index]);
            if ($scope.edit_data.place == undefined || $scope.edit_data.place == "" || $scope.edit_data.dte == undefined || $scope.edit_data.dte == "" || $scope.edit_data.amount == undefined || $scope.edit_data.amount == "" || $scope.edit_data.provider == undefined || $scope.edit_data.provider == "" || $scope.edit_data.schedule == undefined || $scope.edit_data.schedule == "") {
                $cordovaToast.showShortBottom('Please Provide All Information To Add Schedule').then(function(success) {}, function(error) {
                    alert(error);
                });
            } else {
                $scope.show_add_true = false;
                // console.log($scope.edit_data);
                var temp_date = new Date($scope.edit_data.dte);
                var mnth = month[temp_date.getMonth()];
                var dt = temp_date.getDate();
                var yr = temp_date.getFullYear();
                $scope.duties[index].place = $scope.edit_data.place;
                $scope.duties[index].fulldate = $scope.edit_data.dte;
                $scope.duties[index].amount = $scope.edit_data.amount;
                $scope.duties[index].provider = $scope.edit_data.provider;
                $scope.duties[index].schedule = $scope.edit_data.schedule;
                $scope.duties[index].month = mnth;
                $scope.duties[index].date = dt;
                $scope.duties[index].year = yr;
                $scope.duties[index].paid = $scope.edit_data.paid ? true : false;

                localStorage.setItem("duties", angular.toJson($scope.duties));
                $cordovaLocalNotification.schedule({
                    id: $scope.edit_data.random,
                    title: 'Duty Notification',
                    text: 'You have a duty today in: ' + $scope.edit_data.place + ' Schedule: ' + $scope.edit_data.schedule,
                    firstAt: $scope.edit_data.dte
                }).then(function(result) {
                    //alert(result);
                });
                $scope.edit_data = [];
                var t = angular.fromJson(localStorage.getItem('duties'));
                console.log(t);
                $cordovaToast.showShortBottom('Schedule Edited').then(function(success) {}, function(error) {
                    alert(error);
                });
                $scope.edit_modal.hide();
            }
        }

        /**
         * @param  Secret key of the schedule
         */
        $scope.show = function(dt) {
            $scope.show_add_true = true;
            for (var i = 0; i < $scope.duties.length; i++) {
                if ($scope.duties[i].random == dt) {
                    $scope.entry = [];
                    $scope.entry = $scope.duties[i];
                    $scope.show_modal.show();
                    console.log($scope.entry);
                    break;
                }
            }
        }

        function randomString(len, charSet) {
            charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }

        /**
         * All Modal Hide Actions After Cancel button Press
         */
        $scope.add_modal_hide = function() {
            $scope.modal.hide();
        }

        $scope.edit_modal_hide = function() {
            $scope.edit_data = [];
            $scope.edit_modal.hide();
        }

        $scope.show_modal_hide = function() {
            $scope.show_modal.hide();
        }

        /**
         * On click event to the schedule notification
         */
        $rootScope.$on('$cordovaLocalNotification:click', function(event, notification, state) {
            // alert(notification.id);
            // var alertPopup = $ionicPopup.alert({
            //     title: 'Duty Information',
            //     template: notification.text
            // });

            // alertPopup.then(function(res) {
            //     console.log('Thank you for not eating my delicious ice cream cone');
            // });
            $scope.show(notification.id);
        });

    }, false);
    // $ionicLoading.show({
    //     template: 'Loading...',
    //     duration: 3000
    // });
    // console.log('local',localStorage.getItem("duties"));
    /**
     * [Storing data to variable for use at first initialization]
     * @param  {[type]} localStorage.getItem("duties") [description]
     * @return {[type]}                                [description]
     */
    // if (localStorage.getItem("duties") == null || localStorage.getItem("duties") == '' || localStorage.getItem("duties") == undefined) {
    //     $scope.duties = [];
    //     lists.$loaded().then(function(arr) {
    //         // console.log('from loop in loaded', arr);
    //         for (var i = 0; i < arr.length; i++) {
    //             if (arr[i].$id != "backup") {
    //                 $scope.duties.push(arr[i]);
    //             }
    //         }
    //         localStorage.setItem("duties", angular.toJson($scope.duties));
    //         // localStorage.setItem("duties", $scope.duties);
    //         console.log('localstore', angular.fromJson(localStorage.getItem("duties")));
    //     }).catch(function(error) {
    //         console.log("Error:", error);
    //     });
    //     setTimeout(function() {
    //         backuparray.$add($scope.duties);
    //     }, 3000);
    //     // $scope.duties = [];

    // } else {
    // $ionicLoading.show({
    //   template: 'Loading...',
    //   duration: 3000
    // }).then(function(){
    //   console.log("The loading indicator is now displayed");
    // });
    // $scope.showloader();
    // $scope.duties = [];
    // $scope.duties = angular.fromJson(localStorage.getItem("duties"));
    // var obj={
    //     amount:'210',
    //     date:'sfsdfd',
    //     month:'10',
    //     fulldate:'44444444444444',
    //     paid:false,
    //     place:'sdfdsfd',
    //     provider:'sdfds',
    //     random:'987',
    //     schedule:'evening',
    //     year:'2018'
    // }
    // $scope.duties.push(obj);
    // $scope.duties.push(obj);
    // $scope.duties.push(obj);
    // $scope.duties.push(obj);
    // console.log($scope.duties.length);
    // $scope.duties = localStorage.getItem("duties");
    // localStorage.setItem("duties", $scope.duties);
    // localStorage.setItem("duties", $scope.duties);

    // for (var i = 0; i < $scope.duties.length; i++) {
    //   lists.$add($scope.duties[i]);
    // }
    // }



});
