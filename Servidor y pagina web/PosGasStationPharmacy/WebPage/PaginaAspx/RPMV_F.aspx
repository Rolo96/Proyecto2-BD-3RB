<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RPMV_F.aspx.cs" Inherits="WebPage.PaginaAspx.RPMV_F" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.3500.0, Culture=neutral, PublicKeyToken=692fbea5521e1304" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        #fecha2 {
            width: 125px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>

             <h1>Productos más vendidos</h1>
            <asp:Label ID="Label1" runat="server" Text="Fecha Inicio"></asp:Label>
            <input class="form-control" id="fecha1" placeholder="MM/DD/YYYY" onblur="type='text'" onfocus="type='date'" />
            <br />
            <br />
            <asp:Label ID="Label2" runat="server" Text="Fecha Final"></asp:Label>
            <input class="form-control" id="fecha2" placeholder="MM/DD/YYYY" onblur="type='text'" onfocus="type='date'" />
            <br />
            <br />
            <asp:Button ID="Button1" runat="server" Text="Generar Reporte" Width="200px" />
            <br />
            <CR:CrystalReportViewer ID="CrystalReportViewer1" runat="server" AutoDataBind="true" />

        </div>
    </form>
</body>
</html>
