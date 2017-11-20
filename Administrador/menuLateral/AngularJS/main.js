var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

//Ruteador, (relaciona direccion con html y controlador)
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'Paginas/adminClientes.html',
        controller: 'adminClientesController'
    })
        .when("/adminEmpleados", {
            templateUrl: "Paginas/adminEmpleados.html",
            controller: "adminEmpleadosController"
            //authenticated: true
        })
        //redirecciona a la vista de administracion de productos
        .when("/adminProductos", {
            templateUrl: "Paginas/adminProductos.html",
            controller: "adminProductosController"
            //authenticated: true
        })

        //redirecciona a la vista de administracion de sucursales
        .when("/adminSucursales", {
            templateUrl: "Paginas/adminSucursales.html",
            controller: "adminSucursalesController"
            //authenticated: true
        })
        //redirecciona a la vista de administracion de proveedores
        .when("/adminProveedores", {
            templateUrl: "Paginas/adminProveedores.html",
            controller: "adminProveedoresController"
            //authenticated: true
        })

        //redirecciona a la vista de administracion de reportes
        .when("/adminReportes", {
            templateUrl: "Paginas/adminReportes.html",
            controller: "adminReportesController"
            //authenticated: true
        })



});



app.controller('adminClientesController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

app.controller('adminEmpleadosController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

app.controller('adminProductosController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

app.controller('adminSucursalesController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

app.controller('adminProveedoresController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

app.controller('adminReportesController', function ($scope) {
    $scope.urlAdmin = "Paginas/menuLateral.html";
});

