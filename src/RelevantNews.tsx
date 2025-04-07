import axios from "axios";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SocialMediaIcon from "./SocialMediaIcon";
import { Panel, PanelType } from '@fluentui/react';
import NewsPanel from "./NewsPanel";
export default function RelevantNews(props: any) {
    const [allAnnouncements, setallAnnouncements]: any = useState([]);
    const newsWebpartId = props.newsItem[0].id
    //const GetserverUrl = 'http://localhost:4000/api/getDataFilterSmartPageId';
    //const GetserverUrl = 'http://localhost:4000/api/getData';
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [url, setUrl] = useState('');
    const handleTitleClick = (newsItem: any) => {
        // Navigate to the new page and pass the newsItem as state
        setSelectedNews(newsItem);
        setUrl(`https://www.gruene-weltweit.de/Neuigkeiten/${newsItem?.Title}`);
    };
    const closePanel = () => {
        setSelectedNews(null);
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
                    <h3 className="m-0">News Details</h3>
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
        const tableName = 'Announcements';
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
            //     if (item?.PublishingDate != null && item?.PublishingDate != undefined) {
            //         item.PublishingDate = moment(item?.PublishingDate, "MMM DD YYYY").format("DD MMM YYYY");
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
            setallAnnouncements(eventdata);
            console.log(allAnnouncements, "allAnnouncementsallAnnouncements");
        } catch (error: any) {
            console.error(error);
        };
    };
    return (
        <>
            {allAnnouncements && allAnnouncements?.length > 0 && (
                    <div className="panel panel-default">
                        <div className="panel-heading">Relevant News</div>
                        {allAnnouncements?.map((news: any) => (
                            <div key={news.Id} className="panel-body">
                                <div className="relavantpanel">
                                    <div className="publishdata">
                                        <span>  {news?.PublishingDate ? formatDate(news?.PublishingDate) : ' '}</span>
                                        <a onClick={() => handleTitleClick(news)}>{news?.Title}</a>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
            )}
            {selectedNews && (
                <NewsPanel selectedNews={selectedNews} onClose={closePanel} url={url} />
            )}
        </>
    );


}

