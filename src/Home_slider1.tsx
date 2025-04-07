import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Panel, PanelType } from '@fluentui/react';
import "./CSS/App.css";
import { IoChevronForwardOutline, IoChevronBackOutline, IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import moment from "moment";
import SocialMediaIcon from "./SocialMediaIcon";
import NewsPanel from "./NewsPanel";

function Home_slider1() {
  const sliderRef = useRef<Slider | null>(null);
  const [data, setData] = useState<any>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(3);
  const [slidesToScroll, setSlidesToScroll] = useState<number>(3);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const [selectedNews, setSelectedNews] = useState<any>(null);
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
  const HTMLRenderer = ({ content }: any) => {

    return (
      <div
        className="html-content "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
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
          console.log(result, "ddddd")
          result = JSON.parse(result)
          results = result?.data
          results.sort((a: any, b: any) => {
            const dateA: any = new Date(a.PublishingDate);
            const dateB: any = new Date(b.PublishingDate);
            return dateB - dateA;
          });
          // const sortedData = results.sort((a: any, b: any) => {
          //   if (a.PublishingDate && b.PublishingDate) {
          //     const format = "MMMM DD, YYYY"; // Define the date format
          //     const dateA: any = moment(a.PublishingDate, format);
          //     const dateB: any = moment(b.PublishingDate, format);
          //     console.log("Date A:", dateA);
          //     console.log("Date B:", dateB);
          //     if (dateA.isBefore(dateB)) {
          //       return 1; // Date A is before Date B, return 1 for descending order
          //     } else if (dateA.isAfter(dateB)) {
          //       return -1; // Date A is after Date B, return -1 for descending order
          //     } else {
          //       return 0; // Dates are equal, so return 0
          //     }
          //   }
          //   return 0; // If either date is missing, maintain the order
          // });
          setData(results);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  }

  useEffect(() => {
    const tableName = "Announcements"
    const fetchData = async () => {
      try {
        const response: any = await getPublicServerData(`${tableName}`)
      } catch (error) {
        console.log("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  const handleTitleClick = (newsItem: any) => {
    setSelectedNews(newsItem);
    setUrl(`https://www.gruene-weltweit.de/Neuigkeiten/${newsItem?.Title}`);
  };
  const closePanel = () => {
    setSelectedNews(null);
  }

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
    <div className="section EventsCardSection">
      <div className="container">
        <div className="section-header">
          <h2 className="sectionHeading">NEUIGKEITEN</h2>
          <div className="pull-right">
            <button onClick={handlePrev} className="button_color" disabled={currentSlide === 0}>
              {/* <i className="fa fa-angle-left" aria-hidden="true"></i> */}
              <IoChevronBackOutline />
            </button>
            <button onClick={handleNext} className="button_color" disabled={currentSlide === data?.length - settings.slidesToShow!}>
              {/* <i className="fa fa-angle-right" aria-hidden="true"></i> */}
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {data &&
            data.map((item: any) => (
              <div key={item.id} className="">
                <div className="card border-0" style={{ position: "relative" }}>
                  <img className="card-img-top" src={item?.ItemCover == "" ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"} />
                  <div className="card-body">
                    <div className="entry-meta">
                      <IoCalendarOutline />
                      <span>
                        {formatDate(item?.PublishingDate)}
                      </span>
                    </div>
                    <h4 className="card-title" onClick={() => handleTitleClick(item)}>
                      <a> {item?.Title}</a>
                      {/* <Link
                          to={`/${item.Title.toLowerCase()}/?ItemID=${item.id}&Site=Public`}
                          className="nav-link"
                        >
                          {item?.Title}
                        </Link> */}
                    </h4>
                    {/* <div className="eventItemDesc cutoff-text" dangerouslySetInnerHTML={{ __html: item?.Body }}>
                    </div>

                    <input className="expand-btn" type="checkbox" /> */}
                    {/* 
                    { item?.Body != undefined && item?.Body?.length > 0 ?
                        <>
                        <div className="eventItemDesc cutoff-text" dangerouslySetInnerHTML={{ __html: item?.Body }}></div>
                        {item?.Body?.length>200 && <input className="expand-btn" type="checkbox" />}
                        </>
                          : ''
                      } */}

                    {item?.Body?.length > 0 && <>
                      <div className="eventItemDesc cutoff-text">
                        <p>
                          <HTMLRenderer content={item.Body} />
                        </p>
                      </div>
                      {!(item?.Body?.length <= 200) && <input className="expand-btn" type="checkbox" />}
                    </>}

                  </div>
                </div>
              </div>
            ))}
        </Slider>

      </div>
      {selectedNews && (
        <NewsPanel selectedNews={selectedNews} onClose={closePanel} url={url} />
      )}
    </div>
  );
}

export default Home_slider1;

