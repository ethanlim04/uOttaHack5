import React from 'react';
import logo from './logo.svg';
import './App.css';
// import request from 'request';
import fs from 'fs';
import { useState } from "react";
import { json } from 'stream/consumers';
import {
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  DataTableRow
} from 'carbon-components-react'


function App() {  
  const [data, setData] = useState<DataTableRow<string>[]>([])
  // const [data, setData] = useState([{category: "Meals & Entertainment", date: "2017-04-07 11:36:00", total: 29.01}])
  const headerData = [
    {
      header: "Category",
      key: "category"
    },
    {
      header: "Date",
      key: "date"
    },
    {
      header: "Amount",
      key: "total"
    }
  ]
  // const [reciept, setReciept] = useState(String);
  // const [selectedImage, setSelectedImage] = useState(null);
  const HandleReciept = (event: any) => {
    if(!event.target.files) return;
    // setReciept(URL.createObjectURL(event.target.files[0]))
    convertToBase64(event.target.files[0]).then((reciept) => {
      fetch('http://localhost:9000/recieptRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({"reciept": URL.createObjectURL(event.target.files[0])})
        body: JSON.stringify({"reciept": reciept})
      }).then(res => res.json()).then((result) => {
        let out: any = []
        for(let cat in result) {
          for(let date in result[cat]) {
            let toPush = {
              category: cat,
              date: result[cat],
              total: result[cat][date]
            }
            out.push(toPush)
          }
        }
        setData(out)


        console.log(data)
      

        /*
        return (

          <div className="App">
          <div className="container">
            <Tile className="content-container">
              <DataTable
                rows={data}
                headers={headerData}
                isSortable
                render={({rows, headers, getHeaderProps}) => (
                  <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <TableHeader {...getHeaderProps({header})}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.cells.map((cell) => (
                                        <TableCell key={cell.id}>
                                            {cell.value}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
            </Tile>
          </div>
        </div>
        );
        */
      

        
      
      })
    })

  }

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  console.log(data)

  return (
    <div className="container">
        <div>
          <h1>Recipify!</h1>
          <input 
            type="file" 
            id="file-input"
            name="recieptUpload"
            onChange={(event) => {
              HandleReciept(event)
            }}
          />
          <label htmlFor="file-input">Choose a file</label>
        </div>

        <div className="dropdown-container">
              <select id="select-options">
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
              <option value="Combination">Combination</option>
            </select>
        </div>
      <div className="background">
        <ul className="background">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    
  );
}

export default App;
