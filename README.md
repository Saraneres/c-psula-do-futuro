Future Capsule (Cápsula do Futuro)
Uma aplicação futurista de cápsula do tempo digital onde usuários podem selar mensagens e definir uma data específica para a revelação. O projeto simula um terminal de inteligência avançada com interface em 3D e integração com banco de dados em tempo real.

Tecnologias Utilizadas
Front-end: HTML5, CSS3 (Animações 3D e Glassmorphism) e JavaScript (ES6+ Modules).

Back-end: Firebase Firestore para armazenamento de dados escalável.

Design: Estética Cyberpunk/Terminal inspirada em sistemas de ficção científica.

Notificações: Sistema de alerta In-App personalizado para feedback imediato do usuário.

Funcionalidades
Selagem de Memórias: Armazenamento seguro de mensagens, e-mail e data de abertura no banco de dados.

Validação de Acesso: O sistema verifica automaticamente se a data de liberação já chegou antes de exibir a mensagem.

Interface 3D Realista: Uma cápsula central que rotaciona e reage a efeitos de luz e sombra via CSS.

Segurança: Acesso protegido por senha definida pelo usuário no momento da criação.

📂 Estrutura do Projeto
O projeto foi estruturado para demonstrar conhecimentos em BaaS (Backend as a Service) e organização de código limpo:

/index.html: Estrutura principal e interface do terminal.

/style.css: Estilização complexa, incluindo a cápsula 3D e notificações.

/script.js: Lógica de integração com Firebase e comparação de datas.

/functions/: Contém a lógica de Cloud Functions (Node.js) para automação de e-mails (módulo opcional preparado para escalabilidade no plano Blaze).

Como executar o projeto
Clone o repositório:

Bash
git clone https://github.com/seu-usuario/capsula-do-futuro.git
Abra o arquivo index.html em seu navegador (recomenda-se o uso da extensão Live Server no VS Code para suporte a módulos JS).

Certifique-se de configurar suas próprias chaves do Firebase no arquivo script.js.

Nota sobre o Desenvolvimento
Este projeto foi desenvolvido focado em portfólio e viabilidade técnica gratuita. Embora a estrutura para notificações via e-mail (Cloud Functions) esteja configurada na pasta /functions, o sistema utiliza atualmente Notificações In-App para garantir que a aplicação permaneça 100% gratuita no Plano Spark do Firebase.