import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Panel, PanelType } from '@fluentui/react';
import { IoChevronForwardOutline, IoChevronBackOutline, IoCalendarOutline } from "react-icons/io5";
import "./CSS/App.css";
import SocialMediaIcon from "./SocialMediaIcon";
import EventPanel from './EventPanel';

function Slider_Comp() {
  const sliderRef = useRef<Slider | null>(null);
  const [data, setData] = useState<any>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(3);
  const [slidesToScroll, setSlidesToScroll] = useState<number>(3);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [url, setUrl] = useState('');

  const settings: Settings = {
    dots: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 1000,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    }
  };

  const handleNext = () => {
    if (sliderRef.current && currentSlide < data.length - settings.slidesToShow!) {
      setCurrentSlide((prev) => prev + 1);
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      sliderRef.current.slickPrev();
    }
  };
  const handleTitleClick = (newsItem: any) => {
    setSelectedEvent(newsItem);
    setUrl(`https://www.gruene-weltweit.de/Veranstaltungen/${newsItem?.Title}`);

  };
  const closePanel = () => {
    setSelectedEvent(null);
  }
  const HTMLRenderer = ({ content }: any) => {

    return (
      <div
       
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
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

  const getPublicServerData = async (tableName: any) => {
    let results: any = [];
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
          results = result?.data
          const sortedData = results.sort((a: any, b: any) => {
            if (a.EventDate && b.EventDate) {
              const dateA: any = new Date(a.EventDate);
              const dateB: any = new Date(b.EventDate);
              return dateB - dateA;
            }
            return 0; // If EventDate is missing in any of the objects, maintain the order
          });
          let finalData = sortedData.map((data: any) => {
            if (data.Description) {

              data.Description = replaceUrlsWithNewFormat(data.Description)
            } return data;
          })
          setData(finalData);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  }

  useEffect(() => {

    const tableName = "events"
    const fetchData = async () => {
      try {

        const response: any = await getPublicServerData(`${tableName}`)
      } catch (error) {
        console.log("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
        setSlidesToScroll(1);
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(2);
        setSlidesToScroll(2);
      } else {
        setSlidesToShow(3);
        setSlidesToScroll(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div className="section NewsCardSection">
      <div className="container">
        <div className="section-header">
          <h2 className="sectionHeading">Events</h2>
          <div className="pull-right">
            <button onClick={handlePrev} className="button_color" disabled={currentSlide === 0}>
              <IoChevronBackOutline />
            </button>
            <button onClick={handleNext} className="button_color" disabled={currentSlide === data?.length - settings.slidesToShow!}>
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {data &&
            data.map((item: any) => (
              <div key={item.id} className="">
                <div className="card border-0">
                  <img className="card-img-top" src={item?.ItemCover == "" ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"} />

                  <div className="card-body">
                    <div className="entry-meta">
                      <IoCalendarOutline />
                      <span>
                        {item?.EventDate ? formatDate(item?.EventDate) : ''}
                      </span>
                    </div>
                    <h4 className="card-title" onClick={() => handleTitleClick(item)}>
                      <a> {item?.Title}</a>
                    </h4>
                    {item?.Description?.length > 0 && <>
                      <div className="eventItemDesc cutoff-text">
                        <p>
                          <HTMLRenderer content={item?.Description} />
                        </p>
                      </div>
                      {!(item?.Description?.length <= 200) && <input className="expand-btn" type="checkbox" />}
                    </>
                    }

                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>

      {selectedEvent && (
        <EventPanel selectedEvent={selectedEvent} onClose={closePanel} url={url} />

      )}
    </div>
  );
}

export default Slider_Comp;

