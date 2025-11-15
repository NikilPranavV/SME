import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";

type Payload = {
  material: string;
  quantity: number;
};

export default function QRGenerator() {
  const [materials, setMaterials] = useState<string[]>([]); // ✅ from backend
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [generatedQR, setGeneratedQR] = useState<string>("");
  const [payloadJson, setPayloadJson] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  // ✅ Fetch raw materials from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/materials")
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item: any) => item.name); // adjust if API field differs
        setMaterials(names);
      })
      .catch((err) => console.error("Error fetching materials:", err));
  }, []);

  const generateQR = () => {
    if (!material || !quantity) return;
    setGenerating(true);

    const payload: Payload = {
      material,
      quantity: Number(quantity),
    };

    const json = JSON.stringify(payload);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      json
    )}`;

    setPayloadJson(json);
    setGeneratedQR(qrUrl);
    setGenerating(false);
    setCopied(false);
  };

  const copyPayload = async () => {
    if (!payloadJson) return;
    await navigator.clipboard.writeText(payloadJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = async () => {
    if (!generatedQR) return;
    try {
      const res = await fetch(generatedQR);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${material || "code"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-gray-600 mt-1">
          Generate a QR containing <strong>raw material + quantity</strong>.
          Scanner reads payload and your existing scanner logic reduces inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Create QR</h2>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raw Material
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-lg"
          >
            <option value="">Select material</option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full mb-4 px-3 py-2 border rounded-lg"
            placeholder="Enter quantity (e.g. 10)"
          />

          <button
            onClick={generateQR}
            disabled={!material || !quantity || generating}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <QrCode className="w-4 h-4" />
            <span>{generating ? "Generating..." : "Generate QR"}</span>
          </button>
        </div>

        {/* QR Display */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Generated QR</h2>

          {generatedQR ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center">
                <img
                  src={generatedQR}
                  alt="QR code"
                  className="max-w-full h-auto mb-4"
                />

                <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 w-full overflow-auto">
                  {payloadJson}
                </pre>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={copyPayload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? "Copied payload" : "Copy payload"}</span>
                </button>

                <button
                  onClick={downloadQR}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <QrCode className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <p>
                Select material & quantity, then click <strong>Generate QR</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
