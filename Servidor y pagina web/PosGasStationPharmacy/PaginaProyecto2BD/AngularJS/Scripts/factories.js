app.factory('authFact', ["$cookieStore", function ($cookieStore) {
    var authFact = {};
    /*get y set de Cookie empleado*/
    authFact.setEmpleado = function (empleado) {
        $cookieStore.put('empleado', empleado);
    };
    authFact.getEmpleado = function () {
        authFact.authComp = $cookieStore.get('empleado');
        return authFact.authComp;
    };

    /*get y set de Cookie compañia*/
    authFact.setCompania = function (compania) {
        $cookieStore.put('compania', compania);
    };
    authFact.getCompania = function () {
        authFact.authComp = $cookieStore.get('compania');
        return authFact.authComp;
    };

    /*get y set de Cookie sucursal*/
    authFact.setSucursal = function (sucursal) {
        $cookieStore.put('sucursal', sucursal);
    };
    authFact.getSucursal = function () {
        authFact.authComp = $cookieStore.get('sucursal');
        return authFact.authComp;
    };

    /*get y set de Cookie caja*/
    authFact.setCaja = function (caja) {
        $cookieStore.put('caja', caja);
    };
    authFact.getCaja = function () {
        authFact.authComp = $cookieStore.get('caja');
        return authFact.authComp;
    };

    /*get y set de Cookie fecha inicial*/
    authFact.setFechaInicial = function (fechaInicial) {
        $cookieStore.put('fechaInicial', fechaInicial);
    };
    authFact.getFechaInicial = function () {
        authFact.authComp = $cookieStore.get('fechaInicial');
        return authFact.authComp;
    };

    /*get y set de Cookie hora inicial*/
    authFact.setHoraInicial = function (horaInicial) {
        $cookieStore.put('horaInicial', horaInicial);
    };
    authFact.getHoraInicial = function () {
        authFact.authComp = $cookieStore.get('horaInicial');
        return authFact.authComp;
    };

    /*get y set de Cookie saldo inicial*/
    authFact.setSaldoInicial = function (saldoInicial) {
        $cookieStore.put('saldoInicial', saldoInicial);
    };
    authFact.getSaldoInicial  = function () {
        authFact.authComp = $cookieStore.get('saldoInicial');
        return authFact.authComp;
    };

    /*get y set de Cookie saldo actual*/
    authFact.setSaldoActual = function (saldoActual) {
        $cookieStore.put('saldoActual', saldoActual);
    };
    authFact.getSaldoActual = function () {
        authFact.authComp = $cookieStore.get('saldoActual');
        return authFact.authComp;
    };

    /*get y set de Cookie ultima venta facturada*/
    authFact.setFacturaActual = function (facturaActual) {
        $cookieStore.put('facturaActual', facturaActual);
    };
    authFact.getFacturaActual = function () {
        authFact.authComp = $cookieStore.get('facturaActual');
        return authFact.authComp;
    };

    return authFact;
}]);