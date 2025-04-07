import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
import Highlighter from "react-highlight-words";
import axios from 'axios';
import { cursorTo } from 'readline';
import AlertPopup from './AlertPopup';
import Briefwahl2021 from './Briefwahl2021';


let backupdata: any = [];
let BriefwahldataBackup: any = [];
let trimmedSearchTerm: any
// const Briefwahlsearch = (props: any) => {
//     //window.location.href = 'https://gruene-weltweit.de/';
//     let State: any;
//     const [Briefwahldata, setBriefwahldata]: any = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredItems, setFilteredItems] = useState<any[]>([]);
//     const [selectedItem, setSelectedItem] = useState<any | null>(null); // State to store selected item for the modal
//     const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [Email, setEmail] = useState('');
//     const [LinkOnlineFormular, setLinkOnlineFormular] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');

//     const handleToggleExpand = () => {
//         setIsExpanded(!isExpanded);  // Toggle between expanded and collapsed
//     };

//     const handleSubmit = async () => {
//         try {
//             try {
//                 const postDataArray = [{ id: selectedItem?.id, Email: Email, LinkBundestag: LinkOnlineFormular,Title:selectedItem?.Title, Gemeinde:selectedItem?.Gemeinde, Wahlkreis:selectedItem?.Wahlkreis, WKName:selectedItem?.WKName, PLZ:selectedItem?.PLZ,Bevolkerung:selectedItem?.Bevolkerung,  ExistingEmail: selectedItem?.Email, ExistingLinkBundestag: selectedItem?.LinkBundestag, Status:'For-Approval'}];
//                 const postData = {
//                     data: postDataArray,
//                     tableName: 'BriefwahlFeedback',
//                     ApiType: 'postData'
//                 };
//                 const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/createTableColumns.php', postData);
//                 if (response.status === 200) {
//                     setAlertMessage('Vielen Dank für Deine Hilfe!');
//                     setShowAlert(true)
//                     setEmail('')
//                     setLinkOnlineFormular('')
//                 } else {
//                     console.error('Error sending data to server:', response.statusText);
//                 }

//             } catch (error) {
//                 console.error('An error occurred:', error);
//             }

//         } catch (error) {
//             console.error('An error occurred:', error);
//         }
//         closeModal();
//     };
//     const handleCloseAlert = () => {
//         setShowAlert(false);
//       };
//     if (props.stateParam && props.stateParam != undefined && props.stateParam != '') {
//         State = decodeURIComponent(props.stateParam)

//     }
//     const [SelectedTile, setSelectedTile] = useState(State != undefined && State != '' ? State : 'Deutschlandweit');

//     const StateDataArray: any = [
//         { Title: 'Deutschlandweit', src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false },
//         { Title: 'Baden-Württemberg', src: 'https://gruene-weltweit.de/assets/Baden-Wurttemberg.png', IsSelected: false },
//         { Title: 'Bayern', src: 'https://gruene-weltweit.de/assets/Bayern.png', IsSelected: false },
//         { Title: 'Berlin', src: 'https://gruene-weltweit.de/assets/Berlin.png', IsSelected: false },
//         { Title: 'Brandenburg', src: 'https://gruene-weltweit.de/assets/Brandenburg.png', IsSelected: false },
//         { Title: 'Bremen', src: 'https://gruene-weltweit.de/assets/Bremen.png', IsSelected: false },
//         { Title: 'Hamburg', src: 'https://gruene-weltweit.de/assets/Hamburg.png', IsSelected: false },
//         { Title: 'Hessen', src: 'https://gruene-weltweit.de/assets/Hessen.png', IsSelected: false },
//         { Title: 'Mecklenburg-Vorpommern', src: 'https://gruene-weltweit.de/assets/Mecklenburg-Vorpommern.png', IsSelected: false },
//         { Title: 'Nordrhein-Westfalen', src: 'https://gruene-weltweit.de/assets/Nordrhein-Westfalen.png', IsSelected: false },
//         { Title: 'Niedersachsen', src: 'https://gruene-weltweit.de/assets/Niedersachen.png', IsSelected: false },
//         { Title: 'Rheinland-Pfalz', src: 'https://gruene-weltweit.de/assets/Rheinland-Pfalz.png', IsSelected: false },
//         { Title: 'Saarland', src: 'https://gruene-weltweit.de/assets/Saarland.png', IsSelected: false },
//         { Title: 'Sachsen', src: 'https://gruene-weltweit.de/assets/Sachsen.png', IsSelected: false },
//         { Title: 'Sachsen-Anhalt', src: 'https://gruene-weltweit.de/assets/Sachen-Anhalt.png', IsSelected: false },
//         { Title: 'Schleswig-Holstein', src: 'https://gruene-weltweit.de/assets/Schleswig-Holstein.png', IsSelected: false },
//         { Title: 'Thüringen', src: 'https://gruene-weltweit.de/assets/Thuringen.png', IsSelected: false }
//     ]

