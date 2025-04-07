import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
  const [data, setData] = useState<any>([]);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const organizeData = (rawData: any) => {
    const parents = rawData.filter((item: any) => !item.ParentId || item.ParentId == 0);
    return parents.map((parent: any) => ({
      ...parent,
      children: rawData.filter((child: any) => child.ParentId === parent.id)
    }));
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
          result = JSON.parse(result)
          results = result?.data
          const footerItems = organizeData(results);
          setData(footerItems);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  }
  useEffect(() => {
    const footerData = async () => {
      const tableName = "Footer";
      try {
        const response: any = await getPublicServerData(`${tableName}`)

      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    footerData();
  }, []);



  return (
    <div>
      <footer className="bg-sitecolor">
      <section className="copyrights">
          <Container>
            <Row>
              <Col md="12" xs="12" >
                <p className='text-right pt-1'><span className='me-1'> Powered By : </span> <a target='_blank' href="https://hochhuth-consulting.de/"> Hochhuth Consulting GmbH </a></p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="footer-widgets-wrap">
          <Container>
            <Row>
              {data
                .slice() // Create a copy of the array to avoid mutating the original data
                .sort((a: any, b: any) => a.SortOrder - b.SortOrder) // Sort the array based on SortOrder of parent
                .map((parent: any) => (
                  <Col key={parent.id}>
                    <h4>{parent.Title}</h4>
                    <ul className="list-unstyled">
                      {parent.children
                        .slice() // Create a copy of the children array to avoid mutating the original data
                        .sort((a: any, b: any) => a.SortOrder - b.SortOrder) // Sort the array based on SortOrder of children
                        .map((child: any) => (
                          <li key={child.id} className="widget_links">
                            {child.Title === "Impressum" ? (
                              <Link target="_blank" to={child.Title}>
                                {child.Title}
                              </Link>
                            ) : child.Title === "Pressekontakt" ? (
                              <Link target="_blank"
                                to="/OV-in-den-Medien"

                              >
                                {child.Title}
                              </Link>
                            ) : (
                              <Link target="_blank" to={child.href} rel="noopener noreferrer">
                                {child.Title}
                              </Link>
                            )}
                          </li>
                        ))}
                    </ul>
                  </Col>
                ))}
            </Row>
          </Container>
        </section>
       
      </footer>
    </div>
  );
};

export default Footer;
