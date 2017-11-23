
var ip = '';


app.controller('loginController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {

    /**
     * Funcion para realizar el login del empleado
     */
    $scope.login = function () {
        var empleado = {
            opcion: $scope.loginPassword,
            opcion2: $scope.loginCedula
        };
        var apiRoute = ip + '/WebApi/logearEmpleado';
        var respuesta = ServicioHTTP.post(apiRoute, empleado);
        respuesta.then(function (response) {
            authFact.setSucursal(response.data.sucursal);
            authFact.setCompania(response.data.compania);
            authFact.setEmpleado($scope.loginCedula);
            if (response.data.rol === "Administrador") {
                $location.path("/adminClientes");
            }
            else if (response.data.rol === "Cajero")
                $location.path("/abrirCaja");
        },
            function (error) {
                alert("Usuario y/o contraseña incorrecto");
            }
        );
    };

});

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la vista del cajero*/
app.controller('cajeroController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact,$route) {
    window.onbeforeunload = function (e) {
        console.log('Me mamo');
    }
    
    if (authFact.getFacturaActual() != undefined && authFact.getFacturaActual().length === 1 && authFact.getFacturaActual() !== 0) //comprueba si hay una venta facturada que aun no ha sido guardada
        $scope.ventaFacturada = authFact.getFacturaActual(); //$scope.ventaFacturada es una variable que guarda la ultima venta facturada hasta que esta sea salvada
    else
        $scope.ventaFacturada = [];

    /**
     * Funcion para para abrir una caja
     */
    $scope.abrirCaja = function () {
        var fechaActual = new Date();
        var fecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate());
        var hora = fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getMinutes() < 10)
            hora = fechaActual.getHours() + ":0" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10)
            hora = "0" + fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10 && fechaActual.getMinutes() < 10)
            hora = "0" + fechaActual.getHours() + ":0" + fechaActual.getMinutes();
        var caja = {
            opcion: authFact.getSucursal(),
            opcion2: $scope.numeroCaja
        };
        var apiRoute = ip + '/WebApi/verificarCaja';
        var respuesta = ServicioHTTP.post(apiRoute, caja);
        respuesta.then(function (response) {
            authFact.setCaja($scope.numeroCaja);
            authFact.setSaldoInicial($scope.saldoInicial);
            authFact.setFechaInicial(fecha);
            authFact.setHoraInicial(hora);
            authFact.setSaldoActual($scope.saldoInicial);
            authFact.setFacturaActual(0);
            $location.path("/VistaCajero");
        },
            function (error) {
                alert("Error. Puede que la caja no exista en la sucursal del empleado");
            });
    };

    /**
    * Funcion para cerrar la caja y enviar al servidor los datos finales desde que se abrio la caja hasta que se cerro
    */
    $scope.cerrarCaja = function () {
        var fechaActual = new Date();
        var fecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate());
        var hora = fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getMinutes() < 10)
            hora = fechaActual.getHours() + ":0" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10)
            hora = "0" + fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10 && fechaActual.getMinutes() < 10)
            hora = "0" + fechaActual.getHours() + ":0" + fechaActual.getMinutes();
        var apiRoute = ip + '/WebApi/cerrarCaja';
        var objeto = {
            empleado: authFact.getEmpleado(),
            caja: authFact.getCaja(),
            fechainicio: authFact.getFechaInicial(),
            fechafinal: fecha,
            horainicio: authFact.getHoraInicial(),
            horafinal: hora,
            efectivoinicial: authFact.getSaldoInicial(),
            efectivofinal: authFact.getSaldoActual(),
            facturas: null
        };
        $scope.resumen = angular.copy(objeto);
        var respuesta = ServicioHTTP.post(apiRoute, objeto);
        respuesta.then(function (response) {
            $scope.resumen.facturas = response.data;
            $scope.arreglarFacturasResumen($scope.resumen.facturas);
            $('#modalResumen').modal('show');
        },
            function (error) {
                alert("Error obteniendo el resumen de la caja");
            });
    };

    /**
     * Funcion para pasear el tipo (e-> Efectivo, t->Tarjeta) y establecer
     * la fecha y hora con el formato correcto de las facturas a mostrar en el resumen de cirre de caja
     * @param {any} facturas Arreglo de las facturas para mostrar en el resumen
     */
    $scope.arreglarFacturasResumen = function (facturas) {
        for (var index = 0; index < facturas.length; index++) {
            facturas[index].fecha = facturas[index].fecha.split('T')[0];
            facturas[index].hora = facturas[index].hora.substring(0, facturas[index].hora.length - 3);
            if (facturas[index].tipo === 'e')
                facturas[index].tipo = 'Efectivo';
            else
                facturas[index].tipo = 'Tarjeta';
        }
    };

    /**
    * Esto reconoce cuando el modal de resummen de caja se cierrar y redirecciona a la pagina principal
    **/
    $("#modalResumen").on("hidden.bs.modal", function () {
        $location.path("/login");
        $route.reload();
    });

    /**
     * Funcion para consultar todos los medicamentos de una sucursal registrados en la base de datos
     */
    $scope.consultarMedicamentos = function () {
        var apiRoute = ip + '/WebApi/consultarMedicamentosSucursal';
        var sucursal = { opcion: authFact.getSucursal() };
        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
        respuesta.then(function (response) {
            $scope.productos = response.data;
            $scope.interpretarPrescripcionArray($scope.productos);
        },
            function (error) {
                alert("Error obteniendo los medicamentos de la sucursal");
            });
    };

    /**
     * Funcion para obtener los pedidos de clientes que ya estan listos para ser facturados
     */
    $scope.obtenerPedidos = function () {
        var sucursal = { opcion: authFact.getSucursal() };
        var apiRoute = ip + '/WebApi/consultarPedidos';
        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
        respuesta.then(function (response) {
            $scope.pedidos = response.data;
        },
            function (error) {
                alert("Error obteniendo los pedidos");
            });
    };

    /**
     * Funcion para obtener los productos que posee un pedido, se construye el objeto a facturar y se envia a $scope.salvarFactura()
     */
    $scope.consultarProductosPedido = function (numeroPedido, cedulaCliente) {
        var apiRoute = ip + '/WebApi/consultarDetallePedido';
        var numero = { opcion2: numeroPedido };
        var respuesta = ServicioHTTP.post(apiRoute, numero);
        respuesta.then(function (response) {
            var tipo;
            if (confirm('Desea pagar con tarjeta el pedido?') === true)
                tipo = 't';
            else
                tipo = 'e';
            var pedido = { numero: numeroPedido, cliente: cedulaCliente, productos: response.data, tipo: tipo };
            $scope.salvarFactura(pedido);
        },
            function (error) {
                alert("Error obteniendo los pedidos");
            });
    }

    /**
     * Funcion obtner los datos ingresados de una venta y crear una factura
     */
    $scope.facturarVenta = function () {
        var fechaActual = new Date();
        var fecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate());
        var hora = fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getMinutes() < 10)
            hora = fechaActual.getHours() + ":0" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10)
            hora = "0" + fechaActual.getHours() + ":" + fechaActual.getMinutes();
        if (fechaActual.getHours() < 10 && fechaActual.getMinutes() < 10)
            hora = "0" + fechaActual.getHours() + ":0" + fechaActual.getMinutes();
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
            cliente: $scope.cedulaCliente,
            codigo: $scope.codigoVenta,
            productos: $scope.arrayEnvio,
            fecha: fecha + " " + hora,
            tipo: $scope.tipo
        }];
        authFact.setFacturaActual($scope.ventaFacturada);
        $scope.cedulaCliente = null;//poner en blanco las cajas de imput
        $scope.codigoVenta = null;//poner en blanco las cajas de imput
        $scope.tipo = null; //poner en null el spiner
        for (var index = 0; index < $scope.arrayEnvio.length; index++) {//poner en blanco las cajas de imput
            angular.element('[ng-model="cantidad"]')[$scope.arrayEnvio[index].pos].value = null;
        }
    };

    /**
     * Funcion que envia la factura realizada a la base de datos y construye el tiquete
     * @param {any} Pedido Indica si lo que se salva como factura es una venta o un pedido, si es pedido envia el objeto pedido
     */
    $scope.salvarFactura = function (Pedido) {
        var venta;
        var totalFactura = 0;
        var tiquete;
        if (Pedido === 'n') { //este tiquete se crea de una venta realizada
            for (var index = 0; index < $scope.ventaFacturada[0].productos.length; index++) {
                totalFactura += $scope.ventaFacturada[0].productos[index].cantidad * $scope.ventaFacturada[0].productos[index].precio;
            }
            venta = $scope.ventaFacturada[0];
            $scope.tiquete = {
                cliente: venta.cliente,
                empleado: authFact.getEmpleado(),
                factura: null,
                caja: authFact.getCaja(),
                fecha: venta.fecha,
                hora: venta.fecha,
                productos: venta.productos,
                total: totalFactura,
                tipo: venta.tipo,
                sucursal: authFact.getSucursal(),
                pedido: -1
            };
        }
        else { //este tiquete se crea a partir de un pedido seleccionado
            var fechaActual = new Date();
            var fecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + (fechaActual.getDate());
            var hora = fechaActual.getHours() + ":" + fechaActual.getMinutes();
            if (fechaActual.getMinutes() < 10)
                hora = fechaActual.getHours() + ":0" + fechaActual.getMinutes();
            if (fechaActual.getHours() < 10)
                hora = "0" + fechaActual.getHours() + ":" + fechaActual.getMinutes();
            if (fechaActual.getHours() < 10 && fechaActual.getMinutes() < 10)
                hora = "0" + fechaActual.getHours() + ":0" + fechaActual.getMinutes();

            venta = Pedido;
            for (var index = 0; index < venta.productos.length; index++) {
                totalFactura += venta.productos[index].cantidad * venta.productos[index].precio;
            }
            $scope.tiquete = {
                cliente: venta.cliente,
                empleado: authFact.getEmpleado(),
                factura: null,
                caja: authFact.getCaja(),
                fecha: fecha + " " + hora,
                hora: fecha + " " + hora,
                productos: venta.productos,
                total: totalFactura,
                tipo: venta.tipo,
                sucursal: authFact.getSucursal(),
                pedido: venta.numero
            };
        }
        tiquete = angular.copy($scope.tiquete);
        tiquete.productos = $scope.convertirToString(tiquete.productos); //convierte el arreglo de productos en un JSONArray
        console.log(tiquete);
        var apiRoute = ip + '/WebApi/salvarFactura';
        var respuesta = ServicioHTTP.post(apiRoute, tiquete);
        respuesta.then(function (response) {
            $scope.ventaFacturada = [];
            authFact.setFacturaActual($scope.ventaFacturada);
            $scope.tiquete.factura = response.data;
            $scope.obtenerPedidos();
            $('#modalTiquete').modal('show');
            if ($scope.tiquete.tipo === 'e') {
                authFact.setSaldoActual(authFact.getSaldoActual() + totalFactura);
                $scope.tiquete.tipo = 'Efectivo';
            }
            else
                $scope.tiquete.tipo = 'Tarjeta';
        },
            function (error) {
                alert("Error al salvar la venta");
            });
    };

    /**
     * Funcion para transformar un arreglo en un string tipo JSONArray como lo necesita la base de datos
     * @param {any} arreglo Arreglo fuente para crear el JSONArray
     */
    $scope.convertirToString = function (arreglo) {
        resultado = '[' + "{\"Medicamento\":" + "\"" + arreglo[0].medicamento + "\", \"Cantidad\": " + arreglo[0].cantidad + "}";
        for (var index = 1; index < arreglo.length; index++) {
            resultado += ", {\"Medicamento\":" + "\"" + arreglo[index].medicamento + "\", \"Cantidad\": " + arreglo[index].cantidad + "}";
        }
        return resultado + ']';
    };

    /**
     * Funcion obtener los valores de las cajas la cantidad y el nombre del producto donde se inserto alguna cantidad 
     */
    $scope.obtenerSeleccionados = function () {
        var numProductos = $.map($('input[name="posiCajaCantidad"]'), function (c) { return c.value; });
        var pos = 0;
        $scope.arrayEnvio = [];
        for (var index = 0; index < numProductos.length; index++) {
            if (numProductos[index] !== "" && numProductos[index] !== '0') {
                var obj = {
                    medicamento: $scope.productos[index].nombre,
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

    /**
     * * Funcion para verificar si se puede abastecer la cantidad ingresada de un medicamento o si queda menos de la cantidad minima en stock
     * @param {any} medicamento Nombre del medicamento del que se solicita la cantidad actual
     * @param {any} $event Apuntador a la caja de numero en la que se ingreso la cantidad, si no hay suficiente se pone en null
     */
    $scope.verificarCantidad = function (medicamento, $event) {
        var apiRoute = ip + '/WebApi/verificarCantidad';
        var cantidad = event.target;
        if (cantidad.value <= 0)
            return;
        var objeto = {
            opcion2: authFact.getSucursal(),
            opcion: medicamento,
        };
        var respuesta = ServicioHTTP.post(apiRoute, objeto);
        respuesta.then(function (response) {
            var enStock = response.data.cantidad;
            if (enStock < cantidad.value) {
                cantidad.value = null;
                alert('No se cuenta con la cantidad solicitada de ' + medicamento);
            }
            else if ((enStock - cantidad.value) <= response.data.stockminimo)
                alert('Advertencia: Queda menos de la cantidad mínima de ' + medicamento + ' en bodega.');
        },
            function (error) {
                alert("Error solicitando la cantidad actual del producto");
            });


    };

    /**
     * Funcion para establecer el nombre del producto que se va a borrar en la factura
     * @param {any} producto Nombre del producto
     */
    $scope.productoBorrar = function (producto) {
        $scope.BorrarProdu = producto;
    };

    /**
     * Funcion que elimina el producto seleccionado de la venta facturada (aun no guardada en la base)
     */
    $scope.eliminarProductoFacturado = function () {
        if ($scope.ventaFacturada[0].productos.length <= 1) {
            alert('No puede dejar la factura sin productos');
            return;
        }
        var supervisor = {
            opcion2: $scope.cedulaSupervisor,
            opcion: $scope.contrasenaSupervisor
        };
        var apiRoute = ip + '/WebApi/verificarSupervisor';
        var respuesta = ServicioHTTP.post(apiRoute, supervisor)
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
            });

    };

    /**
     * Funcion que verifica que el cliente ingresado este registrado, si no entonces abre la opcion de crearlo
     */
    $scope.verificarCliente = function () {
        if ($scope.cedulaCliente === null || $scope.cedulaCliente === undefined || $scope.cedulaCliente === "")
            return;
        var cliente = { opcion2: $scope.cedulaCliente };
        var apiRoute = ip + '/WebApi/verificarCliente';
        var respuesta = ServicioHTTP.post(apiRoute, cliente);
        respuesta.then(function (response) {
        },
            function (error) {
                $scope.cedulaCliente = null;
                if (confirm("El cliente no existe. Desea registrarlo ahora mismo?")) {
                    $('#crearClienteModal').modal('show');
                }
            });
    };

    /**
     * Funcion para registrar un nuevo cliente
     */
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
        var apiRoute = ip + '/WebApi/agregarCliente';
        var respuesta = ServicioHTTP.post(apiRoute, cliente);
        respuesta.then(function (response) {
            alert('Cliente creado');
        },
            function (error) {
                alert("Error al crear el cliente");
            });
    };

    /**
     * Funcion para obtener los padecimientos del cliente en un string tipo JSONArray
     */
    $scope.obtenerPadecimientos = function () {
        var padecimientos = $.map($('input[name="padecimientoCrearCliente"]'), function (c) { return c.value; });
        var fechaPade = $.map($('input[name="fechaPadeCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < fechaPade.length; index++) {
            if (fechaPade[index] !== "" && padecimientos[index] !== "") {
                var fecha = new Date(fechaPade[index]);
                resultado += "{\"Padecimiento\":\"" + padecimientos[index] + "\", \"Ano\": " + fecha.getFullYear() + "}";
                if (index < fechaPade.length - 1 && fechaPade[index + 1] !== "" && padecimientos[index + 1] !== "")
                    resultado += ',';
            };
            pos++;


        }
        return '[' + resultado + ']';
    };

    /**
     * Funcion para obtener los telefonos del cliente que se esta registrando en un string tipo JSONArray
     */
    $scope.obtenerTelefonos = function () {
        var telefonos = $.map($('input[name="telefonoCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < telefonos.length; index++) {
            if (telefonos[index] !== "") {
                resultado += "{\"Telefono\":" + telefonos[index] + "}";
                pos++;
                if (index < telefonos.length - 1 && telefonos[index + 1] !== "")
                    resultado += ',';
            }
        }
        return '[' + resultado + ']';
    };

    var cantidadPade = 0;//variable para la cantidad de inputs dinamicos de padecimiento
    /**
     * Funcion para incrementar los espacios disponibles donde ingresar padecimientos
     */
    $scope.agregarEspacioPade = function () {
        if (cantidadPade >= 10)
            return;
        cantidadPade++;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    /**
     * Funcion para disminuir los espacios disponibles donde ingresar padecimientos
     */
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
    /**
     * Funcion para aumentar los espacios disponibles donde ingresar telefonos
     */
    $scope.agregarEspacioTels = function () {
        if (cantidadTels >= 10)
            return;
        cantidadTels++;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /**
     * Funcion para disminuir los espacios disponibles donde ingresar telefonos
     */
    $scope.quitarEspacioTels = function () {
        if (cantidadTels <= 0)
            return;
        cantidadTels--;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /**
     * Funcion para poner la prescripcion en Si o NO si es true o false o viceversa de todos los productos
     */
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

    $scope.consultarMedicamentos();
});

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de medicamentos*/
app.controller('adminMedicamentosController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.compa = authFact.getCompania();
    /**
     * Funcion para consultar todos los medicamentos de la base de datos 
     */
    $scope.consultarMedicamentos = function () {
        var apiRoute = ip + '/WebApi/consultarMedicamentos';
        var respuesta = ServicioHTTP.getAll(apiRoute);
        respuesta.then(function (response) {
            $scope.medicamentos = response.data;
            $scope.interpretarPrescripcionArray($scope.medicamentos);
        },
            function (error) {
                alert("Error obteniendo los medicamentos");
            });
    };

    /**
     * Funcion para consultar todos los medicamentos de una sucursal de una compania en especifico (la del administrador)
     */
    $scope.consultarMedicamentosSucu = function () {
        var apiRoute = ip + '/WebApi/consultarMedicamentosSucursal';
        var sucursal = { opcion: authFact.getSucursal() };
        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
        respuesta.then(function (response) {
            $scope.medicamentosSucu = response.data;
        },
            function (error) {
                alert("Error obteniendo los medicamentos de la sucursal");
            });
    };

    /**
     * Funcion para consultar todos los proveedores disponibles
     */
    $scope.consultarProveedores = function () {
        var apiRoute = ip + '/WebApi/consultarProveedores';
        var respuesta = ServicioHTTP.getAll(apiRoute);
        respuesta.then(function (response) {
            $scope.proveedores = response.data;
        },
            function (error) {
                alert("Error al obtener los proveedores");
            });
    };

    /**
     * Funcion para consultar todas las sucursales de la compania del administrador
     */
    $scope.consultarSucursales = function () {
        //$scope.sucursales = [{ nombre: 'Aja' }, { nombre: 'aa' }];
        var compania = { opcion: authFact.getCompania() }
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var respuesta = ServicioHTTP.post(apiRoute, compania);
        respuesta.then(function (response) {
            $scope.sucursales = response.data;
        },
            function (error) {
                alert("Error obteniendo las sucursales");
            });
    };

    /**
     * Funcion para registrar un nuevo medicamento para las companias
     */
    $scope.agregarMedicamento = function () {
        var apiRoute = ip + '/WebApi/agregarMedicamento';
        var medicamento = {
            nombre: $scope.nombre,
            prescripcion: $scope.interpretarPrescripcion($scope.prescripcion),
            proveedor: $scope.proveedor,
            precio: $scope.precio
        };
        var respuesta = ServicioHTTP.post(apiRoute, medicamento);
        respuesta.then(function (response) {
            document.getElementById('botoncerrarCrearProdu').click();
            $scope.consultarMedicamentos();
            alert('Medicamento creado.');
        },
            function (error) {
                alert("Error al registrar el medicamento");
            });
    };

    /**
     * Funcion para registrar la existencia de un medicamento en una sucursal
     */
    $scope.agregarMedicamentoSucursal = function () {
        var apiRoute = ip + '/WebApi/agregarMedicamentoSucursal';
        var medicamento = {
            medicamento: $scope.nombreMedicaSucu,
            sucursal: $scope.sucursalMedicaSucu,
            cantidad: $scope.cantidaActualdMedicaSucu,
            stockminimo: $scope.cantidadMinMedicaSucu,
            stockpromedio: $scope.cantidadPromMedicaSucu
        };
        var respuesta = ServicioHTTP.post(apiRoute, medicamento);
        respuesta.then(function (response) {
            alert('Medicamento ingresado.');
        },
            function (error) {
                alert("Error. Compruebe que el medicamento ya no esté registrado en la sucursal.");
            });
    };

    /**
     * Funcion para aumentar la cantidad de un medicamento en una sucursal
     */
    $scope.agregarMedicamentoSucursalCantidad = function () {
        var apiRoute = ip + '/WebApi/actualizarMedicamentoSucursal';
        var medicamento = {
            medicamento: $scope.nombreAgregarCantidadSucu,
            sucursal: $scope.sucursalAgregarCantidadSucu,
            cantidad: $scope.cantidadAgregarCantidadSucu,
        };
        var respuesta = ServicioHTTP.post(apiRoute, medicamento);
        respuesta.then(function (response) {
            alert('Cantidad aumentada.');
        },
            function (error) {
                alert("Error al aumentar la cantidad nueva de " + $scope.nombreAgregarCantidadSucu);
            });
    };


    /**
     *  Funcion para indicar cual es el medicamento que se va a editar
     * @param {any} medicamento Objeto medicamento para editar
     */
    $scope.editar = function (medicamento) {
        $scope.medicamento = angular.copy(medicamento);
    };

    /**
     *  Funcion para aplicar los cambios realizados a un medicamento
     */
    $scope.editarMedicamento = function () {
        var apiRoute = ip + '/WebApi/actualizarMedicamento';
        var medicamento = {
            nombre: $scope.medicamento.nombre,
            prescripcion: $scope.interpretarPrescripcion($scope.medicamento.prescripcion),
            proveedor: $scope.medicamento.proveedor,
            precio: $scope.medicamento.precio
        };
        var respuesta = ServicioHTTP.post(apiRoute, medicamento);
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditProdu').click();
            $scope.consultarMedicamentos();
            alert('Medicamento editado.');
        },
            function (error) {
                alert("Error al guardar los cambios");
            });
    };

    /**
     *  Funcion para borrar la existencia de un medicamento en las companias
     * @param {any} nombre Nombre del medicamento que se va a borrar
     */
    $scope.borrarMedicamento = function (nombre) {
        if (confirm('Seguro que desea eliminar ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarMedicamento';
        var medicamento = { opcion: nombre };
        var respuesta = ServicioHTTP.post(apiRoute, medicamento);
        respuesta.then(function (response) {
            $scope.consultarMedicamentos();
        },
            function (error) {
                alert("Error al eliminar el medicamento.");
            });
    };

    /**
     *  Funcion para pasar a Si o No la prescripcion o viceversa de un medicamento
     * @param {any} prescripcion Valor de la prescipcion del medicamento
     */
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

    /**
     *  Funcion para pasar a Si o No la prescripcion o viceversa de todos los medicamentos
     * @param {any} productos Arreglo de los medicamentos a los que se le cambiara el valor
     */
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
    $scope.consultarProveedores();
    $scope.consultarMedicamentos();
});

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminProveedoresController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.compa = authFact.getCompania();
    /**
     *  Funcion para consultar todos los proveedores de las companias
     */
    $scope.consultarProveedores = function () {
        var apiRoute = ip + '/WebApi/consultarProveedores';
        var respuesta = ServicioHTTP.getAll(apiRoute);
        respuesta.then(function (response) {
            $scope.proveedores = response.data;
        },
            function (error) {
                alert("Error obteniendo los proveedores");
            });
    };

    /**
     *  Funcion para registar un nuevo proveerdor para las companias
     */
    $scope.agregarProveedor = function () {
        var apiRoute = ip + '/WebApi/agregarProveedor';
        var proveedor = {
            nombre: $scope.nombre,
            sede: $scope.sede
        };
        var respuesta = ServicioHTTP.post(apiRoute, proveedor);
        respuesta.then(function (response) {
            $scope.consultarProveedores();
            document.getElementById('botoncerrarCrearProvee').click();
            alert('Proveedor creado');
        },
            function (error) {
                alert("Error creando el proveedor");
            });
    };

    /**
     * Funcion para establecer el proveedor que se va a editar
     * @param {any} proveedor Objeto proveedor a editar
     */
    $scope.editar = function (proveedor) {
        $scope.proveedor = angular.copy(proveedor);
    };

    /**
     * Funcion para aplicar los cambios realizados a un proveedor
     */
    $scope.editarProveedor = function () {
        var apiRoute = ip + '/WebApi/actualizarProveedor';
        var proveedor = {
            nombre: $scope.proveedor.nombre,
            sede: $scope.proveedor.sede
        };
        var respuesta = ServicioHTTP.post(apiRoute, proveedor);
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditProvee').click();
            $scope.consultarProveedores();
            alert('Proveedor editado.');
        },
            function (error) {
                alert("Error al guardar los cambios");
            });
    };

    /**
     * Funcion para eliminar la existencia de un proveedor
     * @param {any} nombre Nombre del proveedor a eliminar
     */
    $scope.borrarProveedor = function (nombre) {
        if (confirm('Seguro que desea eliminar a ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarProveedor';
        var proveedor = { opcion: nombre };
        var respuesta = ServicioHTTP.postToken(apiRoute, proveedor);
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
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminSucursalesController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.compa = authFact.getCompania();
    /**
     * Funcion para consultar todas las sucursales de una compania (la del proveedor)
     */
    $scope.consultarSucursales = function () {
        var compania = { opcion: authFact.getCompania() }
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var respuesta = ServicioHTTP.post(apiRoute, compania);
        respuesta.then(function (response) {
            $scope.sucursales = response.data;
        },
            function (error) {
                alert("Error obteniendo las sucursales");
            });
    };

    /**
     * Funcion para agregar una nueva sucursal a una compania
     */
    $scope.agregarSucursal = function () {
        var apiRoute = ip + '/WebApi/agregarSucursal';
        var sucursal = {
            nombre: $scope.nombre,
            provincia: $scope.provincia,
            ciudad: $scope.ciudad,
            senas: $scope.senas,
            descripcion: $scope.descripcion,
            administrador: $scope.administrador,
            compania: authFact.getCompania()
        };
        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
        respuesta.then(function (response) {
            $scope.consultarSucursales();
            document.getElementById('botoncerrarCrearSucu').click();
        },
            function (error) {
                alert("Error al crear la compañías");
            });
    };

    /**
     * Funcion para establecer la sucursal que se va a editar
     * @param {any} sucursal Objeto sucursal que se va a editar
     */
    $scope.editar = function (sucursal) {
        $scope.sucursal = angular.copy(sucursal);
    };

    /**
     * Funcion para aplicar los cambios realizados a los atributos de una sucursal
     */
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

        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditSucu').click();
            alert('Sucursal editada');
            $scope.consultarSucursales();
        },
            function (error) {
                alert("Error al editar la sucursal");
            });
    };

    /**
     * Funcion para borrar la existencia de una sucursal en una compania
     * @param {any} nombre Nombre de la sucursal que se va a borrar
     */
    $scope.borrarSucursal = function (nombre) {
        if (confirm('Seguro que desea eliminar ' + nombre) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarSucursal';
        var sucursal = { opcion: nombre };
        var respuesta = ServicioHTTP.post(apiRoute, sucursal);
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
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminEmpleadosController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.compa = authFact.getCompania();
    /**
     * Funcion para consultar todos los empleados de una compania (la del administrador)
     */
    $scope.consultarEmpleados = function () {
        var compania = { opcion: authFact.getCompania() }
        var apiRoute = ip + '/WebApi/consultarEmpleados';
        var respuesta = ServicioHTTP.post(apiRoute, compania);
        respuesta.then(function (response) {
            $scope.empleados = response.data;
            $scope.interpretarFecha($scope.empleados);
        },
            function (error) {
                alert("Error al obtener los empleados");
            });
    };

    /**
     * Funcion para obtener todas las sucursales para una compania
     */
    $scope.consultarSucursales = function () {
        var compania = { opcion: authFact.getCompania() };
        var apiRoute = ip + '/WebApi/consultarSucursales';
        var sucursal = ServicioHTTP.post(apiRoute, compania);
        sucursal.then(function (response) {
            $scope.sucursales = response.data;
        },
            function (error) {
                alert("Error al solicitar las sucursales");
            });
    };

    /**
     * Funcion para obtener los roles para los empleados 
     */
    $scope.consultarRoles = function () {
        var apiRoute = ip + '/WebApi/consultarRoles';
        var rol = ServicioHTTP.getAll(apiRoute);
        rol.then(function (response) {
            $scope.roles = response.data;
        },
            function (error) {
                alert("Error al solicitar los roles");
            });
    };

    /**
     * Funcion para registrar un nuevo empleado en una sucursal
     */
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
        var respuesta = ServicioHTTP.post(apiRoute, empleado);
        respuesta.then(function (response) {
            $scope.consultarEmpleados();
            document.getElementById('botoncerrarCrearEmpleados').click();
            alert('Empleado creado.');
        },
            function (error) {
                alert("Error al crear el empleado");
            });
    };

    /**
     * Funcion para establecer el empelado que se va a editar
     * @param {any} empleado Objeto empleado a editar
     */
    $scope.editar = function (empleado) {
        $scope.empleado = angular.copy(empleado);
    };

    /**
     * Funcion para aplicar los cambios realizados a los atributos de un empleado
     */
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
        var apiRoute = ip + '/WebApi/actualizarEmpleado';
        var respuesta = ServicioHTTP.post(apiRoute, empleado);
        respuesta.then(function (response) {
            document.getElementById('botoncerrarEditEmpleado').click();
            alert('Empleado actualizado.');
            $scope.consultarEmpleados();
        },
            function (error) {
                alert("Error al actualiar el empleado");
            });
    };

    /**
     * Funcion para eliminar la existencia de un empleado en una sucursal
     * @param {any} borrar Numero de cedula del empleado que se va a eliminar
     */
    $scope.borrarEmpleado = function (borrar) {
        if (confirm("Seguro que desea borrar el empleado con cédula " + borrar + "?") === false)
            return;
        var empleado = { opcion2: borrar };
        var apiRoute = ip + '/WebApi/borrarEmpleado';
        var respuesta = ServicioHTTP.post(apiRoute, empleado);
        respuesta.then(function (response) {
            $scope.consultarEmpleados();
        },
            function (error) {
                alert("Error al eliminar el empleado");
            });
    };

    /**
     * Funcion para obtener la parte que se necesita (yy/mm/dd) de la fecha de nacimiento registrada de todos los empleados
     * @param {any} empelados Arreglo con todos los empleados a los que se le cambiara la fecha
     */
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
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/*Controlador para la administracion de proveedores*/
app.controller('adminClientesController', function ($scope, $cookieStore, ServicioHTTP, $location, authFact) {
    $scope.urlAdmin = "AngularJS/Vistas/menuLateral.html";
    $scope.compa = authFact.getCompania();
    /**
     * Funcion para consultar todos los clientes de las companias
     */
    $scope.consultarClientes = function () {
        var apiRoute = ip + '/WebApi/consultarClientes';
        var respuesta = ServicioHTTP.getAll(apiRoute);
        respuesta.then(function (response) {
            $scope.clientes = response.data;
            $scope.interpretarFecha($scope.clientes);
        },
            function (error) {
                alert("Error al obtener los clientes");
            });
    };

    /**
     * Funcion para registrar un nuevo cliente en las companias
     */
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
        var apiRoute = ip + '//WebApi/agregarCliente';
        var respuesta = ServicioHTTP.post(apiRoute, cliente);
        respuesta.then(function (response) {
            $scope.consultarClientes();
            document.getElementById('botoncerrarCrearCliente').click();
            alert('Cliente creado');
        },
            function (error) {
                alert("Error al crear el cliente");
            });
    };

    /**
     * Funcion para establecer el cliente que se va a editar
     * @param {any} cliente Objeto cliente a editar
     */
    $scope.editar = function (cliente) {
        $scope.cliente = angular.copy(cliente);
    };

    /**
     * Funcion para aplicar los cambios realizados a los atributos de un cliente
     */
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
        var respuesta = ServicioHTTP.post(apiRoute, cliente);
        respuesta.then(function (response) {
            $scope.consultarClientes();
            document.getElementById('botoncerrarEditCliente').click();
            alert('Cliente modificado');
        },
            function (error) {
                alert("Error al modificar el cliente");
            });
    };

    /**
     * Funcion para eliminar la existencia de un cliente en las companias
     */
    $scope.borrarCliente = function (cedula) {
        if (confirm('Seguro que desea eliminar el cliente con cedula: ' + cedula) === false)
            return;
        var apiRoute = ip + '/WebApi/borrarCliente';
        var cliente = { opcion2: cedula };
        var respuesta = ServicioHTTP.post(apiRoute, cliente);
        respuesta.then(function (response) {
            $scope.consultarClientes();
        },
            function (error) {
                alert("Error al eliminar el cliente");
            });
    };

    /**
     * Funcion para obtener los padecimientos ingresados para la creacion de un cliente en un string de tipo JSONArray
     */
    $scope.obtenerPadecimientos = function () {
        var padecimientos = $.map($('input[name="padecimientoCrearCliente"]'), function (c) { return c.value; });
        var fechaPade = $.map($('input[name="fechaPadeCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < fechaPade.length; index++) {
            if (fechaPade[index] !== "" && padecimientos[index] !== "") {
                var fecha = new Date(fechaPade[index]);
                resultado += "{\"Padecimiento\":\"" + padecimientos[index] + "\", \"Ano\": " + fecha.getFullYear() + "}";
                if (index < fechaPade.length - 1 && fechaPade[index + 1] !== "" && padecimientos[index + 1] !== "")
                    resultado += ',';
            };
            pos++;

        }
        return '[' + resultado + ']';
    };

    /**
     * Funcion para obtener los telefonos ingresados en la creacion de un cliente en un string tipo JSONArray
     */
    $scope.obtenerTelefonos = function () {
        var telefonos = $.map($('input[name="telefonoCrearCliente"]'), function (c) { return c.value; });
        var resultado = "";
        pos = 0;
        for (var index = 0; index < telefonos.length; index++) {
            if (telefonos[index] !== "") {
                resultado += "{\"Telefono\":" + telefonos[index] + "}";
                pos++;
                if (index < telefonos.length - 1 && telefonos[index + 1] !== "")
                    resultado += ',';
            }
        }
        return '[' + resultado + ']';
    };

    var cantidadPade = 0;//variable para la cantidad de inputs dinamicos de padecimiento
    /**
     * Funcion para aumentar la cantidad de espacios donde ingresar padecimientos
     */
    $scope.agregarEspacioPade = function () {
        if (cantidadPade >= 10)
            return;
        cantidadPade++;
        $scope.arregloRepeat = [];
        for (var index = 0; index < cantidadPade; index++) {
            $scope.arregloRepeat[index] = index;
        }
    };

    /**
     * Funcion para reducir la cantidad de espacios donde ingresar los padecimientos
     */
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
    /**
     * Funcion para agregar espacios donde ingresar los telefonos en la creacion de un cliente
     */
    $scope.agregarEspacioTels = function () {
        if (cantidadTels >= 10)
            return;
        cantidadTels++;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /**
     * Funcion para quitar espacios donde ingresar los telefonos en la creacion de un cliente
     */
    $scope.quitarEspacioTels = function () {
        if (cantidadTels <= 0)
            return;
        cantidadTels--;
        $scope.arregloTels = [];
        for (var index = 0; index < cantidadTels; index++) {
            $scope.arregloTels[index] = index;
        }
    };

    /**
     * Funcion para obtener la parte que se necesita de la fecha de nacimeintos registrada para los clientes y estlacerla para cada uno
     * @param {any} clientes Arreglo de clientes a los que se les va a establer la fecha de nacimientos
     */
    $scope.interpretarFecha = function (clientes) {
        for (var index = 0; index < clientes.length; index++) {
            clientes[index].fechanacimiento = clientes[index].fechanacimiento.split('T')[0];
        }
    };

    $scope.consultarClientes();
});