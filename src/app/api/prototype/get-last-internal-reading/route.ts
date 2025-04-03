// Gets the last internal reading measured by the prototype of the user. It
// uses the date of the last reading received by the caller to get the next
// reading to return. If the date is not passed, it returns the last reading.
// If the date is passed, it returns the next reading after that date. Only 
// customers can use this endpoint and they must be logged in