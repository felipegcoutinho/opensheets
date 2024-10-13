function Ping({ color }) {
  return (
    <div className="relative flex h-2 w-2">
      <span
        className={`${color} absolute inline-flex h-full w-full rounded-full opacity-75`}
      ></span>
      <span
        className={`${color} relative inline-flex h-2 w-2 rounded-full`}
      ></span>
    </div>
  );
}

export default Ping;
