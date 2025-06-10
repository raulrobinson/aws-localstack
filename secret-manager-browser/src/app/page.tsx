import { Toaster } from "react-hot-toast";
import SecretsDashboard from "@/app/dashboard/page";

export default function Home() {
  return (
      <>
        <Toaster position="top-right" />
        <SecretsDashboard />
      </>
  );
}