/**
 * Browser events shared between the marketing sections and the booking popup.
 *
 * Kept in its own tiny module so sections can dispatch "open booking" without
 * pulling the whole popup (form, router, validation) into their JS chunk.
 */
export const OPEN_BOOKING_EVENT = "tt:open-booking";
