"use client";

interface FormInputProps {
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  error,
}: FormInputProps) {
    
  return (
    <div className="">
      <label className="block my-1 text-gray-600">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-500 p-2 rounded-lg w-full"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
