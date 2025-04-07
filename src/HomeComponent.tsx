import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import axios from "axios";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Slider_Comp = lazy(() => import("./Slider_Comp"));
const Home_slider1 = lazy(() => import("./Home_slider1"));

const HomeComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);

  const getPublicServerData = async (tableName: string) => {
    try {
      const myHeaders = new Headers({ "Content-Type": "application/json" });
      const raw = JSON.stringify({ table: tableName });

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions);
      const result = await response.json();
      setData(result?.data || []);
    } catch (error) {
      console.error('An error occurred:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tableName = "slider";
    getPublicServerData(tableName);
  }, []);

  useEffect(() => {
    // Ensure slider goes to the first item on mount
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(1);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings: Settings = {
    dots: false,
    speed: 2000,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 9000,
    nextArrow: <IoChevronForwardOutline />,
    prevArrow: <IoChevronBackOutline />,
    initialSlide: 0,
  };

  const HTMLRenderer: React.FC<{ content: string }> = ({ content }) => (
    <div className="html-content" dangerouslySetInnerHTML={{ __html: content }} />
  );

  return (
    <section className="home_component_section">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <section className="carouselSlider">
          <Slider ref={sliderRef} {...settings}>
            {data &&
              data
                .slice() // Copy array to avoid mutation
                .sort((a, b) => a.SortOrder - b.SortOrder) // Sort by SortOrder
                .map((item) =>
                  item.IsDisabled === "0" ? (
                    <div key={item.id}>
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url(${item?.ItemCover})`,
                          height: "430px",
                          width: "auto",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="slider-bg-overlay"></div>
                        <div className="sliderDescription">
                          <div className="container">
                            <div className="containerDetail">
                              <h2>
                                <Link
                                  to={
                                    item?.Title === `People's Climate March - "Es gibt keinen Planet B"`
                                      ? "https://www.gruene-weltweit.de/Documents/Topics/Positionen/2017-04-27_Flyer_Why_We_March_Climate_March_BLS.pdf"
                                      : item?.smartPage
                                  }
                                  className="text-white"
                                >
                                  {item?.Title}
                                </Link>
                              </h2>
                              <div className="subhead">
                                <p>
                                  <HTMLRenderer content={item.ItemDescription} />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
          </Slider>
        </section>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Slider_Comp />
        <div className="home_slider1">
          <Home_slider1 />
        </div>
      </Suspense>
    </section>
  );
};

export default HomeComponent;
