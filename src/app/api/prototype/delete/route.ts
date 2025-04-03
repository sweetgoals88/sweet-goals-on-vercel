// Delete the prototype with the id given for the logged in user. Only for customers (not admins).
// When deleted, the prototype is not deleted from the database, but only unlinked from the 
// user's account so that they can't access it anymore; all readings are deleted too, as well
// as panel specifications and user customization

export async function POST() {
    // 
    // const body = await request.json();

}
