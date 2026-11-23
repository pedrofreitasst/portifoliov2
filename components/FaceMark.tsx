/** Renders the supplied inline brand mark. */
export default function FaceMark({ className = '', src }: { className?: string; src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} aria-hidden />
  );
}
