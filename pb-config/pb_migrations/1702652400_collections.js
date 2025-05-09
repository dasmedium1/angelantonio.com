/// <reference path="../../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "timeline_events",
      name: "timeline_events",
      type: "base",
      system: false,
      schema: [
        {
          id: "title_field",
          name: "title",
          type: "text",
          required: true,
        },
        {
          id: "date_field",
          name: "event_date",
          type: "date",
          required: true,
        },
        {
          id: "desc_field",
          name: "description",
          type: "text",
          required: true,
        },
        {
          id: "img_field",
          name: "image",
          type: "text",
          required: true,
        },
      ],
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      options: {},
    });

    return Dao(db).saveCollection(collection);
  },
  (db) => {
    return Dao(db).deleteCollection("timeline_events");
  }
);
