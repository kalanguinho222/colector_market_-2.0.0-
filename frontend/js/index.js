// butaun filtrar e preço :3

const botaoFiltrar = document.querySelector('.btn-filtrar');

botaoFiltrar.addEventListener("click", function () {

    const categoriaSelecionada = document.querySelector('#categoria').value;
    const precoMaximoSelecionado = document.querySelector('#preco').value;
    const cartas = document.querySelectorAll('.carta');

    cartas.forEach(function (carta) {

        function numero(txt) {
        const limpo = String(txt).trim().replace(/\./g, '').replace(',', '.');
        if (limpo === '') return null;
        const n = Number(limpo);
        return Number.isNaN(n) ? null : n;
        }


        const categoriaCarta = carta.dataset.categoria;
        const precoCarta = carta.dataset.preco;

        let mostrarCarta = true;

        const temFiltroDeCategoria = categoriaSelecionada !== '';

        const cartaNaoBateComFiltroDeCategoria = categoriaSelecionada.toLowerCase() !== categoriaCarta.toLowerCase();

        if (temFiltroDeCategoria && cartaNaoBateComFiltroDeCategoria) {

            mostrarCarta = false;

        }

        if (precoMaximoSelecionado !== '' && parseFloat(precoCarta) > parseFloat(precoMaximoSelecionado)) {

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

