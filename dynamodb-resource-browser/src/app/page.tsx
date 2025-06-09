import { Toaster } from "react-hot-toast";
import DynamoDashboard from "./dynamodb/page";

export default function Home() {
    return (
        <>
            <Toaster position="top-right" />
            <DynamoDashboard />
        </>
    );
}
