using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApi.Models;
using System.Linq;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que maneja las acciones de los proveedores
    /// </summary>
    public class ProveedorController : ApiController
    {
        /// <summary>
        /// Agrega un proveedor al sistema
        /// </summary>
        /// <param name="Proveedor">Informacion del proveedor a agregar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("agregarProveedor")]
        public HttpResponseMessage AgregarProveedor(proveedor Proveedor)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarProveedor(Proveedor.nombre,Proveedor.sede);
                        
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                   catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Borra un proveedor del sistema
        /// </summary>
        /// <param name="obj">Json que trae en opcion el nombre del proveedor a eliminar</param>
        /// <returns>HTTP Status code OK si se borra, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("borrarProveedor")]
        public HttpResponseMessage BorrarProveedor(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarProveedor(obj.opcion);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Actualiza la informacion de un proveedor
        /// </summary>
        /// <param name="proveedor">Informacion del proveedor a actualizar</param>
        /// <returns>HTTP Status code OK si se actualiza, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("actualizarProveedor")]
        public HttpResponseMessage ActualizarProveedor(proveedor proveedor)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarProveedor(proveedor.nombre,proveedor.sede);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta todos los proveedores del sistema
        /// </summary>
        /// <returns>HTTP Status code OK y la informacion de los proveedores, Unauthorized en caso contrario</returns>
        [HttpGet]
        [Route("consultarProveedores")]
        public HttpResponseMessage ConsultarProveedores()
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var proveedores = entities.proveedor.Select(p => new { p.nombre, p.sede, p.activo}).
                            Where((x) => x.activo).OrderBy((x) => x.nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,proveedores);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}
