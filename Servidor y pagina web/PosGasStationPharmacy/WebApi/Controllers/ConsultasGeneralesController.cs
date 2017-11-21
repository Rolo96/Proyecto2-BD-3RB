using System.Net.Http;
using System.Web.Http;
using AccesoBaseDatos;
using WebApi.Models;
using System.Linq;
using System.Net;
using System.Data;

namespace WebApi.Controllers
{
    public class ConsultasGeneralesController : ApiController
    {
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
                        var caja = entities.caja.Select(p => new { p.id, p.activo}).
                            Where((x) => x.activo && x.id==obj.opcion2).First();
                        id = caja.id;
                        if (id == -1) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }


    }
}
