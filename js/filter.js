/**
 * [Custom filter for calculating total earings]
 * @param  {[object]} 
 * @return {[integer]}   [Total earnings]
 */
angular.module('ionicApp').filter('sumOfValue', function() {
    return function(data, key) {
        //debugger;
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        //console.log(data[0]['amount']);
        angular.forEach(data, function(v, k) {
            sum = sum + parseInt(v[key]);
        });
        // for (var i = 0; i < data.length; i++) {
        //     sum = sum + parseInt(data[i][key]);
        // }
        return sum;
    }
})
