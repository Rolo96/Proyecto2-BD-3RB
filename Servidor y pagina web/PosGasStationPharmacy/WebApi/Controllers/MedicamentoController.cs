using System.Net;
using System.Net.Http;
using System.Web.Http;
using AccesoBaseDatos;
using System.Data;
using WebApi.Models;
using System.Linq;

namespace WebApi.Controllers
{
    public class MedicamentoController : ApiController
    {
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
                                         }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,medicamentos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

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
