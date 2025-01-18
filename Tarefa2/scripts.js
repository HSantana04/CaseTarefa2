//Define variaveis

let dadosRetorno = null;
let dadosVolatilidade = null;
let temaAtual = "light";


//Carregar dados JSON
function carregarDados(equivalente, tipoGrafico, containerId) {
    fetch(equivalente)
        .then(response => response.json())
        .then(data => {
            if (tipoGrafico === "retorno_acumulado") dadosRetorno = data;
            if (tipoGrafico === "volatilidade") dadosVolatilidade = data;

            atualizarGrafico(data, tipoGrafico, containerId);
        })
        //Verificação de erro "Try-catch"
        .catch(error => console.error(`Erro ao carregar ${tipoGrafico}:`, error));
}


//Cria função de atualizar grafico e definir layout e estilização das linhas
function atualizarGrafico(data, tipoGrafico, containerId) {
    const datas = Object.keys(data);
    const valores = datas.map(d => data[d][tipoGrafico]);

    const trace = {
        x: datas,
        y: valores,
        type: 'scatter',
        mode: 'lines+markers',
        name: tipoGrafico,
        line: { color: tipoGrafico === 'retorno_acumulado' ? '#4caf50' : '#ffa500' }
    };

    const layout = {
        xaxis: { title: 'Data', tickangle: 45 },
        yaxis: { title: tipoGrafico },
        plot_bgcolor: temaAtual === "dark" ? '#2d3748' : '#f9f9f9',
        paper_bgcolor: temaAtual === "dark" ? '#2d3748' : '#ffffff',
        font: { color: temaAtual === "dark" ? '#e2e8f0' : '#333' }
    };

    Plotly.newPlot(containerId, [trace], layout);
}


//Função para filtragem dos dados por data
function filtrarDados() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filtrar = (data) => {
        const resultado = {};
        for (let key in data) {
            if (key >= startDate && key <= endDate) {
                resultado[key] = data[key];
            }
        }
        return resultado;
    };

    if (dadosRetorno) atualizarGrafico(filtrar(dadosRetorno), 'retorno_acumulado', 'graficoRetornoAcumulado');
    if (dadosVolatilidade) atualizarGrafico(filtrar(dadosVolatilidade), 'volatilidade', 'graficoVolatilidade');
}


//Cria função de alterar tema
function alternarTema() {
    temaAtual = temaAtual === "dark" ? "light" : "dark";
    document.body.setAttribute('data-theme', temaAtual);
}
//Cria as funções para o HTML carregar os graficos 'graficoRetornoAcumulado'e 'graficoVolatilidade'
carregarDados('retorno_acumulado.json', 'retorno_acumulado', 'graficoRetornoAcumulado');
carregarDados('volatilidade.json', 'volatilidade', 'graficoVolatilidade');
