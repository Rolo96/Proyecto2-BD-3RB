using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class empleado
    {
        [Key]
        public int cedula {get; set;}
        public string nombre1 {get; set;}
        public string nombre2{get; set;}
        public string apellido1{get; set;}
        public string apellido2{get; set;}
        public string cuidad{get; set;}
        public string provincia{get; set;}
        public string senas{get; set;}
        public DateTime fechanacimiento {get; set;}
        public string contrasena{get; set;}
        public string rol{get; set;}
        public string sucursal{get; set;}
        public Boolean activo{get; set;}
    }
}