using System.Net.Http;
using System.Web.Http;
using WebApi.Models;
using System.Linq;
using System.Net;
using System.Data;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase para realizar consultas generales sobre las cajas y demas
    /// </summary>
    public class ConsultasGeneralesController : ApiController
    {
        /// <summary>
        /// Verifica si existe una caja en la sucursal
        /// </summary>
        /// <param name="obj">Json que trae en opcion la sucursal y en opcion2 el numero de la caja</param>
        /// <returns>HTTP Status code OK si existe, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("verificarCaja")]
        public HttpResponseMessage VerificarCaja(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int id = -1;
                        var caja = entities.caja.Select(p => new { p.id, p.activo, p.sucursal}).
                            Where((x) => x.activo && x.id==obj.opcion2 && x.sucursal==obj.opcion).First();
                        id = caja.id;
                        if (id == -1) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Genera el registro del cierre de una caja y devuelve las facturas generadas desde que se abrio la caja
        /// </summary>
        /// <param name="caja">informacion a almacenar del cierre de caja</param>
        /// <returns>HTTP Status code OK si se agrego el registro y las facturas, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("cerrarCaja")]
        public HttpResponseMessage cerrarCaja(empleadoxcaja caja)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.Cerrarcaja(caja.empleado, caja.caja, caja.fechainicio, caja.horainicio, 
                            caja.fechafinal, caja.horafinal,caja.efectivoinicial, caja.efectivofinal);
                        var facturas = entities.factura.Select(p => new { p.id, p.cliente, p.fecha, p.hora, p.tipo, p.total, p.activo, p.empleado, p.caja }).
                            Where((x) => x.activo && x.empleado==caja.empleado && x.caja==caja.caja && x.fecha<=caja.fechafinal && x.fecha>=caja.fechainicio
                            && x.hora <= caja.horafinal && x.hora >= caja.horainicio).OrderBy((x) => x.id).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, facturas);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}