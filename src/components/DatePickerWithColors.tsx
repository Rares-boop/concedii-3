"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


export default function MyDatePickerWithColours() {
    const [selected, setSelected] = useState<Date>();

    return (
        <DayPicker
            animate
            mode="single"
            selected={selected}
            onSelect={setSelected}
            styles={{
                root: { width: "500px", height: "400px" },
                day: { fontSize: "1.2rem", padding: "10px" },
                head_cell: { width: "60px" },
            }}
        />

    );
}
