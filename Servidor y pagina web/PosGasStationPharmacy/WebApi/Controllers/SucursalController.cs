using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApi.Models;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que maneja las acciones sobre la sucursal
    /// </summary>
    public class SucursalController : ApiController
    {

        /// <summary>
        /// Crea una sucursal nueva
        /// </summary>
        /// <param name="sucursal">Informacion de la sucursal</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("agregarSucursal")]
        public HttpResponseMessage AgregarSucursal(sucursalAdmin sucursal)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarSucursal(sucursal.nombre,sucursal.provincia,sucursal.ciudad,sucursal.senas,sucursal.descripcion,sucursal.compania,sucursal.administrador);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Borra una sucursal
        /// </summary>
        /// <param name="obj">Json que trae en opcion el nombre de la sucursal a borrar</param>
        /// <returns>HTTP Status code OK si se borra, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("borrarSucursal")]
        public HttpResponseMessage BorrarSucursal(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarSucursal(obj.opcion);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Actualiza la informacion de una sucursal
        /// </summary>
        /// <param name="sucursal">Informacion de la sucursal</param>
        /// <returns>HTTP Status code OK si se actualiza, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("actualizarSucursal")]
        public HttpResponseMessage ActualizarSucursal(sucursal sucursal)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarSucursal(sucursal.nombre, sucursal.provincia, sucursal.ciudad, sucursal.senas, sucursal.descripcion, sucursal.compania);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta las sucursales de una compania
        /// </summary>
        /// <param name="obj">Json que trae en opcion el nombre de la compania</param>
        /// <returns>HTTP Status code OK y la informacion de la sucursal, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("consultarSucursales")]
        public HttpResponseMessage ConsultarSucursal(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var sucursales = entities.sucursal.Select(p => new { p.nombre, p.provincia, p.descripcion, p.ciudad, p.senas, p.compania, p.activo }).
                            Where((x) => x.activo && x.compania==obj.opcion).OrderBy((x) => x.nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, sucursales);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
        
    }
}