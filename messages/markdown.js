function includeUsername(ctx, text) {
    const { id: userId } = ctx.from;
    const userFullName = getFullName(ctx);

    const userMention = `[${userFullName}](tg://user?id=${userId})`;
    return String(text).replace(/{username}/g, userMention).replace(/\\{username\\}/g, userMention);
}

function getFullName(ctx) {
    const { first_name: firstName, last_name: lastName = "" } = ctx.from;

    let userFullName = firstName + (lastName ? " " + lastName : "");
    userFullName = userFullName.replace(/\[/g, '');
    userFullName = userFullName.replace(/\]/g, '');

    return userFullName.trim();
}

export {
    includeUsername,
};