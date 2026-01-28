"use client";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="w-full bg-[#F5F5F5] rounded-[16px] py-16 px-6 flex flex-col items-center text-center">
      <h2 className="text-[30px] font-normal text-dark mb-2 font-onest">
        {title ?? "Looks like there is no data yet!"}
      </h2>

      <p className="text-base text-gray">
        {description ??
          "You haven’t added anything yet. Start by creating a new one."}
      </p>
    </div>
  );
}
