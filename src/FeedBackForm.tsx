import React, { useState, useEffect } from 'react';
import './CSS/BriefwahlForm.css'; // Import the CSS file for styling
import { useLocation } from 'react-router-dom';
import axios from 'axios';  // Import axios
let Briefwahldata: any = [];
const FeedBackForm = () => {
  const location = useLocation();
  const initialData = location.state || {}; // Extract the initial data from the location state

  const defaultValue = ''; // Default value for each field
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // Access the 'id' query parameter
  useEffect(() => {
    getBriefwahldata();
}, [])
  const getBriefwahldata = async () => {
    const tableName = "Briefwahl";
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
        fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
            .then(response => response.text())
            .then((result: any) => {
                result = JSON.parse(result)
                Briefwahldata = result?.data;
                console.log('Get data from server successfully');
                console.log(result)

            })
            .catch(error => console.log('error', error));
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
  // Initialize the form state with initialData or default to empty string
  const [formData, setFormData] = useState({
    id: initialData.id || defaultValue,
    Title: initialData.Title || defaultValue,
    Land: initialData.Land || defaultValue,
    Gemeinde: initialData.Gemeinde || defaultValue,
    Wahlkreis: initialData.Wahlkreis || defaultValue,

    Modified: initialData.Modified || defaultValue,
    Created: initialData.Created || defaultValue,
    Webseite: initialData.Webseite || defaultValue,

    WKName: initialData.WKName || defaultValue,
    PLZ: initialData.PLZ || defaultValue,
    Bevolkerung: initialData.Bevolkerung || defaultValue,
    Email: initialData.Email || defaultValue,
    Regionalschlussel: initialData.Regionalschlussel || defaultValue,
    AGS: initialData.AGS || defaultValue,

    LinkVerified2017: initialData.LinkVerified2017 || defaultValue,
    EmailVerified2017: initialData.EmailVerified2017 || defaultValue,

    ZipCodes: initialData.ZipCodes || defaultValue,

    LTWWahlkreis: initialData.LTWWahlkreis || defaultValue,
    LTWWKNo: initialData.LTWWKNo || defaultValue,
    EmailStatus2019: initialData.EmailStatus2019 || defaultValue,
    LinkStatus2019: initialData.LinkStatus2019 || defaultValue,

    Comments: initialData.Comments || defaultValue,
    LinkBundestag: initialData.LinkBundestag || defaultValue,

    LinkLandtag: initialData.LinkLandtag || defaultValue,
    LinkStatusLandtag: initialData.LinkStatusLandtag || defaultValue,
    LinkStatusBundestag: initialData.LinkStatusBundestag || defaultValue,
    LinkStatusEuropa: initialData.LinkStatusEuropa || defaultValue,
    ColumnLevelVerification: initialData.ColumnLevelVerification || defaultValue,
    LastSynchronized: initialData.LastSynchronized || defaultValue,
    SyncedBy: initialData.SyncedBy || defaultValue,

    FeedbackComments: initialData.FeedbackComments || defaultValue,
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        try {
          const postDataArray = [formData]
          const postData = {
            data: postDataArray,
            tableName: 'BriefwahlFeedback',
            ApiType: 'postData'
          };
            const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/createTableColumns.php', postData);
            if (response.status === 200) {
                alert('Data submitted successfully!');            
                console.log('Data sent to server successfully');    
            } else {
              console.error('Error sending data to server:', response.statusText);
            }
          
        } catch (error) {
          console.error('An error occurred:', error);
        }
      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  
  };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Define the data to be sent
//     const postData = {
//       ApiType: 'postData',
//       tableName: 'BriefwahlFeedback',  // The table where the data will be inserted
//       data: formData,  // The actual form data
//     };

//     try {
//       // Send the data to the backend using axios
//       const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/createFormData.php', postData, {
//         headers: {
//           'Content-Type': 'application/json', // Set the content type to JSON
//         },
//       });

//       // Handle the response
//       if (response.data.status) {
//         console.log('Data inserted successfully:', response.data.message);
//         alert('Data submitted successfully!');
//         // Optionally, you can reset the form data or redirect the user
//       } else {
//         console.error('Failed to insert data:', response.data.message);
//         alert('Failed to submit data. Please try again!');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Error submitting the form. Please check your network or try again later.');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     const postData = {
//       ApiType: 'postData',
//       tableName: 'BriefwahlFeedback',
//       data: formData,
//     };
  
//     try {
//       // Make the POST request using axios
//       const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/insertandupdatedata.php', postData, {
//         headers: {
//           'Content-Type': 'application/json', // Specify content type as JSON
//         }
//       });
  
//       // Check if the response is successful
//       if (response.data.success) {
//         console.log('Data inserted successfully:', response.data);
//         // Optionally, reset the form or handle the success state
//       } else {
//         console.error('Failed to insert data:', response.data.message);
//       }
//     } catch (error) {
//       // Handle error
//       console.error('Error submitting form:', error);
//       if (axios.isAxiosError(error)) {
//         // If it's an Axios error, you can access the response in error.response
//         const errorMessage = error.response?.data?.message || error.message;
//         console.error('Axios error:', errorMessage);
//       } else {
//         console.error('Non-Axios error:', error);
//       }
//     }
//   };
  
  


  return (
    
<div className="contact-form-bg">
<div className="form-container">
      <h1 className="form-title">Briefwahl Form</h1>
      <form className="briefwahl-form" onSubmit={handleSubmit}>
        {Object.keys(formData).map((key, index) => (
          <div key={key} className={`form-group ${index % 3 === 0 ? 'start-row' : ''}`}>
            <label htmlFor={key} className="form-label">
              {key}:
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              className="form-input"
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <div className=""></div>
        <div className=""></div>
        <div className="col-12"> <button type="submit" className="submit-button w-100">Submit</button></div>
       
      </form>
    </div>
    </div>
  );
};

export default FeedBackForm;
