import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CSS/styles.css";
import "./CSS/custom.css";
import { useParams } from "react-router-dom";
import WahlWeltweit from "./WahlWeltweit";
import Briefwahl2021 from "./Briefwahl2021";
import GrueneWeltweitForm from "./GrueneWeltweitForm";
import RelevantNews from "./RelevantNews";
import EventDetail from "./event-detail";
import RelevantEvent from "./RelevantEvent";
import Briefwahlsearch from "./Briefwahlsearch";
import { useLocation } from 'react-router-dom';
import { IoCalendarOutline } from "react-icons/io5";
import { RelevantWebPart } from "./RelevantWebPart";
import NewsHome from "./NewsHome";
import EventHomemainPage from "./EventHome";
import ContactForm from "./ContactForm";
import BriefwahlElection from "./BriefwahlElection";
import { Helmet } from 'react-helmet';
let FlagSmartPage = false
//let showBriefflag = false;
let stateParam: any;
const SmartpageComponent = ({ clickedTitle }: any) => {
  const { SmartPage: smartPage } = useParams(); // Destructure the SmartPage parameter from useParams
  const [EventData, setEventData]: any = useState([]);
  const [NewsData, setNewsData]: any = useState([]);
  const [Newsflag, setNewsflag]: any = useState(false);
  const [Eventflag, setEventflag]: any = useState(false);
  const [showBriefflag, setShowBriefflag]: any = useState(false);
  const [Showwebpart, setShowwebpart]: any = useState(false);
  const [Eventdetailflag, setEventdetailflag]: any = useState(false);
  const [Smartpageflag, setSmartpageflag]: any = useState(false);
  const [data, setData] = useState<any>([]);
  const [breadcrumsdata, setbreadcrumsdata] = useState<any>([]);
  const newsEventserverUrl = 'https://eventservers.onrender.com/api/getData';
  const GetserverUrl = 'https://eventservers.onrender.com/api/getDataFilterbase';
  const KeyTitleFilterKeyTitle = 'https://eventservers.onrender.com/api/getFilterKeyTitle'
  const location = useLocation();
  const { item } = location.state || {};
  const pageUrl = window?.location?.pathname?.split('/')[1]

  useEffect(() => {
    // Ensure stateParam is scoped inside the effect
    // Check for '/Briefwahl/State=' in the pathname
    if (location.pathname.toLowerCase().indexOf('/briefwahl/state=') > -1) {
      const pathParts = location.pathname.split('/');
      stateParam = pathParts[pathParts.length - 1].split('=')[1];
      if (stateParam) {
        setShowBriefflag(true);
      }
    }
    // Check for '/Briefwahl' if no stateParam is present
    else if ((location.pathname.toLowerCase().indexOf('/bundestagswahl-2025') > -1) || (location.pathname.toLowerCase().indexOf('/briefwahl') > -1 && location.pathname.toLowerCase().indexOf('/briefwahl-about') == -1)) {
      const pathParts = location.pathname.split('/');
      stateParam = pathParts[pathParts.length - 1].split('=')[1];
      if (!stateParam) {
        setShowBriefflag(true);
      }
    } else if (location.pathname.indexOf('/') > -1) {

      setShowBriefflag(false);

    }
  }, [location.pathname]);
  const decodeArray = (arr: any) => {
    return arr.map((item: string) => decodeURIComponent(item));
  };

  const urlParamsString = smartPage;

  const urlParams = new URLSearchParams(urlParamsString);

  const itemId = urlParams.get('ItemID');
  const pathPartssss = location.pathname.split('/');
  console.log(pathPartssss, "itemId")
  const decodedArray = decodeArray(pathPartssss);

  console.log(decodedArray, "urlParamssss")


  function formatDate(dateString: string, format: 'D-M-YYYY' | 'YYYY-M-D') {
    // Parse the date string
    const date = new Date(dateString);
    // Extract day, month, and year, and add leading zeros if needed
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so we add 1
    const year = date.getFullYear();
    // Construct the formatted date string based on the specified format
    let formattedDate;

    if (format === 'D-M-YYYY') {
      formattedDate = `${day}-${month}-${year}`;
    } else if (format === 'YYYY-M-D') {
      formattedDate = `${year}-${month}-${day}`;
    }

    return formattedDate;
  }

  const getPublicServerData = async (tableName: string): Promise<any[]> => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({ "table": `${tableName}` });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions);
      const result = await response.json();
      return result?.data || [];
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  };

  const getNewsdata = async () => {
    const tableName = "Announcements";
    try {
      const response = await getPublicServerData(`${tableName}`);
      if (response.length > 0) {
        const sortedData = response.sort((a, b) => {
          if (a.PublishingDate && b.PublishingDate) {
            const dateA = new Date(a.PublishingDate).getTime();
            const dateB = new Date(b.PublishingDate).getTime();
            return dateB - dateA;
          }
          return 0;
        });
        let finalData = sortedData.map((data: any) => {
          if (data.Body) {

            data.Body = replaceUrlsWithNewFormat(data.Body)
          } return data;
        })
        setNewsData(finalData);
        getPublicBreadCumsNewsAndEvent(item?.id);
        console.log('Get data from server successfully', finalData);
        console.log(sortedData);
      } else {
        console.error('No data received from the server.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const getEventdata = async () => {
    const tableName = "events";
    try {
      const response = await getPublicServerData(`${tableName}`);
      if (response.length > 0) {
        const sortedData = response.sort((a, b) => {
          if (a.EventDate && b.EventDate) {
            const dateA = new Date(a.EventDate).getTime();
            const dateB = new Date(b.EventDate).getTime();
            return dateB - dateA;
          }
          return 0; // If EventDate is missing in any of the objects, maintain the order
        }); let finalData = sortedData.map((data: any) => {
          if (data.Description) {
            data.Description = replaceUrlsWithNewFormat(data.Description)
          } return data;
        })
        setEventData(finalData);
        getPublicBreadCumsNewsAndEvent(item?.id);

        console.log('Get data from server successfully');
        console.log(sortedData);
      } else {
        console.error('No data received from the server.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const showwebpart = () => {
    setShowwebpart(true)
  }
  const getPublicServerSmartMetaData = async (tableName: any, Title: any, smartid: any) => {
    if (clickedTitle != undefined) {
      Title = clickedTitle
    }
    try {
      let url = '';
      // Construct the URL with query parameters
      if (smartid != null) {
        // url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=${smartid}&title=${Title}`;
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?title=${Title}`;
      }
      else {
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?title=${Title}`;
      }

      // Define the GET request options
      const requestOptions: any = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        redirect: 'follow'
      };

      console.log(url, "Request URL");

      // Send the GET request
      const response = await fetch(url, requestOptions);
      const text = await response.text();
      const jsonStartIndex = text.indexOf('{');  // Find the start of JSON
      const jsonEndIndex = text.lastIndexOf('}'); // Find the end of JSON

      // Extract the JSON part by slicing the string between the first "{" and the last "}"
      const jsonText = text.slice(jsonStartIndex, jsonEndIndex + 1);

      const result = JSON.parse(jsonText);
      //const result = await response.json();
      console.log(result, "Result from GET request");

      // Filter the results to match the specific KeyTitle
      const smartPageData = result?.data?.id !== undefined ? [result?.data] : [];

      return smartPageData;
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  };

  // const getPublicServerSmartMetaData = async (tableName: any, Title: any, smartid: any) => {
  //   try {
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     const raw = JSON.stringify({
  //       "table": tableName,
  //       "keyTitle": Title,
  //       "id": smartid
  //     });
  //     console.log(raw, "rawrawrawraw")

  //     const requestOptions: any = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: 'follow'
  //     };

  //     const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataByIdandTitle.php", requestOptions);
  //     const result = await response.json();
  //     console.log(result, "resultresultresultresult")
  //     // Filter the results to match the specific KeyTitle
  //     const smartPageData = result?.data?.id != undefined ? [result?.data] : [];

  //     return smartPageData;
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //     return [];
  //   }
  // }
  const replaceUrlsWithNewFormat = (inputString: any) => {
    try {
      const urlRegex = /href="[^"]*SmartId\s*=\d+[^"]*Item\s*=[^"]*"|href="[^"]*SmartID\s*=\d+[^"]*item1\s*=[^"]*"/gi;

      let replacedString = inputString?.replace(urlRegex, (match: any) => {
        let title;
        if (match.includes('item1=')) {
          title = match.split('item1=')[1]?.replace(/%20/g, '-');
        } else if (match.includes('Item=')) {
          title = match.split('Item=')[1]?.replace(/%20/g, '-');
        } else {
          return match;
        }
        return `href="https://gruene-weltweit.de/${title}"`;
      });

      const urlPattern = /sites\/GrueneWeltweit\/washington\/public\//g;
      const replacement = "";
      replacedString = replacedString.replace(urlPattern, replacement);
      return replacedString;
    } catch (e) {
      console.log(e);
      return inputString; // Return the original string in case of error
    }
  }

  const fetchData = async () => {
    setData(undefined)
    const tableName = "SmartMetaData";
    let Title = smartPage
    console.log(Title, "TitleTitle");
    try {
      const response: any = await getPublicServerSmartMetaData(tableName, Title, item?.id)
      console.log(response, "responseresponse");

      if (response.length > 0) {
        let finalData = response.map((data: any) => {
          if (data?.PageContentProfile) {
            data.PageContentProfile = replaceUrlsWithNewFormat(data?.PageContentProfile)
          } return data;
        })
        console.log('Get data from server successfully', finalData);

        getPublicBreadCums(finalData[0]?.id);
        setData(finalData);
        FlagSmartPage = true
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("SmartPage:", smartPage);
    console.log("Newsflag:", Newsflag);
    console.log("Eventflag:", Eventflag);
    console.log("Smartpageflag:", Smartpageflag);
    if (item?.SmartPage && item?.SmartPage.trim() !== "") {
      fetchData();
      setSmartpageflag(true);
      setNewsflag(false);
      setEventflag(false);
      setEventdetailflag(false);

    }
    else if (smartPage?.toLowerCase() === 'neuigkeiten') {
      getNewsdata();
      setNewsflag(true);
      setEventflag(false);
      setSmartpageflag(false);
      setEventdetailflag(false);
    }
    else if (smartPage?.toLowerCase() == 'mitmachen' || smartPage == 'Über-Uns') {
      console.log(smartPage?.toLowerCase(), "smartPage?.toLowerCase()")
      fetchData();
      setSmartpageflag(true);
      setNewsflag(false);
      setEventflag(false);
      setEventdetailflag(false);

    }
    else if (smartPage?.toLowerCase() === 'veranstaltungen') {
      getEventdata();
      setEventflag(true);
      setNewsflag(false);
      setSmartpageflag(false);
      setEventdetailflag(false);
    } else if (itemId) {
      setEventdetailflag(true);
      setEventflag(false);
      setNewsflag(false);
      setSmartpageflag(false);
    } else if (smartPage?.toLowerCase() !== 'neuigkeiten' && smartPage?.toLowerCase() !== 'veranstaltungen') {
      fetchData();
      setSmartpageflag(true);
      setNewsflag(false);
      setEventflag(false);
      setEventdetailflag(false);
    }

    else if (Smartpageflag) {
      fetchData();
      setSmartpageflag(true);
      setNewsflag(false);
      setEventflag(false);
      setEventdetailflag(false);

    }


  }, [smartPage, Newsflag, Eventflag, Smartpageflag, Eventdetailflag]);


  // Rest of your component code...
  const removeSpacialChar = (Title: any) => {
    return Title?.replace(/ /g, '-');
  }
  const removeSpacialChar2 = (Title: string) => {
    return Title?.replace(/-/g, ' ');
  }


  const getPublicBreadCums = async (smartid: any) => {
    setbreadcrumsdata([])
    console.log(smartid, "smartidsmartid")

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Construct the URL with the query parameters
      const url = `https://gruene-weltweit.de/SPPublicAPIs/getBreadcrumsdata.php?smartId=${smartid}`;

      const requestOptions: any = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log(result, "result")
      setbreadcrumsdata(result?.data)
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }
  const getPublicBreadCumsNewsAndEvent = async (smartid: any) => {
    setbreadcrumsdata([])
    console.log(smartid, "smartidsmartid")

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Construct the URL with the query parameters
      const url = `https://gruene-weltweit.de/SPPublicAPIs/getBreadcrumdataByid.php?id=${smartid}`;

      const requestOptions: any = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log(result, "result")
      setbreadcrumsdata(result?.data)
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }
  // API function to fetch KeyTitle from the server
  const getPublicServerSmartMetaDataTitle = async (Title: any, smartid: any) => {
    try {
      let url = '';
      if (smartid != null) {
        //url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=${smartid}&title=${Title}`;
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=&title=${Title}`;
      } else {
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=&title=${Title}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result?.success && result?.data) {
        return result?.data?.KeyTitle || Title; // Return cleaned title from API
      } else {
        return Title; // Fallback to original title
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return Title; // Return original title in case of error
    }
  };

  const HTMLRenderer = ({ content }: any) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };
  const handleHref = async (title: any) => {
    const smarttitle = await getPublicServerSmartMetaDataTitle(title, "")
    window.location.href = `https://www.gruene-weltweit.de/${smarttitle}`;

  }

  return (
    <>
     <Helmet>
        <title>Gruene Weltweit - {pageUrl}</title>
      </Helmet>
      {/* <div className="fixedbreadcrump">
        <div className="container">
          <ul className="spfxbreadcrumb m-0 p-0">
            {breadcrumsdata.length > 0 && (
              <li>
                <a href="https://www.gruene-weltweit.de/">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 576 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
                  </svg>
                </a>
              </li>
            )}

            {breadcrumsdata?.map((item: any, index: any) => (
              item && item !== '' && (
                <li key={index}>
                  <a
                    title={removeSpacialChar2(item.Title)}
                    href={`https://www.gruene-weltweit.de/${removeSpacialChar(item.KeyTitle)}`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default anchor action
                      // Collect values up to the clicked index and filter out empty values
                      // const allValues = decodedArray?.slice(0, index + 1).filter(Boolean).join('/');
                      // Navigate to the new URL with the concatenated string
                      handleHref(item.KeyTitle)
                    }}
                  >
                    {removeSpacialChar2(item?.Title)}
                  </a>
                </li>
              )
            ))}

          </ul>
        </div>
      </div>  */}

      <section className='SmartPages '>

        <div className='row'>

          <div className='col-12'>

            {Smartpageflag && (
              data?.map((item: any, index: number) => {
                console.log("Item:", item);
                return (
                  item.KeyTitle?.toLowerCase() !== "warum-aus-dem-ausland-wählen" && item.KeyTitle?.toLowerCase() !== 'europawahl-2024' && item.KeyTitle?.toLowerCase() !== 'briefwahl' && item.KeyTitle?.toLowerCase() !== 'kontakt' && showBriefflag == false ? (
                    <div key={index}>
                      <section
                        id="page-title"
                        className="page-banner page-title-parallax page-title-dark skrollable skrollable-between"
                        style={{
                          backgroundImage: `url(${item?.HeaderImage != '' && item?.HeaderImage != undefined ? `"${item?.HeaderImage}"` : ""})`,
                          backgroundPosition: `0px -117.949px`
                        }}
                        data-bottom-top="background-position:0px 300px;"
                        data-top-bottom="background-position:0px -300px;"
                      >
                        <div className="container  clearfix">
                          <h1 className="nott mb-3" style={{ fontSize: '54px' }}>
                           {item?.PageTitle || item?.Title}
                          </h1>
                          {item.ShortDescription ?
                            <div className="SmartPages-Description"><HTMLRenderer content={item?.ShortDescription} /></div> : ""
                          }
                        </div>
                      </section>
                      <section className="section py-3 container">
                        <div className="smartpageContent row">
                          <div className={!Showwebpart ? "col-12" : "col-9"}>
                            <HTMLRenderer content={item.PageContentProfile} />
                            {item.KeyTitle == "Grüne-Weltweit" ? (<GrueneWeltweitForm />) : ''}
                            {data.length > 0 && <RelevantWebPart data={data[0]} usedFor={'keyDoc'} showwebpart={showwebpart} />}
                            <div className={!Showwebpart ? "col-12" : "col-12"}>
                              {data.length > 0 && <RelevantWebPart data={data[0]} usedFor={'relDoc'} showwebpart={showwebpart} />}
                            </div>
                          </div>
                          <div className={!Showwebpart ? "col-3 pt-2" : "col-3 pt-2"}>
                            {data.length > 0 && <RelevantNews newsItem={data} showwebpart={showwebpart} />}
                            {data.length > 0 && <RelevantEvent newsItem={data} showwebpart={showwebpart} />}
                          </div>
                        </div>
                        {item?.PagesContactForm && (item?.PagesContactForm == 1 || item?.PagesContactForm == true) &&
                          <BriefwahlElection item={item} />
                        }
                      </section>
                    </div>
                  ) :
                    item.KeyTitle.toLowerCase() !== 'europawahl-2024' && item.KeyTitle?.toLowerCase() !== 'briefwahl' && item.KeyTitle?.toLowerCase() !== 'kontakt' && showBriefflag == false ? (
                      <>
                        <WahlWeltweit />
                        {data.length > 0 && <RelevantWebPart data={data[0]} usedFor={'keyDoc'} showwebpart={showwebpart} />}
                        {/* <HTMLRenderer content={item.PageContent} /> */}
                      </>
                    ) : item.KeyTitle?.toLowerCase() !== 'briefwahl' && item.KeyTitle?.toLowerCase() !== 'kontakt' && showBriefflag == false ? (
                      <div>
                        <Briefwahl2021 />

                      </div>
                    ) : item.KeyTitle?.toLowerCase() !== 'briefwahl' && item.KeyTitle?.toLowerCase() == 'kontakt' && showBriefflag == false ? (
                      <div>
                        <ContactForm />

                      </div>
                    ) : (
                      <Briefwahlsearch stateParam={stateParam} />
                      //<Briefwahl2021 />
                    )
                );
              })
            )}
            {Newsflag &&
              <NewsHome />
            }

            {Eventflag &&
              <EventHomemainPage />
            }
            {/* {Newsflag && (
            <div className="container">
              <header className='page-header text-center'><h1 className='page-title'>OV Washington News</h1></header>
              {NewsData.map((item: any) => (
                <div key={item.Id} className='news_home publicationItem has-shadow clearfix'>
                  <div className='entry-meta'>  <IoCalendarOutline />
                    <span>{item?.PublishingDate ? formatDate(item.PublishingDate, 'D-M-YYYY') : ''}</span></div>
                  <div className='valign-middle'>
                    <h4>{item.Title}</h4>
                  </div>
                  <div className='entry-content clearfix'>
                    <div className='Coverimage'>

                      <img className="image" src={item?.ItemCover == "" ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"} />

                    </div>
                    <p>
                      <HTMLRenderer content={item.Body} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )} */}
            {/* {Eventflag && (
            <div className='container'>
              <header className='page-header text-center'><h1 className='page-title'>Events Home</h1></header>
              <section>
                {EventData.map((item: any) => (
                  <div key={item.Id} className='my-3 news_home publicationItem has-shadow clearfix'>
                    <div className='entry-meta'><IoCalendarOutline /> <span>{item?.EventDate ? formatDate(item?.EventDate, 'YYYY-M-D') : ''}</span></div>
                    <div className='valign-middle'>
                      <h4>{item.Title}</h4>
                    </div>
                    <div className='entry-content clearfix'>
                      <div className='Coverimage'>

                        <img className="image" src={item?.ItemCover == "" ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"} />

                      </div>

                      <p dangerouslySetInnerHTML={{ __html: item?.Description?.replaceAll(/&#160;/g, ' ') }} />

                    </div>
                  </div>
                ))}
              </section>
            </div>
          )} */}
            {showBriefflag && (
              <Briefwahlsearch stateParam={stateParam} />
              //<Briefwahl2021 />
            )}
          </div>
        </div>
      </section ></>
  );
};


export default SmartpageComponent;
