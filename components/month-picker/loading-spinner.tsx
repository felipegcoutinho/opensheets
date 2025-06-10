"use client";

import { RiLoader2Line } from "@remixicon/react";

const LoadingSpinner = () => (
  <RiLoader2Line
    size={"20"}
    className="text-primary animate-spin dark:text-blue-200"
  />
);

export default LoadingSpinner;