//     useEffect(() => {
//         getBriefwahldata();
//     }, [])



//     const getBriefwahldata = async () => {
//         const tableName = "Briefwahl";
//         let allfilterdata: any = []
//         try {
//             var myHeaders = new Headers();
//             myHeaders.append("Content-Type", "application/json");

//             var raw = JSON.stringify({
//                 "table": `${tableName}`
//             });

//             var requestOptions: any = {
//                 method: 'POST',
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: 'follow'
//             };
//             fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
//                 .then(response => response.text())
//                 .then((result: any) => {
//                     result = JSON.parse(result)
//                     backupdata = result?.data;
//                     if (State != undefined && State != undefined && State.toLowerCase() == 'deutschlandweit') {
//                         BriefwahldataBackup = result?.data;
//                     } else if (State != undefined && State != undefined) {
//                         result?.data?.forEach((item: any) => {
//                             if (item?.Land == State) {
//                                 allfilterdata.push(item)
//                             }
//                         })
//                     }
//                     if (State != undefined && State != undefined && State.toLowerCase() != 'deutschlandweit') {
//                         BriefwahldataBackup = allfilterdata;
//                     } else {
//                         BriefwahldataBackup = result?.data;
//                     }
//                     console.log('Get data from server successfully');
//                     console.log(result)

//                 })
//                 .catch(error => console.log('error', error));
//         } catch (error) {
//             console.error('An error occurred:', error);
//         }
//     };
//     const columns = React.useMemo<ColumnDef<any, unknown>[]>(
//         () => [
//             {
//                 accessorKey: "",
//                 placeholder: "",
//                 hasCheckbox: false,
//                 hasCustomExpanded: false,
//                 hasExpanded: false,
//                 isHeaderNotAvlable: true,
//                 size: 25,
//                 id: 'Id',
//             },
//             {
//                 accessorKey: "Gemeinde",
//                 placeholder: "Stadt",
//                 header: "",
//                 id: "Gemeinde", size: 150,
//                 cell: ({ row }: any) => (
//                     <>{row.original.Gemeinde}
//                     </>
//                 ),
//                 filterFn: (row: any, columnName: any, filterValue: any) => {
//                     let filterVal = row?.original?.Gemeinde;
//                     filterVal = filterVal?.replace(/ö/g, 'o')
//                         .replace(/ü/g, 'ue')
//                         .replace(/ä/g, 'ae')
//                         .replace(/ß/g, 'ss');
//                     if (filterVal?.includes(filterValue) || row?.original?.Gemeinde?.toLowerCase().includes(filterValue)) {
//                         return true
//                     } else {
//                         return false
//                     }
//                 },
//             },
//             {
//                 accessorKey: "PLZ", placeholder: "PLZ", header: "", id: "PLZ", size: 100,
//                 cell: ({ row }: any) => (
//                     <>
//                         {row?.original?.PLZ}
//                     </>
//                 ),
//             },

