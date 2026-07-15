import { useCallback } from "react";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { set, unset, type ObjectInputProps } from "sanity";
import { INDIA_DOTS, INDIA_MAP_W, INDIA_MAP_H } from "../../lib/india-dots";
import { projectLatLng, unprojectXY } from "../../lib/india-projection";

// Custom geopoint input: shows the same dotted India used on the website and
// lets the editor click to drop the pin. What you click here is exactly where
// the pin renders on the site — same projection, same dots.

type Geopoint = { _type?: "geopoint"; lat?: number; lng?: number };

export function IndiaGeopointInput(props: ObjectInputProps) {
  const { value, onChange, readOnly } = props;
  const point = value as Geopoint | undefined;
  const hasPoint =
    typeof point?.lat === "number" && typeof point?.lng === "number";
  const pin = hasPoint ? projectLatLng(point!.lat!, point!.lng!) : null;

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (readOnly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * INDIA_MAP_W;
      const y = ((e.clientY - rect.top) / rect.height) * INDIA_MAP_H;
      const { lat, lng } = unprojectXY(x, y);
      onChange(
        set({
          _type: "geopoint",
          lat: Math.round(lat * 1e4) / 1e4,
          lng: Math.round(lng * 1e4) / 1e4,
        }),
      );
    },
    [onChange, readOnly],
  );

  return (
    <Stack space={3}>
      <Card border radius={2} padding={2} tone="transparent">
        <svg
          viewBox={`0 0 ${INDIA_MAP_W} ${INDIA_MAP_H}`}
          style={{
            display: "block",
            width: "100%",
            maxWidth: 420,
            margin: "0 auto",
            cursor: readOnly ? "default" : "crosshair",
          }}
          onClick={handleClick}
          role="img"
          aria-label="Click on the map to set where this video was filmed"
        >
          {INDIA_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.55} fill="#8a8580" />
          ))}
          {pin && (
            <>
              <circle
                cx={pin.x}
                cy={pin.y}
                r={2.6}
                fill="#f2551f"
                opacity={0.35}
              />
              <circle cx={pin.x} cy={pin.y} r={1.5} fill="#f2551f" />
              <circle cx={pin.x} cy={pin.y} r={0.55} fill="#fff" />
            </>
          )}
        </svg>
      </Card>
      <Flex align="center" justify="space-between" gap={3}>
        <Text size={1} muted>
          {hasPoint
            ? `Lat ${point!.lat!.toFixed(4)}, Lng ${point!.lng!.toFixed(4)}`
            : "Click the map to place the pin."}
        </Text>
        {hasPoint && !readOnly && (
          <Button
            text="Clear"
            mode="ghost"
            tone="critical"
            fontSize={1}
            padding={2}
            onClick={() => onChange(unset())}
          />
        )}
      </Flex>
    </Stack>
  );
}
