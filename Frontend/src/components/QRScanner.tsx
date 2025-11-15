import React, { useState } from "react";
import { Scan, Camera, Upload } from "lucide-react";
import QrScanner from "qr-scanner";

export default function QRScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Process QR payload
  const processPayload = async (payload: string) => {
    try {
      const parsed = JSON.parse(payload); // { material, quantity }

      // Send to backend to reduce inventory
      const res = await fetch("http://localhost:5001/api/materials/reduce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ Error: ${data.message}`);
        return;
      }

      setMessage(`✅ Reduced ${parsed.quantity} from ${parsed.material}`);
      setScanResult(data.updatedMaterial);
    } catch (err) {
      setMessage(`Invalid QR payload ${err}`);
    }
  };

  // ✅ Camera simulation (for testing)
  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const fakeQR = JSON.stringify({ material: "Cement", quantity: 5 });
      processPayload(fakeQR);
      setIsScanning(false);
    }, 2000);
  };

  // ✅ Decode uploaded QR image
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await QrScanner.scanImage(file);
        processPayload(text);
      } catch (err) {
        setMessage("❌ Could not read QR image");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QR Scanner</h1>
        <p className="text-gray-600 mt-2">
          Scan QR codes generated from materials to auto-reduce inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner UI */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Scan QR Code
          </h2>

          <div className="space-y-6">
            {/* Camera Simulation */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600">Scanning QR code...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600 mb-4">
                      Position QR code in front of camera
                    </p>
                    <button
                      onClick={simulateScan}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Scan className="w-5 h-5" />
                      <span>Start Camera Scan (Simulated)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Or upload QR code image
              </p>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload QR code image
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Scan Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Results</h2>

          {message && (
            <div
              className={`p-4 mb-4 rounded ${
                message.startsWith("✅")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {scanResult ? (
            <div className="space-y-3">
              <p>
                <strong>Material:</strong> {scanResult.name}
              </p>
              <p>
                <strong>Remaining Quantity:</strong> {scanResult.quantity}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Scan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>No QR code scanned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
