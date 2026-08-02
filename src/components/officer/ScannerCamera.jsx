export default function ScannerCamera({ elementId }) {
  return (
    <div className="relative isolate aspect-square w-full min-h-[280px] overflow-hidden rounded-3xl border border-gray-200 sm:aspect-video [&_video]:!absolute [&_video]:!inset-0 [&_video]:!h-full [&_video]:!w-full [&_video]:!object-cover [&_canvas]:!absolute [&_canvas]:!inset-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!object-cover">
      <div id={elementId} className="relative z-0 h-full w-full" />

      {/* Custom square scan frame, forced onto its own stacking layer with
          z-10 — live camera video streams can render in a compositor
          layer that ignores normal DOM sibling order, so without an
          explicit z-index this overlay can end up hidden behind the
          video even though it comes after it in the markup. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-[250px] w-[250px] max-w-[70%] rounded-2xl border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
      </div>
    </div>
  );
}