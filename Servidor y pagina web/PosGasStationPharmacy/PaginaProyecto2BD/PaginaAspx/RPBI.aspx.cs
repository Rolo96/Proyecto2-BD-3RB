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
    public partial class RPBI : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
            if (!IsPostBack)
            {
                string valor = (Request.QueryString["d"]);
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport_RPBI cr = new CrystalReport_RPBI();
                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
                cr.SetDataSource((from medSuc in entities.medicamentoxsucursal
                                  join med in entities.medicamento on medSuc.medicamento equals med.nombre
                                  join suc in entities.sucursal on medSuc.sucursal equals suc.nombre
                                  where medSuc.activo && suc.compania == valor && medSuc.cantidad<medSuc.stockminimo
                                  select new
                                  {
                                      Nombre = medSuc.medicamento,
                                      Proveedor = med.proveedor,
                                      StockMinimo = medSuc.stockminimo,
                                      Cantidad = medSuc.cantidad,
                                      Sucursal = suc.nombre
                                  }).ToList());


                CrystalReportViewer1.ReportSource = cr;
            }
        }
    }
}