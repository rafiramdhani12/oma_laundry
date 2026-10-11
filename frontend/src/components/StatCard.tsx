export type Tone = "indigo" | "amber" | "sky" | "emerald";

const TONE: Record<Tone, { icon: string; bar: string }> = {
  indigo: { icon: "bg-indigo-100 text-indigo-600", bar: "bg-indigo-500" },
  amber: { icon: "bg-amber-100 text-amber-600", bar: "bg-amber-400" },
  sky: { icon: "bg-sky-100 text-sky-600", bar: "bg-sky-500" },
  emerald: { icon: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
};

export type StatCardProps = {
  title: string;
  icon: string; // emoji
  tone: Tone;
  value?: string | number; // undefined = masih loading (tampil skeleton)
  className?: string;
};

const StatCard = ({ title, icon, tone, value, className = "" }: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 ${className}`}
  >
    <span className={`absolute inset-x-0 top-0 h-1 ${TONE[tone].bar}`} />

    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${TONE[tone].icon}`}
      >
        {icon}
      </span>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>

    <div className="mt-3 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
      {value === undefined ? (
        <span className="inline-block h-8 w-24 animate-pulse rounded bg-gray-200" />
      ) : (
        value
      )}
    </div>
  </div>
);

export default StatCard;