let users = [
	{
		id: 1,
		username: 'bob',
		password: '12345',
		nickname: 'Bob',
	},
];

export async function create(user) {
	const created = { ...user, id: Date.now().toString() };
	users.push(created);
	return created;
}
export async function findByUsername(username) {
	return users.find((user) => user.username === username);
}

export async function findByNickname(nickname) {
	return users.find((user) => user.nickname === nickname);
}

export async function findById(id) {
	return users.find((user) => user.id === id);
}

export async function findIdx(id) {
	return users.findIndex((user) => user.id === id);
}

export async function removeUser(idx) {
	return users.splice(idx, 1);
}
