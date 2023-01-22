const fetch = require('node-fetch');
require('dotenv').config();
/**
 * Register the metadata to be stored by Discord. This should be a one time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${process.env.clientId}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7
const body = [
    {
        key: 'contribution',
        name: 'Contributor',
        description: 'Is the user a contributor to mr sweet?',
        type: 7,
    },
    {
        key: 'atjemobile',
        name: 'Seen Atjemobile',
        description: 'Has the user seen ATJEMobile?',
        type: 7,
    },
    {
        key: 'premium',
        name: 'Premium User',
        description: 'Has the user purchased Mr Sweet premium?',
        type: 7,
    }
];
(async () => {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    console.log(response);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        //throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
        const data = await response.text();
        console.log(data);
    }
})();