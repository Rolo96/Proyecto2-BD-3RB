
using System;

namespace WebApi.Models
{
    public class facturaCompleta
    {
        public int caja { get; set; }
        public int cliente { get; set; }
        public int empleado { get; set; }
        public DateTime fecha { get; set; }
        public DateTime hora { get; set; }
        public int total { get; set; }
        //public JsonArray medicamento { get; set; }
    }
}