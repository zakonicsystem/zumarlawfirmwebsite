/**
 * JsonLd Component
 * Renders JSON-LD structured data as a script tag
 */

export default function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
