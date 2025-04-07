import React from "react";
const DetailPage = () => {
    console.log('dsdsdsdsdsdsdsdsd')

    const selectedEvent = {
        Title: "Sample Event Title",
        ItemCover: "",
        Description: "This is a <strong>sample description</strong> of the event with HTML content."
    };

    return (
        <div className="new-page-container">
            <div className="p-0 news_home publicationItem clearfix bg-white border-0">
                <h4 className="alignCenter">{selectedEvent?.Title}</h4>
                <div className="imagedetail">
                    <img
                        className="image"
                        src={
                            selectedEvent?.ItemCover === ""
                                ? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"
                                : selectedEvent?.ItemCover ?? "https://gruene-weltweit.de/PublishingImages/Covers/Default_img.jpg"
                        }
                        alt="Event Cover"
                    />
                </div>
                <div className="eventItemDesc">
                    <span>
                        <p dangerouslySetInnerHTML={{ __html: selectedEvent?.Description?.replaceAll(/&#160;/g, " ") }} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
