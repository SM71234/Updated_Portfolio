import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Upload,
  Copy,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Layers,
  Trophy,
  Gauge,
  User,
  KeyRound,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/trader-insight")({
  head: () => ({
    meta: [
      { title: "Trader Insight Dashboard — Sankalp Misal" },
      {
        name: "description",
        content:
          "Upload your trading statement and visualize lots, positions, and symbol contribution instantly.",
      },
    ],
  }),
  component: Dashboard,
});

type Row = {
  symbol: string;
  volume: number;
  trades: number;
  avg: number;
  percent: number;
};

type Insights = {
  total_volume: number;
  total_trades: number;
  top_symbol: string;
  avg_trade: number;
};

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function Dashboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setRows(null);
    setInsights(null);
    setName(null);
    setClientId(null);
    setError(null);
  };

  const handleFile = async (file: File) => {
    reset();
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      setError("Invalid file type. Please upload an .xlsx or .xls file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: null,
      });
      processRaw(raw);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  };

  const processRaw = (raw: unknown[][]) => {
    let extractedName: string | null = null;
    let extractedId: string | null = null;
    for (const row of raw) {
      const text = row
        .filter((c) => c !== null && c !== undefined)
        .map(String)
        .join(" ");
      if (!text) continue;
      const acc = text.match(/Account:\s*(\d{4,})/i);
      if (acc && !extractedId) extractedId = acc[1];
      const nm = text.match(/Name:\s*([A-Za-z][A-Za-z .'-]+?)(?:\s{2,}|$|Account:)/i);
      if (nm && !extractedName) extractedName = nm[1].trim();
    }
    setName(extractedName);
    setClientId(extractedId);

    let headerIdx = -1;
    for (let i = 0; i < raw.length; i++) {
      const cells = (raw[i] || []).map((c) => String(c ?? "").toLowerCase());
      if (cells.some((c) => c.includes("symbol")) && cells.some((c) => c.includes("volume"))) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) {
      setError("Positions table not found in uploaded file.");
      return;
    }
    const headers = (raw[headerIdx] as unknown[]).map((c) =>
      String(c ?? "").trim().toLowerCase(),
    );
    const symIdx = headers.findIndex((h) => h === "symbol");
    const volIdx = headers.findIndex((h) => h === "volume");
    const posIdx = headers.findIndex((h) => h === "position");
    if (symIdx === -1 || volIdx === -1 || posIdx === -1) {
      setError("Missing required columns: symbol, volume, or position.");
      return;
    }

    type Rec = { symbol: string; volume: number; position: string };
    const records: Rec[] = [];
    for (let i = headerIdx + 1; i < raw.length; i++) {
      const r = raw[i] || [];
      const sym = r[symIdx];
      const vol = r[volIdx];
      const pos = r[posIdx];
      if (sym == null || vol == null || pos == null) continue;
      const symStr = String(sym).trim();
      if (!symStr) continue;
      if (/balance|credit/i.test(symStr)) continue;
      const volNum = parseFloat(String(vol).replace(",", ".").trim());
      if (isNaN(volNum)) continue;
      const normalized = symStr.split(".")[0].toUpperCase();
      records.push({ symbol: normalized, volume: volNum, position: String(pos) });
    }

    if (records.length === 0) {
      setError("No valid trade rows found.");
      return;
    }

    const map = new Map<string, { volume: number; positions: Set<string> }>();
    for (const r of records) {
      const e = map.get(r.symbol) ?? { volume: 0, positions: new Set<string>() };
      e.volume += r.volume;
      e.positions.add(r.position);
      map.set(r.symbol, e);
    }
    const totalVolume = records.reduce((s, r) => s + r.volume, 0);
    const totalTrades = new Set(records.map((r) => r.position)).size;
    const built: Row[] = Array.from(map.entries())
      .map(([symbol, v]) => {
        const trades = v.positions.size;
        return {
          symbol,
          volume: round(v.volume),
          trades,
          avg: round(v.volume / trades),
          percent: round((v.volume / totalVolume) * 100),
        };
      })
      .sort((a, b) => b.volume - a.volume);

    setRows(built);
    setInsights({
      total_volume: round(totalVolume),
      total_trades: totalTrades,
      top_symbol: built[0]?.symbol ?? "-",
      avg_trade: round(totalVolume / totalTrades),
    });
  };

  const copyTable = async () => {
    if (!rows) return;
    const header = ["Symbol", "Total Lots", "Positions", "Avg Lot", "% Contribution"].join("\t");
    const body = rows
      .map((r) => [r.symbol, r.volume, r.trades, r.avg, `${r.percent}%`].join("\t"))
      .join("\n");
    try {
      await navigator.clipboard.writeText(`${header}\n${body}`);
      toast.success("Table copied to clipboard");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = `${header}\n${body}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Table copied to clipboard");
    }
  };

  const downloadCSV = () => {
    if (!rows) return;
    const csv = [
      ["Symbol", "Total Lots", "Positions", "Avg Lot", "% Contribution"].join(","),
      ...rows.map((r) =>
        [r.symbol, r.volume, r.trades, r.avg, `${r.percent}%`]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    triggerDownload(new Blob([csv], { type: "text/csv" }), "trader-insights.csv");
    toast.success("CSV downloaded");
  };

  const downloadExcel = () => {
    if (!rows) return;
    const ws = XLSX.utils.json_to_sheet(
      rows.map((r) => ({
        Symbol: r.symbol,
        "Total Lots": r.volume,
        Positions: r.trades,
        "Avg Lot": r.avg,
        "% Contribution": r.percent,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Insights");
    XLSX.writeFile(wb, "trader-insights.xlsx");
    toast.success("Excel downloaded");
  };

  const chartData = useMemo(
    () => (rows ?? []).slice(0, 8).map((r) => ({ name: r.symbol, value: r.volume })),
    [rows],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pt-4">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <header className="rounded-2xl border border-border/60 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center ring-1 ring-primary-foreground/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-display">
                Trader Insight Dashboard
              </h1>
              <p className="text-sm opacity-80">
                Turn raw MT5 trading statements into clear analytics.
              </p>
            </div>
          </div>
          <div className="text-xs uppercase tracking-widest opacity-70">Interactive Demo</div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto py-8 space-y-6">
        {/* Upload card */}
        <section className="card-surface p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-[240px]">
              <h2 className="text-lg font-semibold">Upload your trading statement</h2>
              <p className="text-sm text-muted-foreground">
                Drop an .xlsx or .xls file (max 5MB). Everything is processed locally in your
                browser.
              </p>
            </div>
          </div>

          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className="mt-5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-10 px-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload className="w-7 h-7 text-primary" />
            <span className="font-medium">
              {fileName ? fileName : "Click to browse or drag a file here"}
            </span>
            <span className="text-xs text-muted-foreground">.xlsx · .xls · up to 5MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          {loading && (
            <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your file…
            </div>
          )}
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive p-4">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {insights && rows && (
          <>
            {(name || clientId) && (
              <section className="card-surface px-5 py-4 flex flex-wrap gap-6 text-sm">
                {name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-semibold">{name}</span>
                  </div>
                )}
                {clientId && (
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-semibold">{clientId}</span>
                  </div>
                )}
              </section>
            )}

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Layers className="w-5 h-5" />}
                label="Total Lots"
                value={insights.total_volume.toLocaleString()}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Total Positions"
                value={insights.total_trades.toLocaleString()}
              />
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="Top Symbol"
                value={insights.top_symbol}
              />
              <StatCard
                icon={<Gauge className="w-5 h-5" />}
                label="Avg Lot / Trade"
                value={insights.avg_trade.toLocaleString()}
              />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-surface p-5">
                <h3 className="font-semibold mb-3">Volume by Symbol</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          color: "var(--popover-foreground)",
                        }}
                      />
                      <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card-surface p-5">
                <h3 className="font-semibold mb-3">Contribution Split</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={2}
                      >
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          color: "var(--popover-foreground)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Table + actions */}
            <section className="card-surface p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h3 className="font-semibold">Symbol Breakdown</h3>
                <div className="flex flex-wrap gap-2">
                  <ActionBtn onClick={copyTable} icon={<Copy className="w-4 h-4" />}>
                    Copy
                  </ActionBtn>
                  <ActionBtn onClick={downloadCSV} icon={<Download className="w-4 h-4" />}>
                    CSV
                  </ActionBtn>
                  <ActionBtn onClick={downloadExcel} icon={<FileSpreadsheet className="w-4 h-4" />}>
                    Excel
                  </ActionBtn>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-muted-foreground">
                      <Th className="text-left">Symbol</Th>
                      <Th>Total Lots</Th>
                      <Th>Positions</Th>
                      <Th>Avg Lot</Th>
                      <Th>% Contribution</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={r.symbol}
                        className={i % 2 ? "bg-card" : "bg-background"}
                      >
                        <td className="px-4 py-2.5 font-medium">{r.symbol}</td>
                        <td className="px-4 py-2.5 text-center tabular-nums">{r.volume}</td>
                        <td className="px-4 py-2.5 text-center tabular-nums">{r.trades}</td>
                        <td className="px-4 py-2.5 text-center tabular-nums">{r.avg}</td>
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(r.percent, 100)}%` }}
                              />
                            </div>
                            <span className="tabular-nums text-xs text-muted-foreground w-12 text-right">
                              {r.percent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center ${className}`}
    >
      {children}
    </th>
  );
}

function ActionBtn({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3.5 py-2 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
    >
      {icon}
      {children}
    </button>
  );
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
