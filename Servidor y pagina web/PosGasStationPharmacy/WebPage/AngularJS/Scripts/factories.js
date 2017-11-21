app.factory('authFact', ["$cookieStore", function ($cookieStore) {
    var authFact = {};
    authFact.setAccessToken = function (accessToken) {
        $cookieStore.put('accessToken', accessToken);
    };

    authFact.getAccessToken = function () {
        authFact.authToken = $cookieStore.get('accessToken');
        return authFact.authToken;
    };

    authFact.setCompania = function (compania) {
        $cookieStore.put('compania', compania);
    };

    authFact.getCompania = function () {
        authFact.authComp = $cookieStore.get('compania');
        return authFact.authComp;
    };

    authFact.setSucursal = function (sucursal) {
        $cookieStore.put('sucursal', sucursal);
    };

    authFact.getSucursal = function () {
        authFact.authComp = $cookieStore.get('sucursal');
        return authFact.authComp;
    };

    return authFact;
}]);