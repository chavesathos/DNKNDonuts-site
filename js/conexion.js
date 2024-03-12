// BD LocalStore
const setBanco = (banco) => {
    localStorage.setItem('bd-mario', banco);
}

// função que que coleta os dados do banco de dados e os deixa disponiveis para uso na tabela 
const getBanco = () => {
    return JSON.parse(localStorage.getItem('bd-mario')) ?? [];
}
// Função que cria um banco temporário que recebe o banco do LocalStorage, ele recebe os dados do jogador como parametro depois passa esses dados em um array para o banco na rede.
const bancoTemp = (nome, moedas, estrelas, tempo, pontuacao) => {
    
    let banco = getBanco();

    let dados = {
        nomeJogador: nome, 
        moedasJogador: moedas,
        estrelasJogador: estrelas,
        tempoJogador: tempo,
        pontuacaoJogador: pontuacao
    };

    banco.unshift(dados);

    setBanco(JSON.stringify(banco));
};


export {setBanco, getBanco, bancoTemp};



