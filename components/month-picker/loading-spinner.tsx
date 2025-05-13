"use client";

import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <Loader2
    size={"20"}
    className="text-primary animate-spin dark:text-blue-200"
  />
);

export default LoadingSpinner;
