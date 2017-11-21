<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RPMV_S_C.aspx.cs" Inherits="WebPage.PaginaAspx.RPMV_S_C" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.3500.0, Culture=neutral, PublicKeyToken=692fbea5521e1304" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Productos más vendidos por Sucursal/Cajero.</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <h1>Productos más vendidos por Sucursal/Cajero </h1>
            <asp:Label ID="Label1" runat="server" Text="Sucurcal"></asp:Label>
            <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
            <asp:Button ID="Button1" runat="server" Text="Generar Reporte Sucursal" />
            <br />
            <br />
            <asp:Label ID="Label2" runat="server" Text="Cajero"></asp:Label>
            <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
            <asp:Button ID="Button2" runat="server" Text="Generar Reporte Cajero" />
            <br />
            <br />
            <CR:CrystalReportViewer ID="CrystalReportViewer1" runat="server" AutoDataBind="true" />
        </div>
    </form>
</body>
</html>
