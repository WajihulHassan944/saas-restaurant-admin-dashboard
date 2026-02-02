import { Percent } from "lucide-react";

export default function HappyHourInfoCard() {
  return (
    <div className="bg-white border  rounded-xl p-6 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center">
          <Percent className="text-primary" size={18} />
        </div>

        <div className="flex gap-10">
         <div> <p className="text-2xl font-semibold">
            20% Off{" "}
            <span className="text-xs font-normal text-gray-400">
              (Daily Specific Time)
            </span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            02:12PM - 06:16PM
          </p>
</div>
        <div>  <p className="text-sm text-gray-500 mt-2">
            Discount Type : Discount On Purchase
          </p>

          <p className="text-sm text-gray-500">
            Food Category : All
          </p></div>
        </div>
      </div>
    </div>
  );
}
