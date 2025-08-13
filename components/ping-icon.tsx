type PingProps = {
  color: string;
};

export default function Ping({ color }: PingProps) {
  return (
    <span>
      <span className={`${color} flex h-2.5 w-2.5 rounded-full`}></span>
    </span>
  );
}
