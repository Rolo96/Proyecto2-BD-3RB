using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BDAccess;
using System.Data;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class MedicamentoController : ApiController
    {
        [HttpPost]
        [Route("agregarMedicamento")]
        public HttpResponseMessage AgregarMedicamento(medicamento medicamento)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.InsertarMedicamento(medicamento.nombre, medicamento.precio, medicamento.prescripcion, medicamento.proveedor);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("borrarMedicamento")]
        public HttpResponseMessage BorrarMedicamento(objGeneral obj)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.BorrarMedicamento(obj.opcion);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        [Route("actualizarMedicamento")]
        public HttpResponseMessage ActualizarMedicamento(medicamento medicamento)
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.ActualizarMedicamento(medicamento.nombre, medicamento.precio, medicamento.prescripcion, medicamento.proveedor);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpGet]
        [Route("consultarMedicamentos")]
        public HttpResponseMessage ConsultarMedicamentos()
        {
            using (gspBDEntities1 entities = new gspBDEntities1())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var medicamentos = entities.medicamento.Select(p => new { p.nombre, p.precio, p.prescripcion}).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, medicamentos);
                    }
                    catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }
    }
}
