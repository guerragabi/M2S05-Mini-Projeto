document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-add-interesse').addEventListener('click', addInteresse)
    document.getElementById('btn-clear').addEventListener('click', limparLista)
    document.getElementById('input-interesse').addEventListener('keypress', function(e){
        if (e.key === 'Enter') {
            addInteresse()
        };
    })
    carregarInteresses()
    setInterval(carregarInteresses, 1000)
    fetchIBGENews()
})

// Função que adiciona interesses à lista
function addInteresse() {
    // console.log('funciona')
    const inputInteresse = document.getElementById('input-interesse')
    const novoInteresse = inputInteresse.value

    if (novoInteresse !== '') {
        addInteresseLista(novoInteresse)
        salvarInteresse(novoInteresse)
        inputInteresse.value = ''
    } else {
        alert("Digite um interesse")
    }    
}

// Função que adiciona interesses à lista
function addInteresseLista(novoInteresse){
    const listaInteresses = document.getElementById('lista-interesses')

    const itemLista = document.createElement('li')
    itemLista.className = 'item-lista'

    const textoItem = document.createElement('span')
    textoItem.textContent = novoInteresse

    const removeItem = document.createElement('button')
    removeItem.className = 'remove-item'
    removeItem.textContent = 'Remover'
    removeItem.addEventListener('click', () => {
        removerItem(novoInteresse, itemLista)
    })

    itemLista.appendChild(textoItem)
    itemLista.appendChild(removeItem)
    listaInteresses.appendChild(itemLista)
}

// Função que salva interesses no localStorage
function salvarInteresse(novoInteresse){
    let interesses = localStorage.getItem('interesses') ? JSON.parse(localStorage.getItem('interesses')) : []
    interesses.push(novoInteresse)
    localStorage.setItem('interesses', JSON.stringify(interesses))
}

// Função que carrega interesses do localStorage
function carregarInteresses(){
    const listaInteresses = document.getElementById('lista-interesses')
    listaInteresses.innerHTML = ''

    let interesses = localStorage.getItem('interesses') ? JSON.parse(localStorage.getItem('interesses')) : []
    interesses.forEach(novoInteresse => {
        addInteresseLista(novoInteresse)
    })
}

// Função que limpa a lista
function limparLista() {
    localStorage.removeItem('interesses')
    document.getElementById('lista-interesses').innerHTML = ''
}

// Função que remove um item da lista
function removerItem(interesse, itemLista){
    const interesses = JSON.parse(localStorage.getItem('interesses')) || []
    localStorage.setItem('interesses', JSON.stringify(interesses.filter(item => item !== interesse)))
    itemLista.remove()
}

// Função de notícias
async function fetchIBGENews() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=release')
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText)
        }
        const data = await response.json()

        if (data.items && data.items.length > 0) {
            const firstNewsItem = data.items[0]
            const titleElement = document.querySelector('.titulo-noticia')
            titleElement.textContent = firstNewsItem.titulo
        } else {
            console.log('Nenhuma notícia encontrada.')
        }
    } catch (error) {
        console.error('Erro ao buscar notícias do IBGE:', error)
    }
}
