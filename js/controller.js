/**
 * [App Controller]
 * @param  {[type]} $scope           [description]
 * @param  {[type]} $ionicModal      [description]
 * @param  {Array}  ionicDatePicker
 */
angular.module('ionicApp').controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicPopup, $cordovaToast, $cordovaLocalNotification, $ionicSideMenuDelegate) {
    $scope.duty = [];
    $scope.mnth = [];
    for (var i = 0; i < month.length; i++) {
        $scope.mnth[i] = month[i];
    }
    /**
     * [Storing data to variable for use at first initialization]
     * @param  {[type]} localStorage.getItem("duties") [description]
     * @return {[type]}                                [description]
     */
    if (localStorage.getItem("duties") == null) {
        $scope.duties = [];
        localStorage.setItem("duties", angular.toJson($scope.duties));

    } else {
        $scope.duties = angular.fromJson(localStorage.getItem("duties"));
        console.log($scope.duties);
    }
    /**
     * [Modal for add,show and edit records]
     * @param  {[type]} modal) {                       $scope.modal [description]
     * @return {[type]}        [description]
     */
    $ionicModal.fromTemplateUrl('add.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('edit.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.edit_modal = modal;
    });
    $ionicModal.fromTemplateUrl('show.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.show_modal = modal;
    });

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
    $scope.add_entry = function(event) {
            event.preventDefault();
            if ($scope.duty.place == undefined || $scope.duty.place == "" || $scope.duty.dte == undefined || $scope.duty.dte == "" || $scope.duty.amount == undefined || $scope.duty.amount == "" || $scope.duty.provider == undefined || $scope.duty.provider == "" || $scope.duty.schedule == undefined || $scope.duty.schedule == "") {
                // $cordovaToast.showShortBottom('Please Provide All Information To Add Schedule')
                //     .then(
                //         function(success) {},
                //         function(error) {
                //             alert(error);
                //         }
                //     );
            }
            else {
                $scope.show_add_true = false;
                var temp_date = new Date($scope.duty.dte);
                var paid = $scope.duty.paid;
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
                    paid:paid
                }
                console.log(data);
                $scope.duties.push(data);
                // $cordovaLocalNotification.schedule({
                //     id: rnd,
                //     title: 'Duty Notification',
                //     text: 'You have a duty today in: ' + $scope.duty.place + ' Schedule: ' + $scope.duty.schedule,
                //     firstAt: $scope.duty.dte
                // }).then(function(result) {
                //     //alert(result);
                // });
                $scope.duty = [];
                //$scope.dte = '';
                localStorage.setItem("duties", angular.toJson($scope.duties));
                var t = angular.fromJson(localStorage.getItem('duties'));
                console.log(t);
                // $cordovaToast.showShortBottom('New Schedule Added')
                //     .then(
                //         function(success) {},
                //         function(error) {
                //             alert(error);
                //         }
                //     );
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
            $scope.show_add_true = true;
            for (var i = 0; i < $scope.duties.length; i++) {
                if ($scope.duties[i].random == dt) {
                    $scope.edit_data = [];
                    $scope.edit_data = $scope.duties[i];
                    $scope.edit_data.dte = new Date($scope.duties[i].fulldate);
                    $scope.edit_data.index = i;
                    $scope.edit_modal.show();
                    console.log($scope.edit_data);
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
        console.log($scope.duties[index]);
        if ($scope.edit_data.place == undefined || $scope.edit_data.place == "" || $scope.edit_data.dte == undefined || $scope.edit_data.dte == "" || $scope.edit_data.amount == undefined || $scope.edit_data.amount == "" || $scope.edit_data.provider == undefined || $scope.edit_data.provider == "" || $scope.edit_data.schedule == undefined || $scope.edit_data.schedule == "") {
            // $cordovaToast.showShortBottom('Please Provide All Information To Add Schedule')
            //     .then(
            //         function(success) {},
            //         function(error) {
            //             alert(error);
            //         }
            //     );
        } else {
        $scope.show_add_true = false;
        console.log($scope.edit_data);
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
        $scope.duties[index].paid =$scope.edit_data.paid;

        localStorage.setItem("duties", angular.toJson($scope.duties));
        // $cordovaLocalNotification.schedule({
        //     id: $scope.edit_data.random,
        //     title: 'Duty Notification',
        //     text: 'You have a duty today in: ' + $scope.edit_data.place + ' Schedule: ' + $scope.edit_data.schedule,
        //     firstAt: $scope.edit_data.dte
        // }).then(function(result) {
        //     //alert(result);
        // });
        $scope.edit_data = [];
        var t = angular.fromJson(localStorage.getItem('duties'));
        console.log(t);
        // $cordovaToast.showShortBottom('Schedule Edited')
        //     .then(
        //         function(success) {},
        //         function(error) {
        //             alert(error);
        //         }
        //     );
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
        //$scope.show_add_true = false;
        $scope.modal.hide();
    }

    $scope.edit_modal_hide = function() {
        //$scope.show_add_true = false;
        $scope.edit_modal.hide();
    }

    $scope.show_modal_hide = function() {
        //$scope.show_add_true = false;
        $scope.show_modal.hide();
    }


    /**
     * On click event to the schedule notification
     */
    $rootScope.$on('$cordovaLocalNotification:click',
        function(event, notification, state) {
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

});
