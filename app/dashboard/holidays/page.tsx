"use client"

import * as React from "react"

import {Calendar} from "@/components/ui/calendar"

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

export default function Page() {
    const [selectedRange, setSelectedRange] = React.useState({ from: undefined, to: undefined });

    const handleRangeChange = (nextRange: { from: Date; to: Date; }, selectedDay: any) => {
        setSelectedRange((range) => {
            if (range?.from && range?.to) return {from: selectedDay};
            if (!range?.from && !range?.to) return {from: selectedDay};
            return nextRange;
        });
    }

    return (
        <div className={"flex"}>
            <Calendar
                autoFocus
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeChange}
                //numberOfMonths={2}
            />
        </div>
    );
}