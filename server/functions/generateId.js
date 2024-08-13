function generateId(existingUsersCount = 0, prefix) {
    const nextIdNumber = existingUsersCount + 1;
    const formattedNumber = nextIdNumber.toString().padStart(3, '0');
    return `${prefix}${formattedNumber}`;
}

module.exports = generateId;