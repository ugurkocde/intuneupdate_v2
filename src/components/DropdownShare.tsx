import React, { useState, useEffect, useRef } from "react";

interface DropdownMenuProps {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}

function DropdownMenu({
  options,
  selectedOption,
  onOptionSelect,
}: DropdownMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const node = useRef(null);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative inline-block" ref={node}>
      <button
        className="rounded border border-gray-300 px-4 py-2 font-bold hover:border-gray-400"
        onClick={() => {
          console.log("Dropdown button clicked!");
          setDropdownOpen(!dropdownOpen);
        }}
      >
        {selectedOption}
      </button>
      {dropdownOpen && (
        <div
          className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option) => (
              <button
                key={option}
                className={`w-full items-center px-4 py-2 text-left text-sm ${
                  selectedOption === option
                    ? "bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  onOptionSelect(option);
                  setDropdownOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
