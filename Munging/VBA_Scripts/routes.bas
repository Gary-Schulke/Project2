Attribute VB_Name = "Module1"



Sub deleteTopRowsAddHeadings()
    Set ws = ThisWorkbook.Worksheets("Sheet1")
    Application.DisplayAlerts = False
    ws.Range("A1:XFD7").SpecialCells(xlCellTypeVisible).Delete
    ws.Range("H1: H1048576").SpecialCells(xlCellTypeVisible).Delete
    Application.DisplayAlerts = True
  
    Range("A1").Value = "full_route"
    Range("B1").Value = "boarding_rides"
    Range("C1").Value = "rides_rev_hour"
    Range("D1").Value = "rides_veh_hour"
    Range("E1").Value = "cost_per_ride"
    Range("F1").Value = "passenger_miles"
    Range("G1").Value = "delete1"
    Range("H1").Value = "ave_trip_length"
    Range("I1").Value = "delete2"
    Range("J1").Value = "delete3"
    Range("K1").Value = "delete4"
    Range("L1").Value = "delete5"
    Call ToCSV
  
End Sub



Sub ToCSV()
Dim wsName As String

   wsName = ThisWorkbook.Name + ".csv"
    ActiveWorkbook.SaveAs Filename:= _
    wsName, FileFormat:=xlCSV, CreateBackup:=False
End Sub

