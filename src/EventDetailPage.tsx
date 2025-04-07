
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
export const EventDetailPage = ({ selectedNews }: any) => {
    const [data, setData] = useState<any>({});
    const { newsId: newsId } = useParams(); // Destructure the SmartPage parameter from useParams
    const location = useLocation();
    // const { newsId } = location.state || {};
    console.log(newsId, "newsId")
    const removeSpacialChar2 = (Title: any) => {
        return Title?.replace(/-/g, ' ');
    }
    const getPublicServerSmartMetaData = async (tableName: any, Title: any, smartid: any) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "table": tableName,
                "keyTitle": newsId,
                "id": null
            });
            console.log(raw, "rawrawrawrawss")

            const requestOptions: any = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataByTitle.php", requestOptions);
            const result = await response.json();
            console.log(result, "resultresultresultresult")
            // Filter the results to match the specific KeyTitle
            //   const smartPageData = result?.data?.id != undefined ? [result?.data] : [];
            setData(result?.data);
        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }
    }

    useEffect(() => {
        getPublicServerSmartMetaData("events", "", selectedNews?.id)

    }, [])

    console.log(selectedNews, "selectedNews")
    // if (!selectedNews) {
    //     return <div>Loading...</div>;
    // }
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const HTMLRenderer = ({ content }: any) => {

        return (
            <div
                className="html-content "
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    };

    return (
        <div className="p-4 news_home publicationItem clearfix bg-white  border-0 ">
            <div className='entry-meta'>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect><circle cx="296" cy="232" r="24"></circle><circle cx="376" cy="232" r="24"></circle><circle cx="296" cy="312" r="24"></circle><circle cx="376" cy="312" r="24"></circle><circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle><circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle><circle cx="296" cy="392" r="24"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path><path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path></svg>
                <span>  {data?.EventDate ? formatDate(data?.EventDate) : ''}</span></div>
            <h4>{data?.Title}</h4>
            <div className="imagedetail">
                <img
                    className="image"
                    src={
                        data.ItemCover === ""
                            ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"
                            : data?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"
                    }
                    alt={data?.Title}
                />
            </div>
            <div className="eventItemDesc">
                <p>
                    <HTMLRenderer content={data?.Description} />
                </p>
            </div>
        </div>
    );
};

export default EventDetailPage;
