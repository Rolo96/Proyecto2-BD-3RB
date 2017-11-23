var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

//Ruteador, (relaciona direccion con html y controlador)
app.config(function ($routeProvider) {
    $routeProvider.when('/', { //pagina principal de la pagina
        templateUrl: 'AngularJS/Vistas/LoginEmpleado.html',
        controller: 'loginController'
    })
        /*redireccion para la vista de login*/
        .when("/login", {
            templateUrl: "AngularJS/Vistas/LoginEmpleado.html",
            controller: "loginController"
        })

        /*redireccion para la administracion de proveedores*/
        .when("/adminProveedores", {
            templateUrl: "AngularJS/Vistas/adminProveedores.html",
            controller: "adminProveedoresController"
        })

        /*redireccion para la administracion de sucursales*/
        .when("/adminSucursales", {
            templateUrl: "AngularJS/Vistas/adminSucursales.html",
            controller: "adminSucursalesController"
        })

        /*redireccion para la administracion de los empleados*/
        .when("/adminEmpleados", {
            templateUrl: "AngularJS/Vistas/adminEmpleados.html",
            controller: "adminEmpleadosController"
        })

        /*redireccion para la administracion de los clientes*/
        .when("/adminClientes", {
            templateUrl: "AngularJS/Vistas/adminClientes.html",
            controller: "adminClientesController"
        })

        /*redireccion para la vista del cajero*/
        .when("/VistaCajero", {
            templateUrl: "AngularJS/Vistas/VistaCajero.html",
            controller: "cajeroController"
        })

        /*redireccion para la vista de abrir una caja*/
        .when("/abrirCaja", {
            templateUrl: "AngularJS/Vistas/abrirCaja.html",
            controller: "cajeroController"
        })

        /*redireccion para la administracion de productos*/
        .when("/adminMedicamentos", {
            templateUrl: "AngularJS/Vistas/adminMedicamentos.html",
            controller: "adminMedicamentosController"
        });

});

app.run(["$rootScope", "$location", "authFact", function ($rootScope,
    $location, authFact) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.$$route.authenticated) {
            var userAuth = authFact.getAccessToken();
            if (!userAuth) {
                $location.path('/');
            }
        }
    });
}]);