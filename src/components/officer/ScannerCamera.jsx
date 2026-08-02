export default function ScannerCamera({ elementId }) {
  return (
    <div
      id={elementId}
      className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 sm:aspect-video sm:rounded-3xl"
    />
  );
}
