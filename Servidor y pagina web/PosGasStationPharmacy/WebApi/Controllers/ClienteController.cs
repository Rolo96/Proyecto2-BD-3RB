using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;
using System.Data; 

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que recibe las peticiones basadas en el cliente
    /// </summary>
    public class ClienteController : ApiController
    {
        /// <summary>
        /// Metodo para agregar un cliente al sistema
        /// </summary>
        /// <param name="cliente">informacion del cliente que se quiere insertar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Borra un cliente del sistema
        /// </summary>
        /// <param name="obj">Json que trae el cliente a borrar en opcion2</param>
        /// <returns>HTTP Status code OK si se borro, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Actualiza la informacion de un cliente
        /// </summary>
        /// <param name="cliente">informacion del cliente a actualizar</param>
        /// <returns>HTTP Status code OK si se actualizo, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Consulta todos los clientes del sistema
        /// </summary>
        /// <returns>HTTP Status code OK y la informacion de los clientes, Unauthorized en caso contrario</returns>
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

        /// <summary>
        /// Verifica si un cliente existe
        /// </summary>
        /// <param name="obj">Json que trae en opcion la contrasena y en opcion2 la cedula del cliente</param>
        /// <returns>HTTP Status code OK si existe, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("verificarCliente")]
        public HttpResponseMessage VerificarCaja(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int cedula = -1;
                        var cliente = entities.cliente.Select(p => new { p.cedula, p.activo }).
                            Where((x) => x.activo && x.cedula == obj.opcion2).First();
                        cedula = cliente.cedula;
                        if (cedula == -1) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}