//Importações 
import * as conexoes from './conexion.js'
import * as modulos from './module.js'; 

//------------------------Elementos Globais---------------------------------//
//Botões 
const btnStart = document.querySelector('#btnStart');
const btnReiniciar = document.querySelectorAll('#btnReiniciar');
const btnRanking = document.querySelector('#btnRanking');
//Paginas
const modal = document.querySelector('#modal');
const modalLogin = document.querySelector('#modalLogin');
const modalGameOver = document.querySelector('#modalGameOver');
const modalRanking = document.querySelector('#modalRanking');
const cenario = document.querySelector('#cenario');
//Elementos da tela
const imgPipe = document.querySelector('#imgPipe');
const imgBullet = document.querySelector('#imgBullet');
const imgMoedas = document.querySelectorAll('#imgCoin');
const imgEstrelas = document.querySelectorAll('#imgStar');
//Estrutura HTML
const sleep = document.querySelector('#sleep');
const inputJogador = document.querySelector('#inputJogador');
const tabela = document.querySelector('#tabela');
//Textos na tela
const txtNomejogador = document.querySelector('#txtNomeJogador');
const txtSleep = document.querySelector('#txtSleep'); 
const txtTempo = document.querySelector('#txtTempo');
const txtMoedas = document.querySelector('#txtMoedas');
const txtEstrelas = document.querySelector('#txtEstrelas');

//Variáveis globais
let nomeJogador;
let moedasJogador = 0;
let estrelasJogador = 0;
let tempoJogador = 0;
let pontuacaoJogador = 0; 

let loopSleep;
let loopTime;
let loopMoverElementos;
let loopPegarElementos;
let loopControlePartida;

//----------------------------------Funções------------------------------------------// 
// ==================== FUNÇÕES QUE CONTROLAM O JOGO ====================
// ======================================================================

/*
 * Função que valida o jogador
 * Essa função verifica se o jogador colocou pelo menos 3 caracteres na caixa de texto.
 * O botão que inicia o jogo, só é habilitado com essa condição.
 * Com a condição valida, ele pode acessar usando a tecla Enter ou o click do mouse.
 * A variável nomeJogador recebe o nome digitado na caixa de texto.
 * O parametro recebe o target que vem da caixa de texto e mostra o que foi digitado.
 */
const validarJogador = ({ target }) => {

    if (target.value.length > 2) {
        // Habilita o botão
        btnStart.removeAttribute('disabled');
        // Pega o nome do jogador
        nomeJogador = target.value.trim().toUpperCase();
        // Acesso pelo click do mouse. Chama a função que inicia o jogo.
        btnStart.addEventListener('click', start);
        // Acesso pelo enter do teclado
        document.addEventListener('keypress', ({key}) => {
           if(key === 'Enter' && target.value.length > 2) {
              // Chama a função que inicia o jogo.
              start();
           }
        });

    } else {
         // Desabilita o botão
        btnStart.setAttribute('disabled', '');
    }
};

const iniciarJogo = () => {
    modulos.playSom('somAbertura');
    // Chamada da função;
    inputJogador.addEventListener('input', validarJogador);
};
iniciarJogo(); 

/*
 * Função que inicia o movimento do jogo;
 * Essa função desabilita a tela de modal e oculta todos os seus elementos e remove a classe active da tela de inicio, para que ela não seja carregada quando as outras telas forem chamadas (ranking e game-over).
 * Depois da contagem de 5 segundos ela habilita os movimentos dos elementos na tela, inicia a contagem do tempo e habilita as ações do teclado para controle do Mario.
 */
const start = () => {
     // Chama a função que limpa o texto do input para a proxima partida;
    modulos.limparTexto();
    // Para o som da abertura e habilita o som principal do jogo;
    modulos.stopSom('somAbertura');  
    modulos.playSom('somPrincipal');
    //funcoes vindo dos modulos responsaveis pelos movimentos do personagem
    document.addEventListener('keydown', modulos.pular);
    document.addEventListener('keydown', modulos.voar);
    document.addEventListener('keydown', modulos.abaixar);
    document.addEventListener('keyup', modulos.levantar);
    // Oculta o modal e a tela escura;
    modal.classList.remove('habilitar');
    // Oculta a tela de inicio;
    modalLogin.classList.remove('active');
     // Adiciona o nome do jogador na tela do jogo;
    txtNomejogador.innerHTML = nomeJogador; 

    // ativa a tela do countdown sleep
    sleep.classList.add('active');
    loopSleep = setInterval(() => {
        let cont = txtSleep.innerHTML;
        cont --;
        txtSleep.innerHTML = cont;
    }, 1000);
     // Função que retarta o inicio do jogo em 5s.
    setTimeout(() => {
        sleep.classList.remove('active'); // Oculta o contador regressivo;
        cenario.classList.add('start'); // Habilita os movimentos das nuvens, moedas e estrelas;
        clearInterval(loopSleep);
        modulos.imgMario.src = './assets/mario.gif';
        time(); // Inicia a contagem do tempo.
        //Elementos começam a se mover na tela
        moverElementos(imgPipe); // Movimenta o tupo;
        moverElementos(imgEgg); // Movimenta o ovo;
        moverElementos(imgBullet, 1.5); // Movimenta a bala;
        pegarElementos();
        controlePartida();

    }, 6000);
}; 
// ============= FUNÇÕES QUE CONTROLAM OS ELEMENTOS DA TELA =============
// ======================================================================

