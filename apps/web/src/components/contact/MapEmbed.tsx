// FR-011: use only verified coordinates/pin, never an address inferred/geocoded client-side.
// UX spec: the map should be visually prominent only once verified.
export function MapEmbed({
  latitude,
  longitude,
  mapUrl,
  verified,
}: {
  latitude: number;
  longitude: number;
  mapUrl: string;
  verified: boolean;
}) {
  if (!verified) {
    return (
      <div className="border border-dashed border-outline-variant p-6 font-body-md text-body-md text-on-surface-variant">
        Our location map will appear here once verified.{" "}
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary-fixed-dim">
          View on Google Maps
        </a>
        .
      </div>
    );
  }

  const embedSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="overflow-hidden border border-outline-variant">
      <iframe
        title="ZENKRAFT Design Studios location"
        src={embedSrc}
        width="100%"
        height="360"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="p-3 text-right">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="font-body-md text-sm underline hover:text-secondary-fixed-dim">
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
