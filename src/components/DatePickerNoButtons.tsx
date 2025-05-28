import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface MyDatePickerNoButtonsProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export default function MyDatePickerNoButtons({
  selectedDate,
  setSelectedDate,
}: MyDatePickerNoButtonsProps) {
  return (
    <DayPicker
      mode="single"
      required={false}
      selected={selectedDate}
      onSelect={setSelectedDate}
      footer={
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          {selectedDate
            ? `Selected: ${selectedDate.toLocaleDateString()}`
            : "Pick a day."}
        </p>
      }
    />
  );
}
