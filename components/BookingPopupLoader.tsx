"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OPEN_BOOKING_EVENT } from "@/lib/events";

// The popup form is not needed for the first paint. Splitting it into its own
// chunk keeps its router/validation code out of the critical JS payload; it is
// fetched once the page settles, or immediately if a CTA is clicked sooner.
const BookingPopup = dynamic(() => import("@/components/BookingPopup"), {
  ssr: false,
});

export default function BookingPopupLoader() {
  const [mounted, setMounted] = useState(false);
  const openRequested = useRef(false);

  useEffect(() => {
    if (mounted) return;
    const request = () => {
      openRequested.current = true;
      setMounted(true);
    };
    window.addEventListener(OPEN_BOOKING_EVENT, request);

    let idle = 0;
    let timer = 0;
    const load = () => setMounted(true);
    const ric = window.requestIdleCallback as
      | ((cb: IdleRequestCallback, opts?: IdleRequestOptions) => number)
      | undefined;
    if (typeof ric === "function") {
      idle = ric.call(window, load, { timeout: 2500 });
    } else {
      timer = window.setTimeout(load, 1200);
    }

    return () => {
      window.removeEventListener(OPEN_BOOKING_EVENT, request);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [mounted]);

  // Child effects run first, so the popup's own listener is ready by now.
  useEffect(() => {
    if (!mounted || !openRequested.current) return;
    openRequested.current = false;
    window.dispatchEvent(new CustomEvent(OPEN_BOOKING_EVENT));
  }, [mounted]);

  return mounted ? <BookingPopup /> : null;
}
