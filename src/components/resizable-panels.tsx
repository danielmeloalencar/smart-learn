import { useState, useEffect } from 'react'


import { ReactNode } from 'react';

export function ResizablePane({
  minSize,
  initialSize,
  maxSize,
  grow,
  isVertical,
  bgColor,
  children
}: {
  minSize: number ;
  initialSize: number;
  maxSize: number;
  grow?: boolean;
  isVertical: boolean;
  bgColor: string;
  children: ReactNode;
}) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);

  const dimension = isVertical ? "height" : "width";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const movement = isVertical ? e.movementY : e.movementX;
      let newSize = size + movement;

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [size, isResizing, minSize, maxSize, isVertical]);

  const handleMouseDown = () => setIsResizing(true);

  return (
    <div
      className={`relative ${bgColor} ${grow ? "grow" : ""}  `}
      style={{ [dimension]: `${size}px` }}
    >
      {children}
      {!grow && (
        <ResizableHandle
          isResizing={isResizing}
          isVertical={isVertical}
          handleMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
}

function ResizableHandle({ isResizing, isVertical, handleMouseDown }: { isResizing: boolean; isVertical: boolean; handleMouseDown: () => void }) {
  const positionHandleStyle = isVertical
    ? "h-1 left-0 right-0 bottom-0 cursor-row-resize"
    : "w-1 top-0 bottom-0 right-0 cursor-col-resize";

  return (
      <div
        className={`absolute ${positionHandleStyle} hover:bg-blue-600 ${isResizing ? "bg-blue-600" : "" }`}
        onMouseDown={handleMouseDown}
        onSelect={(e)=>{ e.preventDefault; e.stopPropagation; return;}}
        role="button"
        tabIndex={0}
        style={{ backgroundColor:`${isResizing ? "cyan" : "" }`,userSelect: 'none', position:'absolute', width:2}}
      />
    );
}
