"use client";

import FinalLayout from "@/components/shared/FinalLayout";
import Providers from "./Providers";

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <FinalLayout>{children}</FinalLayout>
    </Providers>
  );
}
