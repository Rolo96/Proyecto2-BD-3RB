using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BDAccess;
using System.Data;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class SucursalController : ApiController
    {
        [HttpPost]
        [Route("agregarSucursal")]
        public HttpResponseMessage AgregarSucursal(sucursalAdmin sucursal)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarSucursal(sucursal.nombre,sucursal.provincia,sucursal.ciudad,sucursal.senas,sucursal.descripcion,sucursal.compania,sucursal.administrador);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("borrarSucursal")]
        public HttpResponseMessage BorrarSucursal(objGeneral obj)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarSucursal(obj.opcion);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("actualizarSucursal")]
        public HttpResponseMessage ActualizarSucursal(sucursal sucursal)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarSucursal(sucursal.nombre, sucursal.provincia, sucursal.ciudad, sucursal.senas, sucursal.descripcion, sucursal.compania);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpGet]
        [Route("consultarSucursales")]
        public HttpResponseMessage ConsultarSucursal()
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var sucursales = entities.sucursal.Select(p => new { p.nombre, p.provincia, p.compania }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, sucursales);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
    }
}
