using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AccesoBaseDatos;
using WebApi.Models;
using System.Data; 

namespace WebApi.Controllers
{
    public class ClienteController : ApiController
    {
        [HttpPost]
        [Route("agregarCliente")]
        public HttpResponseMessage AgregarCliente(clienteCompleto cliente)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarCliente(cliente.cedula, cliente.nombre1,cliente.nombre2,cliente.apellido1,cliente.apellido2,cliente.provincia,cliente.ciudad,cliente.senas,cliente.fechanacimiento,
                            cliente.contrasena,1,cliente.telefonos,cliente.padecimientos);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("borrarCliente")]
        public HttpResponseMessage BorrarCliente(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarCliente(obj.opcion2);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("actualizarCliente")]
        public HttpResponseMessage ActualizarCliente(clienteCompleto cliente)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarCliente(cliente.cedula, cliente.nombre1, cliente.nombre2, cliente.apellido1, cliente.apellido2, 
                            cliente.provincia, cliente.ciudad,cliente.senas,cliente.fechanacimiento,1);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpGet]
        [Route("consultarClientes")]
        public HttpResponseMessage ConsultarClientes()
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var clientes = entities.cliente.Select(p => new { p.cedula, p.nombre1, p.nombre2, p.apellido1, p.apellido2, p.ciudad, p.provincia, p.senas, p.fechanacimiento, p.activo }).
                            Where((x) => x.activo).OrderBy((x) => x.cedula).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, clientes);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }


    }
}
