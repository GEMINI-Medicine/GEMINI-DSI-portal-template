/** @jsxRuntime classic */
/** @jsx jsx */
import { useState, ReactNode } from "react";
import { jsx, css } from "@keystone-ui/core";

const tooltipStyle = css({
  display: "inline-flex",
  position: "relative",
  alignItems: "center",
  cursor: "pointer",

  // Absolute positioning
  "& .Tooltip-Tip": {
    position: "absolute",
    borderRadius: 4,
    left: "50%",
    transform: "translateX(-50%)",
    padding: 6,
    color: "white",
    background: "black",
    fontSize: 14,
    lineHeight: 1,
    zIndex: 100,
    whiteSpace: "nowrap",
  },
  // /* CSS border triangles */
  "& .Tooltip-Tip::before": {
    content: '" "',
    left: "50%",
    border: "solid transparent",
    height: 0,
    width: 0,
    position: "absolute",
    pointerEvents: "none",
    borderWidth: 6,
    marginLeft: "calc(6px * -1)",
  },
  // /* Absolute positioning */
  ".Tooltip-Tip.top": {
    top: "calc(30px * -1)",
  },
  // /* CSS border triangles */
  ".Tooltip-Tip.top::before": {
    top: "100%",
    borderTopColor: "black",
  },

  // /* Absolute positioning */
  ".Tooltip-Tip.right": {
    left: "calc(100% + 30px)",
    top: "50%",
    transform: "translateX(0) translateY(-50%)",
  },
  // /* CSS border triangles */
  ".Tooltip-Tip.right::before": {
    left: "calc(6px * -1)",
    top: "50%",
    transform: "translateX(0) translateY(-50%)",
    borderRightColor: "black",
  },

  // /* Absolute positioning */
  ".Tooltip-Tip.bottom": {
    bottom: "calc(30px * -1)",
  },
  /* CSS border triangles */
  ".Tooltip-Tip.bottom::before": {
    bottom: "100%",
    borderBottomColor: "black",
  },

  // /* Absolute positioning */
  ".Tooltip-Tip.left": {
    left: "auto",
    right: "calc(100% + 30px)",
    top: "50%",
    transform: "translateX(0) translateY(-50%)",
  },
  // /* CSS border triangles */
  ".Tooltip-Tip.left::before": {
    left: "auto",
    right: "calc(6px * -2)",
    top: "50%",
    transform: "translateX(0) translateY(-50%)",
    borderLeftColor: "black",
  },
});

type tooltipProps = {
  delay?: number;
  direction?: string;
  content: string;
  children: ReactNode;
};

export default function Tooltip({
  delay,
  direction,
  content,
  children,
}: tooltipProps) {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      css={tooltipStyle}
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {children}
      {active && (
        <div className={`Tooltip-Tip ${direction || "top"}`}>
          {/* Content */}
          {content}
        </div>
      )}
    </div>
  );
}
