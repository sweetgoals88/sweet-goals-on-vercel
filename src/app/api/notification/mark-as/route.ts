// Marks a notification as "seen" or "not-seen". Only those two exact strings
// are allowed as values for the "status" parameter. When marked as "seen",
// the notification's seen_at field is set to the current date and time.
// When marked as "not-seen", the notification's seen_at field is deleted.
// This endpoint requires the notification's id, which must correspond to
// the user's notification list. The user must be authenticated