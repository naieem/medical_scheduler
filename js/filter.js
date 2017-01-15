/**
 * [Custom filter for calculating total earings]
 * @param  {[object]} 
 * @return {[integer]}   [Total earnings]
 */
angular.module('ionicApp').filter('sumOfValue', function() {
    return function(data, key) {
        
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function(v, k) { 
            sum = sum + parseInt(v[key]);
        });
        return sum;
    }
});

angular.module('ionicApp').filter('sumOfpaidValue', function() {
    return function(data, key) {        
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var paid = 0;
        angular.forEach(data, function(v, k) {
            if(v['paid']){
                paid = paid + parseInt(v[key]);
            }
        });
        return paid;
    }
});

angular.module('ionicApp').filter('sumOfunpaidValue', function() {
    return function(data, key) {
        
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var unpaid = 0;
        angular.forEach(data, function(v, k) {
            if(!v['paid']){
                unpaid = unpaid + parseInt(v[key]);
            }
        });
        return unpaid;
    }
});
