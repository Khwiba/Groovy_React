import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO, parseISO, addDays } from 'date-fns';

export const useCalendar = () => {
    const [dbList, setDbList] = useState([]);

    const refreshList = () => {
        axios.get("/api/calendar").then((res) => {
            const NewEvents = res.data.map(transformEventDataToCalendarEvent);
            setDbList(NewEvents);
        });

        function transformEventDataToCalendarEvent(event) {
            return {
                extendedProps: {
                    seq: event.seq,
                    write_date: event.write_date,
                    contents: event.contents,
                    title: event.title,
                    start: event.starttime,
                    end: formatISO(addDays(parseISO(event.endtime), 1)),
                },
                title: event.title,
                start: event.starttime,
                end: formatISO(addDays(parseISO(event.endtime), 1)),
                color: "white",
                textColor: "black",
                borderColor: "black",
                allDay: true,
                classNames: ['myData-event'],
            };
        }
    };

    useEffect(() => {
        refreshList();
    }, []);

    return { dbList, refreshList };
}
