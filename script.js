"use strict";

let registros = JSON.parse(localStorage.getItem("registrosPonto")) || []

function registrarEntrada(){

let nome = document.getElementById("nome").value

if(nome.trim() === ""){
    alert("Digite o nome!")
    return
}

let agora = new Date()

let hora = agora.getHours() + ":" + agora.getMinutes()
let data = agora.toLocaleDateString()

let novoRegistro = {
    nome: nome,
    data: data,
    entrada: hora,
    saida: "-",
    horas: "-"
}

registros.push(novoRegistro)

salvarDados()
renderizarTabela()

document.getElementById("nome").value = ""

}

function calcularTotalHoras(){

let tabela = document.querySelector("table")

let totalMinutos = 0

for(let i = 1; i < tabela.rows.length; i++){

let texto = tabela.rows[i].cells[4].innerText

if(texto !== "-"){

let partes = texto.split(" ")

let horas = parseInt(partes[0].replace("h",""))
let minutos = parseInt(partes[1].replace("m",""))

totalMinutos += (horas * 60) + minutos

}

}

let totalHoras = Math.floor(totalMinutos / 60)
let restoMinutos = totalMinutos % 60

document.getElementById("totalHoras").innerText =
"Total trabalhado hoje: " + totalHoras + "h " + restoMinutos + "m"

}

function salvarDados(){
    localStorage.setItem("registrosPonto", JSON.stringify(registros))
}



function limparRegistros(){
localStorage.removeItem("registrosPonto")
location.reload()


}

function exportarRelatorio(){

let tabela = document.querySelector("table")

let dados = ""

for(let i = 0; i < tabela.rows.length; i++){

let linha = tabela.rows[i]

for(let j = 0; j < linha.cells.length - 1; j++){ 

dados += linha.cells[j].innerText + ";"

}

dados += "\n"

}

let blob = new Blob([dados], { type: "text/csv" })

let link = document.createElement("a")

link.href = URL.createObjectURL(blob)
link.download = "relatorio_ponto.csv"

link.click()

}

function filtrarTabela(){

let filtro = document.getElementById("filtroNome").value.toLowerCase()

let tabela = document.querySelector("table")

for(let i = 1; i < tabela.rows.length; i++){

let nome = tabela.rows[i].cells[0].innerText.toLowerCase()

if(nome.includes(filtro)){
tabela.rows[i].style.display = ""
}else{
tabela.rows[i].style.display = "none"
}

}

}



function renderizarTabela(){

    let tabela = document.querySelector("table")

    tabela.innerHTML = `
    <tr>
        <th>Nome</th>
        <th>Data</th>
        <th>Entrada</th>
        <th>Saída</th>
        <th>Horas</th>
        <th>Ações</th>
    </tr>
    `

    registros.forEach((reg, index) => {

        let linha = tabela.insertRow()

        linha.insertCell(0).innerText = reg.nome
        linha.insertCell(1).innerText = reg.data
        linha.insertCell(2).innerText = reg.entrada
        linha.insertCell(3).innerText = reg.saida
        linha.insertCell(4).innerText = reg.horas

        let celulaAcoes = linha.insertCell(5)

        let btnExcluir = document.createElement("button")
btnExcluir.innerText = "Excluir"
btnExcluir.onclick = function(){
    registros.splice(index, 1)
    salvarDados()
    renderizarTabela()
}

let btnEditar = document.createElement("button")
btnEditar.innerText = "Editar"
btnEditar.onclick = function(){

    let novoNome = prompt("Editar nome:", reg.nome)

    if(novoNome && novoNome.trim() !== ""){
        reg.nome = novoNome
        salvarDados()
        renderizarTabela()
    }
}

let btnSaida = document.createElement("button")
btnSaida.innerText = "Saída"
btnSaida.onclick = function(){

    if(reg.saida !== "-"){
        alert("Saída já registrada!")
        return
    }

    let agora = new Date()
    let h = agora.getHours()
    let m = agora.getMinutes()

    let [he, me] = reg.entrada.split(":").map(Number)

    let total = (h*60 + m) - (he*60 + me)

    reg.saida = h + ":" + m
    reg.horas = Math.floor(total/60) + "h " + (total%60) + "m"

    salvarDados()
    renderizarTabela()

        }

        celulaAcoes.appendChild(btnExcluir)
        celulaAcoes.appendChild(btnEditar)
        celulaAcoes.appendChild(btnSaida)

    })

    calcularTotalHoras()
}

window.onload = function(){
    renderizarTabela()
}

