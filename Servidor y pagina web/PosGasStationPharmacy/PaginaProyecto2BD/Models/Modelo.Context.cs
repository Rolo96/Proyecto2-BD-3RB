﻿//------------------------------------------------------------------------------
// <auto-generated>
//    Este código se generó a partir de una plantilla.
//
//    Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//    Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PaginaProyecto2BD.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class gasStationBDEntities : DbContext
    {
        public gasStationBDEntities()
            : base("name=gasStationBDEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<administradorxsucursal> administradorxsucursal { get; set; }
        public DbSet<caja> caja { get; set; }
        public DbSet<cliente> cliente { get; set; }
        public DbSet<compania> compania { get; set; }
        public DbSet<empleado> empleado { get; set; }
        public DbSet<empleadoxcaja> empleadoxcaja { get; set; }
        public DbSet<factura> factura { get; set; }
        public DbSet<medicamento> medicamento { get; set; }
        public DbSet<medicamentoxfactura> medicamentoxfactura { get; set; }
        public DbSet<medicamentoxpedido> medicamentoxpedido { get; set; }
        public DbSet<medicamentoxsucursal> medicamentoxsucursal { get; set; }
        public DbSet<padecimiento> padecimiento { get; set; }
        public DbSet<pedido> pedido { get; set; }
        public DbSet<proveedor> proveedor { get; set; }
        public DbSet<rol> rol { get; set; }
        public DbSet<sucursal> sucursal { get; set; }
        public DbSet<telefonoxcliente> telefonoxcliente { get; set; }
    }
}