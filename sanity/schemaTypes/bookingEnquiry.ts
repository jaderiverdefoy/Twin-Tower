import { defineField, defineType } from "sanity";

/**
 * Booking enquiries arrive through /contact and the homepage Reserve popup.
 * They are always saved here first, so a request is never lost even if the
 * email webhook is misconfigured. The team can see and action them in Studio.
 */
export const bookingEnquiry = defineType({
  name: "bookingEnquiry",
  title: "Booking enquiry",
  type: "document",
  groups: [
    { name: "guest", title: "Guest", default: true },
    { name: "stay", title: "Stay" },
    { name: "status", title: "Status" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "guest",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "guest",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "guest",
    }),
    defineField({
      name: "room",
      title: "Room",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "rate",
      title: "Nightly rate",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "mealPlan",
      title: "Meal plan",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "adults",
      title: "Adults",
      type: "number",
      group: "stay",
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "number",
      group: "stay",
    }),
    defineField({
      name: "checkin",
      title: "Check-in",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "checkout",
      title: "Check-out",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "guests",
      title: "Guests",
      type: "string",
      group: "stay",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
      group: "stay",
    }),
    defineField({
      name: "source",
      title: "Form",
      type: "string",
      group: "status",
      description: "contact = /contact form, popup = homepage Reserve popup.",
      options: {
        list: [
          { title: "Contact form", value: "contact" },
          { title: "Reserve popup", value: "popup" },
        ],
      },
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      group: "status",
    }),
    defineField({
      name: "emailed",
      title: "Emailed to the team",
      type: "boolean",
      group: "status",
      description: "False means the Google Apps Script was not reachable — reply from here.",
      initialValue: false,
    }),
    defineField({
      name: "handled",
      title: "Handled",
      type: "boolean",
      group: "status",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "room",
    },
  },
});
