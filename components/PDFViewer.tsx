'use client';
import { Loader2 } from 'lucide-react';
import React, { use, useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type Props = {
    pdf_url: string
}

const PDFViewer = ({pdf_url}: Props) => {
  const [numPages, setNumPages] = useState<number>(-1);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    if (numPages > -1) setLoading(false)
  }, [numPages]);

  useEffect(() => {
    const updatePageWidth = () => {
      if (pdfContainerRef && pdfContainerRef.current) {
        setPageDimensions({
          width: pdfContainerRef.current.clientWidth,
          height: pdfContainerRef.current.clientHeight,
        });
      }
    };
    // Update page width on initial mount and when window resizes
    window.addEventListener('resize', updatePageWidth);
    updatePageWidth();

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages!; i++) {
      pages.push(
        <div id={`page_${i}`}><Page key={i} pageNumber={i} width={pageDimensions.width} /></div>
      );
    }
    return pages;
  };

  return (
    <div id="pdf-viewer-container" ref={pdfContainerRef}>
          <Document file={pdf_url} onLoad={() => setLoading(true)} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages && renderPages()}
          </Document>
          {loading && <Loader2 className='w-4 h-4 animate-spin inline' />}
          <p>
      </p>  
    </div>
  )
}

export default PDFViewer;