/** Função que conta o tempo do jogo;
 * Essa função contem um setInterval dentro dela que permite fazer um loop a cada 1000ms e a cada volta ele adiciona +1 na variavel do tempo do jogador e depois mostra esse tempo na tela;
 * Ela teve que ser feita assim para que pudesse chamar essa função apenas quando a função start for iniciada, caso contrário o tempo começaria a conta ao carregar a tela no navegador.
 * Foi preciso criar o elemento this.loopTime para que pudesse ser interrompido com o método clearInterval dentro da função de loop
 */
const time = () => {
    loopTime = setInterval(() => {
        // Variavel local que recebe o valor que está na tela;
       tempoJogador = txtTempo.innerHTML;
        // Para uma melhor consistencia do loop coloquei um setTimeout de 500ms pois sem ele algumas vezes o valor na tela pulava de 2 em 2.
       tempoJogador ++; // Pega o tempo do jogador
       txtTempo.innerHTML = tempoJogador; // Mostra esse tempo na tela;
     
    }, 1000);
};

const moverElementos = (elemento, retardo = 0) => {
    loopMoverElementos = setInterval(() => {
        if(tempoJogador <= 10) {
            elemento.style.animation = `mover-elementos 3s infinite linear ${retardo}s`;
            modulos.imgEgg.style.display = 'block';
            modulos.imgEgg.style.animation = 'mover-elementos 3s infinite linear 5s'
            pegarOvo();
        } 
             //else if(tempoJogador <= 20) {
            //elemento.style.animation = `mover-elementos 2.5s infinite linear ${retardo}s`;
           //} else if(tempoJogador <= 30) {
         //elemento.style.animation = `mover-elementos 2s infinite linear ${retardo}s`;
        //} else if(tempoJogador <= 40) {
        //elemento.style.animation = `mover-elementos 1.2s infinite linear ${retardo}s`;
        //}
    }, 1);
};
/*
 * Função que pega os elementos da tela (moedas e estrelas)
 * Essa função usa o setInterval para criar o loop a cada 250ms que fica verificando se o Mario encostou em algum elemento que conta pontos no jogo (moedas e estrelas).
 * Dentro da função é feito dois forEach, sendo uma para as moedas que tem 3 no jogo, e um forEach para as estrelas que tem 2 no jogo. Foi feito dessa forma para que pudessem passar em posições e/ou velocidades diferentes.
 */
const pegarElementos = () => {
   loopPegarElementos = setInterval(() => {
    // Essa variável pega o movimento do Mario em relação ao bottom, top, left e depois retira o caractere px e converte o texto para numero;
    let posicaoMarioBottom = window.getComputedStyle(modulos.imgMario).bottom.replace('px', ''); // Posição em relação ao bottom da tela;
    let posicaoMarioTop = modulos.imgMario.offsetTop; // Posição em relação ao top da tela;
     // Condição que pega as moedas;
    imgMoedas.forEach((item, index) => {
        // Posição que a moeda está na tela;
        let posicaoMoedaLeft = item.offsetLeft;
        // Se o left da moeda for menor ou igual a 150 (posição em que o Mario fica) e se o Mario estiver a uma altura maior ou igual a de 150 (altura em relação ao bottom da tela) = Ele pegoua moeda.
        if(posicaoMarioBottom >= 170 && posicaoMarioBottom <= 200 && posicaoMoedaLeft <= 150) {
           moedasJogador ++; // adiciona +1 a variavel global;
           txtMoedas.innerHTML = moedasJogador; // Mostra a soma da variável na tela;
           modulos.playSom('somMoeda'); // Habilita o som
           item.style.display = 'none'; // Remove a moeda da tela;
            // Depois de 50ms a imagem da moeda volta para a tela;
           setTimeout(() => {
            item.style.display = 'block'; // mostra a moeda novamente depois de 50ms
           }, 100);
        }
    });
    // O mesmo proncipio da moeda vale para a estrela;
    imgEstrelas.forEach((item) => {
       let posicaoEstrelaLeft = item.offsetLeft; // Posição em relação ao left da tela;

       if(posicaoMarioTop <= 130 && posicaoEstrelaLeft <= 350 && posicaoEstrelaLeft >= 200) {

          estrelasJogador ++;
          txtEstrelas.innerHTML = estrelasJogador;

          item.style.display = 'none'; // apaga a estrela
          modulos.playSom('somEstrela');

          setTimeout(() => {
           item.style.display = 'block'; // mostra a estrela novamente depois de 50ms
          }, 50);
       }
    });

   }, 250);
};

