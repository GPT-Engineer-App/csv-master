import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const CsvManagement = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
          toast.success("CSV file uploaded successfully!");
        },
        error: () => {
          toast.error("Failed to parse CSV file.");
        },
      });
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][column] = value;
    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});
    setData([...data, newRow]);
    toast.success("Row added successfully!");
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
    toast.success("Row deleted successfully!");
  };

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <Button onClick={handleAddRow} className="ml-2">Add Row</Button>
        <Button onClick={handleDownloadCsv} className="ml-2">Download CSV</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={header}>
                  <input
                    type="text"
                    value={row[header]}
                    onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CsvManagement;