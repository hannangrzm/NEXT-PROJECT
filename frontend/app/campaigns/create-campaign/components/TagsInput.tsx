"use client";
import { useState } from "react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  error?: string;
}

export default function TagsInput({ tags, setTags, error }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (!inputValue.trim() || tags.length >= 5) return;

    setTags([...tags, inputValue.trim()]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index)); 
  };

  return (
    <div className="mt-7">
      <label className="block my-2 text-gray-600">Tags</label>

      <div className="flex gap-5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-500 p-2 rounded-lg w-full"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!inputValue || tags.length >= 5}
          className="border border-gray-500 rounded-2xl w-24"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex gap-1 p-1 border rounded-2xl w-28 justify-center border-gray-500"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-red-500"
            >
              x
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
