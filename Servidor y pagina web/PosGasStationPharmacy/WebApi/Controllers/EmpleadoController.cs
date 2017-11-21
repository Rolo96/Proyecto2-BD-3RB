using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AccesoBaseDatos;
using System.Data;
using WebApi.Models;
using System.Text;
using System.Security.Cryptography;

namespace WebApi.Controllers
{
    public class EmpleadoController : ApiController
    {
        
        [HttpPost]
        [Route("agregarEmpleado")]
        public HttpResponseMessage AgregarEmpleado(empleado empleado)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarEmpleado(empleado.cedula, empleado.nombre1,empleado.nombre2,empleado.apellido1,empleado.apellido2,
                            empleado.provincia,empleado.ciudad,empleado.senas,empleado.fechanacimiento,empleado.contrasena,empleado.sucursal,empleado.rol);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("borrarEmpleado")]
        public HttpResponseMessage BorrarEmpleado(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarEmpleado(obj.opcion2);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
        
        [HttpPost]
        [Route("actualizarEmpleado")]
        public HttpResponseMessage ActualizarEmpleado(empleado empleado)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarEmpleado(empleado.cedula,empleado.nombre1,empleado.nombre2,empleado.apellido1,empleado.apellido2,empleado.provincia,
                            empleado.ciudad,empleado.senas,empleado.fechanacimiento,empleado.sucursal,empleado.rol);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("consultarEmpleados")]
        public HttpResponseMessage ConsultarEmpleados(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var empleados = (from e in entities.empleado
                                         join s in entities.sucursal on e.sucursal equals s.nombre
                                         where e.activo && s.compania == obj.opcion
                                         select new {
                                             e.nombre1,e.nombre2,e.cedula,e.apellido1, e.apellido2, e.provincia, e.ciudad, e.senas, e.rol, e.sucursal, e.fechanacimiento
                                         }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, empleados);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpGet]
        [Route("consultarRoles")]
        public HttpResponseMessage ConsultarRoles()
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var roles = entities.rol.Select(p => new { p.nombre, p.activo}).
                            Where((x) => x.activo).OrderBy((x) => x.nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, roles);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("logearEmpleado")]
        public HttpResponseMessage LogearEmpleado(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        string rol = "";
                        string contrasena = MD5Hash(obj.opcion);
                        var empleado = entities.empleado.Select(m => new { m.rol, m.activo, m.cedula, m.contrasena }).
                            Where((x) => x.activo && x.cedula == obj.opcion2 && x.contrasena ==contrasena ).First();
                        rol = empleado.rol;
                        if (rol != "Cajero" && rol != "Administrador") {
                            return Request.CreateResponse(HttpStatusCode.Unauthorized);
                        }
                        var informacion= (from e in entities.empleado
                            join s in entities.sucursal on e.sucursal equals s.nombre
                            where e.activo && e.cedula == obj.opcion2
                            select new{e.sucursal,s.compania, e.rol}).First();
                        return Request.CreateResponse(HttpStatusCode.OK, informacion);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }


        public static string MD5Hash(string input)
        {
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            for (int i = 0; i < bytes.Length; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();
        }

    }
}
