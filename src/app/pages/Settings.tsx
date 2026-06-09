"use client";

import { useState } from "react";
import { Download, Trash2, Pencil } from "lucide-react";
import { useApp, USER } from "../context";
import Avatar from "../components/Avatar";
import ModelBadge from "../components/ModelBadge";

const TABS = ["Profile", "Workspaces", "AI Model", "Notifications", "Data & Privacy"];

export default function Settings() {
  const [tab, setTab] = useState("Profile");
  return (
    <div className="flex-1 overflow-y-auto mem-scrollbar">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-[22px] font-medium">Settings</h1>
          <p className="text-[13px] text-[#888] mt-0.5">Account and preferences</p>
        </header>

        <div className="md:hidden mb-5 overflow-x-auto flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-3.5 py-1 rounded-full text-[12px] transition-all duration-200 ${
                tab === t ? "bg-[#1A1A1A] text-white" : "text-[#888]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="md:flex md:gap-8">
          <nav className="hidden md:flex flex-col gap-1 w-[200px] shrink-0">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-left text-[13px] px-3 py-1.5 rounded-md transition-all duration-200 ${
                  tab === t
                    ? "bg-white border border-[#E8E8E8] font-medium"
                    : "text-[#1A1A1A] hover:bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            {tab === "Profile" && <ProfileTab />}
            {tab === "Workspaces" && <WorkspacesTab />}
            {tab === "AI Model" && <ModelTab />}
            {tab === "Notifications" && <NotifTab />}
            {tab === "Data & Privacy" && <DataTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-[#E8E8E8] rounded-[10px] p-5">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] text-[#888]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full h-10 px-3 bg-white border border-[#E0E0E0] rounded-[8px] text-[13px] outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200";

function ProfileTab() {
  const [name, setName] = useState(USER.name);
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <Avatar initials={USER.initials} size={48} />
        <div>
          <p className="text-[14px] font-medium">{USER.name}</p>
          <p className="text-[12px] text-[#888]">{USER.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email">
          <input value={USER.email} readOnly className={`${inputClass} bg-[#F5F5F5] text-[#888]`} />
        </Field>
        <button className="self-start h-10 px-4 bg-[#1A1A1A] text-white rounded-[8px] text-[13px] hover:opacity-90 transition-all duration-200">
          Save changes
        </button>
      </div>
    </Card>
  );
}

function WorkspacesTab() {
  const { workspaces } = useApp();
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[14px] font-medium">Workspaces</p>
        <button className="h-8 px-3 border border-[#E0E0E0] rounded-[8px] text-[12px] hover:bg-[#F5F5F5] transition-all duration-200">
          + New workspace
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {workspaces.map((w) => (
          <li
            key={w.id}
            className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-[10px]"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: w.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium">{w.name}</span>
                {w.model !== "auto" && <ModelBadge model={w.model} />}
              </div>
              <p className="text-[11px] text-[#888] truncate">
                You are a focused assistant for {w.name.toLowerCase()} tasks...
              </p>
            </div>
            <button
              aria-label="Edit"
              className="text-[#888] hover:text-[#1A1A1A] transition-all duration-200"
            >
              <Pencil size={14} />
            </button>
            <button
              aria-label="Delete"
              className="text-[#888] hover:text-[#EF4444] transition-all duration-200"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ModelTab() {
  const [v, setV] = useState<"auto" | "groq" | "gemini">("auto");
  const opts = [
    { v: "auto", t: "Auto", d: "Memora picks the best model for each request." },
    { v: "groq", t: "Always Groq", d: "Fastest responses. Best for chat and quick tasks." },
    { v: "gemini", t: "Always Gemini", d: "Long context and deeper reasoning." },
  ] as const;
  return (
    <Card>
      <p className="text-[14px] font-medium mb-3">Default model</p>
      <div className="flex flex-col gap-2">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setV(o.v)}
            className={`text-left p-3 rounded-[10px] border transition-all duration-200 ${
              v === o.v ? "border-[#1A1A1A] bg-[#FAFAFA]" : "border-[#E8E8E8] hover:bg-[#FAFAFA]"
            }`}
          >
            <p className="text-[13px] font-medium">{o.t}</p>
            <p className="text-[12px] text-[#888] mt-0.5">{o.d}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function NotifTab() {
  const [on, setOn] = useState(true);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-medium">Weekly digest email</p>
          <p className="text-[12px] text-[#888] mt-0.5">
            A summary of your week, every Sunday at 8 PM.
          </p>
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          aria-label="Toggle weekly digest"
          className={`relative w-10 h-6 rounded-full transition-all duration-200 ${
            on ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
              on ? "translate-x-4" : ""
            }`}
          />
        </button>
      </div>
      <div className="mt-4">
        <Field label="Email address">
          <input defaultValue={USER.email} className={inputClass} />
        </Field>
      </div>
    </Card>
  );
}

function DataTab() {
  return (
    <Card>
      <p className="text-[14px] font-medium">Your data</p>
      <p className="text-[12px] text-[#888] mt-0.5 mb-4">
        Export everything or permanently delete your account.
      </p>
      <div className="flex flex-col gap-2">
        <button className="inline-flex items-center gap-2 h-10 px-4 border border-[#E0E0E0] rounded-[8px] text-[13px] hover:bg-[#F5F5F5] transition-all duration-200 self-start">
          <Download size={14} />
          Export all data
        </button>
        <button className="inline-flex items-center gap-2 h-10 px-4 border border-[#EF4444] text-[#EF4444] rounded-[8px] text-[13px] hover:bg-[#FEF2F2] transition-all duration-200 self-start">
          <Trash2 size={14} />
          Delete account
        </button>
      </div>
    </Card>
  );
}