//             {
//                 accessorKey: "WKName", placeholder: "WK Name", header: "", id: "WKName", size: 145,
//                 cell: ({ row }: any) => (
//                     <>
//                         {row?.original?.WKName}
//                     </>
//                 ),
//                 filterFn: (row: any, columnName: any, filterValue: any) => {
//                     if (row?.original?.WKName?.includes(filterValue)) {
//                         return true
//                     } else {
//                         return false
//                     }
//                 },
//             },
//             {
//                 accessorKey: "Wahlkreis", placeholder: "Wahlkreis", header: "", id: "Wahlkreis", size: 75,
//                 cell: ({ row }: any) => (
//                     <>
//                         {row?.original?.Wahlkreis}
//                     </>
//                 ),
//                 filterFn: (row: any, columnName: any, filterValue: any) => {
//                     if (row?.original?.Wahlkreis?.includes(filterValue)) {
//                         return true
//                     } else {
//                         return false
//                     }
//                 },
//             },

//             {
//                 accessorKey: "Email", placeholder: "Email", header: "", id: "Email", size: 295,
//                 cell: ({ row }: any) => (
//                     <>
//                         <a href={`mailto:${row?.original?.Email}`}>{row?.original?.Email}</a>
//                     </>
//                 ),
//             },

//             {
//                 accessorKey: "LinkBundestag", placeholder: "Online Formular Link", header: "", id: "LinkBundestag", size: 435,
//                 cell: ({ row }: any) => (
//                     <>
//                         <div className='word-break'><a href={row?.original?.LinkBundestag} target="_blank" >{row?.original?.LinkBundestag}</a></div>
//                     </>
//                 ),
//             }
//         ],
//         [Briefwahldata]
//     );
//     const callBackData = (data: any) => {
//         console.log(data)
//     }
//     const ChangeTile = (tile: string) => {
//         let allfilterdata: any = []
//         setSelectedTile(tile)
//         if (tile != undefined && tile != undefined) {
//             backupdata?.forEach((item: any) => {
//                 if (item?.Land == tile) {
//                     allfilterdata.push(item)
//                 }
//             })
//         }
//         if (tile != 'Alle' && tile.toLowerCase() != 'deutschlandweit') {
//             BriefwahldataBackup = allfilterdata;
//         } else if (tile != undefined && tile != undefined && tile.toLowerCase() == 'deutschlandweit') {
//             BriefwahldataBackup = backupdata;
//         } else {
//             BriefwahldataBackup = allfilterdata;
//         }
//         if (trimmedSearchTerm == undefined || trimmedSearchTerm == null || trimmedSearchTerm === '') {
//             setFilteredItems([]);  // If search term is empty, clear the results
//         } else {
//             handleSearch(trimmedSearchTerm)
//         }

//     }
//     // Normalize function that converts both German characters to English and vice versa
//     const normalizeString = (str: string, reverse: string) => {
//         if (!str) return str;

//         // If reverse flag is set, perform English to German conversion
//         if (reverse == '1') {
//             return str
//                 .replace(/ae/g, 'ä')
//                 .replace(/oe/g, 'ö')
//                 .replace(/ue/g, 'ü')
//                 .replace(/ss/g, 'ß')
//                 .toLowerCase();
//         } else if (reverse == '2') {
//             return str
//                 .replace(/ä/g, 'ae')  // Replace ä with ae
//                 .replace(/ö/g, 'oe')  // Replace ö with oe
//                 .replace(/ü/g, 'ue')  // Replace ü with ue
//                 .replace(/ß/g, 'ss')  // Replace ß with ss
//                 .toLowerCase();  // Convert to lowercase for case-insensitive comparison
//         } else if (reverse == '3') {
//             return str
//                 .replace(/ä/g, 'a')  // Replace ä with ae
//                 .replace(/ö/g, 'o')  // Replace ö with oe
//                 .replace(/ü/g, 'u')  // Replace ü with ue
//                 .replace(/ß/g, 's')  // Replace ß with ss
//                 .toLowerCase();  // Convert to lowercase for case-insensitive comparison
//         }

