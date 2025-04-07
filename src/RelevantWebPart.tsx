import React from 'react'
import "./CSS/custom.css";

export const RelevantWebPart = (props: any) => {
    const [reldoc, setRelDoc] = React.useState([])
    const [keyDoc, setKeyDoc] = React.useState([])
    function getFileIconClass(fileType: string) {

        switch (fileType) {
            case ' ':
                return "svg__iconbox svg__icon--unknownFile"; // Default class for unknown file types
            default:
                return `svg__iconbox svg__icon--${fileType}`;

        }
    }
    React.useEffect(() => {
        getPublicServerData('Documents')
    }, [])
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
                    results = result?.data?.map((item: any) => {
                        try {
                            if (item?.SmartPagesId != undefined && item?.SmartPagesId != "") {
                                item.SmartPagesId = JSON.parse(item.SmartPagesId)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                        try {
                            if (item?.SmartTopicsId != undefined && item?.SmartTopicsId != "") {
                                item.SmartTopicsId = JSON.parse(item.SmartTopicsId)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                        return item
                    })
                    if (props?.usedFor == 'keyDoc') {
                        let keyD = results?.filter((doc: any) => {
                            if (doc?.ItemRank == 6) {
                                if (doc?.SmartTopicsId?.length > 0 && doc?.SmartTopicsId?.some((pageId: any) => pageId == props?.data?.id)) {
                                    return true
                                } else if (doc?.SmartPagesId?.length > 0 && doc?.SmartPagesId?.some((pageId: any) => pageId == props?.data?.id)) {
                                    return true
                                }
                            }
                        })
                        console.log(keyD, 'key Doc')

                        setKeyDoc(keyD)
                    }

                    else {
                        let relD = results?.filter((doc: any) => {
                            if (doc?.ItemRank != 6) {
                                if (doc?.SmartTopicsId?.length > 0 && doc?.SmartTopicsId?.some((pageId: any) => pageId == props?.data?.id)) {
                                    return true
                                } else if (doc?.SmartPagesId?.length > 0 && doc?.SmartPagesId?.some((pageId: any) => pageId == props?.data?.id)) {
                                    return true
                                }
                            }
                        })
                        console.log(relD, 'rel Doc')
                        if (relD?.length > 0) {
                            props?.showwebpart(true)
                        }
                        setRelDoc(relD)

                    }
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return results;
    }
    const extractHrefValue = (path: any) => {
        const hrefPattern = /href="([^"]+)"/; // Regular expression to extract the value inside href="..."

        const match = path.match(hrefPattern); // Find the href pattern in the path

        if (match && match[1]) {
            // Return the value inside href="..."
            return match[1];
        }

        // If href="..." not found, return the original path
        return path;
    };
    return (
        <div className='html-content '>
            {/* {reldoc?.length > 0 && props?.usedFor == 'relDoc' && <div>
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">Relevant Documents</div>
                        {reldoc.map((docItem: any) => (
                            <div className="panel-body">
                                <div>{docItem?.Title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>} */}
            <div className='row'>
                <div>
                    {keyDoc?.length > 0 && <div>
                        <header className="page-header "><h1 className="page-title">KEY DOCUMENTS</h1></header>
                        <div className="col-12 justify-content-center mb-0">
                            {
                                keyDoc?.map((keyitem: any) => {
                                    const iconClass = getFileIconClass(keyitem?.File_x0020_Type);
                                    console.log(iconClass)
                                    return (
                                        <div className="key-documents">
                                            <div className="key-documents__wrp">
                                                <div className="key-documents__item">
                                                    <div className="key-documents__img">
                                                        <a>
                                                            <img
                                                                src={
                                                                    (keyitem?.Item_x0020_Cover && keyitem?.Item_x0020_Cover !== "")
                                                                        ? keyitem?.Item_x0020_Cover
                                                                        : (keyitem?.ItemCover && keyitem?.ItemCover !== "")
                                                                            ? keyitem?.ItemCover
                                                                            : "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"
                                                                }
                                                                data-themekey="#"
                                                                alt=""
                                                            />
                                                        </a>
                                                        &nbsp;</div><div className="key-documents__content"><div className="key-documents__header">

                                                            <span className="key-documents__documentTitle">
                                                                <a target="_blank" href={keyitem?.File_x0020_Type == "aspx" ? `${extractHrefValue(keyitem?.Path)}` : `${extractHrefValue(keyitem?.Path)}?web=1`}>
                                                                    {/* <span className={getFileIconClass(iconClass)}></span> */}

                                                                    {/* svg__iconbox svg__icon--pdf */}
                                                                    {/* <span className="key-documents__documentYear">(2011)</span> */}
                                                                    <span className={iconClass} aria-label={`${keyitem?.File_x0020_Type} icon`}>
                                                                    </span>
                                                                    {keyitem?.Title} ({keyitem?.Year})

                                                                </a>
                                                            </span>
                                                            <span>
                                                                <em className="ms-Icon ms-Icon--WindowEdit" aria-hidden="true"></em>
                                                            </span>
                                                        </div>
                                                        <div className="key-documents__size">
                                                            <span>[{keyitem?.FileSize ? `${keyitem.FileSize}` : "0 KB"}]</span>
                                                        </div>
                                                        <div className="key-documents__text">
                                                            <span><div className="toAlignListElmntOnPage" dangerouslySetInnerHTML={{ __html: keyitem?.Item_x0020_Description }}></div></span>
                                                        </div>
                                                    </div></div></div></div>
                                    )
                                })
                            }
                        </div>
                    </div>}
                    <div >
                        {reldoc?.length > 0 && <div>

                            <section className="section col-3">
                                <div className="mb-3 card commentsection">
                                    <div className="card-header">
                                        <div className="card-title h5 d-flex justify-content-between align-items-center mb-0">
                                            Relevant Documents
                                        </div>

                                    </div>


                                    {
                                        reldoc?.map((keyitem: any) => {
                                            return (
                                                <div className="card-body">
                                                    <ul className="alignCenter list-none text-break mb-0">
                                                        <li className="mb-10 ">
                                                            <a target="_blank" href={keyitem?.File_x0020_Type == "aspx" ? `${extractHrefValue(keyitem?.Path)}` : `${extractHrefValue(keyitem?.Path)}?web=1`}>

                                                                {/* <span className="key-documents__documentYear">(2011)</span> */}
                                                                {keyitem?.Title}.{keyitem?.File_x0020_Type}

                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        })
                                    }


                                </div>

                            </section>


                        </div>}
                    </div>
                </div>

            </div>
        </div>
    )
}
