import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown>[];
}

/** Escapes `<` so the payload can never close the script tag early. */
const serialize = (data: Record<string, unknown>) => JSON.stringify(data).replace(/</g, "\\u003c");

/** One `<script type="application/ld+json">` per object, placed in the document head. */
export const JsonLd = ({ data }: JsonLdProps) => (
  <Helmet>
    {data.map((entry, index) => (
      <script key={index} type="application/ld+json">
        {serialize(entry)}
      </script>
    ))}
  </Helmet>
);
