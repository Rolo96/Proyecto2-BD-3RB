﻿namespace WebApi.Models
{
    /// <summary>
    /// Modelo que recibe la informacion para crear una sucursal
    /// </summary>
    public class sucursalAdmin
    {
        public string nombre {get; set;}
        public string provincia {get; set;}
        public string ciudad {get; set;}
        public string senas {get; set;}
        public string compania {get; set;}
        public string descripcion { get; set; }
        public int administrador {get; set;}
    }
}