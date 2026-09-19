'use client';

import Image from 'next/image';
import { useState } from 'react';

/** Thumbnail with gray fallback if the file is not in public/projects yet. */
export default function ProjectThumb({
  src,
  priority = false,
}: {
  src: string;
  priority?: boolean;
}) {
  const [ok, setOk] = useState(true);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e8e8e8] transition duration-300 group-hover:brightness-95 md:rounded-3xl">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#ececec] via-[#e0e0e0] to-[#d4d4d4]"
        aria-hidden
      />
      {ok && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover transition duration-300 group-hover:scale-[1.015]"
          priority={priority}
          onError={() => setOk(false)}
        />
      )}
    </div>
  );
}
