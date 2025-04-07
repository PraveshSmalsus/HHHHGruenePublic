import axios from "axios";
import React, { useState, useEffect } from 'react';
import moment from "moment";
import SocialMediaIcon from "./SocialMediaIcon";
import { Panel, PanelType } from '@fluentui/react';
import EventPanel from "./EventPanel";

export default function RelevantEvent(props: any) {
    const [allEvents, setallEvents]: any = useState([]);
    const newsWebpartId = props.newsItem[0].id
    //const GetserverUrl = 'http://localhost:4000/api/getData';
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [url, setUrl] = useState('');
    const handleTitleClick = (newsItem: any) => {
        // Navigate to the new page and pass the newsItem as state
        setSelectedEvent(newsItem);
        setUrl(`https://www.gruene-weltweit.de/Veranstaltungen/${newsItem?.Title}`);
    };
    const closePanel = () => {
        setSelectedEvent(null);
    }
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const CustomHeader = () => {
        return (
            <>
                <div className="align-items-center d-flex justify-content-between w-100">
                    <h3 className="m-0">Event Details</h3>
                    <div className="Shareon align-items-baseline d-flex mb-0">
                        <h6>Share :</h6>
                        <SocialMediaIcon platform="facebook" postUrl={url} />
                        <SocialMediaIcon platform="twitter" postUrl={url} />
                        <SocialMediaIcon platform="linkedin" postUrl={url} />
                        <SocialMediaIcon platform="copy-link" postUrl={url} />
                        <span className="svg__iconbox svg__icon--cross" style={{ position: "relative", top: "6px" }} onClick={closePanel}></span>
                    </div>
                </div>

            </>
        );
    };

    useEffect(() => {
        getNewsListData();
    }, [])

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
    const getNewsListData = async () => {
        const tableName = 'events';
        try {
            const response = await getPublicServerData(`${tableName}`);
            // Parse SmartPagesId values from JSON strings to arrays
            const parsedData = response?.map((item: any) => {
                let smartPagesIdArray = [];
                try {
                    // Check if SmartPagesId is a non-empty JSON string
                    if (item.SmartPagesId && item.SmartPagesId.trim() !== '') {
                        smartPagesIdArray = JSON.parse(item.SmartPagesId);
                    }

                } catch (error) {
                    console.error('Error parsing SmartPagesId:', error);
                    // Handle the error, such as setting to an empty array
                }

                return {
                    ...item,
                    SmartPagesId: smartPagesIdArray
                };
            });
            // parsedData.map((item: any) => {
            //     if (item?.EventDate != null && item?.EventDate != undefined) {
            //         item.EventDate = moment(item?.EventDate, "DD-MM-YYYY").format("DD MMM YYYY");
            //     }
            //     return item; // Return the modified item
            // });
            // Filter data based on newsWebpartId
            const eventdata = parsedData.filter((item: any) => {
                // Check if SmartPagesId is an array and includes newsWebpartId
                if (Array.isArray(item?.SmartPagesId)) {
                    return item.SmartPagesId.includes(parseInt(newsWebpartId));
                } else {
                    // If SmartPagesId is not an array, check if it matches newsWebpartId
                    return item.SmartPagesId.includes(parseInt(newsWebpartId));
                }
            });

            if (eventdata && eventdata.length > 0) {
                props.showwebpart()
            }
            setallEvents(eventdata);
            console.log(allEvents, "smartPagesIdArray");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getNewsListData();
    }, []); // This will run once on component mount


    useEffect(() => {
        getNewsListData();
    }, []); // This will run once on component mount

    // Usage:
    // Make sure you have the `allEvents` state initialized and set up correctly
    // It will be populated with the filtered events data

    return (
        <>
            {allEvents && allEvents?.length > 0 && (
                    <div className="panel panel-default">
                        <div className="panel-heading">Relevant Events</div>
                        {allEvents?.map((event: any) => (
                            <div key={event.Id} className="panel-body">
                                <div className="relavantpanel">
                                    <div className="publishdata">
                                        <span className="small"> {event?.EventDate ? formatDate(event?.EventDate) : ''}</span>
                                        <a onClick={() => handleTitleClick(event)}>{event?.Title}</a>
                                        {/* <h4 onClick={() => handleTitleClick(event)}>
                                            <a> {event?.Title}</a>
                                        </h4> */}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
            )}
            {selectedEvent && (
                <EventPanel selectedEvent={selectedEvent} onClose={closePanel} url={url} />

            )}
            {/* {selectedEvent && (
                <Panel
                    type={PanelType.medium}
                    customWidth="550px"
                    isOpen={selectedEvent}
                    isBlocking={false}
                    isFooterAtBottom={true}
                    onRenderHeader={CustomHeader}
                >

                    <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                        <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                            <div className='entry-meta'>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect><circle cx="296" cy="232" r="24"></circle><circle cx="376" cy="232" r="24"></circle><circle cx="296" cy="312" r="24"></circle><circle cx="376" cy="312" r="24"></circle><circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle><circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle><circle cx="296" cy="392" r="24"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path><path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path></svg>
                                <span>  {selectedEvent?.EventDate ? formatDate(selectedEvent?.EventDate) : ''}</span></div>
                            <h4>{selectedEvent?.Title}</h4>

                            <div className="imagedetail">

                                <img className="image"
                                    src={selectedEvent?.ItemCover == "" ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg" :
                                        selectedEvent?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"} />

                            </div>
                            <div className="eventItemDesc">
                                <span>
                                    <p dangerouslySetInnerHTML={{ __html: selectedEvent?.Description?.replaceAll(/&#160;/g, ' ') }} />
                                </span>
                            </div>
                        </div>
                    </div>


                </Panel>
            )} */}
        </>
    );


}
