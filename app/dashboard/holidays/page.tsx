"use client"

import * as React from "react"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {DateRange} from "react-day-picker";

// export default function Page() {
//     const [date, setDate] = React.useState<(DateRange)>({from: undefined, to:undefined});
//
//     const handleSelect = (daySelection: DateRange | undefined) => {
//         if (daySelection) {
//             setDate(daySelection);
//         }
//
//         console.log(date)
//         console.log(daySelection)
//     };
// const handleSelect = (daySelection: DateRange | undefined) => {
//     console.log(daySelection);
//     if(date.from === undefined) {
//         console.log("Setting to")
//         setDate({from: daySelection?.from, to: undefined});
//     } else if (date.to === undefined) {
//         console.log("Setting from")
//         setDate({from: date.from, to: daySelection?.to});
//     } else {
//         console.log("Resetting it")
//         setDate({from: daySelection?.from, to: undefined});
//     }
// }
// return (



export default function Page() {
    const [date, setDate] = React.useState<DateRange>({from: undefined, to: undefined});

    const handleSelect = (daySelection: DateRange | undefined) => {
    console.log(daySelection);
    if(date.from === undefined) {
        console.log("Setting to")
        setDate({from: daySelection?.from, to: undefined});
    } else if (date.to === undefined) {
        console.log("Setting from")
        setDate({from: date.from, to: daySelection?.to});
    } else {
        console.log("Resetting it")
        setDate({from: undefined, to:undefined})
        setDate({from: daySelection?.from, to: undefined});
    }
}

    const dateFrom = date?.from !== undefined ? date.from : "Pick a date range";
    const dateTo = date?.to  !== undefined ? date.to : "Pick a date range";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon/>

                    {date ? `${dateFrom} to ${dateTo}` : <span>Pick a date range</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="rounded-md border shadow"
                />
            </PopoverContent>
        </Popover>
    );
}

// return (
//     <div>
//         <Calendar
//             captionLayout="dropdown"
//             mode="range"
//             selected={date}
//             onSelect={handleSelect}
//             className="p-3 pointer-events-auto rdp-root rounded-md border shadow blue"
//             max={20}
//             today={new Date()}
//             defaultMonth={new Date()}
//
//         />
//     </div>
// );