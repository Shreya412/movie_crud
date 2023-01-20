const getUsers = "SELECT * FROM users";
const checkEmailExists = "SELECT s.* FROM users s WHERE s.email = $1";
const addUser = "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id";
const getUserById = "SELECT * FROM users WHERE id = $1";
const deleteUser = "DELETE FROM users WHERE id = $1";
const updateUser = "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4";

module.exports = {
    getUsers,
    checkEmailExists,
    addUser,
    getUserById,
    deleteUser,
    updateUser,
};