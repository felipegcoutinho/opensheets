import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div"> & {
  animate?: boolean;
};

function Skeleton({ className, animate = true, ...props }: Props) {
  return (
    <div
      role="presentation"
      aria-hidden
      data-slot="skeleton"
      data-animate={animate ? "true" : "false"}
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
