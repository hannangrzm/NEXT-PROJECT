"use client";

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function FormTextarea({ label, value, onChange, error }: FormTextareaProps) {
  return (
    <div className="mt-5">
      <label className="block text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-500 p-2 rounded-lg w-full"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
