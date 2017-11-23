using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PaginaProyecto2BD.Models;
using PaginaProyecto2BD.CrystalReports;

namespace WebPage.PaginaAspx
{
    public partial class RPMV_F : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string valor = (Request.QueryString["d"]);
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport_RPMV_S_C cr = new CrystalReport_RPMV_S_C();
                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
                cr.SetDataSource((from fact in entities.factura
                                  join medFact in entities.medicamentoxfactura on fact.id equals medFact.factura
                                  join medic in entities.medicamento on medFact.medicamento equals medic.nombre
                                  join caja in entities.caja on fact.caja equals caja.id
                                  join suc in entities.sucursal on caja.sucursal equals suc.nombre
                                  where medFact.activo && suc.compania == valor
                                  group medFact by new { proj = medic, medFact.medicamento } into g
                                  select new
                                  {
                                      Nombre = g.Key.proj.nombre,
                                      Proveedor = g.Key.proj.proveedor,
                                      Precio = g.Key.proj.precio,
                                      Cantidad = g.Sum(i => i.cantidad)
                                  }).Take(20));


                CrystalReportViewer1.ReportSource = cr;
            }
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string fecha1 = String.Format("{0}", Request.Form["fecha1"]);
            DateTime fechaInicio = Convert.ToDateTime(fecha1);

            DateTime fechaFinal = Convert.ToDateTime(String.Format("{0}", Request.Form["fecha2"]));
            string valor = (Request.QueryString["d"]);
            gasStationBDEntities entities = new gasStationBDEntities();
            CrystalReport_RPMV_S_C cr = new CrystalReport_RPMV_S_C();
            cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
            cr.SetDataSource((from fact in entities.factura
                              join medFact in entities.medicamentoxfactura on fact.id equals medFact.factura
                              join medic in entities.medicamento on medFact.medicamento equals medic.nombre
                              join caja in entities.caja on fact.caja equals caja.id
                              join suc in entities.sucursal on caja.sucursal equals suc.nombre
                              where medFact.activo && suc.compania == valor
                              && fact.fecha>= fechaInicio && fact.fecha <= fechaFinal
                              group medFact by new { proj = medic, medFact.medicamento } into g
                              select new
                              {
                                  Nombre = g.Key.proj.nombre,
                                  Proveedor = g.Key.proj.proveedor,
                                  Precio = g.Key.proj.precio,
                                  Cantidad = g.Sum(i => i.cantidad)
                              }).Take(20));


            CrystalReportViewer1.ReportSource = cr;
        }
    }
}