// Função criada para dar continuidade ao jogo e mais dinamica, onde o mario coleta o ovo e passa a jogar com o Yoshi ;)
const pegarOvo = () => {
    EncontroComOvo = setInterval(() => {
        const posicaoMario = modulos.imgMario.offsetLeft;
        const posicaoEgg = modulos.imgEgg.offsetLeft;

        if(posicaoEgg <= 120) {
            modulos.imgMario.style.display = 'none'; 
            modulos.imgEgg.style.display = 'none';
            modulos.imgYoshi.style.display = 'block'; 
            //modulos.atacar();
        }
     }, 1);
};
/*
 * Loop que verifica se o jogador perdeu;
 * Essa função é o controle de toda ação do jogo. Ela é um loop que ocorre a cada 10ms verificando a condição e habilitando as funções e variáveis dentro dela.
 * Ela controla se algum elemento encostou no Mario fazendo com que o jogo acabe, chamando a tela de game-over;
 */

const controlePartida = () => {
    loopControlePartida = setInterval(() => {
        // Variaveis que pegam a posição do elemento na tela
       const posicaoTuboLeft = imgPipe.offsetLeft; // Pega a distancia da margin esquerda;
       const posicaoBalaLeft = imgBullet.offsetLeft; // Pega a distancia da margin esquerda;
       const alturaMario = modulos.imgMario.offsetHeight; // Pega a distancia da altura
        // Essa variável pega o movimento do Mario em relação ao bottom, depois retira o caractere px e converte o texto para numero;
       const posicaoMarioBottom = window.getComputedStyle(modulos.imgMario).bottom.replace('px', '');
       const alturaYoshi = modulos.imgYoshi.offsetHeight;
       const posicaoYoshiBottom = window.getComputedStyle(modulos.imgYoshi).bottom.replace('px', '');
    /*
     * Essa condição faz a verificação se o Mario está encostando nos elementos (tubo ou bala);
     * Se o left do tubo estiver entre 0 e 120 do canto esquerdo da tela e a altura do bottom do Mario for menor que 120 (altura do tubo) = Mario encostou no tubo.
     * Ou - Se o left da bala estiver entre 0 e 120 do canto esquerdo da tela e a altura do bottom do Mario for menor que 120 ou se a altura do Mario for maior que 70 (altura do tubo) = Mario encostou na bala.
     */
       if(posicaoTuboLeft <= 125 && posicaoTuboLeft >= 50 && posicaoMarioBottom <= 100 && posicaoYoshiBottom <= 100 ){
           // Pipe 1
           imgPipe.style.animation = 'none';
           imgPipe.style.left = `${posicaoTuboLeft}px`;
           // Mario
           modulos.imgMario.style.animation = 'none';
           modulos.imgYoshi.style.animation = 'none';
           modulos.imgMario.style.bottom = `${posicaoMarioBottom}px`;
           modulos.imgYoshi.style.bottom = `${posicaoMarioBottom}px`;
           // Muda a imagem e estilo;
           modulos.imgMario.src = './assets/game-over.png';
           modulos.imgYoshi.src = './assets/game-over.png';
           modulos.imgMario.style.width = '73px';
           modulos.imgYoshi.style.width = '73px';
           modulos.imgMario.style.left = '60px';
           modulos.imgYoshi.style.left = '60px';

           modulos.stopSom('somPrincipal');

           clearInterval(loopControlePartida);

           modulos.stopSom('somPrincipal');
           // Habilita o som
           modulos.playSom('somPerdeu');

           setTimeout(() => {
            gameOver();
           }, 1500);

           
       } 

       if(posicaoBalaLeft <= 110 && posicaoBalaLeft >= 50 && posicaoMarioBottom <= 180 && alturaMario >= 100 ) {
           // Bullet
           imgBullet.style.animation = 'none';
           imgBullet.style.left = `${posicaoBalaLeft}px`;

           modulos.imgMario.style.animation = 'none';
          
            modulos.imgMario.style.bottom = '30px';
           
            modulos.imgMario.style.bottom = `${posicaoMarioBottom}px`;
           

           modulos.imgMario.src = './assets/game-over.png';
           modulos.imgMario.style.width = '73px';
           modulos.imgMario.style.left = '100px';

           modulos.stopSom('somPrincipal');

           clearInterval(loopControlePartida);

           modulos.stopSom('somPrincipal');
           modulos.playSom('somPerdeu');

            setTimeout(() => {
            gameOver();
           }, 1500);
       }
    }, 1);
};
// Função que calcula a pontuação do jogador;
const calcularPontuacao = () => {
    pontuacaoJogador = (moedasJogador * 2) + (estrelasJogador * 5) + tempoJogador;
};