//         // Default: German to English conversion

//     };

//     const handleSearch = (searchTerm: string) => {
//         const trimmedSearchTerm = searchTerm.trim(); // Trim any leading/trailing spaces

//         if (trimmedSearchTerm === '') {
//             setFilteredItems([]);  // If search term is empty, clear the results
//         } else {
//             const filtered = BriefwahldataBackup.filter((item: any) => {

//                 const originalGemeinde = String(item.Gemeinde || '').toLowerCase();
//                 const normalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '1');
//                 const reverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '2'); // English to German conversion
//                 const myreverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '3');// English to German conversion
//                 const concatenatedGemeinde = originalGemeinde + normalizedGemeinde + reverseNormalizedGemeinde + myreverseNormalizedGemeinde;
//                 return (
//                     concatenatedGemeinde.toLowerCase().indexOf(trimmedSearchTerm.toLowerCase()) !== -1 ||
//                     String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1 || String(item.ZipCodes || '').indexOf(trimmedSearchTerm) !== -1
//                 );

//             });

//             setFilteredItems(filtered); // Update filtered items
//         }
//     };

//     const renderTable = filteredItems.length > 0 || searchTerm === '';

//     // Open modal with selected item
//     const openModal = (item: any) => {
//         setSelectedItem(item);
//         setIsModalOpen(true);
//     };

//     // Close modal
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedItem(null);
//         setIsExpanded(false)
//         setEmail('')
//         setLinkOnlineFormular('')
//     };
//     const clearSearchButton = () => {
//         setFilteredItems([]);
//         setSearchTerm('')
//     }
//     return (
//         <div className="container mb-5">
//             <header className="page-header">
//                 <h1 className="page-title heading  text-center">Grüne Weltweit Briefwahl-Suchmaschine</h1>
//             </header>

//             <ul className='mb-5 mt-3 Briefwahl stateListTiles'>
//                 {StateDataArray.map((item: any, index: any) => (
//                     <li key={index} onClick={() => ChangeTile(item.Title)} className={index == 0 ? SelectedTile === item.Title ? "state active" : "state" : SelectedTile === item.Title ? 'states active' : "states"}>
//                         <img src={item.src} alt={item.Title} className="stateLogo" />
//                         <span className='stateName'>{item.Title}</span>
//                     </li>
//                 ))}
//             </ul>
//             <div className="container my-3">
//                 <div className="row justify-content-center">
//                     <div className="col-lg-8 col-sm-12 p-0 position-relative">
//                         <div className="Briefwahl CustomSearchInputWithBtn">
//                             <span className="BtnSearchIcon" onClick={() => setSearchTerm('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
//                                 <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555" />
//                             </svg>
//                             </span>
//                             <input
//                                 type="text"
//                                 className="CustomSearchInput"
//                                 //placeholder="Suche Deine Gemeinde oder Postleitzahl (PLZ)"
//                                 placeholder="Gib hier Deine Gemeinde oder Postleitzahl (PLZ) ein..."
//                                 value={searchTerm}
//                                 onChange={(e) => {
//                                     setSearchTerm(e.target.value); // Update searchTerm on typing
//                                     handleSearch(e.target.value); // Call handleSearch whenever typing
//                                 }}
//                                 style={{ flex: 1 }}
//                             />
//                             <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
//                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333" />
//                             </svg></span>

//                             <button className="btn btn-primary">Jetzt Starten</button>
//                             {/* {searchTerm && (
//                                 <span
//                                     className="BtnCrossIcon"
//                                     onClick={() => setSearchTerm('')}
//                                 ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
//                                 <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555"/>
//                               </svg>
//                                 </span>
//                             )} */}
//                         </div>

