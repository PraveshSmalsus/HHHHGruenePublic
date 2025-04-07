import axios from "axios";
import React, { useEffect, useState } from "react";
let smartPageData:any=[]
export const fetchData = async (smartPageTitle:any) => {
    const KeyTitleFilterKeyTitle = 'https://eventservers.onrender.com/api/getFilterKeyTitle'
    const tableName = "SmartMetaData";
    let Title = smartPageTitle
    try {
      const response = await axios.get(`${KeyTitleFilterKeyTitle}?table=${tableName}&Title=${smartPageTitle}`);
      if (response.status === 200) {
        smartPageData = response?.data
        console.log('Get data from server successfully');
        console.log(response);
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Function to send data to the API
  export const filterDataByUsingDynamicColumnValue = async (table:any, column:any, value:any) => {
  const data = {
      table: table,
      column: column,
      value: value
  };
  try {
      const response = await fetch('https://gruene-weltweit.de/SPPublicAPIs/getDataByColumnWithValue.php', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json' 
          },
          body: JSON.stringify(data) 
      });
      const result = await response.json();
      if (result.success) {
          console.log('Data fetched successfully:', result.data);
          return result.data;
      } else {
          console.error('Error:', result.message);
      }  
  } catch (error) {
      console.error('Error sending request:', error);
  }
}

// Function to getDataAll
export const getAllTableData = async (tableName) => {
  let allfilterdata: any = []
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "table": `${tableName}`
    });

    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
      .then(response => response.text())
      .then((result: any) => {
        result = JSON.parse(result)
        console.log('Get data from server successfully');
        return result;
      })
      .catch(error => console.log('error', error));
  } catch (error) {
    console.error('An error occurred:', error);
  }
};




