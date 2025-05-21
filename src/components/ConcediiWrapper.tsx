import MyDatePicker from "./DatePicker";
import ListaConcedii from "./layout/ListaConcedii";

export default function ConcediiWrapper() {
    return (
        <div className="container">
            <div className="calendar">
                <MyDatePicker />
            </div>
            <div className="leave-list">
                <ListaConcedii />
            </div>
        </div>
    );
}




