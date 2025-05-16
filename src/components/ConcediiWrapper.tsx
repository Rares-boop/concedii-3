import MyDatePicker from "./DatePicker";
import ListaConcedii from "./layout/ListaConcedii";

export default function ConcediiWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="wrapper-container">
            <MyDatePicker />
            <ListaConcedii />
            {children}
        </div>
    );
}
