using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PaginaProyecto2BD.CrystalReports;
using PaginaProyecto2BD.Models;

namespace WebPage.PaginaAspx
{
    public partial class RTPAC : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string valor = (Request.QueryString["d"]);
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport_RTPAC cr = new CrystalReport_RTPAC();
                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
                cr.SetDataSource((from trabajo in entities.empleadoxcaja
                                  join emp in entities.empleado on trabajo.empleado equals emp.cedula
                                  join caja in entities.caja on trabajo.caja equals caja.id
                                  join suc in entities.sucursal on caja.sucursal equals suc.nombre
                                  where trabajo.activo && suc.compania == valor && trabajo.fechainicio== System.DateTime.Today
                                  group trabajo by new { emp = emp, trabajo.empleado } into g
                                  select new
                                  {
                                      Cedula = g.Key.emp.cedula,
                                      Nombre = g.Key.emp.nombre1,
                                      Apellido = g.Key.emp.apellido1,
                                      Sucursal = g.Key.emp.sucursal,
                                      TiempoPromedio = g.Sum(i => (i.horafinal.Hours-i.horainicio.Hours))
                                  }).ToList());


                CrystalReportViewer1.ReportSource = cr;
            }
        }
    }
}