//                         {searchTerm !== '' && filteredItems.length > 0 ? (
//                             <table className="Briefwahl SmartTableOnTaskPopup scrollbar">
//                                 {filteredItems.map((item, index) => (
//                                     <tr className='searchItemList p-1 fs-6'
//                                         key={index}
//                                         onClick={() => openModal(item)}
//                                         style={{ cursor: 'pointer' }}
//                                     ><td style={{ width: '76%' }}>
//                                             <span className="d-flex flex-column">
//                                                 <span className="" title={item.ZipCode}>
//                                                     {item.PLZ || 'n/a'} {item.Gemeinde}
//                                                 </span>
//                                                 <span className=''>{item.WKName || 'n/a'} (WK {item.Wahlkreis || 'n/a'})</span>
//                                             </span>
//                                         </td>
//                                         {/* <span className="d-flex flex-column">
//                                         <span className=''>{item.PLZ || 'n/a'} {item.Gemeinde}, &nbsp;{item.Wahlkreis || 'n/a'}</span>
//                                         <span className=''>{item.WKName || 'n/a'}</span>
//                                         </span> */}
//                                         <td style={{ width: '12%' }}>
//                                             <span className='align-content-start d-flex'>Email:
//                                                 {item.Email ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
//                                                 </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
//                                                 </svg>
//                                                 }
//                                             </span>
//                                         </td>
//                                         {/* <td style={{ width: '12%' }}><span className='align-content-start d-flex'>Online:
//                                             {item.LinkBundestag ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
//                                             </svg> : {item.ColumnLevelVerification && Array.isArray(item.ColumnLevelVerification) && item.ColumnLevelVerification.length > 0 && item.ColumnLevelVerification.map((verification, index) => (
//                                                 <span key={index}>
//                                                     {verification.Value === "Incorrect" ? (
//                                                         // Render yellow circle for "Incorrect"
//                                                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                                             <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                                         </svg>
//                                                     ) : verification.Value === "Correct" ? (
//                                                         // Render green check for "Correct"
//                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                             <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
//                                                         </svg>
//                                                     ) : verification.Value === "Maybe" ? (
//                                                         // Render green check for "Correct"
//                                                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                                             <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                                         </svg>
//                                                     ) : null}
//                                                 </span>
//                                             ))} :<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
//                                             </svg>
//                                             }
//                                             </span>
                                           

//                                         </td> */}
//                                         <td style={{ width: '12%' }}>
//                                             <span className="align-content-start d-flex">
//                                                 Online:
//                                                 {item.ColumnLevelVerification && item.ColumnLevelVerification !== "" && item.ColumnLevelVerification !== "[]" ? (
//                                                     // Parse the JSON string to an array if it's a string
//                                                     JSON.parse(item.ColumnLevelVerification).map((verification, index) => (
//                                                         <span key={index}>
//                                                             {verification.Title === 'LinkBundestag' && verification.Value === "Incorrect" ? (
//                                                                 <span style={{ marginLeft: '3px' }}>
//                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                                                     </svg>
//                                                                 </span>
//                                                             ) : verification.Title === 'LinkBundestag' && verification.Value === "Correct" ? (
//                                                                 <span style={{ marginLeft: '3px' }}>
//                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                                         <path
//                                                                             fillRule="evenodd"
//                                                                             clipRule="evenodd"
//                                                                             d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
//                                                                             fill="#00893A"
//                                                                         />
//                                                                     </svg>
//                                                                 </span>
//                                                             ) : verification.Title === 'LinkBundestag' && verification.Value === "Maybe" ? (
//                                                                 <span style={{ marginLeft: '3px' }}>
//                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                                                     </svg>
//                                                                 </span>
//                                                             ) : verification.Title === 'LinkBundestag' && verification.Value === "" ? (
//                                                                 <span style={{ marginLeft: '3px' }}>
//                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                                                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                                                     </svg>
//                                                                 </span>
//                                                             ) : null}
//                                                         </span>
//                                                     ))
//                                                 ) : item.LinkBundestag ? (
//                                                     <span>
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             width="24"
//                                                             height="24"
//                                                             viewBox="0 0 24 24"
//                                                             fill="none"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 clipRule="evenodd"
//                                                                 d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
//                                                                 fill="#00893A"
//                                                             />
//                                                         </svg>
//                                                     </span>
//                                                 ) : (
//                                                     <span>
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             width="24"
//                                                             height="24"
//                                                             viewBox="0 0 24 24"
//                                                             fill="none"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 clipRule="evenodd"
//                                                                 d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z"
//                                                                 fill="#333333"
//                                                             />
//                                                         </svg>
//                                                     </span>
//                                                 )}
//                                             </span>
//                                         </td>



