// const { default: axios } = require("axios");
const venom = require("venom-bot");
const banco = require("./src/banco");
const axios = require("axios");

venom.create({
    session: "chatGPT_Bianca",
    multidevice: true
})
    .then((client) => start(client))
    .catch((err) => console.log(err));

const header = {
    "Content-Type": "application/json",
    "Authorization": "" //Aqui coloca a Chave Key da API do ChatGPT
}

const start = (client) => {
    client.onMessage((message) => {
        const userCadastrado = banco.db.find(numero => numero.num === message.from);
        if (!userCadastrado) {
            console.log("Cadastrando usuario");
            banco.db.push({ num: message.from, historico: [] })
        }
        else {
            console, log("Usuario já cadastrado!");
        }

        const historico = banco.db.find(num => num.num === message.from);
        historico.historico.push("user: " + message.body);
        console.log(historico.historico);

        axios.post("https://api.openai.com/v1/chat/completions", {
            "model": "gpt-4-vision-preview",
            "messages": [
                { "role": "system", "content": "historico de conversas: " + historico.historico },
                { "role": "user", "content": message.body }]
        }), {
            headers: header
        }
    })
        .then((response) => {
            console.log(response.data.choices[0].message.content);
            historico.historico.push("assistent: " + response.data.choices[0].message.content);
            client.sendText(message.from, response.data.choices[0].message.content);
        })
        .catch((err) => {
            console.log(err);
        })
}
