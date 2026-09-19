/** Footer face mark from public/face.svg */
export default function FaceMark({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/face.svg" alt="" className={className} aria-hidden />
  );
}
