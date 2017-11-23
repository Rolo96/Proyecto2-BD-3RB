using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApi.Models;
using System.Linq;

namespace WebApi.Controllers
{
    /// <summary>
    /// Clase que maneja las acciones sobre los medicamentos
    /// </summary>
    public class MedicamentoController : ApiController
    {
        /// <summary>
        /// Agrega un medicamento al sistema
        /// </summary>
        /// <param name="medicamento">Informacion del medicamento a agregar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("agregarMedicamento")]
        public HttpResponseMessage AgregarMedicamento(medicamento medicamento)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarMedicamento(medicamento.nombre, medicamento.precio, medicamento.prescripcion, medicamento.proveedor);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    } 
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Agrega medicamentos a una sucursal en especifico
        /// </summary>
        /// <param name="medicamento">Informacion del medicamento a agregar</param>
        /// <returns>HTTP Status code OK si se agrego, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("agregarMedicamentoSucursal")]
        public HttpResponseMessage AgregarMedicamentoSucursal(medicamentoxsucursal medicamento)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarMedicamentoxsucursal(medicamento.sucursal, medicamento.medicamento, medicamento.cantidad, medicamento.stockminimo, medicamento.stockpromedio);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Actualiza la cantidad de medicamento de la sucursal
        /// </summary>
        /// <param name="medicamento">Informacion del medicamento a actualizar</param>
        /// <returns>HTTP Status code OK si se actualiza, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("actualizarMedicamentoSucursal")]
        public HttpResponseMessage ActualizarMedicamentoSucursal(medicamentoxsucursal medicamento)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarMedicamentoxsucursal(medicamento.sucursal, medicamento.medicamento, medicamento.cantidad);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Borra un medicamento del sistema
        /// </summary>
        /// <param name="obj">Json que trae en opcion el nombre del medicamento a borrar</param>
        /// <returns>HTTP Status code OK si se borra, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("borrarMedicamento")]
        public HttpResponseMessage BorrarMedicamento(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarMedicamento(obj.opcion);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Actualiza la informacion de un medicamento
        /// </summary>
        /// <param name="medicamento">Informacion a actualizar</param>
        /// <returns>HTTP Status code OK si se actualiza, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("actualizarMedicamento")]
        public HttpResponseMessage ActualizarMedicamento(medicamento medicamento)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarMedicamento(medicamento.nombre, medicamento.precio, medicamento.prescripcion, medicamento.proveedor);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta todos los medicamentos del sistema
        /// </summary>
        /// <returns>HTTP Status OK y la informacion de los medicamentos, Unauthorized en caso contrario</returns>
        [HttpGet]
        [Route("consultarMedicamentos")]
        public HttpResponseMessage ConsultarMedicamentos()
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var medicamentos = entities.medicamento.Select(m => new { m.nombre, m.precio, m.prescripcion, m.proveedor, m.activo}).
                            Where((x) => x.activo).OrderBy((x) => x.nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,medicamentos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta la informacion de los medicamentos de una sucursal en especifico
        /// </summary>
        /// <param name="obj">Json que trae en opcion la sucursal</param>
        /// <returns>HTTP Status code OK y la informacion de los medicamentos, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("consultarMedicamentosSucursal")]
        public HttpResponseMessage consultarMedicamentosSucursal(objGeneral obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var medicamentos = (from m in entities.medicamento
                                         join ms in entities.medicamentoxsucursal on m.nombre equals ms.medicamento
                                         where ms.activo && ms.sucursal == obj.opcion
                                         select new
                                         {
                                             m.nombre,
                                             m.precio,
                                             m.prescripcion
                                         }).OrderBy((x) => x.nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,medicamentos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Consulta la cantidad de un medicamento en una sucursal
        /// </summary>
        /// <param name="obj">Json que trae en opcion el medicamento y en opcion2 la sucursal</param>
        /// <returns>HTTP Status code OK y las cantidades del medicamento en la sucursal, Unauthorized en caso contrario</returns>
        [HttpPost]
        [Route("verificarCantidad")]
        public HttpResponseMessage verificarCantidad(objGeneral2 obj)
        {
            using (gasStationBDEntities entities = new gasStationBDEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var medicamentos = entities.medicamentoxsucursal.Select(m => new { m.cantidad, m.stockminimo, m.activo, m.medicamento, m.sucursal }).
                            Where((x) => x.activo && x.medicamento==obj.opcion && x.sucursal==obj.opcion2).First();
                        return Request.CreateResponse(HttpStatusCode.OK, medicamentos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

    }
}
