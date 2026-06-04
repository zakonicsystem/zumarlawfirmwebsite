"use client";

import { useMemo, useState } from "react";
import FaIcon from "@/components/FaIcon";

const taxYears = ["2026", "2025", "2024", "2023", "2022"];

const taxTables = {
  salary: {
    2026: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.01, 600000],
      [2200000, 6000, 0.11, 1200000],
      [3200000, 116000, 0.23, 2200000],
      [4100000, 346000, 0.3, 3200000],
      [Infinity, 616000, 0.35, 4100000]
    ],
    2025: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.05, 600000],
      [2200000, 30000, 0.15, 1200000],
      [3200000, 180000, 0.25, 2200000],
      [4100000, 430000, 0.3, 3200000],
      [Infinity, 700000, 0.35, 4100000]
    ],
    2024: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.025, 600000],
      [2400000, 15000, 0.125, 1200000],
      [3600000, 165000, 0.225, 2400000],
      [6000000, 435000, 0.275, 3600000],
      [Infinity, 1095000, 0.35, 6000000]
    ],
    2023: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.025, 600000],
      [2400000, 15000, 0.125, 1200000],
      [3600000, 165000, 0.2, 2400000],
      [6000000, 405000, 0.25, 3600000],
      [12000000, 1005000, 0.325, 6000000],
      [Infinity, 2955000, 0.35, 12000000]
    ],
    2022: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.05, 600000],
      [1800000, 30000, 0.1, 1200000],
      [2500000, 90000, 0.15, 1800000],
      [3500000, 195000, 0.175, 2500000],
      [5000000, 370000, 0.2, 3500000],
      [Infinity, 570000, 0.25, 5000000]
    ]
  },
  business: {
    2026: [
      [5000000, 0, 0, 0],
      [10000000, 0, 0.05, 5000000],
      [15000000, 250000, 0.1, 10000000],
      [25000000, 750000, 0.15, 15000000],
      [Infinity, 2250000, 0.2, 25000000]
    ],
    2025: [
      [5000000, 0, 0, 0],
      [10000000, 0, 0.04, 5000000],
      [15000000, 200000, 0.08, 10000000],
      [25000000, 600000, 0.12, 15000000],
      [Infinity, 1800000, 0.18, 25000000]
    ],
    2024: [
      [5000000, 0, 0, 0],
      [10000000, 0, 0.03, 5000000],
      [15000000, 150000, 0.07, 10000000],
      [25000000, 500000, 0.11, 15000000],
      [Infinity, 1600000, 0.15, 25000000]
    ],
    2023: [
      [5000000, 0, 0, 0],
      [10000000, 0, 0.03, 5000000],
      [15000000, 150000, 0.07, 10000000],
      [25000000, 500000, 0.11, 15000000],
      [Infinity, 1600000, 0.15, 25000000]
    ],
    2022: [
      [5000000, 0, 0, 0],
      [10000000, 0, 0.02, 5000000],
      [15000000, 100000, 0.06, 10000000],
      [25000000, 400000, 0.1, 15000000],
      [Infinity, 1400000, 0.15, 25000000]
    ]
  }
};

