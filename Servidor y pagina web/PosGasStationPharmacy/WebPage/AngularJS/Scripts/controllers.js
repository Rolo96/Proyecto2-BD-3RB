
var ip = 'http://192.168.100.2';

var companiaActual;
var sucursalActual;

app.controller('loginController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {

    $scope.login = function () {
        var empleado = {
            opcion: $scope.loginPassword,
            opcion2: $scope.loginCedula
        };
        console.log(empleado);
        var apiRoute = ip + '/WebApi/logearEmpleado';
        var respuesta = ServicioHTTP.post(apiRoute, empleado);
        respuesta.then(function (response) {
            sucursalActual = response.data.sucursal;
            companiaActual = response.data.compania;
            if (response.data.rol === "Administrador") {
                $location.path("/adminClientes");
            }

            else $location.path("/abrirCaja");
        },
            function (error) {
                alert("Usuario y/o contraseña incorrecto");
            }
        );
    };

  /*  $scope.loginCliente = function () {
        var cliente =
            "userName=" + encodeURIComponent($scope.loginCedula) +
            "&password=" + encodeURIComponent($scope.loginPassword) +
            "&grant_type=password" +
            "&client_id=cliente"
            ;

        var apiRoute = ip + '/WebApi/token';
        var respuesta = ServicioHTTP.postLog(apiRoute, cliente);
        respuesta.then(function (response) {

            var accessToken = response.data.access_token;
            authFact.setAccessToken(accessToken);
            //$location.path("/clientesPedidos");
        },
            function (error) {
                authFact.setAccessToken("");
                alert("Usuario y/o contraseña incorrecto");
            }
        );
    };*/
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la vista del cajero*/
app.controller('cajeroController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    var horaInicioCaja;
    var fechaInicioCaja;
    var cajaActualAbierta = 11;
    var saldoInicialCaja;
    var saldoFinalCaja;
    $scope.ventaFacturada = [];

    /*funcion para abrir una nueva caja*/
    $scope.abrirCaja = function () {
        var fechaActual = new Date();
        var fecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate());
        var hora = fechaActual.getHours() + ":" + fechaActual.getMinutes();
        var caja = {
            caja: $scope.numeroCaja,
            saldo: $scope.saldoInicial,
            fecha: fecha,   
            hora: hora
        };
        console.log(caja);
        $location.path("/VistaCajero");
        /*var apiRoute = ip + '/WebApi/abrirCaja';
        var respuesta = ServicioHTTP.postToken(apiRoute, caja, authFact.getAccessToken());
        respuesta.then(function (response) {
            cajaActualAbierta = $scope.numeroCaja;
            saldoInicialCaja = $scope.saldoInicial;
            fechaInicioCaja = fecha;
            horaInicioCaja = hora;
        },
            function (error) {
                alert("Error. Puede que la caja no exista");
            });*/
    };

    /*Funcion para cerrar caja y mostrar el resumen*/
    $scope.resumenCaja = function () {
        var apiRoute = ip + '/WebApi/cerrarCaja';
        var objeto = {
            caja: cajaActualAbierta,
            fecha: fechaInicioCaja,
            hora: horaInicioCaja,
            saldo: saldoFinalCaja
        };
        var respuesta = ServicioHTTP.postToken(apiRoute, objeto, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.resumen = response.data;
            $scope.plataInicio = saldoInicialCaja;
            $scope.plataFinal = saldoFinalCaja;
        },
            function (error) {
                alert("Error obteniendo el resumen de la caja");
            });
    };

    /*Para obtener todos los productos de la farmacia*/
    $scope.consultarMedicamentos = function () {
        $scope.productos = [{ medicamento: "agua", precio: 200, prescripcion: "si" }, { medicamento: "miel", precio: 500, prescripcion: "no" }, { medicamento: "sal", precio: 100, prescripcion: "si" }];
        /*var apiRoute = ip + '/WebApi/consultarMedicamentos';
        var sucursal = { sucursal: sucursalActual };
        var respuesta = ServicioHTTP.getAll(apiRoute, sucursal, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.medicamentos = response.data;
            console.log($scope.medicamentos)
        },
            function (error) {
                alert("Error obteniendo los medicamentos");
            });*/
    };

    /*Para obtener los pedidos para entregar*/
    $scope.obtenerPedidos = function () {
        $scope.pedidos = [
            { cliente: 654, numero: 5648, productos: [{ medicamento: 'v', cantidad: 12, precio: 1200, prescripcion: 'No' }, { medicamento: 'y', cantidad: 4, precio: 1500, prescripcion: 'No' }] },
            { cliente: 1236987, numero: 1205, productos: [{ medicamento: 'rr', cantidad: 2, precio: 200, prescripcion: 'No' }, { medicamento: 'll', cantidad: 4, precio: 365, prescripcion: 'No' }] }
        ];
        /*var apiRoute = ip + 'WebApi/consultarPedidos';
        var respuesta = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.pedidos = response.data;
        },
            function (error) {
                alert("Error obteniendo los pedidos");
            });*/
    };

    /*para salvar una venta facturada*/
    $scope.salvarFactura = function (esPedido) {
        var venta;
        var totalFactura = 0;
        var tiquete;

        if (esPedido === 'n') {
            for (var index = 0; index < $scope.arrayEnvio.length; index++) {
                totalFactura += $scope.arrayEnvio[index].cantidad * $scope.arrayEnvio[index].precio;
            }
            venta = $scope.ventaFacturada[0];
            $scope.tiquete = {
                cliente: venta.cliente,
                cajero: 'El',
                factura: 10,
                sucursal: 'La Mejor',
                caja: cajaActualAbierta,
                fecha: venta.fecha,
                productos: venta.productos,
                total: totalFactura
            };
        }
        else {
            for (var index = 0; index < $scope.pedidos.length; index++) {
                if ($scope.pedidos[index].numero === esPedido) {
                    venta = $scope.pedidos[index];
                    break;
                }
            }
            for (var index = 0; index < venta.productos.length; index++) {
                totalFactura += venta.productos[index].cantidad * venta.productos[index].precio;
            }
            var date = new Date();
            $scope.tiquete = {
                cliente: venta.cliente,
                cajero: 'El',
                factura: 10,
                sucursal: 'La Mejor',
                caja: cajaActualAbierta,
                fecha: date.getFullYear() + "-" + (date.getDate() + 1) + "-" + (date.getMonth() + 1) + " " + date.getHours() + ":" + date.getMinutes(),
                productos: venta.productos,
                total: totalFactura
            };
        }
        tiquete = angular.copy($scope.tiquete);
        tiquete.productos = $scope.convertirToString(tiquete.productos);
        $scope.ventaFacturada = [];
        $('#modalTiquete').modal('show');
        console.log(tiquete);
        console.log($scope.tiquete);
        saldoFinalCaja += totalFactura;
        /*var apiRoute = ip + '/WebApi/salvarFactura';
        var respuesta = ServicioHTTP.postToken(apiRoute, tiquete, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.ventaFacturada = [];
            $scope.tiquete.factura = response.data.factura;
            $scope.obtenerPedidos();
            $('#modalTiquete').modal('show');
            saldoFinalCaja += totalFactura;
        },
            function (error) {
                alert("Error al salvar la venta");
            });*/
    };

    /*para facturar una venta realizada*/
    $scope.facturarVenta = function () {
        var fechaActual = new Date();

        if ($scope.ventaFacturada.length >= 1) {
            alert('Debe salvar la ultima venta antes de realizar otra');
            return;
        }
        $scope.obtenerSeleccionados();
        if ($scope.arrayEnvio.length === 0) {
            alert("Debe incluir al menos un producto en la factura");
            return;
        }

        $scope.ventaFacturada = [{
            id: 125,
            cliente: $scope.cedulaCliente,
            codigo: $scope.codigoVenta,
            productos: $scope.arrayEnvio,
            fecha: fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate()) + " " + fechaActual.getHours() + ":" + fechaActual.getMinutes()
        }];

        $scope.cedulaCliente = null;//poner en blanco las cajas de imput
        $scope.codigoVenta = null;//poner en blanco las cajas de imput
        for (var index = 0; index < $scope.arrayEnvio.length; index++) {//poner en blanco las cajas de imput
            angular.element('[ng-model="cantidad"]')[$scope.arrayEnvio[index].pos].value = null;
        }

        console.log($scope.ventaFacturada);
        //console.log($scope.arrayEnvio);
    };

    /*Funcion para convertir el arreglo de productos a string*/
    $scope.convertirToString = function (arreglo) {
        resultado = '[{\"Medicamento\":' + '\'' + arreglo[0].medicamento + '\', \"Cantidad\":' + arreglo[0].cantidad + '}';
        for (var index = 1; index < arreglo.length; index++) {
            resultado += ', {\"Medicamento\":' + '\'' + arreglo[index].nombre + '\', \"Cantidad\":' + arreglo[index].cantidad  + '}';
        }
        return resultado + ']';
    };


    /*Funcion para obetener los productos para incluir en la venta*/
    $scope.obtenerSeleccionados = function () {
        var numProductos = $.map($('input[name="posiCajaCantidad"]'), function (c) { return c.value; });
        var pos = 0;
        $scope.arrayEnvio = [];
        for (var index = 0; index < numProductos.length; index++) {
            if (numProductos[index] !== "" && numProductos[index] !== '0') {
                var obj = {
                    medicamento: $scope.productos[index].medicamento,
                    cantidad: parseInt(numProductos[index]),
                    prescripcion: $scope.productos[index].prescripcion,
                    pos: index,
                    precio: $scope.productos[index].precio,
                    receta: 0
                };
                $scope.arrayEnvio[pos] = obj;
                pos++;
            }
        }
    };

    /*Verifica si la cantidad solicitada de un producto es validada*/
    $scope.verificarCantidad = function (producto, $event) {
        var apiRoute = ip + '/WebApi/verificarCantidad';
        var cantidad = event.target;
        if (cantidad.value <= 0)
            return;
        var objeto = {
            producto: producto,
            sucursal: cantidad
        };
        //var respuesta = ServicioHTTP.postToken(apiRoute, objeto, authFact.getAccessToken());
        var respuesta = [{ cantidadActual: 15, cantidadMinima: 5 }];
        var enStock = respuesta[0].cantidadActual;
        if (enStock < cantidad.value) {
            cantidad.value = null;
            alert('No se cuenta con la cantidad solicitada de ' + producto);
        }
        else if ((enStock - cantidad.value) <= respuesta[0].cantidadMinima)
            alert('Advertencia: Queda menos de la cantidad mínima de ' + producto + ' en bodega.');
        /*var respuesta = ServicioHTTP.postToken(apiRoute, objeto, authFact.authFact.getAccessToken());
        respuesta.then(function (response) {
            var enStock = respuesta[0].cantidad;
            if (enStock < cantidad.value) {
                cantidad.value = null;
                alert('No se cuenta con la cantidad solicitada de ' + producto);
            }
            else if ((enStock - cantidad.value) <= respuesta[0].cantidadMinima)
                alert('Advertencia: Queda menos de la cantidad mínima de ' + producto + ' en bodega.');
        },
            function (error) {
                alert("Error solicitando la cantidad actual del producto");
            });*/


    };

    /*elimina un producto que ya esta en un factura*/
    $scope.eliminarProductoFacturado = function () {
        if ($scope.ventaFacturada[0].productos.length <= 1) {
            alert('No puede dejar la factura sin productos');
            return;
        }
        var supervisor = {
            cedula: $scope.cedulaSupervisor,
            contrasena: $scope.contrasenaSupervisor
        };
        console.log(supervisor);
        var arregloProductos = [];
        var posicion = 0;
        for (var index = 0; index < $scope.ventaFacturada[0].productos.length; index++) {
            if ($scope.ventaFacturada[0].productos[index].medicamento !== $scope.BorrarProdu) {
                arregloProductos[posicion] = $scope.ventaFacturada[0].productos[index];
                posicion++;
            }
        }
        $scope.ventaFacturada[0].productos = arregloProductos;
        document.getElementById('botoncerrarSupervisor').click();
        console.log($scope.ventaFacturada[0]);
        $scope.contrasenaSupervisor = null;
        /*var apiRoute = ip + 'WebApi/comprobarSupervisor';
        var respuesta = ServicioHTTP.postToken(apiRoute, supervisor, authFact.getAccessToken())
        respuesta.then(function (response) {
            var arregloProductos = [];
            var posicion = 0;
            for (var index = 0; index < $scope.ventaFacturada[0].productos.length; index++) {
                if ($scope.ventaFacturada[0].productos[index].medicamento !== $scope.BorrarProdu) {
                    arregloProductos[posicion] = $scope.ventaFacturada[0].productos[index];
                    posicion++;
                }
            }
            $scope.ventaFacturada[0].productos = arregloProductos;
            document.getElementById('botoncerrarSupervisor').click();
            $scope.contrasenaSupervisor = null;
        },
            function (error) {
                alert("Error comprobando supervisor.");
            });*/

    };

    /*para vereficar si el ciente que se ingreso en la factura existe*/
    $scope.verificarCliente = function () {
        if ($scope.cedulaCliente === null || $scope.cedulaCliente === undefined || $scope.cedulaCliente === "")
            return;
        var cliente = { cliente: $scope.cedulaCliente };
        var apiRoute = ip + 'WebApi/verficarCliente';
        /*var respuesta = ServicioHTTP.postToken(apiRoute, cliente, authFact.getAccessToken());
        console.log(cliente);
        respuesta.then(function (response) {
        },
            function (error) { 
                $scope.cedulaCliente = null; 
                if (confirm("El cliente no existe. Desea registrarlo ahora mismo?")) {
                    $('#crearClienteModal').modal('show');
                }
            });*/
    };

    /*crear cliente nuevo*/
    $scope.crearCliente = function () {
        var cliente = {
            cedula: $scope.cedulaCrearCliente,
            nombre1: $scope.nombre1CrearCliente,
            nombre2: $scope.nombre2CrearCliente,
            apellido1: $scope.apellido1CrearCliente,
            apellido2: $scope.apellido2CrearCliente,
            contrasena: $scope.passwordCrearCliente,
            provincia: $scope.provinciaCrearCliente,
            ciudad: $scope.ciudadCrearCliente,
            senas: $scope.senasCrearCliente,
            padecimientos: $scope.obtenerPadecimientos(),
            telefono: $scope.obtenerTelefonos(),
            fechaNacimiento: $scope.fechaNacimientoCrearCliente
        };
        console.log(cliente);
        /*var apiRoute = ip + 'WebApi/crearCliente';
        var respuesta = ServicioHTTP.postToken(apiRoute, cliente, authFact.getAccessToken());
        respuesta.then(function (response) {
            alert('Cliente creado');
        },
            function (error) {
                alert("Error al crear el cliente");
            });*/
    };

    /*funcion para obtener los padecimientos del cliente*/
    $scope.obtenerPadecimientos = function () {
        var padecimientos = $.map($('input[name="padecimientoCrearCliente"]'), function (c) { return c.value; });
        var fechaPade = $.map($('input[name="fechaPadeCrearCliente"]'), function (c) { return c.value; });
        var resultado = [];
        pos = 0;
        for (var index = 0; index < fechaPade.length; index++) {
            if (fechaPade[index] !== "" && padecimientos[index] !== "") {
                var objeto = { padecimiento: padecimientos[index], ano: fechaPade[index] };
                resultado[pos] = objeto;
                pos++;
            }
        }
        return resultado;
    };

    $scope.obtenerTelefonos = function () {
        var telefonos = $.map($('input[name="telefonoCrearCliente"]'), function (c) { return c.value; });
        var resultado = [];
        pos = 0;
        for (var index = 0; index < telefonos.length; index++) {
            if (telefonos[index] !== "") {
                resultado[pos] = telefonos[index];
                pos++;
            }
        }
        return resultado;
    };

    /*funcion que establece cual es el producto a borrar de la factura*/
    $scope.productoBorrar = function (producto) {
        $scope.BorrarProdu = producto;
    };

    var cantidadPade = 0;//variable para la cantidad de inputs dinamicos de padecimiento
    /*funcion para poner inputs dinamicos de los padecimientos*/
    $scope.agregarEspacioPade = function () {
        if (cantidadPade >= 10)
            return;
        cantidadPade++;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    /*funcion para quitar cantidad de inputs dinamicos de padecimientos*/
    $scope.quitarEspacioPade = function () {
        if (cantidadPade <= 0)
            return;
        cantidadPade--;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    var cantidadTels = 0;//variable para la cantidad de inputs dinamicos de telefonos
    /*funcion para poner inputs dinamicos de los telefonos*/
    $scope.agregarEspacioTels = function () {
        if (cantidadTels >= 10)
            return;
        cantidadTels++;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /*funcion para quitar cantidad de inputs dinamicos de telefonos*/
    $scope.quitarEspacioTels = function () {
        if (cantidadTels <= 0)
            return;
        cantidadTels--;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    //$scope.obtenerVentasFacturadas();
    $scope.consultarMedicamentos();
    //$scope.obtenerPedidos();
    //setTimeout(() => { $scope.obtenerFacturasSalvadas(); }, 1000);
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de medicamentos*/
app.controller('adminMedicamentosController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";

    /*Para obtener todos los medicamentos de la farmacia*/
    $scope.consultarMedicamentos = function () {
        //$scope.productos = [{ medicamento: "agua", precio: 200, prescripcion: "si" }, { medicamento: "miel", precio: 500, prescripcion: "no" }, { medicamento: "sal", precio: 100, prescripcion: "si" }];
        var apiRoute = ip + '/WebApi/consultarMedicamentos';
        var respuesta = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.medicamentos = response.data;
            $scope.interpretarPrescripcionArray($scope.medicamentos);
            console.log(response.data);
        },
            function (error) {
                alert("Error obteniendo los medicamentos");
            });
    };

    /*Para obtener los proveedores disponibles para los prodcutos*/
    $scope.consultarProveedores = function () {
        //$scope.proveedores = [{ nombre: 'Aja' }, { nombre: 'LL' }];
        var apiRoute = ip + '/WebApi/consultarProveedores';
        var respuesta = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.proveedores = response.data;
        },
            function (error) {
                alert("Error al obtener los proveedores");
            });
    };

    /*Funcion para obtener las sucursales existentes*/
    $scope.consultarSucursales = function () {
        $scope.sucursales = [{ nombre: 'Aja' }, {nombre:'aa'}];
        /*var compania = { opcion: companiaActual }
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var respuesta = ServicioHTTP.getAll(apiRoute, compania, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.sucursales = response.data;
            console.log(response.data);
        },
            function (error) {
                alert("Error obteniendo las sucursales");
            });*/
    };

    /*Agregar un nuevo medicamento*/
    $scope.agregarMedicamento = function () {
        var apiRoute = ip + '/WebApi/agregarMedicamento';
        var medicamento = {
            nombre: $scope.nombre,
            prescripcion: $scope.interpretarPrescripcion($scope.prescripcion),
            proveedor: $scope.proveedor,
            precio: $scope.precio
        };
        console.log(medicamento);
        var respuesta = ServicioHTTP.postToken(apiRoute, medicamento, authFact.getAccessToken());
        respuesta.then(function (response) {
            document.getElementById('botoncerrarCrearProdu').click();
            $scope.consultarMedicamentos();
            alert('Medicamento creado.');
        },
            function (error) {
                alert("Error al registrar el medicamento");
            });
    };

    /*Agregar un nuevo medicamento a una sucursal*/
    $scope.agregarMedicamento = function () {
        var apiRoute = ip + '/WebApi/agregarMedicamento';
        var medicamento = {
            nombre: $scope.nombreMedicaSucu,
            sucursal: $scope.sucursalMedicaSucu,
            stockActual: $scope.cantidaActualdMedicaSucu,
            stockMinimo: $scope.cantidadMinMedicaSucu,
            stockPromedio: $scope.cantidadPromMedicaSucu
        };
        console.log(medicamento);
        /*var respuesta = ServicioHTTP.postToken(apiRoute, medicamento, authFact.getAccessToken());
        respuesta.then(function (response) {
            document.getElementById('botoncerrarProduSucu').click();
            alert('Medicamento ingresado.');
        },
            function (error) {
                alert("Error. Compruebe que sea un nombre válido y que no se encuentre en la sucursal.");
            });*/
    };

    /*Para establecer cual es el medicamento que se va a editar*/
    $scope.editar = function (medicamento) {
        //$scope.medicamento = { nombre: "agua", precio: 200, prescripcion: 'Sí', proveedor: 'Aja' };
        $scope.medicamento = angular.copy(medicamento);
    };

    /*Envia los cambios realizados del medicamento a la base de datos*/
    $scope.editarMedicamento = function () {
        var apiRoute = ip + '/WebApi/actualizarMedicamento';
        var medicamento2 = {
            nombre: $scope.medicamento.nombre,
            prescripcion: $scope.medicamento.prescripcion,
            proveedor: $scope.medicamento.proveedor,
            precio: $scope.medicamento.precio
        };
        var medicamento = {
            nombre: $scope.medicamento.nombre,
            prescripcion: $scope.interpretarPrescripcion($scope.medicamento.prescripcion),
            proveedor: $scope.medicamento.proveedor,
            precio: $scope.medicamento.precio
        };
        console.log($scope.medicamento);
        console.log(medicamento2);
        console.log($scope.medicamento === medicamento2);
        var respuesta = ServicioHTTP.postToken(apiRoute, medicamento, 'authFact.getAccessToken()');
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditProdu').click();
            $scope.consultarMedicamentos();
            alert('Medicamento editado.');
        },
            function (error) {
                alert("Error al guardar los cambios");
            });
    };

    /*Para eliminar un medicamento*/
    $scope.borrarMedicamento = function (nombre) {
        if (confirm('Seguro que desea eliminar ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarMedicamento';
        var medicamento = { opcion: nombre };
        var respuesta = ServicioHTTP.postToken(apiRoute, medicamento, authFact.getAccessToken());
        console.log(medicamento);
        respuesta.then(function (response) {
            $scope.consultarMedicamentos();
        },
            function (error) {
                alert("Error al eliminar el medicamento.");
            });
    };

    /*Esta funcion se utiliza para pasar un 'true' a un Si y un 'false' a un no y viceversa*/
    $scope.interpretarPrescripcion = function (prescripcion) {
        if (prescripcion === true)
            prescripcion = 'Sí';
        else if (prescripcion === false)
            prescripcion = 'No';
        else if (prescripcion === 'Sí')
            prescripcion = true;
        else
            prescripcion = false;
        return prescripcion;
    };

    /*Esta funcion se utiliza para pasar un 'true' a un Si y un 'false' a un no y viceversa*/
    $scope.interpretarPrescripcionArray = function (productos) {
        for (var index = 0; index < productos.length; index++) {
            if (productos[index].prescripcion === true) {
                productos[index].prescripcion = 'Sí';
            }
            else if (productos[index].prescripcion === false)
                productos[index].prescripcion = 'No';
            else if (productos[index].prescripcion === 'Sí')
                productos[index].prescripcion = true;
            else
                productos[index].prescripcion = false;
        }
    };
    /*$scope.consultarProveedores();
    $scope.consultarMedicamentos();*/
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminProveedoresController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";

    /*Para solicitar los proveedores existentes*/
    $scope.consultarProveedores = function () {
        var apiRoute = ip + '/WebApi/consultarProveedores';
        var respuesta = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.proveedores = response.data;
            console.log(response.data);
        },
            function (error) {
                alert("Error obteniendo los proveedores");
            });
    };

    /*Para crear un nuevo proveedor*/
    $scope.agregarProveedor = function () {
        var apiRoute = ip + '/WebApi/agregarProveedor';
        var proveedor = {
            nombre: $scope.nombre,
            sede: $scope.sede
        };
        var respuesta = ServicioHTTP.postToken(apiRoute, proveedor, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarProveedores();
            document.getElementById('botoncerrarCrearProvee').click();
            alert('Proveedor creado');
        },
            function (error) {
                alert("Error creando el proveedor");
            });
    };

    /*Para seleccionar el proveedor que se editara*/
    $scope.editar = function (proveedor) {
        $scope.proveedor = angular.copy(proveedor);
    };

    /*Para aplicar los cambios a un proveedor*/
    $scope.editarProveedor = function () {
        var apiRoute = ip + '/WebApi/actualizarProveedor';
        var proveedor = {
            nombre: $scope.proveedor.nombre,
            sede: $scope.proveedor.sede
        };
        var respuesta = ServicioHTTP.postToken(apiRoute, proveedor, authFact.getAccessToken());
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditProvee').click();
            $scope.consultarProveedores();
            alert('Proveedor editado.');
        },
            function (error) {
                alert("Error al guardar los cambios");
            });
    };

    /*Para borrar un proveedor de la bases de datos*/
    $scope.borrarProveedor = function (nombre) {
        if (confirm('Seguro que desea eliminar a ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarProveedor';
        var proveedor = { opcion: nombre };
        var respuesta = ServicioHTTP.postToken(apiRoute, proveedor, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarProveedores();
        },
            function (error) {
                alert("Error al eliminar el proveedor");
            });
    };

    $scope.consultarProveedores();
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminSucursalesController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";

    /*Funcion para obtener las sucursales existentes*/
    $scope.consultarSucursales = function () {
        var compania = { opcion: companiaActual }
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var respuesta = ServicioHTTP.getAll(apiRoute, compania, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.sucursales = response.data;
            console.log(response.data);
        },
            function (error) {
                alert("Error obteniendo las sucursales");
            });
    };

    /*Funcion para agregar una nueva sucursal*/
    $scope.agregarSucursal = function () {
        var apiRoute = ip + '/WebApi/agregarSucursal';
        var sucursal = {
            nombre: $scope.nombre,
            provincia: $scope.provincia,
            ciudad: $scope.ciudad,
            senas: $scope.senas,
            descripcion: $scope.descripcion,
            administrador: $scope.administrador,
            compania: companiaActual
        };
        console.log(sucursal);
        var respuesta = ServicioHTTP.postToken(apiRoute, sucursal, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarSucursales();
            document.getElementById('botoncerrarCrearSucu').click();
            console.log(response.data);
        },
            function (error) {
                alert("Error al crear la compañías");
            });
    };

    /*Para establer la sucursal a editar*/
    $scope.editar = function (sucursal) {
        $scope.sucursal = angular.copy(sucursal);
    };

    /*Para aplicar los cambios a una sucursal*/
    $scope.editarSucursal = function () {
        var apiRoute = ip + '/WebApi/actualizarSucursal';
        var sucursal = {
            nombre: $scope.sucursal.nombre,
            provincia: $scope.sucursal.provincia,
            ciudad: $scope.sucursal.ciudad,
            senas: $scope.sucursal.senas,
            descripcion: $scope.sucursal.descripcion,
            compania: $scope.sucursal.compania
        };
        console.log(sucursal);

        var respuesta = ServicioHTTP.postToken(apiRoute, sucursal, authFact.getAccessToken());
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditSucu').click();
            alert('Sucursal editada');
            $scope.consultarSucursales();
        },
            function (error) {
                alert("Error al editar la sucursal");
            });
    };

    /*Para eliminar una sucursal*/
    $scope.borrarSucursal = function (nombre) {
        if (confirm('Seguro que desea eliminar ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarSucursal';
        var sucursal = { opcion: nombre };
        var respuesta = ServicioHTTP.postToken(apiRoute, sucursal, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarSucursales();
        },
            function (error) {
                alert("Error al eliminar la sucursal");
            });
    };
    $scope.consultarSucursales();
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminEmpleadosController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";

    /*Para obtener los empleados existentes*/
    $scope.consultarEmpleados = function () {
        var compania = { opcion: companiaActual }
        var apiRoute = ip + '/WebApi/consultarEmpleados';
        var respuesta = ServicioHTTP.postToken(apiRoute, compania, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.empleados = response.data;
            $scope.interpretarFecha($scope.empleados);
            console.log($scope.empleados);
            //console.log($scope.empleados[0].fechanacimiento.split('T'));
        },
            function (error) {
                alert("Error al obtener los empleados");
            });
    };

    /*Para obtener todas las sucursales de la compania*/
    $scope.consultarSucursales = function () {
        var compania = { opcion: companiaActual };
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var sucursal = ServicioHTTP.postToken(apiRoute, compania, authFact.getAccessToken());
        sucursal.then(function (response) {
            $scope.sucursales = response.data;
            //console.log($scope.sucursales);
        },
            function (error) {
                alert("Error al solicitar las sucursales");
            });
    };

    /*Para obtener los roles disponibles*/
    $scope.consultarRoles = function () {
        var apiRoute = ip + '/WebApi/consultarRoles';
        var rol = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        rol.then(function (response) {
            $scope.roles = response.data;
            //console.log($scope.roles);
        },
            function (error) {
                alert("Error al solicitar los roles");
            });
    };

    /*Crear un nuevo empleado*/
    $scope.agregarEmpleado = function () {
        var empleado =
            {
                nombre1: $scope.nombre1,
                nombre2: $scope.nombre2,
                apellido1: $scope.apellido1,
                apellido2: $scope.apellido2,
                provincia: $scope.provincia,
                ciudad: $scope.ciudad,
                senas: $scope.senas,
                fechanacimiento: $scope.fechanacimiento,
                cedula: $scope.cedula,
                contrasena: $scope.password,
                rol: $scope.rol,
                sucursal: $scope.sucursal
            };
        var apiRoute = ip + '/WebApi/agregarEmpleado';
        var respuesta = ServicioHTTP.postToken(apiRoute, empleado, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarEmpleados();
            document.getElementById('botoncerrarCrearEmpleados').click();
            alert('Empleado creado.');
        },
            function (error) {
                alert("Error al crear el empleado");
            });
    };

    /*variable para cargar el empleado a editar */
    $scope.editar = function (empleado) {
        $scope.empleado = angular.copy(empleado);
    };

    /*funcion que se llama para aplicar los cambios realizados al empleado*/
    $scope.editarEmpleado = function () {
        var empleado =
            {
                nombre1: $scope.empleado.nombre1,
                nombre2: $scope.empleado.nombre2,
                apellido1: $scope.empleado.apellido1,
                apellido2: $scope.empleado.apellido2,
                provincia: $scope.empleado.provincia,
                ciudad: $scope.empleado.ciudad,
                senas: $scope.empleado.senas,
                fechanacimiento: $scope.empleado.fechanacimiento,
                cedula: $scope.empleado.cedula,
                rol: $scope.empleado.rol,
                sucursal: $scope.empleado.sucursal
            };
        console.log(empleado);
        var apiRoute = ip + '/WebApi/actualizarEmpleado';
        var respuesta = ServicioHTTP.postToken(apiRoute, empleado, authFact.getAccessToken());
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditEmpleado').click();
            alert('Empleado actualizado.');
            $scope.consultarEmpleados();
        },
            function (error) {
                alert("Error al actualiar el empleado");
            });
    };

    /*Para borrar un empleado seleccionado*/
    $scope.borrarEmpleado = function (borrar) {
        if (confirm("Seguro que desea borrar el empleado con cédula " + borrar + "?") === false)
            return;
        var empleado = { opcion2: borrar };
        var apiRoute = ip + '/WebApi/borrarEmpleado';
        var respuesta = ServicioHTTP.postToken(apiRoute, empleado, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarEmpleados();
        },
            function (error) {
                alert("Error al eliminar el empleado");
            });
    };

    /*Para convertir la fecha a un formato diferente al recibido*/
    $scope.interpretarFecha = function (empleados) {
        for (var index = 0; index < empleados.length; index++) {
            empleados[index].fechanacimiento = empleados[index].fechanacimiento.split('T')[0];
        }
    };

    $scope.consultarSucursales();
    setTimeout(() => { $scope.consultarRoles(); }, 500);
    setTimeout(() => { $scope.consultarEmpleados(); }, 1000);
});

