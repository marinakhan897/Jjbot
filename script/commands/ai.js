module.exports.config = {
	name: "ai",
	credits: "Opiar",
	version: '1.0.0',
	description: "talk with gemini 2.0 flash exp",
	prefix: false,
	premium: true,
	permission: 0,
	category: "without prefix",
	cooldowns: 0,
	dependencies: {
		"axios": ""
	}
}

const axios = require("axios");

module.exports.handleEvent = async function({api, event, botname }) {
	try {
		const ask = event.body?.toLowerCase() || '';
		if (ask.includes(botname.toLowerCase())) {
			try {
				const escapedBotname = botname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const processedAsk = ask
					.replace(new RegExp(escapedBotname, 'gi'), '')
					.replace(/\s+/g, ' ')
					.trim()
					.replace(/\s+([,.?!])/g, '$1');

				// Attempt to use the new message API first
				const res = await axios.get(`https://opiar-e6fo.onrender.com/gemini?search=${encodeURIComponent(processedAsk)}`);
				const reply = res.data.message;

				// Send the response back
				return api.sendMessage(reply, event.threadID, event.messageID);
			} catch (error) {
				return api.sendMessage("failed to get a response from the api.", event.threadID, event.messageID);
			}
		}
	} catch (error) {
		console.error(error); // Log the error for debugging
	}
};

module.exports.run = async function({ api, event, args, botname }) {
	const ask = args.join(' ');
	if (!ask) {
		return api.sendMessage(`please provide a message`, event.threadID, event.messageID);
	}

	try {
		// Attempt to use the new message API first
		const res = await axios.get(`https://opiar-e6fo.onrender.com/gemini?search=${encodeURIComponent(ask)}`);
		const reply = res.data.message;
		return api.sendMessage(reply, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("failed to get a response from the api.", event.threadID, event.messageID);
	}
};
