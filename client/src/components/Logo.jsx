const Logo = ({ dark = false }) => {
  return (
    <div className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="3" width="22" height="26" rx="2" fill="#8C3B3B" />
        <rect
          x="4"
          y="3"
          width="6"
          height="26"
          rx="2"
          fill={dark ? "#F6EFE3" : "#3B2C22"}
        />
        <line
          x1="14"
          y1="10"
          x2="22"
          y2="10"
          stroke="#F6EFE3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="15"
          x2="22"
          y2="15"
          stroke="#F6EFE3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="20"
          x2="19"
          y2="20"
          stroke="#F6EFE3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="font-display text-xl leading-none"
        style={{ color: dark ? "#F6EFE3" : "#3B2C22" }}
      >
        Avsar<span style={{ color: "#8C3B3B" }}>Diary</span>
      </span>
    </div>
  );
};

export default Logo;
