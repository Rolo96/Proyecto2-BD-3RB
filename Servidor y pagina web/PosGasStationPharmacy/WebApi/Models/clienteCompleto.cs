using System;
namespace WebApi.Models
{
    public class clienteCompleto
    {
        public int cedula { get; set; }
        public string nombre1 { get; set; }
        public string nombre2 { get; set; }
        public string apellido1 { get; set; }
        public string apellido2 { get; set; }
        public string provincia { get; set; }
        public string ciudad { get; set; }
        public string senas { get; set; }
        public DateTime fechanacimiento { get; set; }
        public string contrasena { get; set; }
        public int prioridad { get; set; }
        public bool activo { get; set; }
        public string telefonos { get; set; }
        public string padecimientos { get; set; }
    }
}