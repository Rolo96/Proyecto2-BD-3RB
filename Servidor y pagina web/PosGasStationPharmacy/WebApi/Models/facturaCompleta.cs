
using System;

namespace WebApi.Models
{
    /// <summary>
    /// Modelo que recibe la informacion de una factura
    /// </summary>
    public class facturaCompleta
    {
        public int caja { get; set; }
        public int cliente { get; set; }
        public int empleado { get; set; }
        public DateTime fecha { get; set; }
        public DateTime hora { get; set; }
        public int total { get; set; }
        public int pedido { get; set; }
        public string tipo { get; set; }
        public string productos { get; set; }
    }
}