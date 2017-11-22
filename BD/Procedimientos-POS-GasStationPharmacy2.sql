--Procedimiento almacenado para insertar un proveedor
CREATE OR REPLACE FUNCTION insert_proveedor(newNombre VARCHAR(50), newSede VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = newNombre AND NOT Activo) THEN
        	UPDATE PROVEEDOR SET Activo=true, Sede=newSede where Nombre=newNombre;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE PROVEEDOR SET Activo=true,Sede='||''''||newSede||''''||'
                    WHERE Nombre='||''''||newNombre||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
  				BEGIN 
   					RAISE NOTICE 'No hay conexion con la otra base de datos';
 				END;   
            END;
        ELSE
      		INSERT INTO PROVEEDOR(Nombre,Sede,Activo) VALUES (newNombre,newSede,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO PROVEEDOR(Nombre,Sede,Activo) 
                    VALUES('||''''||newNombre||''''||','||''''||newSede||''''||',true);');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar un proveedor
CREATE OR REPLACE FUNCTION update_proveedor(newNombre VARCHAR(50), newSede VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN
    	IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = newNombre AND Activo) THEN
        	UPDATE PROVEEDOR SET Sede=newSede where Nombre=newNombre;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE PROVEEDOR SET Sede='||''''||newSede||''''||'
                    WHERE Nombre='||''''||newNombre||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
  				BEGIN 
   					RAISE NOTICE 'No hay conexion con la otra base de datos';
 				END;
            END;
        ELSE
      		RAISE EXCEPTION 'Proveedor no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar un proveedor
CREATE OR REPLACE FUNCTION delete_proveedor(nombreProveedor VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN
    	IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = nombreProveedor AND Activo) THEN
        	IF NOT EXISTS (SELECT * FROM MEDICAMENTO WHERE Proveedor = nombreProveedor AND Activo) THEN
        		UPDATE PROVEEDOR SET Activo=false where Nombre=nombreProveedor;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE PROVEEDOR SET Activo=false
                    WHERE Nombre='||''''||nombreProveedor||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
  					BEGIN 
   						RAISE NOTICE 'No hay conexion con la otra base de datos';
 					END;
                END;
        	ELSE
        		RAISE EXCEPTION 'No se puede eliminar este proveedor, algunos medicamentos están ligadas a él';
        	END IF;
    	ELSE
        	RAISE EXCEPTION 'Proveedor no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un medicamento
CREATE OR REPLACE FUNCTION insert_medicamento(newNombre VARCHAR(50), newPrecio INT,newPrescripcion BOOL, newProveedor VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN
    	IF EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = newNombre AND NOT Activo) THEN
        	IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = newProveedor AND Activo) THEN
        		UPDATE MEDICAMENTO SET Activo=true, Precio=newPrecio,Prescripcion=newPrescripcion,Proveedor=newProveedor where Nombre=newNombre;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE MEDICAMENTO SET Activo=true,Precio='||''''||newPrecio||''''||',
                                        Prescripcion='||''''||newPrescripcion||''''||',Proveedor='||''''||newProveedor||''''||'
                    WHERE Nombre='||''''||newNombre||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	RAISE EXCEPTION 'Proveedor no registrado';
            END IF;
        ELSE
        	IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = newProveedor AND Activo) THEN
            	INSERT INTO MEDICAMENTO(Nombre,Precio,Prescripcion,Proveedor,Activo) VALUES (newNombre,newPrecio,newPrescripcion,newProveedor,true);
        		BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO MEDICAMENTO(Nombre,Precio,Prescripcion,Proveedor,Activo)
                    VALUES('||''''||newNombre||''''||','||''''||newPrecio||''''||','||''''||newPrescripcion||''''||',
                                        '||''''||newProveedor||''''||',true);');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
  					BEGIN 
   						RAISE NOTICE 'No hay conexion con la otra base de datos';
 					END;
                END;
            ELSE
            	RAISE EXCEPTION 'Proveedor no registrado';
            END IF;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar un medicamento
