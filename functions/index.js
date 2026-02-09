const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "elementolabb@gmail.com",
        pass: "buix toom wnye zkt" 
    }
});

exports.verificarCapsulasDiario = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("America/Sao_Paulo")
    .onRun(async (context) => {
        const hoje = new Date().toISOString().split('T')[0];
        const snapshot = await admin.firestore().collection("capsulas")
            .where("dataAbertura", "==", hoje)
            .get();

        if (snapshot.empty) return null;

        const promessas = [];
        snapshot.forEach(doc => {
            const dados = doc.data();
            const mailOptions = {
                from: "Cápsula do Futuro <SEU_EMAIL@gmail.com>",
                to: dados.email,
                subject: "🚀 O tempo passou! Sua cápsula foi aberta.",
                text: "Olá! Sua cápsula do futuro acaba de ser desbloqueada. Acesse o sistema para ler sua mensagem!"
            };
            promessas.push(transporter.sendMail(mailOptions));
        });

        return Promise.all(promessas);
    });