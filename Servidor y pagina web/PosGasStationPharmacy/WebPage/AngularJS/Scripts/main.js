var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

//Ruteador, (relaciona direccion con html y controlador)
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'AngularJS/Vistas/adminProductos.html',
        controller: 'adminClientesController'
    })
        .when("/adminEmpleados", {
            templateUrl: "AngularJS/Vistas/adminEmpleados.html",
            controller: "adminEmpleadosController"
            //authenticated: true
        })
        //redirecciona a la vista de administracion de productos
        .when("/adminProductos", {
            templateUrl: "AngularJS/Vistas/adminProductos.html",
            controller: "adminProductosController"
            //authenticated: true
        })

        //redirecciona a la vista de administracion de sucursales
        .when("/adminSucursales", {
            templateUrl: "AngularJS/Vistas/adminSucursales.html",
            controller: "adminSucursalesController"
            //authenticated: true
        })
        //redirecciona a la vista de administracion de proveedores
        .when("/adminProveedores", {
            templateUrl: "AngularJS/Vistas/adminProveedores.html",
            controller: "adminProveedoresController"
            //authenticated: true
        })

        //redirecciona a la vista de administracion de reportes
        .when("/adminReportes", {
            templateUrl: "AngularJS/Vistas/adminReportes.html",
            controller: "adminReportesController"
            //authenticated: true
        })



});



app.controller('adminClientesController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.abrirMenu = function () {

        console.log(2255);
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
    };
});

app.controller('adminEmpleadosController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
});

app.controller('adminProductosController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
});

app.controller('adminSucursalesController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
});

app.controller('adminProveedoresController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
});

app.controller('adminReportesController', function ($scope) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
});