const gameOver = () => {
    // Habilita o som
    modulos.playSom('somGameOver');
    // Encerra o loop, pontuação e tempo do jogo;
    clearInterval(loopTime); // Essa propria função;
    clearInterval(loopPegarElementos); // Loop que faz a contagem das moedas e estrelas
    clearInterval(loopMoverElementos); // Loop que controla a velocidade do jogo;

    document.removeEventListener('keydown', modulos.voar);
    document.removeEventListener('keydown', modulos.abaixar);
    document.removeEventListener('keyup', modulos.levantar);
    document.removeEventListener('keydown', modulos.pular);
    // Função que vai calcular os pontos do jogador;
    calcularPontuacao();
    // Salvando no BD
    conexoes.bancoTemp(nomeJogador, moedasJogador, estrelasJogador, tempoJogador, pontuacaoJogador);
    // Mostra a tela de game over;
    modal.classList.add('habilitar'); // Habilita o modal e o fundo preto;
    modalGameOver.classList.add('active'); // Habilita a tela de game-over no modal;
};
/*
 * Função que reinicia a partida
 * Ela habilita o som da abertura e usa um metodo nativo para dar um reload no navegador.
 * Como são dois botões de baixo dela o evento de click é feito com um forEach.
 */
const reiniciarPartida = () => {
    modulos.playSom('somAbertura');
    location.reload(true);
};

btnReiniciar.forEach((btn) => {
   btn.addEventListener('click', reiniciarPartida);
});
/*
 * Função que mostra o Ranking
 * Ela remove a tela de game-over do modal e chama a tela do ranking para o lugar.
 * Habilita o som dessa tela, e chama a função que constroe as tabelas com os dados armazenados no BD.
 */
const telaRanking = () => {
    modalGameOver.classList.remove('active'); // Remove a tela game-over;
    modalRanking.classList.add('active'); // Habilita a tela de ranking;
    modulos.stopSom('somGameOver');
    modulos.playSom('somRanking'); // Habilita o som;

    tabelaRanking(); // Chama a função que monta a tabela na tela;
};

btnRanking.addEventListener('click', telaRanking);

const tabelaRanking = () => {
    // Variavel que recebe o banco depois de ser reorganizado na ordem crescente;
    const classificacao = conexoes.getBanco().sort(colocacao).reverse();
    classificacao.forEach((item, index) => {
        let posicao = index +1;
        let nome = item.nomeJogador;
        let moedas = item.moedasJogador;
        let estrelas = item.estrelasJogador;
        let tempo = item.tempoJogador;
        let pontuacao = item.pontuacaoJogador;

        criarTabela(posicao, nome, moedas, estrelas, tempo, pontuacao);
    });
};
// Função que monta a tabela
const criarTabela = (posicao, nome, moedas, estrelas, tempo, pontuacao) => {
   const elementoHTML = document.createElement('tr');
   elementoHTML.classList.add('linha');

   elementoHTML.innerHTML = `
     <td class="coluna">${posicao}</td>
     <td class="coluna">${nome}</td>
     <td class="coluna">${moedas}</td>
     <td class="coluna">${estrelas}</td>
     <td class="coluna">${tempo}</td>
     <td class="coluna">${pontuacao}</td>
   `;

   tabela.appendChild(elementoHTML);
};
// Função que organiza a colocação dos jogadores
const colocacao = (a, b) => {
    return a.pontuacaoJogador > b.pontuacaoJogador ? 1 
    :  a.pontuacaoJogador < b.pontuacaoJogador ? -1
    : 0;
  };




































