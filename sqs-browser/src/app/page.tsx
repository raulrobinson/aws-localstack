import { Toaster } from "react-hot-toast";
import SqsDashboard from "@/app/dashboard/page";
import SqsQueueList from "@/components/SqsQueueList";

export default function Home() {
  return (
      <>
        <Toaster position="top-right" />
          {/*<SqsDashboard />*/}
          <SqsQueueList />
      </>
  );
}