"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/header";

export default function CreateFAQPage() {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState(false);
  const [visibility, setVisibility] = useState<"all" | "logged-in">("all");

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <Header
            title="FAQ Manager"
            description="Manage your restaurant's frequently asked questions to help customers navigate ordering, payments, and policy information."
            titleClassName="text-[24px] sm:text-[28px] font-semibold text-[#101828] leading-tight"
            descriptionClassName="mt-1 max-w-[760px] text-sm text-[#667085] leading-6"
          />

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#C1121F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a50f1a]"
          >
            + Publish FAQ
          </button>
        </div>

        {/* Main Card */}
        <div className="mt-6 rounded-3xl border border-[#ECEEF2] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_0.9fr]">
            {/* Left Form */}
            <div>
              {/* Question */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#344054]">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. How do I track my order in real-time?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#D0D5DD] focus:bg-white"
                />
              </div>

              {/* Category */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#344054]">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 pr-10 text-sm text-[#101828] outline-none focus:border-[#D0D5DD] focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Orders">Orders</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Payments">Payments</option>
                    <option value="Policy">Policy</option>
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#667085]">
                    ▾
                  </span>
                </div>
              </div>

              {/* Answer */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#344054]">
                  Answer
                </label>

                <div className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-b border-[#E4E7EC] px-3 py-2">
                    {[
                      { icon: Bold, label: "Bold" },
                      { icon: Italic, label: "Italic" },
                      { icon: List, label: "List" },
                      { icon: LinkIcon, label: "Link" },
                      { icon: ImageIcon, label: "Image" },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          type="button"
                          title={item.label}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-[#667085] transition hover:bg-white hover:text-[#344054]"
                        >
                          <Icon size={15} />
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    placeholder="Provide a detailed answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[220px] w-full resize-none bg-[#F9FAFB] px-4 py-3 text-sm leading-6 text-[#101828] outline-none placeholder:text-[#98A2B3]"
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="rounded-2xl bg-[#FAFAFB] p-4">
              {/* Live Preview */}
              <div className="rounded-2xl border border-[#F1D6D8] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.05)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C1121F]">
                  Live Preview
                </p>
                <p className="mt-2 text-sm font-semibold leading-5 text-[#101828]">
                  {question?.trim()
                    ? question
                    : "User View: Your question will appear as a toggleable accordion here."}
                </p>
              </div>

              {/* Publishing Status */}
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  Publishing Status
                </p>

                <div className="mt-3 rounded-xl border border-[#EAECF0] bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#101828]">Status</p>
                      <p className="mt-1 text-xs text-[#98A2B3]">
                        {status ? "Published" : "Currently Draft"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStatus((prev) => !prev)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        status ? "bg-[#C1121F]" : "bg-[#D0D5DD]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition ${
                          status ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  Visibility
                </p>

                <div className="mt-3 space-y-3">
                  <button
                    type="button"
                    onClick={() => setVisibility("all")}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      visibility === "all"
                        ? "border-[#F1D6D8] bg-white"
                        : "border-transparent bg-white hover:border-[#EAECF0]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 flex size-4 items-center justify-center rounded-full border ${
                          visibility === "all"
                            ? "border-[#D92D20]"
                            : "border-[#D0D5DD]"
                        }`}
                      >
                        {visibility === "all" && (
                          <span className="size-2 rounded-full bg-[#D92D20]" />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-[#101828]">
                          Visible to all
                        </p>
                        <p className="text-xs text-[#98A2B3]">
                          Publicly accessible on the web
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("logged-in")}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      visibility === "logged-in"
                        ? "border-[#F1D6D8] bg-white"
                        : "border-transparent bg-white hover:border-[#EAECF0]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 flex size-4 items-center justify-center rounded-full border ${
                          visibility === "logged-in"
                            ? "border-[#D92D20]"
                            : "border-[#D0D5DD]"
                        }`}
                      >
                        {visibility === "logged-in" && (
                          <span className="size-2 rounded-full bg-[#D92D20]" />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-[#101828]">
                          Logged-in only
                        </p>
                        <p className="text-xs text-[#98A2B3]">
                          Restricted to registered customers
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-6 border-t border-[#EAECF0] pt-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                      Created By
                    </p>
                    <p className="text-xs font-semibold uppercase text-[#344054]">
                      Admin_Sarah
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                      Last Sync
                    </p>
                    <p className="text-xs font-semibold uppercase text-[#344054]">
                      Just Now
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#D9EAF2] bg-[#EAF5FB] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-white text-[#2E90FA]">
                <Lightbulb size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#344054]">Editorial Tip</p>
                <p className="mt-1 text-sm leading-6 text-[#667085]">
                  Keep questions concise. Use active voice to help customers find
                  solutions faster. Asymmetric layouts for your answers can improve
                  scanability.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F3E0E0] bg-[#FFF4F4] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-white text-[#D92D20]">
                <RotateCcw size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#344054]">
                  Auto-Save Enabled
                </p>
                <p className="mt-1 text-sm leading-6 text-[#667085]">
                  Your changes are automatically saved as a local draft every 30
                  seconds to prevent data loss. Check your draft history in the
                  sidebar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}