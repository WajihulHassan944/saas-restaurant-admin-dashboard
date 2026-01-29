import { Card } from "@/components/ui/card";

export default function UserProfile() {
  return (
      <Card className="w-full bg-white rounded-2xl shadow-none border-none p-10">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src="/user-2.jpg"
            alt="User Avatar"
            className="w-46 h-46 object-cover rounded-2xl shadow-md"
          />

          {/* Name */}
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Samantha Doe
          </h2>

          {/* Email */}
          <p className="text-[#909090] text-sm">
            samantha123@example.com
          </p>
        </div>

        {/* Description */}
        <div className="text-center mt-8">
          <p className="font-medium text-gray-700 mb-2">Description</p>
          <p className="text-[#909090] text-sm max-w-xl mx-auto leading-relaxed">
            Authentic and fusion flavors made fresh every day using
            high-quality ingredients.
          </p>
        </div>

<div className="flex justify-center mt-12">
  <div className="w-full max-w-[580px] space-y-5 text-sm">
    {[
      ["Restaurant type", "Fast food"],
      ["Phone", "+921212121212"],
      ["Joining Date", "12/13/2025 07:00 PM"],
      ["Address", "742 Mission Street, Suite 300"],
      ["Typography", "Onest"],
    ].map(([label, value]) => (
      <div
        key={label}
        className="grid grid-cols-[1fr_auto_1fr] items-center"
      >
        {/* left */}
        <span className="text-left font-medium text-gray-600">
          {label}
        </span>

        {/* center */}
        <span className="text-center text-gray-400 px-3">:</span>

        {/* right */}
        <span className="text-right text-gray-400">
          {value}
        </span>
      </div>
    ))}

    {/* Colors (NO colon) */}
    <div className="grid grid-cols-[1fr_1fr] items-start">
      <span className="text-left font-medium text-gray-600">
        Colors
      </span>

      {/* Colors (stacked rows below label) */}
<div className="grid grid-cols-[1fr_auto_1fr]">
  
  <span /> {/* empty center */}
  <span /> {/* empty right */}
</div>

<div className="pl-1 space-y-3 text-gray-400 text-sm mt-3">
  <div className="flex items-center gap-3">
    <span className="w-4 h-4 rounded-full bg-red-600" />
    Primary
  </div>

  <div className="flex items-center gap-3">
    <span className="w-4 h-4 rounded-full bg-black" />
    Secondary
  </div>
</div>

    </div>
  </div>
</div>

      </Card>
  );
}
