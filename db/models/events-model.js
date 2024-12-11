const db = require(`../connection`);

exports.fetchEvents = () => {
  return db.query(`SELECT * FROM events;`).then(({ rows }) => {
    return rows;
  });
};

exports.addEvent = (newEvent) => {
  const { event_name, image, venue, start_date, creator } = newEvent;

  if (
    typeof event_name !== "string" ||
    typeof image !== "string" ||
    typeof venue !== "string" ||
    typeof start_date !== "string" ||
    typeof creator !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      "INSERT INTO events (event_name, image, venue, start_date, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [event_name, image, venue, start_date, creator]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
