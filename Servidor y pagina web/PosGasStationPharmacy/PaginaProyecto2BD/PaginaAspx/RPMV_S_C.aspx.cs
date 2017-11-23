using System;
using System.Linq;
using PaginaProyecto2BD.Models;
using PaginaProyecto2BD.CrystalReports;

namespace WebPage.PaginaAspx
{
    public partial class RPMV_S_C : System.Web.UI.Page
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
                                  group medFact by new { proj = medic, medFact.medicamento} into g
                                  select new
                                  {
                                      Nombre = g.Key.proj.nombre,
                                      Proveedor = g.Key.proj.proveedor,
                                      Precio = g.Key.proj.precio,
                                      Cantidad = g.Sum(i=>i.cantidad)
                                  }).Take(20));


                CrystalReportViewer1.ReportSource = cr;
            }
        }

        protected void TextBox1_TextChanged(object sender, EventArgs e)
        {

        }

        protected void Button2_Click(object sender, EventArgs e)
        {
            string valor = (Request.QueryString["d"]);
            int empleado = 0;
            try{empleado = Int32.Parse(TextBox2.Text);}catch(Exception){}
            gasStationBDEntities entities = new gasStationBDEntities();
            CrystalReport_RPMV_S_C cr = new CrystalReport_RPMV_S_C();
            cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
            cr.SetDataSource((from fact in entities.factura
                              join medFact in entities.medicamentoxfactura on fact.id equals medFact.factura
                              join medic in entities.medicamento on medFact.medicamento equals medic.nombre
                              join caja in entities.caja on fact.caja equals caja.id
                              join suc in entities.sucursal on caja.sucursal equals suc.nombre
                              where medFact.activo && suc.compania == valor && fact.empleado==empleado
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

        protected void Button1_Click(object sender, EventArgs e)
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
                              where medFact.activo && suc.compania == valor && suc.nombre == TextBox1.Text
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