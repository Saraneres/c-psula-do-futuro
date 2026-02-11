let db = null;
let app = null;

// Inicialização do Firebase de forma segura
async function initFirebase() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            authDomain: "capsula-do-futuro-b9bb6.firebaseapp.com",
            projectId: "capsula-do-futuro-b9bb6",
            storageBucket: "capsula-do-futuro-b9bb6.appspot.com",
            messagingSenderId: "860849574143",
            appId: "SUA_APP_ID"
        };

        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log('Firebase inicializado com sucesso');
    } catch (e) {
        console.warn('Aviso: Firebase não inicializado. Cronômetro funcionará, mas funcionalidades de banco de dados estarão desativadas.', e);
    }
}

// Função para atualizar os números na tela
function atualizarCronometro(dataValor) {
    const displayYears = document.getElementById('years');
    const displayMonths = document.getElementById('months');
    const displayDays = document.getElementById('days');
    const displayClock = document.getElementById('clock');

    // Validação: se dataValor está vazia, resetar display
    if (!dataValor || dataValor.trim() === '') {
        if (displayYears) displayYears.innerText = "00";
        if (displayMonths) displayMonths.innerText = "00";
        if (displayDays) displayDays.innerText = "00";
        if (displayClock) displayClock.innerText = "00:00:00";
        return;
    }

    try {
        // Converter data formato YYYY-MM-DD para Date
        const [ano, mes, dia] = dataValor.split('-');
        const dataAlvo = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        dataAlvo.setHours(0, 0, 0, 0);
        
        const agora = new Date();
        const diferenca = dataAlvo.getTime() - agora.getTime();

        if (diferenca <= 0) {
            if (displayYears) displayYears.innerText = "00";
            if (displayMonths) displayMonths.innerText = "00";
            if (displayDays) displayDays.innerText = "00";
            if (displayClock) displayClock.innerText = "00:00:00";
            return;
        }

        const seg = Math.floor((diferenca / 1000) % 60);
        const min = Math.floor((diferenca / 1000 / 60) % 60);
        const hor = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const dTotal = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        
        const anos = Math.floor(dTotal / 365);
        const diasRestantes = dTotal % 365;
        const meses = Math.floor(diasRestantes / 30);
        const dias = diasRestantes % 30;

        if (displayYears) displayYears.innerText = anos.toString().padStart(2, '0');
        if (displayMonths) displayMonths.innerText = meses.toString().padStart(2, '0');
        if (displayDays) displayDays.innerText = dias.toString().padStart(2, '0');
        if (displayClock) displayClock.innerText = `${hor.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
    } catch (e) {
        console.error('Erro ao calcular cronômetro:', e);
        if (displayYears) displayYears.innerText = "00";
        if (displayMonths) displayMonths.innerText = "00";
        if (displayDays) displayDays.innerText = "00";
        if (displayClock) displayClock.innerText = "00:00:00";
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Firebase (sem bloquear o cronômetro se falhar)
    await initFirebase();

    const campoData = document.getElementById('dataAlvo');
    const btnSelar = document.getElementById('btnSelar');
    const btnConsultar = document.getElementById('btnConsultar');

    // Escuta a mudança de data e inicia automaticamente
    if (campoData) {
        const iniciarTimer = () => {
            if (window.timerId) clearInterval(window.timerId);
            atualizarCronometro(campoData.value);
            window.timerId = setInterval(() => atualizarCronometro(campoData.value), 1000);
        };
        
        // Inicia o timer imediatamente (com ou sem data)
        iniciarTimer();
        
        // Atualiza quando o usuário muda a data
        campoData.addEventListener('input', iniciarTimer);
        campoData.addEventListener('change', iniciarTimer);
    }

    // Ações dos botões
    if (btnSelar) btnSelar.addEventListener('click', selarCapsula);
    else console.warn('btnSelar não encontrado');
    if (btnConsultar) btnConsultar.addEventListener('click', consultarCapsula);
    else console.warn('btnConsultar não encontrado');
});

async function selarCapsula() {
    try {
        if (!db) {
            exibirNotificacao("ERRO: BANCO DE DADOS NÃO DISPONÍVEL", "vermelho");
            return;
        }

        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const emailEl = document.getElementById('emailUser');
        const mensagemEl = document.getElementById('textoCapsula');
        const dataEl = document.getElementById('dataAlvo');
        const senhaEl = document.getElementById('novaSenha');

        if (!emailEl || !mensagemEl || !dataEl || !senhaEl) {
            console.error('Elemento(s) do formulário não encontrado(s)');
            exibirNotificacao("ERRO: ELEMENTOS NÃO ENCONTRADOS", "vermelho");
            return;
        }

        const email = emailEl.value.trim();
        const mensagem = mensagemEl.value.trim();
        const dataAbertura = dataEl.value;
        const senha = senhaEl.value;

        if (!email || !mensagem || !dataAbertura || !senha) {
            exibirNotificacao("ERRO: CAMPOS VAZIOS", "vermelho");
            return;
        }

        await addDoc(collection(db, "capsulas"), {
            email, mensagem, dataAbertura, senha, criadoEm: new Date()
        });
        exibirNotificacao("CÁPSULA SELADA!", "verde");
        setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
        console.error(e);
        exibirNotificacao("ERRO NO BANCO", "vermelho");
    }
}

async function consultarCapsula() {
    try {
        if (!db) {
            exibirNotificacao("ERRO: BANCO DE DADOS NÃO DISPONÍVEL", "vermelho");
            return;
        }

        const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const emailEl = document.getElementById('emailUser');
        const senhaEl = document.getElementById('novaSenha');

        if (!emailEl || !senhaEl) {
            console.error('Elemento(s) do formulário não encontrado(s)');
            exibirNotificacao("ERRO: ELEMENTOS NÃO ENCONTRADOS", "vermelho");
            return;
        }

        const emailBusca = emailEl.value.trim();
        const senhaBusca = senhaEl.value;

        const q = query(collection(db, "capsulas"), where("email", "==", emailBusca), where("senha", "==", senhaBusca));
        const snap = await getDocs(q);

        if (snap.empty) {
            exibirNotificacao("NÃO ENCONTRADA", "vermelho");
            return;
        }

        snap.forEach(doc => {
            const d = doc.data();
            const alvo = new Date(d.dataAbertura.replace(/-/g, '\/'));
            alvo.setHours(0,0,0,0);
            const hoje = new Date();

            if (hoje >= alvo) {
                exibirNotificacao("LIBERADO: " + d.mensagem, "verde");
            } else {
                exibirNotificacao("AINDA NÃO É O MOMENTO", "azul");
            }
        });
    } catch (e) {
        console.error(e);
        exibirNotificacao("ERRO AO CONSULTAR", "vermelho");
    }
}

function exibirNotificacao(m, t) {
    const a = document.createElement("div");
    a.className = `notificacao-in-app ${t}`;
    a.innerText = m;
    document.body.appendChild(a);
    setTimeout(() => { a.style.opacity = "0"; setTimeout(() => a.remove(), 500); }, 5000);
}