using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;
using System.Data;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que maneja las acciones de los pedidos
    /// </summary>
    public class PedidoController : ApiController
    {
        /// <summary>
        /// Consulta los pedidos que hay en una sucursal
        /// </summary>
        /// <param name="obj">Json que trae en opcion la sucursal</param>
        /// <returns>HTTP Status code OK y la informacion de los pedidos, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("consultarPedidos")]
        public HttpResponseMessage ConsultarPedidos(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var pedidos = (from p in entities.pedido
                                         where p.activo && p.sucursal == obj.opcion
                                         select new
                                         {
                                             p.numero,
                                             p.cliente
                        }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, pedidos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta los medicamentos de un pedido
        /// </summary>
        /// <param name="obj">Json que trae en opcion2 el numero del pedido</param>
        /// <returns>HTTP Status code OK y los medicamentos del pedido, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("consultarDetallePedido")]
        public HttpResponseMessage consultarDetallePedido(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var detallePedido = (from medPed in entities.medicamentoxpedido
                                             join med in entities.medicamento on medPed.medicamento equals med.nombre
                                             where medPed.pedido == obj.opcion2
                                         select new
                                         {
                                             medPed.medicamento,
                                             medPed.cantidad,
                                             med.precio
                                         }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, detallePedido);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}
