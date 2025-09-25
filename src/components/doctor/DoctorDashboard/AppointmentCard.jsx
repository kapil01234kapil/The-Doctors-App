import { Card } from "@/components/ui/card";

const AppointmentCards = ({ title, total, value, textColor }) => {
  const colorMap = {
    "text-blue-500": "#3b82f6",
    "text-green-500": "#10b981",
    "text-orange-500": "#f59e0b",
    "text-red-500": "#ef4444",
  };

  const percent = total ? (value / total) * 100 : 0;
  const progressColor = colorMap[textColor] || "#3b82f6";

  return (
    <Card className="w-full sm:w-full md:w-full  xl:w-60 min-h-[180px] flex flex-col items-center justify-center text-center shadow-md">
      <h2 className="font-bold text-sm md:text-md">{title}</h2>
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center relative"
        style={{
          background: `conic-gradient(${progressColor} ${percent}%, #e5e7eb ${percent}%)`,
        }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center">
          <span className={`text-sm md:text-lg font-bold ${textColor}`}>
            {value}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCards;
