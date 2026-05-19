"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
      [8000000, 670000, 0.225, 5000000],
      [12000000, 1345000, 0.25, 8000000],
      [30000000, 2345000, 0.275, 12000000],
      [50000000, 7295000, 0.3, 30000000],
      [75000000, 13295000, 0.325, 50000000],
      [Infinity, 21420000, 0.35, 75000000]
    ]
  },
  business: {
    2026: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.15, 600000],
      [1600000, 90000, 0.2, 1200000],
      [3200000, 170000, 0.3, 1600000],
      [5600000, 650000, 0.4, 3200000],
      [Infinity, 1610000, 0.45, 5600000]
    ],
    2025: [
      [600000, 0, 0, 0],
      [1200000, 0, 0.15, 600000],
      [1600000, 90000, 0.2, 1200000],
      [3200000, 170000, 0.3, 1600000],
      [5600000, 650000, 0.4, 3200000],
      [Infinity, 1610000, 0.45, 5600000]
    ],
    2024: [
      [600000, 0, 0, 0],
      [800000, 0, 0.075, 600000],
      [1200000, 15000, 0.15, 800000],
      [2400000, 75000, 0.2, 1200000],
      [3000000, 315000, 0.25, 2400000],
      [4000000, 465000, 0.3, 3000000],
      [Infinity, 765000, 0.35, 4000000]
    ],
    2023: [
      [600000, 0, 0, 0],
      [800000, 0, 0.05, 600000],
      [1200000, 10000, 0.125, 800000],
      [2400000, 60000, 0.175, 1200000],
      [3000000, 270000, 0.225, 2400000],
      [4000000, 405000, 0.275, 3000000],
      [6000000, 680000, 0.325, 4000000],
      [Infinity, 1330000, 0.35, 6000000]
    ],
    2022: [
      [400000, 0, 0, 0],
      [600000, 0, 0.05, 400000],
      [1200000, 10000, 0.1, 600000],
      [2400000, 70000, 0.15, 1200000],
      [3000000, 250000, 0.2, 2400000],
      [4000000, 370000, 0.25, 3000000],
      [6000000, 620000, 0.3, 4000000],
      [Infinity, 1220000, 0.35, 6000000]
    ]
  }
};

export default function TaxCalculators({ page, mode = "all" }) {
  return (
    <section className="bg-[#fffdfb] py-14 sm:py-20">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
        {mode === "all" ? (
          <div className="grid gap-5 md:grid-cols-2">
            <CalculatorCard href="/calculators/salary-tax" icon="tax" title={page.salaryTitle} copy={page.salaryCopy} />
            <CalculatorCard href="/calculators/business-tax" icon="business" title={page.businessTitle} copy={page.businessCopy} />
          </div>
        ) : null}

        {(mode === "all" || mode === "salary") ? (
          <TaxCalculator
            title={page.salaryTitle}
            copy={page.salaryCopy}
            defaultMonthlyIncome={150000}
            incomeLabel="Monthly Salary"
            helperText="Enter gross monthly salary in PKR."
            tableKey="salary"
          />
        ) : null}

        {(mode === "all" || mode === "business") ? (
          <TaxCalculator
            title={page.businessTitle}
            copy={page.businessCopy}
            defaultMonthlyIncome={250000}
            incomeLabel="Monthly Business Income"
            helperText="Enter estimated monthly taxable business income in PKR."
            tableKey="business"
          />
        ) : null}

        <div className="grid gap-5 rounded-lg border border-primary/10 bg-paper p-6 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-sm font-semibold leading-7 text-muted">{page.disclaimer}</p>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-black text-white transition hover:-translate-y-1" href={page.consultationHref || "/appointment"}>
            {page.consultationLabel || "Review With Tax Team"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function CalculatorCard({ href, icon, title, copy }) {
  return (
    <Link className="group rounded-lg border border-primary/10 bg-white p-6 shadow-xl shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10" href={href}>
      <span className="grid size-14 place-items-center rounded-md bg-secondary text-primary">
        <FaIcon className="size-6" name={icon} />
      </span>
      <h2 className="mt-5 text-2xl font-black text-primary">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{copy}</p>
      <span className="mt-5 inline-flex font-black text-primary transition group-hover:text-primary/75">Open Calculator</span>
    </Link>
  );
}

function TaxCalculator({ title, copy, defaultMonthlyIncome, tableKey, incomeLabel, helperText }) {
  const [year, setYear] = useState("2026");
  const [monthlyIncome, setMonthlyIncome] = useState(defaultMonthlyIncome);
  const [deductions, setDeductions] = useState(0);
  const slabs = taxTables[tableKey][year].map(([upto, base, rate, over]) => ({ upto, base, rate, over }));

  const result = useMemo(() => {
    const annualIncome = Math.max(0, Number(monthlyIncome || 0) * 12);
    const annualDeductions = Math.max(0, Number(deductions || 0));
    const taxableIncome = Math.max(0, annualIncome - annualDeductions);
    const tax = calculateTax(taxableIncome, slabs);
    return {
      annualDeductions,
      taxableIncome,
      annualTax: tax,
      monthlyTax: tax / 12,
      takeHomeMonthly: Math.max(0, Number(monthlyIncome || 0) - tax / 12),
      effectiveRate: taxableIncome ? (tax / taxableIncome) * 100 : 0
    };
  }, [monthlyIncome, deductions, slabs]);

  return (
    <div className="grid gap-6 rounded-lg border border-primary/10 bg-white p-6 shadow-2xl shadow-primary/10 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
      <div>
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">
          <FaIcon className="size-4" name="tax" />
          Tax Year {year}
        </p>
        <h2 className="text-3xl font-black text-primary">{title}</h2>
        <p className="mt-3 leading-7 text-muted">{copy}</p>

        <div className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-black text-primary">
            Tax Year
            <select className="min-h-14 rounded-md border border-primary/10 bg-paper px-4 text-lg font-black text-ink outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10" value={year} onChange={(event) => setYear(event.target.value)}>
              {taxYears.map((item) => <option key={item} value={item}>Tax Year {item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-primary">
            {incomeLabel}
            <input className="min-h-14 rounded-md border border-primary/10 bg-paper px-4 text-lg font-black text-ink outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10" min="0" type="number" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} />
            <span className="text-xs font-semibold text-muted">{helperText}</span>
          </label>
          <label className="grid gap-2 text-sm font-black text-primary">
            Annual Deductions / Adjustments
            <input className="min-h-14 rounded-md border border-primary/10 bg-paper px-4 text-lg font-black text-ink outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10" min="0" type="number" value={deductions} onChange={(event) => setDeductions(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg bg-primary p-5 text-white sm:grid-cols-2">
        <Result label="Tax Year" value={year} />
        <Result label="Annual Taxable Income" value={formatCurrency(result.taxableIncome)} />
        <Result label="Estimated Annual Tax" value={formatCurrency(result.annualTax)} />
        <Result label="Estimated Monthly Tax" value={formatCurrency(result.monthlyTax)} />
        <Result label="Estimated Monthly Take Home" value={formatCurrency(result.takeHomeMonthly)} />
        <Result label="Effective Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
        <Result label="Annual Adjustments" value={formatCurrency(result.annualDeductions)} />
      </div>
    </div>
  );
}

function Result({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function calculateTax(income, slabs) {
  const slab = slabs.find((item) => income <= item.upto) || slabs[slabs.length - 1];
  return Math.max(0, slab.base + Math.max(0, income - slab.over) * slab.rate);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "PKR"
  }).format(Number(value || 0));
}
