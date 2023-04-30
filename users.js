// store our users in an array:
const users = [];

function clean(s) {
    return s.trim().toLowerCase();
}

// add user to room:
const addUser = (id, name, room) => {
    // first make sure username isn't taken:
    const existingUser = users.find(user => clean(user.name) === clean(name));

    // error checking:
    if(existingUser) return {error: "Username already exists"};
    if(!name || !room) return {error: "Username and room are required"}

    const user = {id, name, room}
    users.push(user)
    return {user}
}

// get user by id:
const getUser = id => {
    return users.find(user => user.id === id);
}

// get users for room:
const getUsers = (room) => {
    return users.filter(user => user.room === room);
}

const deleteUser = (id) => {
    users = users.filter(user => user.id !== id);
}

module.exports = { addUser, getUser, deleteUser, getUsers }