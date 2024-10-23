import React, { useState, ReactNode } from "react";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

interface FullScreenWrapperProps {
  children: ReactNode;
  className?: string;
  isRotate?: boolean;
}

const FullScreenWrapper: React.FC<FullScreenWrapperProps> = ({
  children,
  className = "",
  isRotate 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleFullScreen}
        className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-all duration-300"
      >
        {isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </button>
      {isFullScreen ? (
        <div className={`fixed inset-0 z-50 bg-white overflow-auto `}>
          <div className="p-10 m-auto">
            <button
              onClick={toggleFullScreen}
              className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-all duration-300"
            >
              <FullscreenExitOutlined />
            </button>
            <div className={`${isRotate ? "rotate-90 " : ""}`}>
              <div className={`${isRotate ? "[width:90vh]" : ""}`}>
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default FullScreenWrapper;
