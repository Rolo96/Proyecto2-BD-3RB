using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class RolController : ApiController
    {
        DatabaseContext _context;
        public RolController()
        {
            _context = new DatabaseContext("public");

        }

        [HttpGet]
        [Route("consultarRoles")]
        public HttpResponseMessage ConsultarRol()
        {
            List<rol> roles = null;
            try { if (ModelState.IsValid) { roles = _context.rol.ToList(); } }
            catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }

            if (roles == null)
            {//No se proceso bien la solicitud
                HttpResponseMessage responseError = Request.CreateResponse(HttpStatusCode.Unauthorized);
                return responseError;
            }
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, roles);
            return response;
        }

        [HttpPost]
        [Route("agregarRol")]
        public HttpResponseMessage AgregarRol(rol Rol)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    rol rolBD = null;
                    rolBD = _context.rol.Where(
                      x => x.nombre == Rol.nombre && !x.activo).SingleOrDefault();
                    if (rolBD != null) {
                        return ActualizarRolBorrado(Rol);
                    }
                    _context.rol.Add(Rol);
                    _context.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
            }
            catch (DataException e) { return Request.CreateResponse(HttpStatusCode.Unauthorized); }
            return Request.CreateResponse(HttpStatusCode.Unauthorized);
        }

        [HttpPost]
        [Route("borrarRol")]
        public HttpResponseMessage BorrarRol(General Rol)
        {
            rol rolBD = null;
            empleado empleado = null;
            rolBD = _context.rol.Where(
              x => x.nombre == Rol.opcion && x.activo).SingleOrDefault();
            if (rolBD != null) { 
                empleado = _context.empleado.Where(
                  x => x.rol == rolBD.nombre && x.activo).FirstOrDefault();
            }

            if (rolBD != null && empleado==null)
            {
                rolBD.activo = false;
                _context.Entry(rolBD).Property(X => X.activo).IsModified = true;
                _context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.Unauthorized);
        }


        [HttpPost]
        [Route("actualizarRol")]
        public HttpResponseMessage ActualizarRol(rol Rol)
        {
            rol rolBD = _context.rol.Where(
              x => x.nombre == Rol.nombre && x.activo).SingleOrDefault();
            if (rolBD != null)
            {
                _context.Entry(rolBD).CurrentValues.SetValues(Rol);
                _context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.Unauthorized);
        }

        [HttpPost]
        [Route("actualizarRolBorrado")]
        public HttpResponseMessage ActualizarRolBorrado(rol Rol)
        {
            rol rolBD = _context.rol.Where(
              x => x.nombre == Rol.nombre).SingleOrDefault();
            if (rolBD != null)
            {
                _context.Entry(rolBD).CurrentValues.SetValues(Rol);
                _context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.Unauthorized);
        }

    }
}
