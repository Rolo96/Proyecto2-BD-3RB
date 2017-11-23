//Servicio para realizar peticiones http 
app.service('ServicioHTTP', function ($http) {
    var urlGet = '';
    this.post = function (apiRoute, Model) {
        var request = $http({
            method: "post",
            url: apiRoute,
            data: Model
        });
        return request;
    };

    this.put = function (apiRoute, Model) {
        var request = $http({
            method: "put",
            url: apiRoute,
            data: Model
        });
        return request;
    };
    this.delete = function (apiRoute) {
        var request = $http({
            method: "delete",
            url: apiRoute
        });
        return request;
    };
    this.getAll = function (apiRoute, token) {
        urlGet = apiRoute;
        return $http.get(urlGet, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
    };

    this.postLog = function (apiRoute, Model) {
        var request = $http({
            method: "post",
            url: apiRoute,
            data: Model,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    };

    this.getLogin = function (apiRoute, cedula, contrasena) {
        urlGet = apiRoute + '/' + cedula + '/' + contrasena;
        return $http.get(urlGet);
    };

    this.postToken = function (apiRoute, Model, token) {
        var request = $http({
            method: "post",
            url: apiRoute,
            data: Model,
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return request;
    };
});
