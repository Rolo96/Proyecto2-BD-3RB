CREATE TABLE COMPANIA(
	Nombre varchar(50) NOT NULL,
	Sede varchar(50),
	Activo boolean NOT NULL,
	PRIMARY KEY (Nombre)
);

CREATE TABLE SUCURSAL(
	Nombre varchar(50) NOT NULL,
	Provincia varchar(20) NOT NULL,
	Ciudad varchar(20),
	Senas varchar(50),
	Descripcion varchar(50),
    Activo boolean NOT NULL,
	Compania varchar(50) NOT NULL,
	PRIMARY KEY (Nombre)
);

CREATE TABLE CAJA(
	Id INT NOT NULL,
    Activo boolean NOT NULL,
    Sucursal varchar(50) NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE EMPLEADO(
	Cedula int NOT NULL,
	Nombre1 varchar(20) NOT NULL,
	Nombre2 varchar(20),
	Apellido1 varchar(20) NOT NULL,
	Apellido2 Varchar(20),
	Provincia varchar(20) NOT NULL,
	Ciudad varchar(20),
	Senas varchar(50),
	FechaNacimiento date NOT NULL,
	Contrasena varchar(200) NOT NULL,
	Activo boolean NOT NULL,
    Sucursal varchar(50) NOT NULL,
	Rol varchar(20) NOT NULL,
	PRIMARY KEY (Cedula)
);

CREATE TABLE ROL(
	Nombre varchar(20) NOT NULL,
	Descripcion varchar(50),
	Activo boolean NOT NULL,
	PRIMARY KEY (Nombre)
);

CREATE TABLE CLIENTE(
	Cedula int NOT NULL,
	Nombre1 varchar(20) NOT NULL,
	Nombre2 varchar(20),
	Apellido1 varchar(20) NOT NULL,
	Apellido2 varchar(20),
	Provincia varchar(20) NOT NULL,
	Ciudad varchar(30),
	Senas varchar(50),
	FechaNacimiento date NOT NULL,
    Contrasena varchar(200) NOT NULL,
	Prioridad int NOT NULL,
	Activo boolean NOT NULL,
	PRIMARY KEY (Cedula)
);

CREATE TABLE TELEFONOXCLIENTE(
	Cliente int NOT NULL,
	Telefono int NOT NULL,
	Activo boolean NOT NULL,
	PRIMARY KEY (Cliente,Telefono)
);

CREATE TABLE PADECIMIENTO(
    Cliente int NOT NULL,
	Padecimiento varchar(50) NOT NULL,
	Ano int NOT NULL,
	Activo boolean NOT NULL,
	PRIMARY KEY (Cliente,Padecimiento,Ano)
);

CREATE TABLE PROVEEDOR(
	Nombre varchar(50) NOT NULL,
	Sede varchar(50),
	Activo boolean NOT NULL,
	PRIMARY KEY (Nombre)
);

CREATE TABLE MEDICAMENTO(
	Nombre varchar(50) NOT NULL,
    Precio int NOT NULL,
	Prescripcion boolean NOT NULL,
    Activo boolean NOT NULL,
	Proveedor varchar(50) NOT NULL,
	PRIMARY KEY (Nombre)
);

CREATE TABLE FACTURA(
	Id serial NOT NULL,
    Fecha date NOT NULL,
    Hora time NOT NULL,
    Total int NOT NULL,
    Activo boolean NOT NULL,
    Caja int NOT NULL,
    Empleado int NOT NULL,
    Cliente int NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE ADMINISTRADORXSUCURSAL(
	Administrador int NOT NULL,
	Sucursal varchar(50) NOT NULL,
	Activo boolean NOT NULL,
	PRIMARY KEY (Administrador,Sucursal)
);

CREATE TABLE MEDICAMENTOXFACTURA(
	Medicamento varchar(50) NOT NULL,
    Factura int NOT NULL,
    Cantidad int NOT NULL,
    Activo boolean NOT NULL,
    PRIMARY KEY(Medicamento,Factura)
);

CREATE TABLE MEDICAMENTOXSUCURSAL(
	Medicamento varchar(50) NOT NULL,
    Sucursal varchar(50) NOT NULL,
    Cantidad int NOT NULL,
    StockMinimo int NOT NULL,
    StockPromedio int NOT NULL,
    Activo boolean NOT NULL,
    PRIMARY KEY(Medicamento,Sucursal)
);

CREATE TABLE EMPLEADOXCAJA(
	Empleado int NOT NULL,
    Caja int NOT NULL,
    FechaInicio date NOT NULL,
    FechaFinal date NOT NULL,
    HoraInicio time NOT NULL,
    HoraFinal time NOT NULL,
    EfectivoInicial int NOT NULL,
    EfectivoFinal int NOT NULL,
    Activo boolean NOT NULL,
    PRIMARY KEY(Empleado,Caja)
);

ALTER TABLE SUCURSAL 
ADD CONSTRAINT FK_COMP_SUCUR FOREIGN KEY (Compania) REFERENCES COMPANIA(Nombre);

ALTER TABLE EMPLEADO 
ADD CONSTRAINT FK_SUCUR_EMP FOREIGN KEY (Sucursal) REFERENCES Sucursal(Nombre);

ALTER TABLE EMPLEADO 
ADD CONSTRAINT FK_ROL_EMP FOREIGN KEY (Rol) REFERENCES ROL(Nombre);

ALTER TABLE CAJA 
ADD CONSTRAINT FK_SUCUR_CAJA FOREIGN KEY (Sucursal) REFERENCES SUCURSAL(Nombre);

ALTER TABLE MEDICAMENTO 
ADD CONSTRAINT FK_PROVEEDOR_MEDI FOREIGN KEY (Proveedor) REFERENCES PROVEEDOR(Nombre);

ALTER TABLE FACTURA 
ADD CONSTRAINT FK_CAJA_FAC FOREIGN KEY (Caja) REFERENCES CAJA(Id);

ALTER TABLE FACTURA 
ADD CONSTRAINT FK_EMP_FAC FOREIGN KEY (Empleado) REFERENCES EMPLEADO(Cedula);

ALTER TABLE FACTURA 
ADD CONSTRAINT FK_CLI_FAC FOREIGN KEY (Cliente) REFERENCES CLIENTE(Cedula);

ALTER TABLE PADECIMIENTO 
ADD CONSTRAINT FK_CLIENTE_PED FOREIGN KEY (Cliente) REFERENCES CLIENTE(Cedula);

ALTER TABLE ADMINISTRADORXSUCURSAL
ADD CONSTRAINT FK_ADMIN_SUCUR FOREIGN KEY (Administrador) REFERENCES EMPLEADO(Cedula);

ALTER TABLE ADMINISTRADORXSUCURSAL
ADD CONSTRAINT FK_SUCUR_ADMIN FOREIGN KEY (Sucursal) REFERENCES Sucursal(Nombre);

ALTER TABLE TELEFONOXCLIENTE 
ADD CONSTRAINT FK_CLIENTE_TEL FOREIGN KEY (Cliente) REFERENCES CLIENTE(Cedula);

ALTER TABLE MEDICAMENTOXSUCURSAL 
ADD CONSTRAINT FK_MEDICA_SUCUR FOREIGN KEY (Medicamento) REFERENCES MEDICAMENTO(Nombre);

ALTER TABLE MEDICAMENTOXSUCURSAL 
ADD CONSTRAINT FK_SUCUR_MEDICA FOREIGN KEY (Sucursal) REFERENCES SUCURSAL(Nombre);

ALTER TABLE MEDICAMENTOXFACTURA
ADD CONSTRAINT FK_MEDICA_FACT FOREIGN KEY (Medicamento) REFERENCES MEDICAMENTO(Nombre);

ALTER TABLE MEDICAMENTOXFACTURA 
ADD CONSTRAINT FK_FACT_MEDICA FOREIGN KEY (Factura) REFERENCES FACTURA(Id);

ALTER TABLE EMPLEADOXCAJA
ADD CONSTRAINT FK_EMP_CAJA FOREIGN KEY (Empleado) REFERENCES EMPLEADO(Cedula);

ALTER TABLE EMPLEADOXCAJA
ADD CONSTRAINT FK_CAJA_EMP FOREIGN KEY (Caja) REFERENCES CAJA(Id);