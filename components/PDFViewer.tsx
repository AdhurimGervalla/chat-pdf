'use client';
import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type Props = {
    pdf_url: string
}

const PDFViewer = ({pdf_url}: Props) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState(500);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    // Function to update the width
    const updatePageWidth = () => {
      setPageWidth(window.innerWidth); // Or the width of a specific container if necessary
    };

    // Update page width on initial mount and when window resizes
    window.addEventListener('resize', updatePageWidth);
    updatePageWidth();

    // Cleanup
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages!; i++) {
      pages.push(
        <Page key={i} pageNumber={i} width={1000} />
      );
    }
    return pages;
  };

  return (
    <div>
          <Document file={pdf_url} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages && renderPages()}
          </Document>
          <p>
      </p>  
    </div>
  )
}

export default PDFViewer;