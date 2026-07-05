import { useState } from "react";

const EXTENSIONS = ["svg", "png", "webp", "jpg"];

export default function Logo({ universe, fallbackText = "CogVerse" }) {
  const [extIndex, setExtIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  if (!universe || exhausted) {
    return <h1 className="wordmark">{fallbackText}</h1>;
  }

  const handleError = () => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1);
    } else {
      setExhausted(true);
    }
  };

  const src = `/logos/${universe}.${EXTENSIONS[extIndex]}`;

  return (
    <img
      key={src}
      className="universe-logo"
      src={src}
      alt={`${universe.replace(/_/g, " ")} logo`}
      onError={handleError}
    />
  );
}
