using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApi.Models;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que maneja las acciones de las facturas
    /// </summary>
    public class FacturacionController : ApiController
    {
        /// <summary>
        /// Guarda una factura en el sistema
        /// </summary>
        /// <param name="factura">informacion de la factura a guardar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("salvarFactura")]
        public HttpResponseMessage salvarFactura(facturaCompleta factura)
        {
            using ( gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarFactura(factura.fecha,factura.hora.TimeOfDay,factura.total,factura.tipo,factura.caja,factura.empleado,factura.cliente,factura.productos);
                        int id = entities.factura.Max(u => u.id);

                        if (factura.pedido != -1) {
                            entities.BorrarPedido(factura.pedido);
                        }

                        return Request.CreateResponse(HttpStatusCode.OK, id);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}
