import { Fragment } from "react";
import { Link } from "react-router-dom";
import { RICH_LINK_ONE, RICH_LINK_SPLIT } from "../../utils/richText";

interface RichTextProps {
  text: string;
}

/** Renders locale copy, turning `[label](/path)` into internal router links. */
export const RichText = ({ text }: RichTextProps) => (
  <>
    {text.split(RICH_LINK_SPLIT).map((part, index) => {
      const match = RICH_LINK_ONE.exec(part);
      if (!match) return <Fragment key={index}>{part}</Fragment>;
      return (
        <Link key={index} to={match[2]} className="text-link">
          {match[1]}
        </Link>
      );
    })}
  </>
);
