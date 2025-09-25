"use client";

import { useEffect } from "react";

function BackgroundWrapper({ children }) {
  useEffect(() => {
    // Create comprehensive CSS to make background visible
    const styleId = 'background-visibility-fix';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* Apply background to body */
      body {
        background-color: #dbeafe !important;
        background-image: url('/curve-lines.png') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
        min-height: 100vh !important;
      }
      
      /* Make major containers transparent */
      #__next,
      #root,
      .app,
      main,
      [data-reactroot],
      body > div:first-child,
      body > div:first-child > *:first-child {
        background-color: transparent !important;
        background-image: none !important;
        background: transparent !important;
      }
      
      /* Target your specific app structure */
      body > div,
      body > div > div {
        background-color: transparent !important;
      }
      
      /* Keep specific UI elements with their backgrounds */
      .toast,
      .modal,
      .dropdown,
      .popover,
      .menu,
      .card,
      .button,
      .input,
      nav,
      header,
      aside,
      [role="dialog"],
      [role="menu"],
      [class*="bg-white"],
      [class*="bg-gray"],
      [class*="bg-blue"]:not([class*="bg-blue-50"]),
      [style*="background-color: rgb"],
      [style*="background-color: #"]:not([style*="transparent"]) {
        background-color: revert !important;
        background-image: revert !important;
        background: revert !important;
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) styleElement.remove();
    };
  }, []);

  return <>{children}</>;
}

export default BackgroundWrapper;