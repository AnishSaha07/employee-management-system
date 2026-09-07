/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AnnouncementContext = createContext();

const STORAGE_KEY = "announcements";


const getAnnouncements = () => {

    return (
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || []
    );

};


const saveAnnouncements = (announcements) => {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(announcements)
    );

};


export const AnnouncementProvider = ({ children }) => {

    const [announcements, setAnnouncements] =
        useState(getAnnouncements);


    useEffect(() => {

        saveAnnouncements(announcements);

    }, [announcements]);


    /* ===========================
            CREATE
    =========================== */

    const createAnnouncement = (announcement) => {

        const newAnnouncement = {

            id: Date.now(),

            title: announcement.title,

            description:
                announcement.description,

            type:
                announcement.type || "General",

            priority:
                announcement.priority || "Normal",

            createdAt:
                new Date().toLocaleDateString(),

            active:
                true,

        };


        setAnnouncements(prev => [

            newAnnouncement,

            ...prev,

        ]);

    };


    /* ===========================
            UPDATE
    =========================== */

    const updateAnnouncement = (updatedAnnouncement) => {

        setAnnouncements(prev =>

            prev.map(item =>

                item.id === updatedAnnouncement.id

                    ? {
                        ...item,
                        ...updatedAnnouncement,
                    }

                    : item

            )

        );

    };


    /* ===========================
            DELETE
    =========================== */

    const deleteAnnouncement = (id) => {

        setAnnouncements(prev =>

            prev.filter(
                item => item.id !== id
            )

        );

    };


    /* ===========================
            TOGGLE ACTIVE
    =========================== */

    const toggleAnnouncement = (id) => {

        setAnnouncements(prev =>

            prev.map(item =>

                item.id === id

                    ? {
                        ...item,
                        active: !item.active,
                    }

                    : item

            )

        );

    };


    return (

        <AnnouncementContext.Provider

            value={{

                announcements,

                createAnnouncement,

                updateAnnouncement,

                deleteAnnouncement,

                toggleAnnouncement,

            }}

        >

            {children}

        </AnnouncementContext.Provider>

    );

};


export const useAnnouncement = () =>
    useContext(AnnouncementContext);