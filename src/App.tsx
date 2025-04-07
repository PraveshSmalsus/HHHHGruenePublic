import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import HomeComponent from './HomeComponent';
import SmartpageComponent from './SmartpageComponent';
import Navbarcomponent from './Navbar'; // Import your Navbar component
import './CSS/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import NewsHomemainPage from './NewsHome';
import EventHomemainPage from './EventHome';
import FeedBackForm from './FeedBackForm';
const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [clickedTitle, setClickedTitle] = useState<string>('');
  const [loadNewshome, setLoadNewshome] = useState<boolean>(false);
  const [loadEventhome, setLoadEventhome] = useState<boolean>(false);

  function getParameterByName() {
    const searchParams = window?.location?.pathname?.split("/").pop()?.replace(/%20/g, ' ');
    if (searchParams && searchParams?.toLowerCase() !== 'neuigkeiten' && searchParams?.toLowerCase() !== 'veranstaltungen') {
      setClickedTitle(searchParams);
      setLoadNewshome(false);
      setLoadEventhome(false);
    } if (searchParams && searchParams?.toLowerCase() === 'neuigkeiten') {
      setLoadNewshome(true);
      setLoadEventhome(false);
      setClickedTitle('');
    }
    if (searchParams && searchParams?.toLowerCase() === 'veranstaltungen') {
      setLoadEventhome(true);
      setLoadNewshome(false);
      setClickedTitle('');
    }
  }

  useEffect(() => {
    getParameterByName();

    const fetchData = async () => {

      try {
        const response = await axios.get(
          "https://gruene-weltweit.de/SPPublicAPIs/TopNavigation.php"
        );
        const structuredData = response?.data?.data;
        setData(structuredData);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbarcomponent />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SmartpageComponent clickedTitle={'Europawahl-2024'} />} />
         
          {clickedTitle && clickedTitle?.toLowerCase() !== 'neuigkeiten' && clickedTitle?.toLowerCase() !== 'feedbackform' && clickedTitle?.toLowerCase() !== 'veranstaltungen' && data.map((route: any) => (
            <Route
              key={route.Title}
              path={route.Title === "Briefwahl Suchmaschine" ? "/Briefwahl" : `/${route.Title}`}
              element={<SmartpageComponent clickedTitle={clickedTitle} />}
            />
          ))}
          {loadNewshome && loadNewshome == true && (
            <Route
              path={`/neuigkeiten`}
              element={<NewsHomemainPage loadNewshome={loadNewshome} />}
            />
          )}
          {loadEventhome && loadEventhome == true && (
            <Route
              path={`/veranstaltungen`}
              element={<EventHomemainPage loadEventhome={loadEventhome} />}
            />
          )}
        </Routes>
      </Suspense>
    </>
  );
};


export default App;