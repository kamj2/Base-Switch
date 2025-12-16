import { useState, useMemo } from "react";
import { FiCopy, FiCheck, FiRepeat } from "react-icons/fi";

type Base = "bin" | "dec" | "hex" | "oct";
const baseMap: Record<Base, number> = { bin: 2, dec: 10, hex: 16, oct: 8 };
const baseName: Record<Base, string> = {
  bin: "Binary",
  dec: "Decimal",
  hex: "Hexadecimal",
  oct: "Octal",
};

function isValidForBase(value: string, base: Base): boolean {
  if (value === "") return true;
  const radix = baseMap[base];
  return [...value].every((c) => {
    const code = c.toUpperCase().charCodeAt(0);
    const digit = c >= "0" && c <= "9" ? parseInt(c, 10) : 10 + code - 65;
    return digit < radix;
  });
}

function convert(value: string, from: Base, to: Base): string {
  const dec = parseInt(value, baseMap[from]);
  if (isNaN(dec)) throw new Error("Invalid number");
  const res = dec.toString(baseMap[to]);
  return to === "hex" ? res.toUpperCase() : res;
}

export default function BaseConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Base>("dec");
  const [to, setTo] = useState<Base>("hex");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [rotated, setRotated] = useState(false);

  const valid = useMemo(() => isValidForBase(value, from), [value, from]);
  const decimalPreview = useMemo(() => {
    if (!value || !valid) return null;
    return parseInt(value, baseMap[from]);
  }, [value, valid, from]);

  const handleConvert = () => {
    if (!value) return;
    try {
      setResult(convert(value, from, to));
    } catch {
      setResult("Error");
    }
  };

  const swapBases = () => {
    setFrom(to);
    setTo(from);
    setValue(result);
    setResult(value);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-100 p-8 space-y-5">
        <h1 className="text-2xl font-semibold text-blue-700 text-center">
          Base Converter
        </h1>

        <label className="block text-sm font-medium text-blue-600">
          Number
        </label>
        <div className="relative">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${baseName[from].toLowerCase()} value`}
            className={`w-full pl-4 pr-10 py-2 rounded-lg border bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              valid ? "border-blue-200" : "border-red-400"
            }`}
          />
          <span className="absolute right-3 top-2 text-xs text-blue-500">
            {from.toUpperCase()}
          </span>
        </div>

        {decimalPreview !== null && (
          <p className="text-xs text-blue-500">
            Decimal: <span className="font-semibold">{decimalPreview}</span>
          </p>
        )}

        {/* Selectors + Swap */}
        <div className="flex items-center gap-3">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as Base)}
            className="flex-1 p-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {(["bin", "dec", "hex", "oct"] as Base[]).map((b) => (
              <option key={b} value={b}>
                {baseName[b]}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              swapBases();
              setRotated(!rotated);
            }}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
            title="Swap bases"
          >
            <FiRepeat
              style={{
                transform: rotated ? "rotate(180deg)" : "",
                transition: "transform 0.3s ease",
              }}
            />
          </button>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value as Base)}
            className="flex-1 p-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {(["bin", "dec", "hex", "oct"] as Base[]).map((b) => (
              <option key={b} value={b}>
                {baseName[b]}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={!value}
          className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Convert
        </button>

        {result && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-blue-700 font-medium">Result</span>
              <button
                onClick={copyResult}
                className="text-sm flex items-center gap-2 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
              >
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-lg font-semibold text-blue-800 break-all">
              {result}
            </p>
            <p className="text-xs text-blue-500">{baseName[to]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
