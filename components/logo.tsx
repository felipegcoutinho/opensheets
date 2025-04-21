function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="40"
      viewBox="0 0 140 40"
      fill="none"
    >
      <text
        x="0"
        y="28"
        fontFamily="sans-serif"
        fontWeight="400"
        fontSize="24"
        className="dark:fill-primary fill-black"
      >
        open
      </text>
      <text
        x="54"
        y="28"
        fontFamily="sans-serif"
        fontWeight="600"
        fontSize="24"
        className="dark:fill-primary fill-black"
      >
        sheets
      </text>
      <circle cx="134" cy="26" r="2" className="fill-primary" />
    </svg>
  );
}

export default Logo;
