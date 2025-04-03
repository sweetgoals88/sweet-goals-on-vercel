// Deletes the account of a user (either an admin or customer); only allowed
// for admins. When their accounts are deleted, regular users' prototypes are
// marked as unactive and their API key and activation code are eliminated 
// from the database. When admins are deleted, the admins they invited are
// transferred to the admin who deleted the original admin (i. e., if admin A
// invited admin B and C, and admin D deletes A's account, then B and C are 
// transferred to D). Admins can delete any customer, but if they want to 
// delete an admin, they must be the one who invited them.