//------------------------------------------------------------------------------
// <auto-generated>
//    Este código se generó a partir de una plantilla.
//
//    Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//    Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BDAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class factura
    {
        public factura()
        {
            this.medicamentoxfactura = new HashSet<medicamentoxfactura>();
        }
    
        public int id { get; set; }
        public System.DateTime fecha { get; set; }
        public System.TimeSpan hora { get; set; }
        public int total { get; set; }
        public bool activo { get; set; }
        public int caja { get; set; }
        public int empleado { get; set; }
        public int cliente { get; set; }
    
        public virtual caja caja1 { get; set; }
        public virtual cliente cliente1 { get; set; }
        public virtual empleado empleado1 { get; set; }
        public virtual ICollection<medicamentoxfactura> medicamentoxfactura { get; set; }
    }
}