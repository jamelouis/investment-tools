import React from 'react';
import html2canvas from 'html2canvas';
import { Button } from "antd";

const PageToImageExporter = () => {
  const exportPageToImage = () => {
    html2canvas(document.body).then(canvas => {
      // Create a temporary link element
      const link = document.createElement('a');
      
      // Convert the canvas to a data URL
      link.href = canvas.toDataURL('image/png');
      
      // Set the filename for the download
      link.download = 'page-screenshot.png';
      
      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the link from the body
      document.body.removeChild(link);
    });
  };

  return (
      <Button 
        onClick={exportPageToImage}
      >
        Export Page as Image
      </Button>
  );
};

export default PageToImageExporter;