const {Api, TelegramClient} = require("telegram");
const input = require("input")
const creds = require("./config.js");
//Provide here phone number or username
const usernameOrNumber = "number";



(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(creds.config.stringSession, creds.config.apiId, creds.config.apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => creds.config.phoneNumber,
        password: async () => creds.config.password,
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    client.session.save(); // Save this string to avoid logging in again


    (async function run() {
        const client = new TelegramClient(creds.config.stringSession, creds.config.apiId, creds.config.apiHash, {
            connectionRetries: 5,
        });
        await client.connect(); // This assumes you have already authenticated with .start()
        client.useWSS = true
        client._floodSleepThreshold = 0
        const result = await client.getEntity(usernameOrNumber);
        // console.log(result)
        client.addEventHandler(async (event) => {
            if (result.id.value === event.userId.value) {
                console.log({user: result.phone, username: result.firstName}, event.status)
            }
        })

    })().catch((e) => {
        console.log(e.message)
    })

})();

