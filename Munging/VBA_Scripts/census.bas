Attribute VB_Name = "Module1"

Sub DeleteEmptyA()
Let numOfRows = 7647
For i = 2 To numOfRows Step 1
If IsEmpty(Cells(i, 1)) Then
Cells(i, 1).Delete Shift:=xlToLeft
Else

End If
Next
Call DeleteAndShift
End Sub




Sub DeleteAndShift()
Let numOfRows = 7647
For i = 2 To numOfRows Step 1
If Not IsNumeric(Cells(i, 2)) Then
    Cells(i, 1) = Cells(i, 1) + " " + Cells(i, 2)
    Cells(i, 2).Delete Shift:=xlToLeft
    
ElseIf IsEmpty(Cells(i, 2)) Then
    Cells(i, 1) = Cells(i, 1) + " " + Cells(i, 2)
    Cells(i, 2).Delete Shift:=xlToLeft


End If
Next
Call deleteTopRowsAddHeadings
End Sub

Sub ToCSV()
Dim wsName As String

   wsName = ThisWorkbook.Name + ".csv"
    ActiveWorkbook.SaveAs Filename:= _
    wsName, FileFormat:=xlCSV, CreateBackup:=False
End Sub


Sub deleteTopRowsAddHeadings()
    Set ws = ThisWorkbook.Worksheets("Sheet1")
    Application.DisplayAlerts = False
    ws.Range("A1:XFD6").SpecialCells(xlCellTypeVisible).Delete
    ws.Range("H1: H1048576").SpecialCells(xlCellTypeVisible).Delete
    Application.DisplayAlerts = True
  
    Range("A1").Value = "location"
    Range("B1").Value = "location_id"
    Range("C1").Value = "direction"
    Range("D1").Value = "position"
    Range("E1").Value = "ons"
    Range("F1").Value = "offs"
    Range("G1").Value = "total"
    Range("H1").Value = "lifts"
    
    Call ToCSV
  
End Sub

