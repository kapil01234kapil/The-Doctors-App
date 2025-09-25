import DashboardSecond from "@/components/shared/Dashboard/DashboardSecond";
import DashboardStory from "@/components/shared/Dashboard/DashboardStory";
import Faq from "@/components/shared/Dashboard/Faq";
import HeroDashboard from "@/components/shared/Dashboard/HeroDashboard";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroDashboard/>
      <DashboardSecond/>
      <DashboardStory/>
      <Faq/>
    </div>
  );
}
