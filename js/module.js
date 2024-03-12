//Elementos Globais (personagens)
const imgMario = document.querySelector('#imgMario');
const imgYoshi = document.querySelector('#imgYoshi');
const imgAtack = document.querySelector('#imgAtack');
const imgEgg = document.querySelector('#imgEgg');

// ==================== FUNÇÕES QUE CONTROLAM O MARIO ====================
// =======================================================================
//Funções de movimento do personagem e controle de audio do jogo.

// Função que toca o som do jogo
const playSom = (elemento) => {
     const element = document.querySelector(`#${elemento}`);

     element.play();
};
// Função que para o som do jogo
const stopSom = (elemento) => {
    const element = document.querySelector(`#${elemento}`)

    element.pause();
};
/*
 * Função que faz o Mario pular;
 * Essa função verifica a tecla usada pelo jogador, e compara se ela é a mesma que faz o Mario pular.
 * @param {*} event Parametro que vem do teclado mostrando a tecla pressionada;
 */
const pular = ({key}) => {
   if(key === 'ArrowUp'){
     // Adiciona a classe que contem a animação que faz o Mario pular;
        imgMario.classList.add('jump');
        imgYoshi.classList.add('jump');
        imgAtack.classList.add('jump');
        // Habilita o som do pulo
        playSom('somPulo');
        // Metodo de tempo que após 500ms remove a classe com a animação do pulo;
        setTimeout(() => {
          imgMario.classList.remove('jump');
          imgYoshi.classList.remove('jump');
          imgAtack.classList.remove('jump');
        }, 500);
   }
};
/*
 * Função que faz o Mario voar;
 * Essa função verifica a tecla usada pelo jogador, e compara se ela é a mesma que faz o Mario voar.
 * @param {*} event Parametro que vem do teclado mostrando a tecla pressionada;
 */
const voar = (evento) => {
   if(evento.key === ' '){
     imgMario.classList.add('fly'); // Adiciona a classe que contem a animação que faz o Mario pular;
     imgMario.src = './assets/mario-voando.png'; // Muda a imagem do Mario
     // Habilita o som do voo;
     playSom('somVoar');
      // Metodo de tempo que após 1500ms remove a classe com a animação do voo e volta a imagem principal do Mario;
     setTimeout(() => {
          imgMario.classList.remove('fly');
          imgMario.src = './assets/mario.gif';
        }, 1500);
   }
}
/*
 * Função que faz o Mario abaixar;
 * Essa função verifica a tecla usada pelo jogador, e compara se ela é a mesma que faz o Mario abaixar.
 * Essa função diferente das outras não retorna a imagem do Mario nem remove a classe da animação depois de alguns segundos. Ela só é invalidada quando o jogador deixa de pressionara a tecla Arrow Down que nesse momento habilita outra função (levantar).
 * @param {*} event Parametro que vem do teclado mostrando a tecla pressionada;
 */
const abaixar = ({key}) => {
     if(key === 'ArrowDown'){
          imgMario.classList.add('abaixar'); // Adiciona a classe que contem a animação que faz o Mario abaixar;
          imgMario.src = './assets/mario-agachado.png'; // Muda a imagem do Mario
           // Habilita o som
          playSom('somAgachado');
     }
}
/*
 * Função que faz o Mario levantar;
 * Essa função complementa a função abaixar, pois ao soltar a tecla Arrow Down ela devolve a imagem principal do Mario e remove a classe que contem a animação que abaixa.
 * Isso foi necessário para que o jogador pudesse ficar o tempo necessário abaixado para desviar das balas que se movem em uma velocidade que muda com o tempo. 
 * @param {*} event Parametro que vem do teclado mostrando a tecla que deixou de ser pressionada;
 */
const levantar = ({key}) => {
     if(key === 'ArrowDown') {
          imgMario.classList.remove('abaixar');
          imgMario.src = './assets/mario.gif';
     }
}
// * Função que faz o Mario ataque com o Yoshi;
const atacar = ({key}) => {
     if(key === 'A') {
          imgYoshi.style.display = 'none';
          imgAtack.style.display = 'block';
     }
}
// Função que limpa a caixa de texto;
const limparTexto = () => {
   inputJogador.value = '';  
   btnStart.setAttribute('disabled', '');
}; 


export {playSom,
        stopSom,
        pular,
        voar,
        abaixar,
        levantar,
        atacar,
        limparTexto,
        imgMario,
        imgEgg,
        imgYoshi,
        imgAtack,
     };
