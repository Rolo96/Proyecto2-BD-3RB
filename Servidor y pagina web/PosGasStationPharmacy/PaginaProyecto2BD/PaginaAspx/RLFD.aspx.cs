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
    public partial class RLFD : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                string valor = (Request.QueryString["d"]);
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport_RLPD cr = new CrystalReport_RLPD();
                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
                cr.SetDataSource((from fac in entities.factura
                                  join caja in entities.caja on fac.caja equals caja.id
                                  join suc in entities.sucursal on caja.sucursal equals suc.nombre
                                  where fac.activo && suc.compania == valor && fac.fecha== System.DateTime.Today
                                  orderby fac.id
                                  select new
                                  {
                                      IdFactura = fac.id,
                                      MontoTotal = fac.total,
                                      Cajero = fac.empleado,
                                      Cliente = fac.cliente,
                                      Sucursal = suc.nombre
                }).ToList());
                CrystalReportViewer1.ReportSource = cr;
            }
            
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string valor = (Request.QueryString["d"]);
            gasStationBDEntities entities = new gasStationBDEntities();
            CrystalReport_RLPD cr = new CrystalReport_RLPD();
            cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
            cr.SetDataSource((from fac in entities.factura
                              join caja in entities.caja on fac.caja equals caja.id
                              join suc in entities.sucursal on caja.sucursal equals suc.nombre
                              where fac.activo && suc.compania == valor && fac.fecha == System.DateTime.Today && suc.nombre==TextBox1.Text
                              orderby fac.id
                              select new
                              {
                                  IdFactura = fac.id,
                                  MontoTotal = fac.total,
                                  Cajero = fac.empleado,
                                  Cliente = fac.cliente
                              }).ToList());
            CrystalReportViewer1.ReportSource = cr;
        }

        protected void CrystalReportViewer1_Init(object sender, EventArgs e)
        {

        }
    }
}