"use client";

import { Loader2 } from "@/lib/remix-icons";

const LoadingSpinner = () => (
  <Loader2
    size={"20"}
    className="text-primary animate-spin dark:text-blue-200"
  />
);

export default LoadingSpinner;
