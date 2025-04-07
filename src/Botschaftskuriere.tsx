import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
import Highlighter from "react-highlight-words";
import axios from 'axios';
import { cursorTo } from 'readline';
import AlertPopup from './AlertPopup';
import { getAllTableData } from './service';

const Botschaftskuriere = (props: any) => {
    const [AllBotschaftskuriere, setAllBotschaftskuriere]: any = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    useEffect(() => {
        getTabledata("GWTBotschaftskuriere");
    }, [])
    const getTabledata = async (tableName) => {
        let allfilterdata: any = []
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
            await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
                .then(response => response.text())
                .then((result: any) => {
                    result = JSON.parse(result)
                    if (result != undefined && result != null && result?.data != undefined && result?.data != null)
                        setAllBotschaftskuriere(result?.data);
                    else
                        setAllBotschaftskuriere([]);
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 1,
                id: 'Id',
            },
            // {
            //     accessorKey: "Title",
            //     placeholder: "Botschaft",
            //     header: "",
            //     id: "Title", size: 200,
            //     cell: ({ row }: any) => (
            //         <>{row.original.Title}
            //         </>
            //     ),

            // },
            {
                accessorKey: "City", placeholder: "Stadt", header: "", id: "City", size: 65,
                cell: ({ row }: any) => (
                    <>
                        <span style={{ wordBreak: 'break-all', width: '120px', display: 'block' }}></span> {row?.original?.City}
                    </>
                ),
            },

            {
                accessorKey: "Country", placeholder: "Land", header: "", id: "Country", size: 55,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Country}
                    </>
                ),
            },


            // {
            //     accessorKey: "DeadlineTime", placeholder: "Lokale Uhrzeit", header: "", id: "DeadlineTime", size: 280,
            //     cell: ({ row }: any) => (
            //         <>
            //             {row?.original?.DeadlineTime}
            //         </>
            //     ),
            // },

            {
                accessorKey: "Link", placeholder: "Mehr Informationen", header: "", id: "Link", size: 70,
                cell: ({ row }: any) => (
                    <>
                        <div style={{ display: 'contents' }}><a target='_blank' href={row?.original?.Link}>{row?.original?.Link}</a></div>
                    </>
                ),
            },
            {
                accessorKey: "DeadlineDay", placeholder: "Abgabefrist", header: "", id: "DeadlineDay", size: 70,
                cell: ({ row }: any) => (
                    <>
                        <span style={{ whiteSpace: 'nowrap' }}>{row?.original?.DeadlineDay}</span>
                    </>
                ),
            },
            {
                accessorKey: "Comment", placeholder: "Hinweis", header: "", id: "Comment", size: 180,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Comment}
                    </>
                ),
            }
        ],
        [AllBotschaftskuriere]
    );
    const callBackData = (data: any) => {
        console.log(data)
    }

    return (
        <div className="container mb-5">
            <header className="page-header">
                <h1 className="page-title heading text-center" style={{ display: "none" }}>Grüne Weltweit Botschaftskuriere</h1>
            </header>
            {/* popup content starts */}
            <div className="popup-content mb-2">
                <div className="popup-content-header">
                    <span className='popup-content-header-lowerText'>Anleitung</span>
                    <div className="popup-content-header-title">Botschaftskurier in beide Richtungen</div>
                </div>
                <div className="popup-content-body">
                    <div className="numberList">
                        <strong>So nutzt Du den Kurierservice der Botschaften und Konsulate in beide Richtungen:</strong>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>1</span>
                            <span className='numberList-item-text'>Prüfe, ob die <strong><a href='https://gruene-weltweit.de/briefwahl/botschaftskuriere' target='_blank'>deutsche Botschaft/ Konsulat</a></strong> in deinem Land mitmacht </span>
                        </div>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>2</span>
                            <span className='numberList-item-text'>Fülle das <strong><a href='https://gruene-weltweit.de/Briefwahl' target='_blank'>Briefwahl Online-Formular</a></strong> Deiner Gemeinde aus </span>
                        </div>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>3</span>
                            <span className='numberList-item-text'>Gib als Postadresse folgendes an: <br></br>
                                <div className='numberList-item'>
                                    <span className='numberList-item-number'>Auswärtiges Amt <br></br>
                                        für [Name der Botschaft/Generalkonsulat/Konsulat (Dienstort)]<br></br>
                                        Kurstraße 36<br></br>
                                        10117 Berlin
                                    </span>
                                </div>
                            </span>
                        </div>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>4</span>
                            <span className='numberList-item-text'>Wähle direkt vor Ort in der Auslandsvertretung mit deinen Unterlagen</span>
                        </div>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>5</span>
                            <span className='numberList-item-text'>Die Auslandsvertretung sorgt für die Zustellung der Wahlbriefe in Deutschland</span>
                        </div>
                        <div className='numberList-item'>
                            <span className='numberList-item-number'>6</span>
                            <span className='numberList-item-text'>Prüfe, ob die  in deinem Land mitmacht </span>
                        </div>
                    </div>
                    {/* <div><p className='m-0'>Grüne weltweit versucht die Informationen aller Auslandsvertretungen auf dieser Seite zusammenzutragen:</p>
                        <strong><a href='https://gruene-weltweit.de/briefwahl/botschaftskuriere' target='_blank'>https://gruene-weltweit.de/briefwahl/botschaftskuriere</a></strong>
                    </div> */}

                    <details open>
                        <summary><a> <span>Wichtig zu wissen</span></a></summary>
                        <div className="expand-AccordionContent clearfix">
                            <ul className='GreenDots-List'>
                                <li>Mit der <a href='https://gruene-weltweit.de/Briefwahl' target='_blank'>Grüne Weltweit Briefwahlsuchmaschine</a> kommst du in drei Klicks zu deinem Briefwahlantrag Online-Formular.</li>
                                <li>Der Kurier-Service in beide Richtungen kann von allen Wahlberechtigten in Anspruch genommen werden. </li>
                                <li>Das Zeitfenster für das Abholen und Zurücksenden an der Auslandsvertretung ist sehr kurz (meist zwischen 13. und 18. Februar, variiert je nach Auslandsvertretung). <strong>Stelle sicher, dass du an diesen Tagen zur Auslandsvertretung kommen kannst.</strong></li>
                                <li>Weitere Informationen gibt es auf der <a href='https://www.bundeswahlleiterin.de/bundestagswahlen/2025/informationen-waehler/deutsche-im-ausland.html#d6e90c11-e284-4a14-9484-de8d557a097b' target='_blank'>Seite der Bundeswahlleiterin</a>.</li>
                                <li>Die Unterlagen können persönlich (Ausweis nicht vergessen!) oder durch eine bevollmächtigte Person abgeholt werden.</li>
                                <li>in vielen grenznahen EU-Staaten ist der Kurierweg nicht schneller als der reguläre Postweg.</li>
                                <li>Das Auswärtige Amt übernimmt keinerlei Haftung für verspätet oder nicht eingegangene Wahlunterlagen.</li>
                            </ul>
                        </div>
                    </details>

                </div>

            </div>
            {/* popup content ends */}
            <div className='text-right'><a href="https://gruene-weltweit.de/Kontakt" target="_blank" rel="noopener noreferrer">
                Alle Angaben ohne Gewähr. Fehler melden</a></div>

            <div className="BotschaftskurierePageTable border" style={{ userSelect: "none" }}><GlobalCommanTable columns={columns} data={AllBotschaftskuriere} showHeader={true} callBackData={callBackData} expandIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} /></div>
            {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
        </div >

    )
};
export default Botschaftskuriere;