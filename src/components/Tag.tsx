import "./Tag.css";

interface TagProps {
  value: string;
  size?: "md" | "sm";
}

/** A facet value badge; colours come from the value (e.g. tag--atom). */
export default function Tag({ value, size = "md" }: TagProps) {
  return <span className={`tag tag--${value} ${size === "sm" ? "tag--sm" : ""}`}>{value}</span>;
}
