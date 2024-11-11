function Ping({ color }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`${color} absolute inline-flex h-full w-full rounded opacity-75`}
      ></span>
      <span className={`${color} relative inline-flex h-3 w-3 rounded`}></span>
    </span>
  );
}

export default Ping;
