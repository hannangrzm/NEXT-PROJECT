"use client";
import { useState, useEffect } from "react";

interface MilestoneInputProps {
  index: number;
  initialValue: string;
  onUpdate: (value: string) => void;
  error?: string;
}

export default function MilestoneInput({
  index,
  initialValue,
  onUpdate,
  error,
}: MilestoneInputProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  // Whenever user types, notify parent after small delay
  useEffect(() => {
    onUpdate(localValue);
  }, [localValue]);

  return (
    <div className="">
      <label className="block my-2 text-gray-600">Milestone {index + 1}</label>
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="border border-gray-500 p-2 rounded-lg w-full"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
