"use client";

import React, { useMemo, useState } from "react";
import { Search, Plus, Star, Sparkles } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";

type FAQStatus = "published" | "draft";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  status: FAQStatus;
  updatedAgo?: string;
  createdAgo?: string;
  category: string;
};

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I track my order in real-time?",
    answer:
      "Once your order is confirmed, you can view the live tracking status in the 'My Orders' section of the app. Notifications will be sent as your order progresses.",
    status: "published",
    updatedAgo: "Updated 2 days ago",
    category: "Orders",
  },
  {
    id: 2,
    question: "Can I cancel my order after it's been prepared?",
    answer:
      "Orders cannot be canceled once the kitchen has started preparing them. For urgent changes, please contact the restaurant directly via the support section.",
    status: "draft",
    createdAgo: "Created 1 hour ago",
    category: "Orders",
  },
  {
    id: 3,
    question: "Is there a minimum order value for delivery?",
    answer:
      "The minimum order value varies by distance. Generally, orders above the delivery threshold qualify for standard delivery, while smaller orders may incur a small delivery surcharge.",
    status: "published",
    updatedAgo: "Updated 1 week ago",
    category: "Delivery",
  },
  {
    id: 4,
    question: "What happens if my food is delivered late?",
    answer:
      "We strive for punctuality. If your order is more than 20 minutes late beyond the promised time, we will automatically issue a 15% discount credit to your account where applicable.",
    status: "published",
    updatedAgo: "Updated 3 weeks ago",
    category: "Policy",
  },
];

type StatCardProps = {
  label: string;
  value: string;
  subText: string;
  subTextClassName?: string;
  rightContent?: React.ReactNode;
};

function StatCard({
  label,
  value,
  subText,
  subTextClassName = "text-[#12B76A]",
  rightContent,
}: StatCardProps) {
  return (
    <div className="relative min-h-[96px] rounded-2xl border border-[#ECEEF2] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
            {label}
          </p>
          <h3 className="mt-2 text-[28px] leading-none font-semibold text-[#1D2939]">
            {value}
          </h3>
          <p className={`mt-2 text-xs font-medium ${subTextClassName}`}>
            {subText}
          </p>
        </div>

        {rightContent && <div className="pt-4">{rightContent}</div>}
      </div>
    </div>
  );
}

type FAQRowProps = {
  item: FAQItem;
};

function FAQRow({ item }: FAQRowProps) {
  const isPublished = item.status === "published";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)]">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          isPublished ? "bg-[#12B76A]" : "bg-[#F5B301]"
        }`}
      />

      <div className="px-5 py-4 sm:px-6">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase leading-none ${
              isPublished
                ? "bg-[#ECFDF3] text-[#027A48]"
                : "bg-[#FFF7E6] text-[#B54708]"
            }`}
          >
            {item.status}
          </span>

          <span className="text-xs text-[#98A2B3]">
            {item.updatedAgo || item.createdAgo}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-6 text-[#101828] sm:text-[17px]">
          {item.question}
        </h3>

        <p className="mt-2 max-w-[900px] text-sm leading-6 text-[#667085]">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQManagerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Latest");

  const filteredFaqs = useMemo(() => {
    let items = [...faqData];

    if (category !== "All Categories") {
      items = items.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
      );
    }

    if (sortBy === "Oldest") {
      return [...items].reverse();
    }

    if (sortBy === "Published First") {
      return [...items].sort((a, b) =>
        a.status === b.status ? 0 : a.status === "published" ? -1 : 1
      );
    }

    return items;
  }, [search, category, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <Header
            title="FAQ Manager"
            description="Manage your restaurant's frequently asked questions to help customers navigate ordering, payments, and policy information."
            titleClassName="text-[24px] sm:text-[28px] font-semibold text-[#101828] leading-tight"
            descriptionClassName="mt-1 max-w-[720px] text-sm text-[#667085] leading-6"
          />

          <Link href="/faqs/add"
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full bg-[#C1121F] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a50f1a]"
          >
            <Plus size={15} />
            <span>New FAQ Item</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total FAQs" value="24" subText="+ 2 this month" />

          <StatCard
            label="Active Drafts"
            value="03"
            subText="Needs review"
            subTextClassName="text-[#667085]"
          />

          <div className="relative min-h-[96px] overflow-hidden rounded-2xl border border-[#ECEEF2] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="absolute -right-3 -bottom-4 opacity-[0.07]">
              <Sparkles size={96} className="text-[#C1121F]" strokeWidth={1.5} />
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                Helpfulness Rating
              </p>

              <div className="mt-2 flex items-center gap-2.5">
                <h3 className="text-[28px] leading-none font-semibold text-[#1D2939]">
                  98.2%
                </h3>

                <div className="flex items-center gap-0.5 pt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="fill-[#D92D20] text-[#D92D20]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
              type="text"
              placeholder="Filter by question or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#ECEEF2] bg-white pl-11 pr-4 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#D0D5DD]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 min-w-[160px] rounded-xl border border-[#ECEEF2] bg-white px-4 text-sm font-medium text-[#344054] outline-none focus:border-[#D0D5DD]"
            >
              <option>All Categories</option>
              <option>Orders</option>
              <option>Delivery</option>
              <option>Policy</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 min-w-[140px] rounded-xl border border-[#ECEEF2] bg-white px-4 text-sm font-medium text-[#344054] outline-none focus:border-[#D0D5DD]"
            >
              <option>Latest</option>
              <option>Oldest</option>
              <option>Published First</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredFaqs.map((item) => (
            <FAQRow key={item.id} item={item} />
          ))}

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white px-6 py-12 text-center">
              <p className="text-base font-medium text-[#344054]">
                No FAQs found
              </p>
              <p className="mt-1 text-sm text-[#667085]">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}