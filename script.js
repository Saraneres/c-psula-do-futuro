import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "capsula-do-futuro-b9bb6.firebaseapp.com",
    projectId: "capsula-do-futuro-b9bb6",
    storageBucket: "capsula-do-futuro-b9bb6.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function selarCapsula() {
    const email = document.getElementById('emailUser').value;
    const mensagem = document.getElementById('textoCapsula').value;
    const dataAbertura = document.getElementById('dataAlvo').value;
    const senha = document.getElementById('novaSenha').value;

    if (!email || !mensagem || !dataAbertura || !senha) {
        exibirNotificacao("ERRO: PREENCHA TODOS OS CAMPOS", "vermelho");
        return;
    }

    try {
        await addDoc(collection(db, "capsulas"), {
            email,
            mensagem,
            dataAbertura,
            senha,
            criadoEm: new Date()
        });

        exibirNotificacao("CÁPSULA SELADA COM SUCESSO!", "verde");
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);

    } catch (e) {
        console.error("Erro ao salvar: ", e);
        exibirNotificacao("ERRO AO CONECTAR COM O FUTURO", "vermelho");
    }
}

async function consultarCapsula() {
    const emailBusca = document.getElementById('emailUser').value;
    const senhaBusca = document.getElementById('novaSenha').value;

    if (!emailBusca || !senhaBusca) {
        exibirNotificacao("ERRO: IDENTIFICAÇÃO NECESSÁRIA", "vermelho");
        return;
    }

    const q = query(collection(db, "capsulas"), 
        where("email", "==", emailBusca), 
        where("senha", "==", senhaBusca));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        exibirNotificacao("CÁPSULA NÃO ENCONTRADA", "vermelho");
        return;
    }

    querySnapshot.forEach((doc) => {
        const dados = doc.data();
        const dataAbertura = new Date(dados.dataAbertura);
        const hoje = new Date();

        if (hoje >= dataAbertura) {
            exibirNotificacao("ACESSO LIBERADO: " + dados.mensagem, "verde");
        } else {
            const diasRestantes = Math.ceil((dataAbertura - hoje) / (1000 * 60 * 60 * 24));
            exibirNotificacao(`ACESSO NEGADO: FALTAM ${diasRestantes} DIAS`, "azul");
        }
    });
}

function exibirNotificacao(mensagem, tipo) {
    const alerta = document.createElement("div");
    alerta.className = `notificacao-in-app ${tipo}`;
    alerta.innerText = mensagem;
    
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.style.opacity = "0";
        setTimeout(() => alerta.remove(), 500);
    }, 5000);
}

window.selarCapsula = selarCapsula;
window.consultarCapsula = consultarCapsula;