export default function TaxCalculators({ page = {} }) {
  const [calculatorType, setCalculatorType] = useState("salary");
  const [year, setYear] = useState("2026");
  const [income, setIncome] = useState("");

  const taxResult = useMemo(() => {
    if (!income || isNaN(income)) return null;
    const amount = Number(income);
    const table = taxTables[calculatorType]?.[year] || [];

    for (const [limit, baseTax, rate, threshold] of table) {
      if (amount < limit) {
        const tax = baseTax + (amount - threshold) * rate;
        return {
          tax: Math.round(tax),
          netIncome: Math.round(amount - tax),
          rate: (rate * 100).toFixed(2)
        };
      }
    }

    return null;
  }, [income, calculatorType, year]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-2">
        {/* Calculator Panel */}
        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-primary/10 bg-white p-7 shadow-xl shadow-primary/5 sm:p-9">
            <h2 className="inline-flex items-center gap-3 text-2xl font-black text-primary sm:text-3xl">
              <FaIcon className="size-6" name={calculatorType === "salary" ? "id" : "business"} />
              {calculatorType === "salary" ? "Salary" : "Business"} Tax Calculator
            </h2>

            <div className="mt-8 grid gap-6">
              {/* Calculator Type Selection */}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setCalculatorType("salary")}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-black transition ${calculatorType === "salary"
                      ? "bg-primary text-white"
                      : "border border-primary/10 bg-paper text-primary hover:bg-white"
                    }`}
                >
                  <FaIcon className="size-4" name="id" />
                  Salary Tax
                </button>
                <button
                  onClick={() => setCalculatorType("business")}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-black transition ${calculatorType === "business"
                      ? "bg-primary text-white"
                      : "border border-primary/10 bg-paper text-primary hover:bg-white"
                    }`}
                >
                  <FaIcon className="size-4" name="business" />
                  Business Tax
                </button>
              </div>

              {/* Year Selection */}
              <label className="grid gap-2 text-sm font-black text-primary">
                Tax Year
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold outline-none focus:ring-4 focus:ring-primary/10"
                >
                  {taxYears.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </label>

              {/* Income Input */}
              <label className="grid gap-2 text-sm font-black text-primary">
                Annual Income (PKR)
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter your annual income"
                  className="min-h-12 rounded-2xl border border-primary/10 px-4 font-semibold outline-none focus:ring-4 focus:ring-primary/10"
                />
              </label>
            </div>
          </div>

          {/* Tax Bracket Info */}
          <div className="rounded-[2rem] border border-primary/10 bg-paper p-6 sm:p-7">
            <p className="text-sm font-black uppercase tracking-wide text-primary/60">Tax Information</p>
            <p className="mt-2 text-sm text-muted">
              {calculatorType === "salary"
                ? "Salary tax is calculated based on progressive tax brackets for salaried individuals."
                : "Business income tax applies to self-employed individuals and business owners."}
            </p>
            <p className="mt-3 text-xs text-muted">
              <strong>Year:</strong> {year} | <strong>Type:</strong> {calculatorType === "salary" ? "Salaried" : "Business Income"}
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="grid gap-6">
          {taxResult ? (
            <>
              <div className="rounded-[2rem] border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5 p-7 shadow-xl shadow-secondary/10 sm:p-9">
                <p className="text-sm font-black uppercase tracking-wide text-secondary">Tax Estimate</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="block text-xs font-black uppercase text-primary/60">Annual Tax</span>
                    <span className="mt-1 block text-3xl font-black text-primary">
                      PKR {taxResult.tax.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase text-primary/60">Tax Rate</span>
                    <span className="mt-1 block text-3xl font-black text-primary">
                      {taxResult.rate}%
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-black uppercase text-primary/60">Net Income</span>
                    <span className="mt-1 block text-3xl font-black text-primary">
                      PKR {taxResult.netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-primary/10 bg-white p-6 sm:p-7">
                <p className="text-sm font-black uppercase tracking-wide text-primary/60">Monthly Breakdown</p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5">
                    <span className="text-sm font-bold text-muted">Monthly Income:</span>
                    <strong className="text-primary">PKR {Math.round(Number(income) / 12).toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5">
                    <span className="text-sm font-bold text-muted">Monthly Tax:</span>
                    <strong className="text-primary">PKR {Math.round(taxResult.tax / 12).toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-2.5">
                    <span className="text-sm font-bold text-primary">Monthly Net Income:</span>
                    <strong className="text-primary">PKR {Math.round(taxResult.netIncome / 12).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-primary/10 bg-paper p-6 sm:p-7">
                <p className="text-xs leading-6 text-muted">
                  <strong className="text-primary">Disclaimer:</strong> This calculator provides estimates based on current tax brackets. For accurate tax calculations, consult with a professional tax advisor. Actual tax liability may vary based on deductions, exemptions, and other factors.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-primary/10 bg-paper p-9 text-center">
              <FaIcon className="mx-auto size-12 text-primary/40" name="calculator" />
              <p className="mt-4 font-black text-primary/60">Enter your income to calculate tax</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