//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminClientesController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";

    /*Muestra todos los clientes*/
    $scope.consultarClientes = function () {
        var apiRoute = ip + '/WebApi/consultarClientes';
        var respuesta = ServicioHTTP.getAll(apiRoute, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.clientes = response.data;
            $scope.interpretarFecha($scope.clientes);
            console.log($scope.clientes);
            //console.log($scope.empleados[0].fechanacimiento.split('T'));
        },
            function (error) {
                alert("Error al obtener los clientes");
            });
    };

    /*crear cliente nuevo*/
    $scope.crearCliente = function () {
        var cliente = {
            cedula: $scope.cedulaCrearCliente,
            nombre1: $scope.nombre1CrearCliente,
            nombre2: $scope.nombre2CrearCliente,
            apellido1: $scope.apellido1CrearCliente,
            apellido2: $scope.apellido2CrearCliente,
            contrasena: $scope.passwordCrearCliente,
            provincia: $scope.provinciaCrearCliente,
            ciudad: $scope.ciudadCrearCliente,
            senas: $scope.senasCrearCliente,
            padecimientos: $scope.obtenerPadecimientos(),
            telefonos: $scope.obtenerTelefonos(),
            fechanacimiento: $scope.fechaNacimientoCrearCliente
        };
        console.log(cliente);
        var apiRoute = ip + '//WebApi/agregarCliente';
        var respuesta = ServicioHTTP.postToken(apiRoute, cliente, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarClientes();
            document.getElementById('botoncerrarCrearCliente').click();
            alert('Cliente creado');
        },
            function (error) {
                alert("Error al crear el cliente");
            });
    };

    /*Para seleccionar el cliente que se va a modificar*/
    $scope.editar = function (cliente) {
        $scope.cliente = angular.copy(cliente);
    };

    /*Para aplicar los cambios realizados a un cliente*/
    $scope.editarCliente = function () {
        var apiRoute = ip + '/WebApi/actualizarCliente';
        var cliente = {
            cedula: $scope.cliente.cedula,
            nombre1: $scope.cliente.nombre1,
            nombre2: $scope.cliente.nombre2,
            apellido1: $scope.cliente.apellido1,
            apellido2: $scope.cliente.apellido2,
            provincia: $scope.cliente.provincia,
            ciudad: $scope.cliente.ciudad,
            senas: $scope.cliente.senas,
            fechanacimiento: $scope.cliente.fechanacimiento
        };
        console.log(cliente);
        var respuesta = ServicioHTTP.postToken(apiRoute, cliente, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarClientes();
            document.getElementById('botoncerrarEditCliente').click();
            alert('Cliente modificado');
        },
            function (error) {
                alert("Error al modificar el cliente");
            });
    };

    /*Borrar un cliente*/
    $scope.borrarCliente = function (cedula) {
        if (confirm('Seguro que desea eliminar el cliente con cedula: ' + cedula) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarCliente';
        var cliente = { opcion2: cedula };
        var respuesta = ServicioHTTP.postToken(apiRoute, cliente, authFact.getAccessToken());
        respuesta.then(function (response) {
            $scope.consultarClientes();
        },
            function (error) {
                alert("Error al eliminar el cliente");
            });
    };

    /*funcion para obtener los padecimientos del cliente*/
    $scope.obtenerPadecimientos = function () {
        var padecimientos = $.map($('input[name="padecimientoCrearCliente"]'), function (c) { return c.value; });
        var fechaPade = $.map($('input[name="fechaPadeCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < fechaPade.length; index++) {
            if (fechaPade[index] !== "" && padecimientos[index] !== "") {
                var fecha = new Date(fechaPade[index]);
                resultado += "{\"Padecimiento\":\"" + padecimientos[index] + "\", \"Ano\": " + fecha.getFullYear() + "}";
            };
            pos++;
            if (index < fechaPade.length - 1)
                resultado += ',';

        }
        console.log(JSON.stringify(resultado));
        return '['+resultado+']';
    };

    /*Para seleccionar los telefonos ingresados en la creacion del cliente*/
    $scope.obtenerTelefonos = function () {
        var telefonos = $.map($('input[name="telefonoCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < telefonos.length; index++) {
            if (telefonos[index] !== "") {
                resultado += "{\"Telefono\":" + telefonos[index] + "}";
                pos++;
                if (index < telefonos.length - 1)
                    resultado += ',';
            }
        }
        return '[' + resultado + ']';
    };

    var cantidadPade = 0;//variable para la cantidad de inputs dinamicos de padecimiento
    /*funcion para poner inputs dinamicos de los padecimientos*/
    $scope.agregarEspacioPade = function () {
        if (cantidadPade >= 10)
            return;
        cantidadPade++;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    /*funcion para quitar cantidad de inputs dinamicos de padecimientos*/
    $scope.quitarEspacioPade = function () {
        if (cantidadPade <= 0)
            return;
        cantidadPade--;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    var cantidadTels = 0;//variable para la cantidad de inputs dinamicos de telefonos
    /*funcion para poner inputs dinamicos de los telefonos*/
    $scope.agregarEspacioTels = function () {
        if (cantidadTels >= 10)
            return;
        cantidadTels++;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /*funcion para quitar cantidad de inputs dinamicos de telefonos*/
    $scope.quitarEspacioTels = function () {
        if (cantidadTels <= 0)
            return;
        cantidadTels--;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /*Para convertir la fecha a un formato diferente al recibido*/
    $scope.interpretarFecha = function (empleados) {
        for (var index = 0; index < empleados.length; index++) {
            empleados[index].fechanacimiento = empleados[index].fechanacimiento.split('T')[0];
        }
    };

    $scope.consultarClientes();
});