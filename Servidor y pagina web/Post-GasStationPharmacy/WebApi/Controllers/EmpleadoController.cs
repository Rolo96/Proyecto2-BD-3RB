using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BDAccess;
using System.Data;
using WebApi.Models;
using System.Linq;

namespace WebApi.Controllers
{
    public class EmpleadoController : ApiController
    {
        [HttpPost]
        [Route("agregarEmpleado")]
        public HttpResponseMessage AgregarEmpleado(empleado empleado)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarEmpleado(empleado.cedula, empleado.nombre1,empleado.nombre2,empleado.apellido1,empleado.apellido2,
                            empleado.provincia,empleado.ciudad,empleado.senas,empleado.fechanacimiento,empleado.contrasena,empleado.sucursal,empleado.rol);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("borrarEmpleado")]
        public HttpResponseMessage BorrarEmpleado(objGeneral obj)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarEmpleado(obj.opcion2);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
        /*
        [HttpPost]
        [Route("actualizarProveedor")]
        public HttpResponseMessage ActualizarProveedor(proveedor proveedor)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarProveedor(proveedor.nombre, proveedor.sede);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }*/

        [HttpGet]
        [Route("consultarEmpleados")]
        public HttpResponseMessage ConsultarEmpleados()
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var empleados = entities.empleado.Select(p => new { p.cedula, p.nombre1, p.apellido1, p.sucursal, p.rol }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, empleados);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
    }
}
