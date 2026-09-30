// butaun filtrar e preço :3

const botaoFiltrar = document.querySelector('.btn-filtrar');

function numero(txt) {
    const limpo = String(txt).trim().replace(/\./g, '').replace(',', '.');
    if (limpo === '') return null;
    const n = Number(limpo);
    return Number.isNaN(n) ? null : n;
}

botaoFiltrar.addEventListener("click", function () {

    const categoriaSelecionada = document.querySelector('#categoria').value;
    const precoMaximoSelecionado = document.querySelector('#preco').value;
    const precoMaximo = numero(precoMaximoSelecionado);
    const cartas = document.querySelectorAll('.carta');

    if (precoMaximoSelecionado.trim() !== '' && precoMaximo === null) {
        alert('Digite o preço no formato 5.000,00.');
        return;
    }

    cartas.forEach(function (carta) {
        const categoriaCarta = carta.dataset.categoria;
        const precoCarta = numero(carta.dataset.preco);

        let mostrarCarta = true;

        const temFiltroDeCategoria = categoriaSelecionada !== '';

        const cartaNaoBateComFiltroDeCategoria = categoriaSelecionada.toLowerCase() !== categoriaCarta.toLowerCase();

        if (temFiltroDeCategoria && cartaNaoBateComFiltroDeCategoria) {

            mostrarCarta = false;

        }

        if (precoMaximo !== null && precoCarta > precoMaximo) {

            mostrarCarta = false;

        }

        if (mostrarCarta) {

            carta.classList.add('mostrar');
            carta.classList.remove('esconder');


        } else {

            carta.classList.remove('mostrar');
            carta.classList.add('esconder');

        }

    });

});
