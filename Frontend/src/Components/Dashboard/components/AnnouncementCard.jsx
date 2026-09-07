import "./Card.css";

import {
    FaBullhorn,
    FaArrowRight,
} from "react-icons/fa";

import { useAnnouncement } from "../../../context/AnnouncementContext";


const AnnouncementCard = () => {

    const {
        announcements,
    } = useAnnouncement();


    const activeAnnouncements =
        announcements.filter(
            item => item.active !== false
        );


    return (

        <div className="dashboard-card">

            <div className="card-header">

                <h3>
                    Announcements
                </h3>

                <FaBullhorn
                    className="announcement-icon"
                />

            </div>


            {

                activeAnnouncements.length === 0

                    ? (

                        <div className="empty-card">

                            <FaBullhorn
                                size={42}
                            />

                            <h4>
                                No Announcements
                            </h4>

                            <p>
                                There are no company announcements at the moment.
                            </p>

                        </div>

                    )

                    : (

                        <>

                            {
                                activeAnnouncements
                                    .slice(0, 3)
                                    .map((item) => (

                                        <div
                                            key={item.id}
                                            className="announcement-item"
                                        >

                                            <div>

                                                <h4>
                                                    {item.title}
                                                </h4>

                                                <p>
                                                    {item.description}
                                                </p>

                                            </div>

                                        </div>

                                    ))
                            }


                            {

                                activeAnnouncements.length > 3 && (

                                    <button
                                        className="view-announcement-btn"
                                    >

                                        View All

                                        <FaArrowRight />

                                    </button>

                                )

                            }

                        </>

                    )

            }

        </div>

    );

};


export default AnnouncementCard;