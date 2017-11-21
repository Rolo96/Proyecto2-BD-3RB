using System.Net;
using System.Net.Http;
using System.Web.Http;
using AccesoBaseDatos;
using System.Data;
using WebApi.Models;
using System.Linq;

namespace WebApi.Controllers
{
    public class ProveedorController : ApiController
    {
        
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