//                                     </tr>
//                                 ))}

//                             </table>
//                         ) : (
//                             searchTerm !== '' &&
//                             filteredItems.length === 0 && (
//                                 <p className="text-danger mt-3">No matching results found.</p>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>


//             {
//               isModalOpen && (
//                 <div
//                   style={{
//                     position: 'fixed',
//                     top: '0',
//                     left: '0',
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     zIndex: '99999',
//                   }}
//                 >
//                   <div
//                     style={{
//                       backgroundColor: 'white',
//                       padding: '24px',
//                       borderRadius: '4px',
//                       width: '100%',
//                       maxWidth: '600px',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: '20px',
//                     }}
//                   >
//                     {/* Close icon at top-right */}
//                     <button
//                       onClick={closeModal}
//                       style={{
//                         position: 'absolute',
//                         top: '10px',
//                         right: '10px',
//                         background: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                       }}
//                     >

//                     </button>
//                     <div className='BriefwahlInformationPopup'>
//                       <div className='modal-header'>
//                         <h3 className='modal-title'>Briefwahl Information - {selectedItem?.Gemeinde}</h3>
//                         <span className='' style={{ cursor: 'pointer' }} onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                           <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg></span>
//                       </div>
//                       <div className="modal-body">
//                         <div className='infoBox'>
//                           <div className="infoBox-itemBox">
//                             <div className='infoBox-itemBox-item'>
//                               <strong>PLZ:</strong> {selectedItem?.PLZ}
//                               {selectedItem?.ZipCodes ? (
//                                 <div className="zipCodeHover">{selectedItem?.ZipCodes}</div>
//                               ) : null}
//                             </div>
//                             <div className='infoBox-itemBox-item'><strong>Gemeinde:</strong>{selectedItem?.Gemeinde}</div>
//                           </div>
//                           <div className="infoBox-itemBox">
//                             <div className='infoBox-itemBox-item'><strong>Wahlkreis:</strong>{selectedItem?.Wahlkreis}</div>
//                             <div className='infoBox-itemBox-item'><strong>WK Name:</strong>{selectedItem?.WKName}</div>
//                           </div>
//                         </div>
//                         <div className='infoBox'>
//                           <div className='col'>
//                             <strong>Email:</strong> <a href={`mailto:${selectedItem?.Email}`}>{selectedItem?.Email ? selectedItem?.Email : 'n/a'}</a>
//                           </div>
//                         </div>
//                         {isExpanded && (
//                           <>
//                             <div className='infoBox'>
//                               <div className='col' style={{ width: '100%' }}>
//                                 <input className="form-control m-0 rounded-0"
//                                   type="text"
//                                   value={Email}
//                                   onChange={(e) => setEmail(e.target.value)}
//                                   placeholder="Richtige Gemeinde-Email melden:"
//                                   style={{ width: '100%' }}
//                                 />
//                               </div>
//                             </div>

