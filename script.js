// Capturar o clicque dos botões de operações
const elementoSaldo = document.getElementById("saldo")
const elementoValor = document.getElementById("valorDigitado")
const elementoMensagem = document.getElementById("mensagem")
const listaHistorico = document.getElementById("listaHistorico")

// Estado inicial da simulção
let saldo = 150000 // R$ 1.500,00 armazenado em centavos
let valorDigitado = ""
let operacao = "saque"

// Formata centavos como moeda brasileira
function formatarMoeda(centavos) {
    return (centavos / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

// Atualiza saldo na tela
function atualizarSaldo() {
    elementoSaldo.textContent = formatarMoeda(saldo)
}

// Atualiza valor que aparece no painel de saque
function atualizarValor() {
    const centavos = Number(valorDigitado || "0")
    elementoValor.textContent = formatarMoeda(centavos)
}

// Exibe mensagens para o usuário
function mostrarMensagem(texto) {
    elementoMensagem.textContent = texto;
}

// Registra as movimentações no hitórico
function registrarHitorico(descricao) {
    const item = document.createElement("li")

    const agora = new Date().toLocaleString("pt-BR")

    item.textContent = `${agora} - ${descricao}`

    listaHistorico.prepend(item)
}

// Limpa somente o valor digitado
function limparValor() {
    valorDigitado = ""
    atualizarValor()
}

// Digita os números como em um caixa eletrônico
document.querySelectorAll("[data-numero]").forEach((botao) => {
    botao.addEventListener("click", () => {
        if(valorDigitado >= 9) {
            mostrarMensagem("Limite de dígitos atingido.")
            return
        }

        valorDigitado += botao.dataset.numero

        atualizarValor()
        mostrarMensagem("Valor digitado.Confirme a operação.")
    })
})

// Seleciona valores rápidos: R$ 50, R$ 100 ou R$ 200
document.querySelectorAll("[data-valor]").forEach((botao) => {
    botao.addEventListener("click", () => {
        valorDigitado = String(Number(botao.dataset.valor) * 100)

        atualizarValor()
        mostrarMensagem("Valor selecionado. Confirme a operação.")
    })
})

// Seleciona a operação de saque
document.getElementById("btnSacar").addEventListener("click", () => {
    operacao = "saque"

    mostrarMensagem("Digite o valor para sacar.");
});

// Seleciona a operação de depósito
document.getElementById("btnDepositar").addEventListener("click", () => {
    operacao = "depósito"

    mostrarMensagem("Digite o valor para depositar.")
})

// Consulta o saldo
document.getElementById("btnConsultar").addEventListener("click", () => {
    mostrarMensagem(`Seu saldo disponível é ${formatarMoeda(saldo)}.`)
})

// Confirma o saque ou depósito
document.getElementById("btnConfirmar").addEventListener("click", () => {
    const valor = Number(valorDigitado)

    if (!valorDigitado || !Number.isSafeInteger(valor) || valor <= 0) {
        mostrarMensagem("Digite um valor válido.")
        return
    }

    if (operacao === "saque") {
        if (valor > saldo) {
            mostrarMensagem("Saldo insuficiente para realizar o saque.")
            return
        }

        saldo -= valor

        registrarHistorico(`Saque: - ${formatarMoeda(valor)}`);

        mostrarMensagem(`Saque de ${formatarMoeda(valor)} realizado com sucesso!`)
    } else {
        saldo += valor

        registrarHistorico(`Depósito: + ${formatarMoeda(valor)}`);

        mostrarMensagem(`Depósito de ${formatarMoeda(valor)} realizado com sucesso!`);
    }

     atualizarSaldo()
    limparValor()
})

// Limpa o teclado
document.getElementById("btnLimparTeclado").addEventListener("click", () => {
    limparValor()

    mostrarMensagem("Valor digitado apagado.")
})

// Cancela a operação e volta para saque
document.getElementById("btnCancelar").addEventListener("click", () => {
    limparValor()

    operacao = "saque"

    mostrarMensagem("Operação cancelada.")
})

// Limpa a operação atual
document.getElementById("btnLimpar").addEventListener("click", () => {
    limparValor()

    mostrarMensagem("Operação limpa. Digite um novo valor.")
})

// Inicializa a tela
atualizarSaldo()
atualizarValor()