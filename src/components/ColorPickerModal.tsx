"use client";

import { useState, useEffect } from "react";

interface ColorPickerModalProps {
  currentColor: string;
  onClose: () => void;
  onSave: (newColor: string) => void;
}

export default function ColorPickerModal({
  currentColor,
  onClose,
  onSave,
}: ColorPickerModalProps) {
  const [color, setColor] = useState<string>(currentColor);

  // Ensure `color` is synced on open
  useEffect(() => {
    if (currentColor) setColor(currentColor);
  }, [currentColor]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">🎨 Pick a Color</h2>
        <input
          type="color"
          value={color} // ✅ always defined
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-12 mb-6 cursor-pointer"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(color)}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
