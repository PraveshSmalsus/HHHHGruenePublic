import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import SmartpageComponent from "./SmartpageComponent";
import { fetchData } from './service'
import Container from 'react-bootstrap/Container';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MdMenu, MdClose } from "react-icons/md";

const Navbarcomponent = () => {
  const [data, setData] = useState([]);
  const [isSticky, setSticky] = useState(false);
  const [clickedTitle, setClickedTitle] = useState('');
  const [clickItem, setClickItem] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cleanedTitles, setCleanedTitles] = useState<{ [key: string]: string }>({});  // Store cleaned titles for subchilds

  const navigate = useNavigate();
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

      const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      results = parsedResult?.data;

      const structuredData = structureData(results);


      const sortData = (data: any[]) => {
        return data.sort((a: any, b: any) => a.SortOrder - b.SortOrder).map((item: any) => {
          if (item.children && Array.isArray(item.children)) {
            item.children = sortData(item.children); // Recursively sort children
          }
          return item;
        });
      };

      const sortedData: any = sortData(structuredData);
      console.log(sortedData, "sortedData");
      setData(sortedData);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  };

  useEffect(() => {
    const topNavigationData = async () => {
      const tableName = "navigation";
      try {
        const response: any = await getPublicServerData(`${tableName}`);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    topNavigationData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = useMemo(() => {
    const handleScrollEvent = () => {
      setSticky(window.scrollY > 56);
    };
    return debounce(handleScrollEvent, 100);
  }, []);

  const structureData = (rawData: any) => {
    rawData.forEach((item: any) => {
      if (!item.children) {
        item.children = [];
      }
      item.children = [
        ...item.children,
        ...rawData.filter((child: any) => child.ParentId === item.id),
      ];
    });
    return rawData.filter((item: any) => !item.ParentId);
  };

  const handleLinkClick = (title: any, item: any) => {
    console.log("Clicked on", item);
    setClickedTitle(title);
    setClickItem(item);
  };

  // API function to fetch KeyTitle from the server
  const getPublicServerSmartMetaData = async (Title: any, smartid: any) => {
    try {
      let url = '';
      if (smartid != null) {
        //url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=${smartid}&title=${Title}`;
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=&title=${Title}`;
      } else {
        url = `https://gruene-weltweit.de/SPPublicAPIs/getSmartMetaData.php?id=&title=${Title}`;
      }

      const response = await fetch(url);
      const text = await response.text();
      const jsonStartIndex = text.indexOf('{');  // Find the start of JSON
      const jsonEndIndex = text.lastIndexOf('}'); // Find the end of JSON

      // Extract the JSON part by slicing the string between the first "{" and the last "}"
      const jsonText = text.slice(jsonStartIndex, jsonEndIndex + 1);

      const result = JSON.parse(jsonText);

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

  // Update cleaned titles for subchildren dynamically
  const resolveAndStoreTitle = async (subchild: any) => {
    const cleanedTitle = await getPublicServerSmartMetaData(subchild.KeyTitle, '');  // Fetch cleaned title
    setCleanedTitles((prev) => ({
      ...prev,
      [subchild.id]: cleanedTitle,  // Store cleaned title in state
    }));
  };

  useEffect(() => {
    data.forEach((item: any) => {
      item.children.forEach((child: any) => {
        resolveAndStoreTitle(child); // Fetch and store title for each child
        child.children.forEach((subchild: any) => {
          resolveAndStoreTitle(subchild); // Fetch and store title for each subchild
        });
      });
    });
  }, [data]);

  const removeSpacialChar = (Title: any) => {
    return Title.replace(/ /g, '-'); // Clean spaces
  };

  const renderItem = (item: any) => (
    <li key={item.id} className="nav-item dropdown">
      <Link
       to={{
        pathname:
          item.Title === "Home"
            ? "/"
            : item.Title === "Briefwahl Suchmaschine"
            ? "/Briefwahl"
            : item.Title === "Über Uns"
            ? "/About"
            : item.Title === "Bundestagswahl 2025"
            ? "/briefwahl"
            : `/${removeSpacialChar(item.Title)}`,
      }}

        state={{ item: item }}
        id="navbarDropdown"
        role="button"
        data-toggle="dropdown"
        className="nav-link"
      >
        {item?.Title}
        {item.children.length > 0 && (
        <span className="ml-auto" onClick={toggleDropdown}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="m112 184 144 144 144-144"></path>
          </svg>
        </span>
      )}
      </Link>

     

      {item.children.length > 0 && (
        <div className="dropdown-menu dropdown-menu-level-0">
          <div className="dropdown-menu-spacer"></div>
          <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
            {item.children.map((child: any) => (
              <li key={child.id} className="dropdown-submenu">
                <a
                  href={child?.Title?.toLowerCase() == "botschaftskuriere"?"/Briefwahl/Botschaftskuriere":child?.Title?.toLowerCase() == "homepages aller direktkandidat*innen"?"/Briefwahl/kandidatinnen":`/${removeSpacialChar(cleanedTitles[child.id] || child.KeyTitle)}`}
                  className="nav-link dropdown-item"
                  onClick={() => handleLinkClick(child?.Title, child)}
                >
                  {child?.Title}
                </a>
                {child?.children?.length > 0 && (
                  <div className="dropdown-submenu dropdown-menu-level-1">
                    <div className="dropdown-menu-spacer"></div>
                    <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
                      {child?.children?.map((subchild: any) => (
                        <li key={subchild.id} className="dropdown-submenu">
                          <a
                            href={`/${removeSpacialChar(cleanedTitles[subchild.id] || subchild.KeyTitle)}`}
                            className="nav-link dropdown-item"
                            onClick={() => handleLinkClick(subchild?.Title, subchild)}
                          >
                            {subchild?.Title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );

  return (
    <div className="header-wrap">
      <div className={"sticky"}>
        <div className="headerContainer">
          <div className="container d-flex align-item-center">
            <div className="nav_logo">
              <Link
                to={`/`}
                role="button"
                className="nav-link"
                onClick={() => handleLinkClick("Home", "")}
              >
                <img
                  src="https://gruene-weltweit.de/SiteAssets/Gruene_logo.png"
                  alt="Logo of Grüne weltweit, Bundestagswahl 2025 Briefwahl aus dem Ausland" className="logo_image"
                />
                <span>GRÜNE WELTWEIT</span>
              </Link>
            </div>
          </div>
        </div>
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand href="/"><img alt="Gruene-weltweit logo, Gruene weltweit logo" src="https://gruene-weltweit.de/SiteAssets/nav-logo.png" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <MdMenu className="open" />
              <MdClose className="close" />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {data.map((item) => renderItem(item))}
              </ul>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

function debounce(func: any, wait: any) {
  let timeout: any;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default Navbarcomponent;
