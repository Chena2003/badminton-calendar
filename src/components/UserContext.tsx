"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import dayjs from "dayjs";
import dayjsutc from "dayjs/plugin/utc";
import dayjstimezone from "dayjs/plugin/timezone";
import { v4 as uuidv4 } from 'uuid';

type Theme = 'light' | 'dark';

type userContextType = {
    timeFormat: number;
    timezone: string;
    theme: Theme;
    updateTimezone: (timezone:string) => void;
    updateTimeFormat: (timeformat:number) => void;
    updateCollapsePastRaces: (state:boolean) => void;
    collapsePastRaces: boolean;
    toggleTheme: () => void;
};

const userContextDefaultValues: userContextType = {
    timeFormat: 24,
    timezone: "Europe/London",
    theme: 'dark',
    updateTimeFormat: () => {},
    updateTimezone: () => {},
    collapsePastRaces: true,
    updateCollapsePastRaces: () => {},
    toggleTheme: () => {},
};

const UserContext = createContext<userContextType>(userContextDefaultValues);

export function useUserContext() {
    return useContext(UserContext);
}

type Props = {
    children: ReactNode;
};

export function UserContextProvider({ children }: Props) {
    const [timezone, updateStateTimezone] = useState<string>("Europe/London");
    const [timeFormat, updateStateTimeFormat] = useState<number>(24);
    const [collapsePastRaces, updateStateCollapsePastRaces] = useState(true);
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Fetch the stored timezone
        const storedTimezone = localStorage.getItem("timezone");
        if (storedTimezone) {
            updateTimezone(storedTimezone);
        } else {
            dayjs.extend(dayjsutc);
            dayjs.extend(dayjstimezone);
            updateTimezone(dayjs.tz.guess());
        }
    
        // Fetch the stored time format
        const storedFormat = localStorage.getItem("timeFormat");
        if (storedFormat) {
            updateTimeFormat(Number(storedFormat));
        } else {
            updateTimeFormat(24);
        }
        
        // Store whether to collapse or show the past races.
        const storedCollapsedState = localStorage.getItem("collapsePastRaces");
        updateStateCollapsePastRaces(storedCollapsedState == "true");

        // Theme initialization
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else {
            // Default to dark
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
        
        // Fetch the stored UUID
        const storedUUID = localStorage.getItem("uuid");
        if(!storedUUID){
            setUUID();
        }
        
    }, []);

    const updateTimeFormat = (format:number) => {
        updateStateTimeFormat(format);
        localStorage.setItem("timeFormat", String(format));
    };

    const updateTimezone = (timezone:string) => {
        if(timezone == "Europe/Kyiv"){
            timezone = "Europe/Kiev";
        }
        
        updateStateTimezone(timezone);
        localStorage.setItem("timezone", timezone);
    };
    
    const updateCollapsePastRaces = (bool:Boolean) => {
        updateStateCollapsePastRaces(bool);
        localStorage.setItem("collapsePastRaces", String(bool));
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
    
    const setUUID = () => {
        localStorage.setItem("uuid", uuidv4());
    };

    const value = {
        timezone,
        timeFormat,
        theme,
        updateTimezone,
        updateTimeFormat,
        collapsePastRaces,
        updateCollapsePastRaces,
        toggleTheme
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}