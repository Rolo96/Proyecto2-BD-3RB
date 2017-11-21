using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AccesoBaseDatos;

namespace WebPage
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
           

            if (!IsPostBack) {
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport cr = new CrystalReport();

                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
                cr.SetDataSource((from s in entities.sucursal
                                  join c in entities.compania on s.compania equals c.nombre
                                  where s.activo
                                  select new
                                  {
                                      s.nombre,
                                      s.compania,
                                      c.sede
                                  }).ToList());


                CrystalReportViewer1.ReportSource = cr;


            }

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            
                gasStationBDEntities entities = new gasStationBDEntities();
                CrystalReport cr = new CrystalReport();
                cr.SetDatabaseLogon("BD3rb", "proyecto2BD", "gspbd.cofvv40de4gk.us-west-1.rds.amazonaws.com", "gasStationBD");
            cr.SetDataSource((from s in entities.sucursal
                              join c in entities.compania on s.compania equals c.nombre
                              where s.activo && s.compania == TextBox1.Text
                                  select new
                                  {
                                      s.nombre,
                                      s.compania,
                                      c.sede
                                  }).ToList());


                CrystalReportViewer1.ReportSource = cr;


            

        }
    
    }
}