using System;
using System.ComponentModel.DataAnnotations;
namespace WebApi.Models
{
    public class rol
    {
        [Key]
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public Boolean activo { get; set; }
    }
}