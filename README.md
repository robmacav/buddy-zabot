# BUDDY BOT
O buddy-bot é um bot automatizado para WhatsApp, desenvolvido com WPPConnect e Node.js, criado para gerenciar automaticamente listas de presença em grupos de vôlei.

<p><b>A ideia nasceu de uma necessidade real:</b> nos grupos de vôlei recreativo, assim que alguém publica a lista de quem vai jogar, as vagas acabam em poucos segundos.</p>

<p>O buddy-bot entra em ação exatamente nesse momento — ele monitora o grupo, identifica a mensagem com a lista, e preenche automaticamente seu nome (ou dos integrantes configurados) assim que a lista é publicada.</p>

<p>Se todas as vagas já estiverem ocupadas, o bot adiciona os nomes automaticamente na seção de “lista de espera integrantes do grupo”, mantendo o formato da mensagem original e garantindo que ninguém fique de fora.</p>

### Recursos
- Conexão automática via WPPConnect (com suporte a QR Code).
- Detecção inteligente de mensagens de lista com base em padrões e texto.
- Preenchimento automático de nomes conforme regras configuráveis (1–5 mulheres, 6–10 homens).
- Adição automática à lista de espera, abaixo dos nomes existentes, quando não há vagas.
