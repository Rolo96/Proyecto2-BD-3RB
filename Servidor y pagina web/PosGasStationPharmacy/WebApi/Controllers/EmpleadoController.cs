using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApi.Models;
using System.Text;
using System.Security.Cryptography;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase para realizar las acciones relacionadas a los empleados
    /// </summary>
    public class EmpleadoController : ApiController
    {
        /// <summary>
        /// Agrega un empleado al sistema
        /// </summary>
        /// <param name="empleado">informacion del empleado a agregar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Borra un empleado del sistema
        /// </summary>
        /// <param name="obj">Json que tiene en opcion2 la cedula del empleado a borrar</param>
        /// <returns>HTTP Status code OK si se borra, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Actualiza la informacion de un empleado
        /// </summary>
        /// <param name="empleado">informacion del empleado a actualizar</param>
        /// <returns>HTTP Status code OK si se actualizo, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Consulta todos los empleados de una compania
        /// </summary>
        /// <param name="obj">Json que trae la compania en opcion</param>
        /// <returns>HTTP Status code OK y la informacion de los empleados, Unauthorized en caso contrario</returns>
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
                                         }).OrderBy((x) => x.nombre1).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, empleados);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta todos los roles del sistema
        /// </summary>
        /// <returns>HTTP Status code OK y la informacion de los roles, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Verifica las credenciales de un empleado
        /// </summary>
        /// <param name="obj">Json que trae en opcion la contrasena y en opcion2 la cedua del empleado</param>
        /// <returns>HTTP Status code OK si existe, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Verifica las credenciales de un supervisor para eliminar un producto de una venta
        /// </summary>
        /// <param name="obj">Json que trae en opcion la contrasena y en opcion2 la cedua del empleado</param>
        /// <returns>HTTP Status code OK si existe, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("verificarSupervisor")]
        public HttpResponseMessage verificarSupervisor(objGeneral obj)
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
                            Where((x) => x.activo && x.cedula == obj.opcion2 && x.contrasena == contrasena).First();
                        rol = empleado.rol;
                        if (rol != "Supervisor")
                        {
                            return Request.CreateResponse(HttpStatusCode.Unauthorized);
                        }
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Genera la clave en md5
        /// </summary>
        /// <param name="input">contrasena a convertir en MD5</param>
        /// <returns>contrasena en md5</returns>
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
