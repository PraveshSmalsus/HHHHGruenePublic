import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './KanGlobalCommonTable';
import './CSS/Briefwahlsearch.css';
import Highlighter from "react-highlight-words";
import axios from 'axios';
import { cursorTo } from 'readline';
import AlertPopup from './AlertPopup';
import { Helmet } from 'react-helmet';
import { getAllTableData } from './service';
import { filterDataByUsingDynamicColumnValue } from './service';
import { TailSpin } from "react-loader-spinner";
let PopuTitle = 'Direktkandidat*in Wahlkreis '
let AllBriefwahl = [];
let KandidatinnendataBackup: any = [];
const Kandidatinnen = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [Allkandidatinnen, setAllkandidatinnen]: any = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
    const [condidateInfo, setCondidateInfo]: any = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [CondidateName, setCondidateName] = useState('');
    const [CondidateLink, setCondidateLink] = useState('');
    const [CopyRight, setCopyRight] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const handleToggleExpand = () => {
        PopuTitle = 'Feedback Formular -'
        setIsExpanded(!isExpanded);  // Toggle between expanded and collapsed
    };
    useEffect(() => {
        getBriefwahlTabledata('Briefwahl');
    }, [])
    useEffect(() => {
        setCaptchaText(generateCaptcha());
    }, []); // Empty dependency array ensures it runs once when the component is mounted
    const handleCaptchaChange = (e) => {
        const value = e.target.value;
        setCaptchaInput(value);
        setIsCaptchaValid(value.toLowerCase() === captchaText.toLowerCase());
    };
    // Function to regenerate CAPTCHA text
    const refreshCaptcha = () => {
        setCaptchaText(generateCaptcha());
        setCaptchaInput('');
        setIsCaptchaValid(false);
    };

    function generateCaptcha(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < length; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
    }
    const getBriefwahlTabledata = async (tableName) => {
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
                    if (result != undefined && result != null && result?.data != undefined && result?.data != null)
                        AllBriefwahl = result?.data;
                    else
                        AllBriefwahl = [];
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('An error occurred:', error);
        }
        getTabledata("WKCandidatesInfo");
    };
    const getTabledata = async (tableName) => {
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
                    if (result != undefined && result != null && result?.data != undefined && result?.data != null) {
                        result?.data.map((wk) => {
                            wk.PLZ = ""
                            wk.ZipCodes = ""
                            wk.Gemeinde = ""
                            AllBriefwahl.map((bwhl) => {
                                if (wk.WKNo == bwhl.Wahlkreis) {
                                    wk.PLZ = wk.PLZ + ';' + bwhl.PLZ
                                    wk.ZipCodes = wk.ZipCodes + ';' + bwhl.ZipCodes
                                    wk.Gemeinde = wk.Gemeinde + ';' + bwhl.Gemeinde
                                }
                            })
                        })
                        KandidatinnendataBackup = result?.data
                        setAllkandidatinnen(result?.data);
                        setLoading(false);
                    }
                    else
                        setAllkandidatinnen([]);
                    setLoading(false);
                })

                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const getCondidateInfo = async (table: any, column: any, value: any) => {
        try {
            const response: any = await filterDataByUsingDynamicColumnValue(table, column, value);
            if (response != undefined && response != null)
                setCondidateInfo(response);
            else
                setCondidateInfo(null);
        } catch (error: any) {
            console.error(error);
        };
    };
    const openModal = (item: any) => {
        let e: any = '';
        setIsModalOpen(true);
        getCondidateInfo('WKCandidatesInfo', 'WKNo', item?.WKNo)
        refreshCaptcha()
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setIsExpanded(false)
        setCondidateName('')
        setCondidateLink('')
        setCopyRight('')
        setCaptchaInput('')
        PopuTitle = 'Direktkandidat*in Wahlkreis '
    };
    const getPublicServerData = async (tableName: any, id: any) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "table": tableName,
                "id": id
            });
            console.log(raw, "rawrawrawraw")

            const requestOptions: any = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataById.php", requestOptions);
            const result = await response.json();
            console.log(result, "resultresultresultresult")
            // Filter the results to match the specific KeyTitle
            const itemData = result?.data?.id != undefined ? [result?.data] : [];
            return itemData;
        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }
    }
    const WKCondidateSubmit = async () => {
        const Itemresponse = await getPublicServerData('WKCandidatesInfoFeedback', condidateInfo?.id)
        try {
            try {
                const postDataArray = [{
                    id: condidateInfo?.id, Name: CondidateName, Link: CondidateLink, WKNo: condidateInfo.WKNo, CopyRight: CopyRight, ExistingName: condidateInfo?.Name, ExistingLink: condidateInfo?.Link, ExistingCopyRight: condidateInfo?.CopyRight, Status: { LinkStatus: "Not yet verified", CandidateNameStatus: "Not yet verified" , CopyRightStatus: "Not yet verified"}, Created: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                }];
                const updatepostDataArray = [{
                    id: condidateInfo?.id, Name: CondidateName, Link: CondidateLink, WKNo: condidateInfo.WKNo, CopyRight: CopyRight, ExistingName: condidateInfo?.Name, ExistingLink: condidateInfo?.Link, ExistingCopyRight: condidateInfo?.CopyRight, Status: { LinkStatus: "Not yet verified", CandidateNameStatus: "Not yet verified", CopyRightStatus: "Not yet verified" }, Modified: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                }];
                const postData = {

                    data: Itemresponse != undefined && Itemresponse != null && Itemresponse.length > 0 ? updatepostDataArray : postDataArray,
                    tableName: 'WKCandidatesInfoFeedback',
                    ApiType: Itemresponse != undefined && Itemresponse != null && Itemresponse.length > 0 ? 'updateData' : 'postData'
                };
                const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/createTableColumns.php', postData);
                if (response.status === 200) {
                    setAlertMessage('Vielen Dank für Deine Hilfe!');
                    setShowAlert(true)
                    setCondidateName('')
                    setCondidateLink('')
                    setCopyRight('')
                } else {
                    console.error('Error sending data to server:', response.statusText);
                }

            } catch (error) {
                console.error('An error occurred:', error);
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
        closeModal();
    };

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 1,
                id: 'Id',
            },
            {
                accessorKey: "", placeholder: "Image Name", header: "", id: "ImageName", size: 5,
                cell: ({ row }: any) => (
                    <>

                        <div className="columnFixedTitle">
                            <span style={{ width: '60px', display: 'block' }}> {row?.original?.Image != undefined && row?.original?.Image != "" ?
                                <img src={row?.original?.Image} className="KandidatinImg me-1" /> : <img src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/32/icon_user.jpg" className="KandidatinImg me-1" />}
                            </span>
                        </div>
                    </>
                ),
                resetColumnFilters: false,
                isAdvanceSearchVisible: true,
                resetSorting: false,
                isColumnVisible: true
            },
            {
                accessorKey: "Name", placeholder: "Name", header: "", id: "Name", size: 30,
                cell: ({ row }: any) => (
                    <>
                        <div style={{ width: '260px' }}><a onClick={() => openModal(row?.original)}><strong>{row?.original?.Name}</strong></a></div>
                    </>
                ),
            },
            {
                accessorKey: "WKNo", placeholder: "WK-Nr.", header: "", id: "WKNo", size: 10,
                cell: ({ row }: any) => (
                    <>
                        <div style={{ width: '105px', textAlign: "center" }}>{row?.original?.WKNo}</div>
                    </>
                ),
            },

            {
                accessorKey: "WKName", placeholder: "Wahlkreis", header: "", id: "WKName", size: 55,
                cell: ({ row }: any) => (
                    <>
                        <span style={{ width: '250px' }}>
                            <a onClick={() => openModal(row?.original)}>
                                {row?.original?.WKName}
                            </a></span>
                    </>
                ),
            },

        ],
        [Allkandidatinnen]
    );
    const callBackData = (data: any) => {
        console.log(data)
    }
    const normalizeString = (str: string, reverse: string) => {
        if (!str) return str;

        // If reverse flag is set, perform English to German conversion
        if (reverse == '1') {
            return str
                .replace(/ae/g, 'ä')
                .replace(/oe/g, 'ö')
                .replace(/ue/g, 'ü')
                .replace(/ss/g, 'ß')
                .toLowerCase();
        } else if (reverse == '2') {
            return str
                .replace(/ä/g, 'ae')  // Replace ä with ae
                .replace(/ö/g, 'oe')  // Replace ö with oe
                .replace(/ü/g, 'ue')  // Replace ü with ue
                .replace(/ß/g, 'ss')  // Replace ß with ss
                .toLowerCase();  // Convert to lowercase for case-insensitive comparison
        } else if (reverse == '3') {
            return str
                .replace(/ä/g, 'a')  // Replace ä with ae
                .replace(/ö/g, 'o')  // Replace ö with oe
                .replace(/ü/g, 'u')  // Replace ü with ue
                .replace(/ß/g, 's')  // Replace ß with ss
                .toLowerCase();  // Convert to lowercase for case-insensitive comparison
        }

        // Default: German to English conversion

    };
    const clearSearchButton = () => {
        setSearchTerm('')
        setAllkandidatinnen([...KandidatinnendataBackup]);
    }
    const handleSearch = (searchTerm: string) => {
        const trimmedSearchTerm = searchTerm.trim(); // Trim any leading/trailing spaces
        const filtered = KandidatinnendataBackup.filter((item: any) => {
            const originalGemeinde = String(item.Gemeinde || '').toLowerCase();
            const normalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '1');
            const reverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '2');
            const myreverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '3');
            const concatenatedGemeinde = originalGemeinde + " " + normalizedGemeinde + " " + reverseNormalizedGemeinde + " " + myreverseNormalizedGemeinde;

            return (
                concatenatedGemeinde.toLowerCase().indexOf(trimmedSearchTerm.toLowerCase()) !== -1 ||
                String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1 ||
                String(item.ZipCodes || '').indexOf(trimmedSearchTerm) !== -1 ||
                String(item.WKName || '').indexOf(trimmedSearchTerm) !== -1
            );
        });

        // Sort the filtered results based on PLZ value
        const sortedFiltered = filtered.sort((a: any, b: any) => {
            const plzA = String(a.PLZ || '');
            const plzB = String(b.PLZ || '');

            // Check if both PLZ values contain the search term
            const indexA = plzA.indexOf(trimmedSearchTerm);
            const indexB = plzB.indexOf(trimmedSearchTerm);

            // If the search term exists in both, prioritize based on the value of PLZ itself (numeric order)
            if (indexA !== -1 && indexB !== -1) {
                return parseInt(plzA) - parseInt(plzB);  // Sort numerically to ensure smaller values come first
            }

            // If only one contains the search term, prioritize that entry
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // If neither contains the search term, sort based on numeric PLZ values
            return parseInt(plzA) - parseInt(plzB); // Sort numerically
        });
        setAllkandidatinnen([...sortedFiltered]); // Update filtered items with sorted results


    };

    return (
        <>
            <Helmet>
                <title>Bundestagswahl 2025 - Homepages aller Direktkandidat*innen</title>
                <meta name="description" content="Finde hier die direkten Links zu den Homepages aller grünen Direktkandidat*innen zur Bundestagswahl 2025" />
            </Helmet>
            <div className="container mb-5">
                <header className="page-header">
                    <h1 className="page-title heading text-center">Bundestagswahl 2025 - Homepages aller Direktkandidat*innen</h1>
                </header>
                <div className="kandidatinnenpage">
                    <div className="col position-relative kandidatinnen">
                        <div className="flex-searchrowWithBtn">
                            <div className="CustomSearchInputWithBtn">
                                <span className="BtnSearchIcon" onClick={() => setSearchTerm('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#00893A" />
                                </svg>
                                </span>
                                <input
                                    type="text"
                                    className="CustomSearchInput"
                                    placeholder="Gib hier Deine Gemeinde oder Postleitzahl (PLZ) ein..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value); // Update searchTerm on typing
                                        handleSearch(e.target.value); // Call handleSearch whenever typing
                                    }}
                                />
                                <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333" />
                                </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                  
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                                <TailSpin
                                    color="#005437"
                                    height={60}
                                    width={60}
                                />
                            </div>
                        ) : (
                            <div className="kandidatinnenPageTable border" style={{ userSelect: "none" }}><GlobalCommanTable columns={columns} openModel={openModal} data={Allkandidatinnen} showHeader={true} callBackData={callBackData} expandIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} /></div>
                        )}
                   

                </div>
                {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
            </div >
            {
                isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: '99999',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                width: '100%',
                                maxWidth: '670px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}
                        >
                            {/* Close icon at top-right */}
                            <button
                                onClick={closeModal}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',

                                }}
                            >

                            </button>
                            <div className='KandidatinnenPopup'>
                                <div className='modal-header'>
                                    <h3 className='modal-title'>{PopuTitle}{condidateInfo?.WKNo} - {condidateInfo?.WKName}</h3>
                                    <span className='closePopupBtn' style={{ cursor: 'pointer' }} onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg></span>
                                </div>
                                <div className="modal-body">
                                    {condidateInfo ? (
                                        <><div className="expand-AccordionContent clearfix">
                                            <div className="KandidatinnenDetails">
                                                {condidateInfo.Image != undefined && condidateInfo.Image != "" ? (<div className='KandidatinnenImgSection'><img className='KandidatinnenImg' src={condidateInfo.Image} />{condidateInfo.CopyRight != undefined && condidateInfo.CopyRight != null && condidateInfo.CopyRight != "" ? (<span className='copyrightInfo'>&copy; {condidateInfo.CopyRight}</span>) : ""}</div>) : (<img className='KandidatinnenImg' src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/32/icon_user.jpg" />)}
                                                <div className='KandidatinnenDescription'>
                                                    <span className='KandidatinnenName'>{condidateInfo.Name}</span>
                                                    <a className='KandidatinnenURL' href={condidateInfo.Link} target="_blank" rel="noopener noreferrer">{condidateInfo.Link}</a>
                                                    {/* <a className='userURL' href='https://katharina-beck.de/' target="_blank" rel="noopener noreferrer">{condidateInfo.Link}</a> */}
                                                </div>
                                            </div>
                                        </div></>
                                    ) : ("")}
                                    {isExpanded && <>
                                        <div className='infoBox mt-3'>
                                            <div className="infoBox-itemBox">
                                                <div className='infoBox-itemBox-item'><strong>WK-Nummer:</strong>{condidateInfo?.WKNo}</div>
                                                <div className='infoBox-itemBox-item'><strong>Wahlkreis:</strong>{condidateInfo?.WKName}</div>
                                            </div>
                                        </div>
                                        <div className='infoBox'>
                                            <div className='col' style={{ width: '100%' }}>
                                                <input className="form-control m-0 rounded-0"
                                                    type="text"
                                                    value={CondidateName}
                                                    onChange={(e) => setCondidateName(e.target.value)}
                                                    placeholder="Richtigen Namen melden:"
                                                    style={{ width: '100%' }} />
                                            </div>
                                        </div><div className='infoBox'>
                                            <div className='col' style={{ width: '100%' }}>
                                                <input className="form-control m-0 rounded-0"
                                                    type="text"
                                                    value={CondidateLink}
                                                    onChange={(e) => setCondidateLink(e.target.value)}
                                                    placeholder="Richtigen Link melden:"
                                                    style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div className='infoBox'>
                                            <div className='col' style={{ width: '100%' }}>
                                                <input className="form-control m-0 rounded-0"
                                                    type="text"
                                                    value={CopyRight}
                                                    onChange={(e) => setCopyRight(e.target.value)}
                                                    placeholder="Richtige Copyright Information melden:"
                                                    style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '13px' }}>
                                            Korrekturen per Email an <a href="mailto:info@gruene-weltweit.de">info@gruene-weltweit.de</a>
                                        </div>
                                    </>}
                                </div>
                                {isExpanded && (
                                    <div className='modal-footer'>

                                        {isExpanded && (
                                            <div className="captcha-container">
                                                <span>Geben Sie das Wort ein:
                                                    <label htmlFor="captcha" className="captcha-label">
                                                        {captchaText}
                                                    </label>
                                                    <span
                                                        className="captcha-refresh-icon"
                                                        onClick={refreshCaptcha}
                                                        title="CAPTCHA aktualisieren"
                                                    ><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8028 0.55394C12.3641 1.35957 9.3989 2.67104 6.605 5.064C4.08809 7.2198 2.45521 9.5152 1.08484 12.824C0.629632 13.9229 0.692932 14.0664 1.78533 14.4106C2.32563 14.581 2.78366 14.6944 2.803 14.6626C2.82234 14.6308 3.02489 14.13 3.25311 13.5498C5.2682 8.4272 9.4215 4.74453 14.8688 3.2502C16.9568 2.67737 20.7902 2.66489 22.8688 3.22418C26.0462 4.07904 28.2727 5.3077 30.5479 7.4615C32.0222 8.8572 33.8578 11.2667 33.8578 11.8063C33.8578 12.0103 33.3686 12.0553 31.1513 12.0553C28.1711 12.0553 28.2314 12.0317 28.2314 13.1982C28.2314 14.4031 27.9728 14.341 32.9975 14.341H37.5501V9.7696V5.1982H36.4128H35.2754L35.226 7.234L35.1764 9.2699L34.0076 7.7821C30.4693 3.27816 25.3505 0.71904 19.5281 0.54321C18.271 0.50524 17.0446 0.50998 16.8028 0.55394ZM34.5994 24.8465C33.7458 26.9298 32.8496 28.3229 31.3192 29.9456C28.2222 33.2291 24.6347 34.94 19.9647 35.3604C17.7187 35.5626 14.3882 34.9047 11.9462 33.7764C10.2231 32.9803 8.3379 31.653 7.0145 30.3041C5.8905 29.1586 4.14348 26.7574 4.14348 26.3582C4.14348 26.1838 4.77135 26.1189 6.8248 26.0819L9.5061 26.0333L9.5582 24.8465L9.61 23.6597H5.0307H0.451172V28.319V32.9784H1.59403H2.73689V30.8432V28.708L3.3855 29.5684C6.7225 33.9957 11.0238 36.6424 16.0837 37.3822C18.1308 37.6817 21.9388 37.5104 23.7275 37.0387C27.8905 35.9407 31.7384 33.3571 34.3666 29.8957C35.3438 28.6086 36.9382 25.5466 37.1267 24.5954C37.2352 24.0472 37.2197 24.0312 36.3068 23.7603C35.795 23.6082 35.3271 23.4839 35.267 23.4839C35.2069 23.4839 34.9064 24.0971 34.5994 24.8465Z" fill="#008939" />
                                                        </svg>
                                                    </span>

                                                </span>
                                                <input
                                                    type="text"
                                                    id="captcha"
                                                    value={captchaInput}
                                                    onChange={handleCaptchaChange}
                                                    placeholder="Geben Sie CAPTCHA ein"
                                                    className="form-control"
                                                />
                                                {!isCaptchaValid && captchaInput && (
                                                    <small className="text-danger">Captcha ist falsch</small>
                                                )}
                                            </div>
                                        )}
                                        {isExpanded && (
                                            <button
                                                className="btn btn-primary rounded-0 mb-2"
                                                onClick={WKCondidateSubmit}
                                                disabled={!isCaptchaValid}  // Disabled if CAPTCHA is not valid
                                            >
                                                Melden
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="ExpandLinkFooter">

                                    {/* Expand/Collapse icon button */}

                                    {isExpanded ? (
                                        <>
                                            {/* <a onClick={handleToggleExpand}>Falsche Informationen melden</a> */}

                                        </>
                                    ) : (
                                        <>
                                            <a onClick={handleToggleExpand}>Falsche Informationen melden</a>
                                            <span className='footer_text_right'>Alle Angaben ohne Gewähr</span>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};
export default Kandidatinnen;