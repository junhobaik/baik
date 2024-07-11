import React from 'react';

interface ArchiveFooterProps {}

const year = new Date().getFullYear();

const ArchiveFooter = (props: ArchiveFooterProps) => {
  return (
    <footer className="text-center text-sm text-gray-700 mt-auto pt-4 pb-2 px-4">
      <p className="">© {year} Junho Baik. All rights reserved.</p>
    </footer>
  );
};

export default ArchiveFooter;
