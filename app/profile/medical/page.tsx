"use client";

import { useState } from "react";
import { Shield, Upload, FileText, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function MedicalInsurancePage() {
  const [carrier, setCarrier] = useState("Blue Cross Blue Shield");
  const [policyNumber, setPolicyNumber] = useState("BCBS-98745210");
  const [groupNumber, setGroupNumber] = useState("GRP-55443");

  const [uploadedFile, setUploadedFile] = useState<string | null>(
    "insurance_card_front.png"
  );
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");

    setTimeout(() => {
      setSaving(false);
      setSuccessMessage("Medical & Insurance records saved successfully!");
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Medical & Insurance Records
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Provide your healthcare insurance coverage details to facilitate seamless billing and claim verification.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Insurance Policy Information
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Insurance Carrier / Provider Name
            </label>
            <input
              type="text"
              required
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g. Aetna, Blue Cross, Cigna, UnitedHealth"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Policy Member ID Number
              </label>
              <input
                type="text"
                required
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="e.g. ID-123456789"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Group Number
              </label>
              <input
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="e.g. GRP-998877"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Insurance Card Scan Container */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Insurance Card Scan / Digital Upload
          </h3>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-2xl flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Upload Insurance Card (Front & Back Scan)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PNG, JPG, or PDF format up to 10MB
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-colors">
              <FileText className="w-4 h-4" /> Browse File Scan
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFile && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-xs flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate font-semibold">{uploadedFile}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Uploaded
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
          >
            {saving ? "Saving Records..." : "Save Medical & Insurance"}
          </button>
        </div>
      </form>
    </div>
  );
}