//                           </>
//                         )}
//                         <div className='infoBox'>
//                           <div className="col-12">
//                             <span className="VerifyOnlineStatus">
//                           <span className="alignCenter d-flex">
//                               {selectedItem.ColumnLevelVerification && selectedItem.ColumnLevelVerification !== "" && selectedItem.ColumnLevelVerification !== "[]" ? (
//                                 JSON.parse(selectedItem.ColumnLevelVerification).map((verification, index) => (
//                                   <span key={index}>
//                                     {verification.Title === 'LinkBundestag' && verification.Value === "Incorrect" ? (
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                       </svg>
//                                     ) : verification.Title === 'LinkBundestag' && verification.Value === "Correct" ? (
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <path
//                                           fillRule="evenodd"
//                                           clipRule="evenodd"
//                                           d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
//                                           fill="#00893A"
//                                         />
//                                       </svg>
//                                     ) : verification.Title === 'LinkBundestag' && verification.Value === "Maybe" ? (
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                       </svg>
//                                     ) : verification.Title === 'LinkBundestag' && verification.Value === "" ? (
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                         <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
//                                       </svg>
//                                     ) : null}
//                                   </span>
//                                 ))
//                               ) : selectedItem.LinkBundestag ? (
                               
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       clipRule="evenodd"
//                                       d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
//                                       fill="#00893A"
//                                     />
//                                   </svg>
                              
//                               ) : (
                              
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       clipRule="evenodd"
//                                       d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z"
//                                       fill="#333333"
//                                     />
//                                   </svg>
                              
//                               )}
                              
//                             </span>
//                             {selectedItem?.OnlineStatus!=null && selectedItem?.OnlineStatus!=undefined && selectedItem?.OnlineStatus!="" && (<span className='VerifyOnlineStatusText'>Verifiziert - verfügbar ab {selectedItem?.OnlineStatus}</span>)}
//                             </span>
//                           </div>
//                           <div className='col'>
//                             <strong>Link Online Formular: </strong>
                            
                            
//                             <a className='breakURLLink' href={selectedItem?.LinkBundestag} target="_blank" rel="noopener noreferrer">{selectedItem?.LinkBundestag}</a>
//                           </div>
//                         </div>
//                         {isExpanded && (
//                           <>

//                             <div className='infoBox'>
//                               <div className='col' style={{ width: '100%' }}>
//                                 <input className="form-control m-0 rounded-0"
//                                   type="LinkOnlineFormular"
//                                   value={LinkOnlineFormular}
//                                   onChange={(e) => setLinkOnlineFormular(e.target.value)}
//                                   placeholder="Richtigen Online-Link melden:"
//                                   style={{ width: '100%' }}
//                                 />
//                               </div>
//                             </div>
//                           </>
//                         )}
//                         {/* Expanded fields */}

//                         <div className="col-12">
//                           {/* Expand/Collapse icon button */}
//                           <button
//                             className='btn btn-secondary rounded-0'
//                             onClick={handleToggleExpand}
//                             style={{
//                               border: 'none',
//                               background: 'transparent',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px', // Space between icon and text
//                             }}
//                           >
//                             {isExpanded ? (
//                               <>
//                                 <a>Falsche Informationen melden</a>

//                               </>
//                             ) : (
//                               <>
//                                 <a>Falsche Informationen melden</a>
//                               </>
//                             )}
//                           </button>

//                         </div>


//                       </div>
                    



//                         {/* Submit button */}
//                         {isExpanded && (
//                               <div className='modal-footer'>
//                           <button
//                             className='btn btn-primary rounded-0'
//                             onClick={handleSubmit}
//                           >
//                             Melden
//                           </button>
//                           </div>
//                         )}

//                         {/* Close button */}
//                         {/* <button
//                           className='btn btn-secondary rounded-0 ms-2'
//                           onClick={closeModal}
//                         >
//                           Close
//                         </button> */}
                      
//                     </div>
//                   </div>
//                 </div>
//               )

//             }
//              {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
//         </div >

//     )
// };
const Briefwahlsearch = (props: any) => {

    return (
        <Briefwahl2021 />
      );
}
export default Briefwahlsearch;