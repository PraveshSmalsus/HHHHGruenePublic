import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomeComponent from './HomeComponent';
import SmartpageComponent from './SmartpageComponent';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import './CSS/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import NewsHomemainPage from './NewsHome';
import EventHomemainPage from './EventHome';
import Layout from './Layout';
import NewsDetailPage from './NewsDetailPage'
import EventDetailPage from './EventDetailPage'
import FeedBackForm from './FeedBackForm';
import ContactForm from './ContactForm';
import BriefwahlElection from './BriefwahlElection';
import Botschaftskuriere from './Botschaftskuriere';
import Kandidatinnen from './Kandidatinnen';
// import MatomoIntegration from './MatomoIntegration';

// import './klaroConfig'; // Import your Klaro configuration
// import 'klaro/dist/klaro.css'; // Import Klaro styles // Import Klaro

// document.addEventListener('DOMContentLoaded', () => {
//   if (!window.klaroInitialized) {
//     window.klaroInitialized = true;
//     window.klaro.show();
//   }
// });
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><Layout /></>}>
      {/* <Route path='/' element={<HomeComponent />} /> */}
      <Route path='/' element={<SmartpageComponent clickedTitle = {'Europawahl-2024'}/>} />
       <Route path="/feedbackform" element={<FeedBackForm />} />
       <Route path="/Wahlkampf-aus-der-Ferne" element={<BriefwahlElection />} />
       <Route path="/briefwahl/botschaftskuriere" element={<Botschaftskuriere />} />
       <Route path="/briefwahl/kandidatinnen" element={<Kandidatinnen />} />
      <Route path=':SmartPage' element={<SmartpageComponent />}>
        <Route path=':SmartPage' element={<SmartpageComponent />} >
          <Route path=':SmartPage' element={<SmartpageComponent />} />
        </Route>
      </Route>
      {/* <Route path=':NewsDetailPage' element={<SmartpageComponent />}>
      </Route> */}
      <Route path='Neuigkeiten/:newsId' element={<NewsDetailPage />} />
      <Route path='Veranstaltungen/:newsId' element={<EventDetailPage />}>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    {/* <MatomoIntegration /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);