CREATE OR REPLACE FUNCTION update_medicamento(newNombre VARCHAR(50), newPrecio INT,newPrescripcion BOOL, newProveedor VARCHAR(50)) 
        RETURNS void AS $$
        BEGIN
            IF EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = newNombre AND Activo) THEN
                IF EXISTS (SELECT * FROM PROVEEDOR WHERE Nombre = newProveedor AND Activo) THEN
                    UPDATE MEDICAMENTO SET Activo=true, Precio=newPrecio,Prescripcion=newPrescripcion,Proveedor=newProveedor where Nombre=newNombre;
                	BEGIN
                    	perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                        perform dblink_exec('UPDATE MEDICAMENTO SET Activo=true,Precio='||''''||newPrecio||''''||',
                                            Prescripcion='||''''||newPrescripcion||''''||',Proveedor='||''''||newProveedor||''''||'
                        WHERE Nombre='||''''||newNombre||''''||';');
                        perform dblink_disconnect();
                        EXCEPTION WHEN OTHERS THEN 
  						BEGIN 
   							RAISE NOTICE 'No hay conexion con la otra base de datos';
 						END;
                    END;
                ELSE
                    RAISE EXCEPTION 'Proveedor no registrado';
                END IF;
            ELSE
                RAISE EXCEPTION 'Medicamento no registrado';
            END IF;
        END;
        $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar un medicamento
CREATE OR REPLACE FUNCTION delete_medicamento(nombreMedicamento VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN
    	IF EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = nombreMedicamento AND Activo) THEN
        	IF NOT EXISTS (SELECT * FROM MEDICAMENTOXSUCURSAL WHERE Medicamento = nombreMedicamento AND Activo) THEN
        		UPDATE Medicamento SET Activo=false where Nombre=nombreMedicamento;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE MEDICAMENTO SET Activo=false
                    WHERE Nombre='||''''||nombreMedicamento||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
        		RAISE EXCEPTION 'No se puede eliminar este medicamento, algunas sucursales están ligadas a él';
        	END IF;
    	ELSE
        	RAISE EXCEPTION 'Medicamento no registrado';
       END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar una sucursal
CREATE OR REPLACE FUNCTION insert_sucursal(newNombre VARCHAR(50), newProvincia VARCHAR(20), newCiudad VARCHAR(20), newSenas VARCHAR(50),
                                           newDescripcion VARCHAR(50),newCompania VARCHAR(50),newAdministrador INT) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newNombre AND NOT Activo) THEN
        	UPDATE SUCURSAL SET Provincia=newProvincia, Ciudad = newCiudad, Senas = newSenas, Descripcion = newDescripcion,
            					Compania = newCompania, Activo=true where Nombre=newNombre;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE SUCURSAL SET Activo=true, Provincia='||''''||newProvincia||''''||',
                                    Ciudad='||''''||newCiudad||''''||',Senas='||''''||newSenas||''''||',
                                    Descripcion='||''''||newDescripcion||''''||',Compania='||''''||newCompania||''''||'
                                    WHERE Nombre='||''''||newNombre||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	INSERT INTO SUCURSAL(Nombre,Provincia,Ciudad,Senas,Descripcion,Compania,Activo) 
            VALUES (newNombre,newProvincia,newCiudad,newSenas,newDescripcion,newCompania,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO SUCURSAL(Nombre, Provincia, Ciudad, Senas,Descripcion, Compania, Activo) 
                                    VALUES('||''''||newNombre||''''||','||''''||newProvincia||''''||','||''''||newCiudad||''''||',
                                    '||''''||newSenas||''''||','||''''||newDescripcion||''''||',
                                    '||''''||newCompania||''''||',true);');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
       	IF EXISTS (SELECT * FROM ADMINISTRADORXSUCURSAL WHERE Sucursal = newNombre AND Administrador = newAdministrador AND NOT Activo) THEN
       	BEGIN
       		IF EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newAdministrador AND Activo) THEN
            	UPDATE ADMINISTRADORXSUCURSAL SET Activo = true WHERE Sucursal = newNombre AND Administrador = newAdministrador;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE ADMINISTRADORXSUCURSAL SET Activo=true 
                                        WHERE Sucursal='||''''||newNombre||''''||' AND Administrador='||''''||newAdministrador||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	RAISE EXCEPTION 'Empleado no registrado';
                ROLLBACK;
            END IF;
       	END;
       	ELSE
       	BEGIN
        	IF EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newAdministrador AND Activo) THEN
            	INSERT INTO ADMINISTRADORXSUCURSAL(Sucursal,Administrador,Activo) VALUES (newNombre,newAdministrador,true);
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO ADMINISTRADORXSUCURSAL(Administrador,Sucursal,Activo)
                                        VALUES('||''''||newAdministrador||''''||','||''''||newNombre||''''||',true);');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	RAISE EXCEPTION 'Empleado no registrado';
                ROLLBACK;
        	END IF;
        END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar una sucursal
CREATE OR REPLACE FUNCTION update_sucursal(newNombre VARCHAR(50), newProvincia VARCHAR(20), 
                                           newCiudad VARCHAR(20), newSenas VARCHAR(50),newDescripcion VARCHAR(50),newCompania VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newNombre AND Activo) THEN
        	UPDATE SUCURSAL SET Provincia=newProvincia, Ciudad = newCiudad, Senas = newSenas, Descripcion = newDescripcion, 
            Compania = newCompania, Activo=true where Nombre=newNombre;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE SUCURSAL SET Provincia='||''''||newProvincia||''''||',Ciudad='||''''||newCiudad||''''||',
                                    Senas='||''''||newSenas||''''||',Descripcion='||''''||newDescripcion||''''||',
                                    Compania='||''''||newCompania||''''||'
                                    WHERE Nombre='||''''||newNombre||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	RAISE EXCEPTION 'Sucursal no registrada';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar una sucursal
CREATE OR REPLACE FUNCTION delete_sucursal(newNombre VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newNombre AND Activo) THEN
        	IF EXISTS (SELECT * FROM CAJA WHERE Sucursal = newNombre AND Activo) THEN
            	RAISE EXCEPTION 'No se puede eliminar la sucursal, existen cajas ligadas a ella';
            ELSIF EXISTS (SELECT * FROM MEDICAMENTOXSUCURSAL WHERE Sucursal = newNombre AND Activo) THEN
            	RAISE EXCEPTION 'No se puede eliminar la sucursal, existen medicamentos ligados a ella';
            ELSE 
        		UPDATE SUCURSAL SET Activo=false WHERE Nombre=newNombre;
                UPDATE ADMINISTRADORXSUCURSAL SET Activo = false WHERE Sucursal = newNombre;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE SUCURSAL SET Activo=false WHERE Nombre='||''''||newNombre||''''||';');
                    perform dblink_exec('UPDATE ADMINISTRADORXSUCURSAL SET Activo=false WHERE Sucursal='||''''||newNombre||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            END IF;
        ELSE
        	RAISE EXCEPTION 'Sucursal no registrada';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un empleado
CREATE OR REPLACE FUNCTION insert_empleado(newCedula INT,newNombre1 VARCHAR(20),newNombre2 VARCHAR(20),
    newApellido1 VARCHAR(20),newApellido2 VARCHAR(20),newProvincia VARCHAR(20),newCiudad VARCHAR(20),
    newSenas VARCHAR(50),newFechaNacimiento DATE,newContrasena VARCHAR(200),newSucursal VARCHAR(50),newRol VARCHAR(20)) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newCedula AND NOT Activo) THEN
        	IF NOT EXISTS(SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            	RAISE EXCEPTION 'Sucursal no registrada';
            ELSIF NOT EXISTS(SELECT * FROM ROL WHERE Nombre = newRol AND Activo) THEN
            	RAISE EXCEPTION 'Rol no registrado';
            ELSE
        		UPDATE EMPLEADO SET Activo=true, Nombre1=newNombre1,Nombre2=newNombre2,Apellido1=newApellido1,Apellido2=newApellido2,
            	Provincia=newProvincia,Ciudad=newCiudad,Senas=newSenas,FechaNacimiento=newFechaNacimiento,
            	Contrasena=md5(newContrasena),Sucursal=newSucursal,Rol=newRol WHERE Cedula=newCedula;
                BEGIN
                	perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE EMPLEADO SET Activo=true,Nombre1='||''''||newNombre1||''''||',
                                        Nombre2='||''''||newNombre2||''''||',Apellido1='||''''||newApellido1||''''||',
                                        Apellido2='||''''||newApellido2||''''||',Provincia='||''''||newProvincia||''''||',
                                        Ciudad='||''''||newCiudad||''''||',Senas='||''''||newSenas||''''||',
                                        FechaNacimiento='||''''||newFechaNacimiento||''''||',Contrasena=md5('||''''||newContrasena||''''||'),
                                        Sucursal='||''''||newSucursal||''''||',Rol='||''''||newRol||''''||'
                                    WHERE Cedula='||''''||newCedula||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            END IF;
        ELSE
        	IF NOT EXISTS(SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            	RAISE EXCEPTION 'Sucursal no registrada';
            ELSIF NOT EXISTS(SELECT * FROM ROL WHERE Nombre = newRol AND Activo) THEN
            	RAISE EXCEPTION 'Rol no registrado';
            ELSE
        		INSERT INTO EMPLEADO(Cedula,Nombre1,Nombre2,Apellido1,Apellido2,Provincia,Ciudad,Senas,FechaNacimiento,
            	Contrasena,Sucursal,Rol,Activo) VALUES (newCedula,newNombre1,newNombre2,newApellido1,newApellido2,
            	newProvincia,newCiudad,newSenas,newFechaNacimiento,
            	md5(newContrasena),newSucursal,newRol,true);
                BEGIN
                	perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO EMPLEADO(Cedula,Nombre1,Nombre2,Apellido1,Apellido2,Provincia,
                                        Ciudad,Senas,FechaNacimiento,Contrasena,Sucursal,Rol,Activo) 
                                        VALUES('||''''||newCedula||''''||','||''''||newNombre1||''''||','||''''||newNombre2||''''||',
                                        '||''''||newApellido1||''''||','||''''||newApellido2||''''||',
                                        '||''''||newProvincia||''''||','||''''||newCiudad||''''||',
                                        '||''''||newSenas||''''||','||''''||newFechaNacimiento||''''||',
                                        md5('||''''||newContrasena||''''||'),'||''''||newSucursal||''''||','||''''||newRol||''''||',true);');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            END IF;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar un empleado
CREATE OR REPLACE FUNCTION update_empleado(newCedula INT,newNombre1 VARCHAR(20),newNombre2 VARCHAR(20),
    newApellido1 VARCHAR(20),newApellido2 VARCHAR(20),newProvincia VARCHAR(20),newCiudad VARCHAR(20),
    newSenas VARCHAR(50),newFechaNacimiento DATE,newSucursal VARCHAR(50),newRol VARCHAR(20)) 
    RETURNS void AS $$
	BEGIN 
    	IF EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newCedula AND Activo) THEN
        	IF NOT EXISTS(SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            	RAISE EXCEPTION 'Sucursal no registrada';
            ELSIF NOT EXISTS(SELECT * FROM ROL WHERE Nombre = newRol AND Activo) THEN
            	RAISE EXCEPTION 'Rol no registrado';
            ELSE
        		UPDATE EMPLEADO SET Nombre1=newNombre1,Nombre2=newNombre2,Apellido1=newApellido1,Apellido2=newApellido2,
            	Provincia=newProvincia,Ciudad=newCiudad,Senas=newSenas,FechaNacimiento=newFechaNacimiento,
            	Sucursal=newSucursal,Rol=newRol WHERE Cedula=newCedula;
                BEGIN
                	perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE EMPLEADO SET Nombre1='||''''||newNombre1||''''||',Nombre2='||''''||newNombre2||''''||',
                                        Apellido1='||''''||newApellido1||''''||',Apellido2='||''''||newApellido2||''''||',
                                        Provincia='||''''||newProvincia||''''||',Ciudad='||''''||newCiudad||''''||',
                                    	Senas='||''''||newSenas||''''||',FechaNacimiento='||''''||newFechaNacimiento||''''||',
                                    	Sucursal='||''''||newSucursal||''''||',
                                        Rol='||''''||newRol||''''||' WHERE Cedula='||''''||newCedula||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            END IF;
        ELSE
        	RAISE EXCEPTION 'Empleado no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar un empleado
CREATE OR REPLACE FUNCTION delete_empleado(newCedula INT) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newCedula AND Activo) THEN
        	UPDATE EMPLEADO SET Activo=false WHERE Cedula=newCedula;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
            	perform dblink_exec('UPDATE EMPLEADO SET Activo=false
            					WHERE Cedula='||''''||newCedula||''''||';');
            	perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                	RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	RAISE EXCEPTION 'Empleado no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un cliente
CREATE OR REPLACE FUNCTION insert_cliente(newCedula INT,newNombre1 VARCHAR(20),newNombre2 VARCHAR(20),
    newApellido1 VARCHAR(20),newApellido2 VARCHAR(20),newProvincia VARCHAR(20),newCiudad VARCHAR(20),
    newSenas VARCHAR(50),newFechaNacimiento DATE,newContrasena VARCHAR(200),newPrioridad INT,
    newTelefono JSON,newPadecimiento JSON) 
    RETURNS void AS $$
    DECLARE 
    pade VARCHAR(50);
    an INT;
    tel INT;
    telefonoCliente JSON;
    padecimientoCliente JSON;
    BEGIN 
    	IF EXISTS (SELECT * FROM CLIENTE WHERE Cedula = newCedula AND NOT Activo) THEN
        	UPDATE CLIENTE SET Activo=true, Nombre1=newNombre1,Nombre2=newNombre2,Apellido1=newApellido1,Apellido2=newApellido2,
            Provincia=newProvincia,Ciudad=newCiudad,Senas=newSenas,FechaNacimiento=newFechaNacimiento,
            Contrasena=md5(newContrasena),Prioridad=newPrioridad WHERE Cedula=newCedula;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE CLIENTE SET Activo=true,Nombre1='||''''||newNombre1||''''||',Nombre2='||''''||newNombre2||''''||',
                                        Apellido1='||''''||newApellido1||''''||',Apellido2='||''''||newApellido2||''''||',
                                        Provincia='||''''||newProvincia||''''||',Ciudad='||''''||newCiudad||''''||',
                                    Senas='||''''||newSenas||''''||',FechaNacimiento='||''''||newFechaNacimiento||''''||',
                                    Contrasena=md5('||''''||newContrasena||''''||'),Prioridad='||''''||newPrioridad||''''||'
                                    WHERE Cedula='||''''||newCedula||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	INSERT INTO CLIENTE(Cedula,Nombre1,Nombre2,Apellido1,Apellido2,Provincia,Ciudad,Senas,FechaNacimiento,
            Contrasena,Prioridad,Activo) VALUES (newCedula,newNombre1,newNombre2,newApellido1,newApellido2,
            newProvincia,newCiudad,newSenas,newFechaNacimiento,
            md5(newContrasena),newPrioridad,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO CLIENTE(Cedula,Nombre1,Nombre2,Apellido1,Apellido2,Provincia,
                                        Ciudad,Senas,FechaNacimiento,Contrasena,Prioridad,Activo) 
                                        VALUES('||''''||newCedula||''''||','||''''||newNombre1||''''||','||''''||newNombre2||''''||',
                                        '||''''||newApellido1||''''||','||''''||newApellido2||''''||',
                                        '||''''||newProvincia||''''||','||''''||newCiudad||''''||',
                                        '||''''||newSenas||''''||','||''''||newFechaNacimiento||''''||',
                                        md5('||''''||newContrasena||''''||'),'||''''||newPrioridad||''''||',true);');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
        FOR telefonoCliente IN SELECT * FROM json_array_elements(newTelefono)
        LOOP
        	tel=telefonoCliente->>'Telefono';
        	IF EXISTS(SELECT * FROM TELEFONOXCLIENTE WHERE Cliente = newCedula AND Telefono=tel AND NOT Activo) THEN
            	UPDATE TELEFONOXCLIENTE SET Activo=true WHERE Cliente = newCedula AND Telefono=tel;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE TELEFONOXCLIENTE SET Activo=true 
                                    WHERE Cliente='||''''||newCedula||''''||' AND Telefono='||''''||tel||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	INSERT INTO TELEFONOXCLIENTE(Cliente,Telefono,Activo) VALUES (newCedula,tel,true);
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO TELEFONOXCLIENTE(Cliente,Telefono,Activo) 
                                    VALUES ('||''''||newCedula||''''||','||''''||tel||''''||',true);');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
        	END IF;
        END LOOP;
       	FOR padecimientoCliente IN SELECT * FROM json_array_elements(newPadecimiento)
        LOOP
        	pade=padecimientoCliente->>'Padecimiento';
            an=(padecimientoCliente->>'Ano')::INT;
        	IF EXISTS(SELECT * FROM PADECIMIENTO WHERE Cliente = newCedula AND Padecimiento=padecimientoCliente->>'Padecimiento' 
                      AND Ano = (padecimientoCliente->>'Ano')::INT AND NOT Activo) THEN
            	UPDATE PADECIMIENTO SET Activo=true WHERE Cliente = newCedula AND Padecimiento=padecimientoCliente->>'Padecimiento' 
                      AND Ano = (padecimientoCliente->>'Ano')::INT;
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('UPDATE PADECIMIENTO SET Activo=true 
                                    WHERE Cliente='||''''||newCedula||''''||' AND Padecimiento='||''''||pade||''''||'
                                        AND Ano='||''''||an||''''||';');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	INSERT INTO PADECIMIENTO(Cliente,Padecimiento,Ano,Activo) 
                VALUES (newCedula,padecimientoCliente->>'Padecimiento',(padecimientoCliente->>'Ano')::INT,true);
                BEGIN
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO PADECIMIENTO(Cliente,Padecimiento,Ano,Activo)
                                        VALUES('||''''||newCedula||''''||','||''''||pade||''''||',
                                        '||''''||an||''''||',true);');                              
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            END IF;
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar un cliente
CREATE OR REPLACE FUNCTION update_cliente(newCedula INT,newNombre1 VARCHAR(20),newNombre2 VARCHAR(20),
    newApellido1 VARCHAR(20),newApellido2 VARCHAR(20),newProvincia VARCHAR(20),newCiudad VARCHAR(20),
    newSenas VARCHAR(50),newFechaNacimiento DATE,newPrioridad INT) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM CLIENTE WHERE Cedula = newCedula AND Activo) THEN
        	UPDATE CLIENTE SET Nombre1=newNombre1,Nombre2=newNombre2,Apellido1=newApellido1,Apellido2=newApellido2,
            Provincia=newProvincia,Ciudad=newCiudad,Senas=newSenas,FechaNacimiento=newFechaNacimiento,
            Prioridad=newPrioridad WHERE Cedula=newCedula;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE CLIENTE SET Activo=true,Nombre1='||''''||newNombre1||''''||',Nombre2='||''''||newNombre2||''''||',
                                  	Apellido1='||''''||newApellido1||''''||',Apellido2='||''''||newApellido2||''''||',
                                    Provincia='||''''||newProvincia||''''||',Ciudad='||''''||newCiudad||''''||',
                                    Senas='||''''||newSenas||''''||',FechaNacimiento='||''''||newFechaNacimiento||''''||',
                                    Prioridad='||''''||newPrioridad||''''||'
                                    WHERE Cedula='||''''||newCedula||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	RAISE EXCEPTION 'Cliente no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar un cliente
CREATE OR REPLACE FUNCTION delete_cliente(newCedula INT) 
    RETURNS void AS $$
    BEGIN 
    	IF EXISTS (SELECT * FROM CLIENTE WHERE Cedula = newCedula AND Activo) THEN
        	UPDATE CLIENTE SET Activo=false WHERE Cedula=newCedula;
            UPDATE TELEFONOXCLIENTE SET Activo = false WHERE Cliente=newCedula;
            UPDATE PADECIMIENTO SET Activo = false WHERE Cliente= newCedula;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE CLIENTE SET Activo=false WHERE Cedula='||''''||newCedula||''''||';');
                perform dblink_exec('UPDATE TELEFONOXCLIENTE SET Activo=false WHERE Cliente='||''''||newCedula||''''||';');
                perform dblink_exec('UPDATE PADECIMIENTO SET Activo=false WHERE Cliente='||''''||newCedula||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
        	RAISE EXCEPTION 'Cliente no registrado';
        END IF;
    END;
    $$ LANGUAGE plpgsql;
    
---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un pedido
CREATE OR REPLACE FUNCTION insert_pedido(newNumero INT,newSucursal varchar(50),newCliente int,newMedicamento JSON) 
    RETURNS void AS $$
    DECLARE 
    medica VARCHAR(50);
    cant INT;
    medicamentoCompra JSON;
    BEGIN 
    	IF NOT EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            RAISE EXCEPTION 'Sucursal no registrada';
        ELSIF NOT EXISTS (SELECT * FROM CLIENTE WHERE Cedula = newCliente AND Activo) THEN
            RAISE EXCEPTION 'Cliente no registrado';
        ELSE
        	INSERT INTO PEDIDO(Numero,Sucursal,Cliente,Activo) 
            VALUES(newNumero,newSucursal,newCliente,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO PEDIDO(Numero,Sucursal,Cliente,Activo) 
            						VALUES('||''''||newNumero||''''||','||''''||newSucursal||''''||',
                                    '||''''||newCliente||''''||',true);');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
        FOR medicamentoCompra IN SELECT * FROM json_array_elements(newMedicamento)
        LOOP
        	IF EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = medicamentoCompra->>'Medicamento' AND Activo) THEN
            	INSERT INTO MEDICAMENTOXPEDIDO(Pedido,Medicamento,Cantidad,Activo) 
                    VALUES (newNumero,medicamentoCompra->>'Medicamento',(medicamentoCompra->>'Cantidad')::INT,true);
               	BEGIN
                    medica=medicamentoCompra->>'Medicamento';
                  	cant=(medicamentoCompra->>'Cantidad')::INT;
                    perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                    perform dblink_exec('INSERT INTO MEDICAMENTOXPEDIDO(Pedido,Medicamento,Cantidad,Activo)
                                       VALUES('||''''||newNumero||''''||','||''''||medica||''''||','||''''||cant||''''||',true);');
                    perform dblink_disconnect();
                    EXCEPTION WHEN OTHERS THEN 
                    BEGIN 
                        RAISE NOTICE 'No hay conexion con la otra base de datos';
                    END;
                END;
            ELSE
            	RAISE EXCEPTION 'Medicamento no registrado';
           	END IF;
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un pedido
CREATE OR REPLACE FUNCTION delete_pedido(newNumero INT) 
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM PEDIDO WHERE Numero = newNumero AND Activo) THEN
            RAISE EXCEPTION 'Pedido no registrado';
        ELSE
            UPDATE PEDIDO SET Activo=false WHERE Numero=newNumero;
            UPDATE MEDICAMENTOXPEDIDO SET Activo=false WHERE Pedido=newNumero;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE PEDIDO SET Activo=false WHERE Numero = '||''''||newNumero||''''||';');
                perform dblink_exec('UPDATE MEDICAMENTOXPEDIDO SET Activo=false WHERE Pedido = '||''''||newNumero||''''||';');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;
    
    
---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar una factura
CREATE OR REPLACE FUNCTION insert_factura(newFecha DATE,newHora TIME,newTotal INT,newTipo CHAR(1),newCaja INT,
                                          newEmpleado INT,newCliente INT,newMedicamento JSON) 
    RETURNS void AS $$
    DECLARE 
    medica VARCHAR(50);
    cant INT;
    medicamentoCompra JSON;
    newId BIGINT;
    BEGIN 
        IF NOT EXISTS (SELECT * FROM CAJA WHERE Id = newCaja AND Activo) THEN
            RAISE EXCEPTION 'Caja no registrada';
        ELSIF NOT EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newEmpleado AND Activo) THEN
            RAISE EXCEPTION 'Empleado no registrado';
        ELSIF NOT EXISTS (SELECT * FROM CLIENTE WHERE Cedula = newCliente AND Activo) THEN
            RAISE EXCEPTION 'Cliente no registrado';
        ELSE
            INSERT INTO FACTURA(Fecha,Hora,Total,Tipo,Caja,Empleado,Cliente,Activo) VALUES
            (newFecha,newHora,newTotal,newTipo,newCaja,newEmpleado,newCliente,true);
            newId = currval(pg_get_serial_sequence('FACTURA', 'id'));
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO FACTURA(Id,Fecha,Hora,Total,Tipo,Caja,Empleado,Cliente,Activo)
                                    VALUES('||''''||newId||''''||','||''''||newFecha||''''||','||''''||newHora||''''||',
                                    '||''''||newTotal||''''||','||''''||newTipo||''''||','||''''||newCaja::INT||''''||',
                                    '||''''||newEmpleado||''''||','||''''||newCliente||''''||',true);');
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
        FOR medicamentoCompra IN SELECT * FROM json_array_elements(newMedicamento)
        LOOP
        	IF EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = medicamentoCompra->>'Medicamento' AND Activo) THEN
            	IF EXISTS (SELECT * FROM MEDICAMENTOXSUCURSAL WHERE Medicamento = medicamentoCompra->>'Medicamento' 
                           AND Sucursal=(SELECT Sucursal FROM CAJA WHERE Id=newCaja) 
                           AND Cantidad >= (medicamentoCompra->>'Cantidad')::INT AND  Activo) THEN
            		INSERT INTO MEDICAMENTOXFACTURA(Medicamento,Factura,Cantidad,Activo) 
                    VALUES (medicamentoCompra->>'Medicamento',newId,(medicamentoCompra->>'Cantidad')::INT,true);
                	UPDATE MEDICAMENTOXSUCURSAL SET Cantidad=Cantidad-(medicamentoCompra->>'Cantidad')::INT 
                    WHERE Sucursal=(SELECT Sucursal FROM CAJA WHERE Id=newCaja) AND
                    Medicamento=medicamentoCompra->>'Medicamento';
                    BEGIN
                    	newId = currval(pg_get_serial_sequence('FACTURA','id'))::INT;
                    	medica=medicamentoCompra->>'Medicamento';
                    	cant=(medicamentoCompra->>'Cantidad')::INT;
                        perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                        perform dblink_exec('INSERT INTO MEDICAMENTOXFACTURA(Medicamento,Factura,Cantidad,Activo)
                                        VALUES('||''''||medica||''''||','||''''||newId||''''||','||''''||cant||''''||',true);');
                        perform dblink_exec('UPDATE MEDICAMENTOXSUCURSAL SET Cantidad=Cantidad-'||''''||cant::INT||''''||'
                                    		WHERE Sucursal=(SELECT Sucursal FROM CAJA WHERE Id='||''''||newCaja||''''||') AND
                                      		Medicamento='||''''||medica||''''||';');
                        perform dblink_disconnect();
                        EXCEPTION WHEN OTHERS THEN 
                        BEGIN 
                            RAISE NOTICE 'No hay conexion con la otra base de datos';
                        END;
                    END;
                ELSE
                	RAISE EXCEPTION 'No hay medicamento';
                END IF;
            ELSE
            	RAISE EXCEPTION 'Medicamento no registrado';
           	END IF;
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un medicamento en una sucursal
CREATE OR REPLACE FUNCTION insert_medicamentoxsucursal(newSucursal VARCHAR(50),newMedicamento VARCHAR(50),newCantidad INT,
                                                       newStockMinimo INT,newStockPromedio INT) 
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            RAISE EXCEPTION 'Sucursal no registrada';
        ELSIF NOT EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = newMedicamento AND Activo) THEN
            RAISE EXCEPTION 'Medicamento no registrado';
       	ELSE 
            INSERT INTO MEDICAMENTOXSUCURSAL(Sucursal,Medicamento,Cantidad,StockMinimo,StockPromedio,Activo) VALUES
            (newSucursal,newMedicamento,newCantidad,newStockMinimo,newStockPromedio,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO MEDICAMENTOXSUCURSAL(Sucursal,Medicamento,Cantidad,StockMinimo,StockPromedio,Activo)
                                        VALUES('||''''||newSucursal||''''||','||''''||newMedicamento||''''||','||''''||newCantidad||''''||',
                                            '||''''||newStockMinimo||''''||','||''''||newStockPromedio||''''||',true);');     
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para actualizar la cantidad de medicamento en una sucursal
CREATE OR REPLACE FUNCTION update_medicamentoxsucursal(newSucursal VARCHAR(50),newMedicamento VARCHAR(50),newCantidad INT)
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            RAISE EXCEPTION 'Sucursal no registrada';
        ELSIF NOT EXISTS (SELECT * FROM MEDICAMENTO WHERE Nombre = newMedicamento AND Activo) THEN
            RAISE EXCEPTION 'Medicamento no registrado';
        ELSIF NOT EXISTS (SELECT * FROM MEDICAMENTOXSUCURSAL WHERE Sucursal = newSucursal AND Medicamento=newMedicamento AND Activo) THEN
            RAISE EXCEPTION 'Medicamento no registrado en la sucursal';
        ELSE
            UPDATE MEDICAMENTOXSUCURSAL SET Cantidad=Cantidad+newCantidad WHERE Sucursal=newSucursal AND Medicamento=newMedicamento;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE MEDICAMENTOXSUCURSAL SET Cantidad=Cantidad+'||''''||newCantidad::INT||''''||'
                                        WHERE Sucursal='||''''||newSucursal||''''||' AND Medicamento='||''''||newMedicamento||''''||';');             
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar un empleado por caja
CREATE OR REPLACE FUNCTION insert_empleadoxcaja(newEmpleado INT,newCaja INT,newFechaInicio DATE, newHoraInicio TIME,
                                                       newFechaFinal DATE, newHoraFinal TIME,newEfectivoInicial INT,newEfectivoFinal INT) 
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM EMPLEADO WHERE Cedula = newEmpleado AND Activo) THEN
            RAISE EXCEPTION 'Empleado no registrado';
        ELSIF NOT EXISTS (SELECT * FROM CAJA WHERE Id = newCaja AND Activo) THEN
            RAISE EXCEPTION 'Caja no registrada';
        ELSE
            INSERT INTO EMPLEADOXCAJA(Empleado,Caja,FechaInicio,HoraInicio,
            FechaFinal,HoraFinal,EfectivoInicial,EfectivoFinal,Activo) VALUES
            (newEmpleado,newCaja,newFechaInicio,newHoraInicio,
            newFechaFinal,newHoraFinal,newEfectivoInicial,newEfectivoFinal,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO EMPLEADOXCAJA(Empleado,Caja,FechaInicio,HoraInicio,FechaFinal,
                                    HoraFinal,EfectivoInicial,EfectivoFinal,Activo)
                                        VALUES('||''''||newEmpleado||''''||','||''''||newCaja||''''||','||''''||newFechaInicio||''''||',
                                    '||''''||newHoraInicio||''''||','||''''||newFechaFinal||''''||','||''''||newHoraFinal||''''||',
                                    '||''''||newEfectivoInicial||''''||','||''''||newEfectivoFinal||''''||',true);');            
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para insertar una caja
CREATE OR REPLACE FUNCTION insert_caja(newCaja INT,newSucursal VARCHAR(50)) 
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM SUCURSAL WHERE Nombre = newSucursal AND Activo) THEN
            RAISE EXCEPTION 'Sucursal no registrada';
        ELSIF EXISTS (SELECT * FROM CAJA WHERE Id = newCaja AND Activo) THEN
            RAISE EXCEPTION 'Caja ya registrada';
         ELSIF EXISTS (SELECT * FROM CAJA WHERE Id = newCaja AND NOT Activo) THEN
            UPDATE CAJA SET Activo=true,Sucursal=newSucursal WHERE Id = newCaja;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE CAJA SET Activo=true,Sucursal='||''''||newSucursal||''''||' 
                                    WHERE Id = '||''''||newCaja||''''||';');            
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        ELSE
            INSERT INTO CAJA(Id,Sucursal,Activo) VALUES (newCaja,newSucursal,true);
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('INSERT INTO CAJA(Id,Sucursal,Activo) 
                                    VALUES ('||''''||newCaja||''''||','||''''||newSucursal||''''||',true);');            
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------

--Procedimiento almacenado para eliminar una caja
CREATE OR REPLACE FUNCTION delete_caja(newCaja INT) 
    RETURNS void AS $$
    BEGIN 
        IF NOT EXISTS (SELECT * FROM CAJA WHERE Id = newCaja AND Activo) THEN
            RAISE EXCEPTION 'Caja no registrada';
        ELSE
            UPDATE CAJA SET Activo=false WHERE Id=newCaja;
            BEGIN
                perform dblink_connect('dbname=gasStationBD user=BD3rb password=proyecto2BD 
                                  host=gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com port=5432');
                perform dblink_exec('UPDATE CAJA SET Activo=false WHERE Id = '||''''||newCaja||''''||';');            
                perform dblink_disconnect();
                EXCEPTION WHEN OTHERS THEN 
                BEGIN 
                    RAISE NOTICE 'No hay conexion con la otra base de datos';
                END;
            END;
        END IF;
    END;
    $$ LANGUAGE plpgsql;