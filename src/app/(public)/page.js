import DashboardSecond from "@/components/shared/Dashboard/DashboardSecond";
import DashboardStory from "@/components/shared/Dashboard/DashboardStory";
import Faq from "@/components/shared/Dashboard/Faq";
import HeroDashboard from "@/components/shared/Dashboard/HeroDashboard";

export default function Home() {
  return (
    <div>
      <HeroDashboard/>
      <DashboardSecond/>
      <Faq/>
    </div>
  );
}
