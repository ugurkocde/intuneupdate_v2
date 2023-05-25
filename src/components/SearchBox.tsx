// components/SearchBox.tsx

import React from "react";

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (newSearchTerm: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <input
      type="search"
      placeholder="Search..."
      defaultValue={searchTerm}
      onChange={handleSearchChange}
    />
  );
};

export default SearchBox;
