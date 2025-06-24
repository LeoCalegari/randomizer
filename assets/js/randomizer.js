var randomized = false;

async function init() {
    // Fills out the database
    await fillDatabase();

    // Removes loading animation
    $("#loadingElement").remove();

    // Cicles the gifs after loading
    cicleGifs(0);
}

function cicleGifs(ms){
    setTimeout(() => {
        console.log("test");
        if(randomized === false) document.getElementById("loadingSection").style.backgroundImage = "URL('gif/init" + returnRandomIndex(23) + ".gif')";
        if(randomized === false) cicleGifs(5000);
    }, ms);
}

function returnRandomIndex(range){
    return Math.floor((Math.random() * range));
}

// --------------------------------------------------------------------------------------------------------
// var ultimoPersonagemRetornado = "";
// var randomizou = false;

// // *********
// // Animações
// // *********

// // Faz o ícone no botão de randomizar girar
// $('#btnRandomizar').hover(
//     function() {
//         let iBtnRandomizar = document.getElementById("iBtnRandomizar");

//         if(iBtnRandomizar.classList.contains("fa-spin")){
//             iBtnRandomizar.classList.remove("fa-spin");
//         }else{
//             iBtnRandomizar.classList.add("fa-spin");
//         }
//     }
// )

// // Faz os ítens com animação para expandir ter uma animação para minimizar
// $('.hover-expand-sm').hover(
//     function() {                
//         if(this.classList.contains("minimize-sm")) this.classList.remove("minimize-sm");
        
//         this.classList.add("minimize-sm");
//     }
// )
    
// $('.hover-expand-md').hover(
//     function() {                
//         if(this.classList.contains("minimize-sm")) this.classList.remove("minimize-sm");
        
//         this.classList.add("minimize-sm");
//     }
// )

// // *******
// // Funções
// // *******

// async function inicia() {
//     // Bloqueia o botão de randomizar
//     document.getElementById("btnRandomizar").disabled = true;

//     // Exibe carregamento
//     document.getElementById("cardboxCarregandoDados").style.display = "";

//     // Preenche database
//     await preencheDatabase();
    
//     // Adiciona obras no filtro
//     let filtroObra = document.getElementById("filtroObra");
//     await obraList.forEach(function(obraTemp){
//         let opcaoObra = document.createElement('option');
//         opcaoObra.selected = false;
//         opcaoObra.value = obraTemp;
//         opcaoObra.text = obraTemp;

//         filtroObra.add(opcaoObra);  
//     });
    
//     // Mostra lista de personagens
//     await preencheListaPersonagemHTML();
    
//     // Preenche o autocomplete
//     let autocompletePersonagemList = [];
//     await personagemList.forEach(function(personagem){
//         let autocompleteData = new Object();
//         autocompleteData.obra = personagem.obra;

//         let autocompletePersonagem = new Object();
//         autocompletePersonagem.value = personagem.nome;
//         autocompletePersonagem.data = autocompleteData;

//         autocompletePersonagemList.push(autocompletePersonagem);
//     });

//     // Terminou de carregar
//     document.getElementById("loadingGif").src = "";
//     document.getElementById("cardboxCarregandoDados").style.display = "none";

//     // ciclaGifs(0);

//     $("#cardboxPersonagemImagem").fadeIn("1000");
//     $("#cardboxListaPersonagem").fadeIn("1000");

//     // Desbloqueia o botão de randomizar
//     document.getElementById("btnRandomizar").disabled = false;

//     // Define o input autocomplete de busca manual de personagem
//     $('#filtroNomePersonagem').devbridgeAutocomplete({
//         lookup: autocompletePersonagemList,
//         minChars: 1,
//         onSelect: function (suggestion) {
//             retornaPersonagem(suggestion.value, suggestion.data.obra);
//         },
//         showNoSuggestionNotice: true,
//         noSuggestionNotice: 'Não foi encontrado nenhum personagem...',
//         groupBy: 'obra'
//     });

//     // Seleciona automaticamente o input de autocomplete
//     document.getElementById('filtroNomePersonagem').focus();
// }

// async function ciclaGifs(ms) {
//     setTimeout(() => {
//         if(randomizou === false) document.getElementById("bkgCardboxPersonagemImagem").style.backgroundImage = "URL('gif/init" + retornaIndexAleatorio(23) + ".gif')";
//         if(randomizou === false) ciclaGifs(5000);
//     }, ms);
    
// }

// async function ciclaImagens(ms) {
    
// }

// async function randomizar(){
//     randomizou = true;

//     // Remove classe que define altura mínima para rodar os GIFs
//     document.getElementById("bkgCardboxPersonagemImagem").classList.remove("min-height-550");

//     // Remove informações adicionais
//     btnExibirInfoAdicional.classList.remove("fa-chevron-up");
//     btnExibirInfoAdicional.classList.add("fa-chevron-down");

//     document.getElementById("divInfoAdicional").style.display = "none";

//     $("#divImagemReferencia").find("div").remove();

//     // Bloqueia o botão de randomizar
//     document.getElementById("btnRandomizar").disabled = true;
    
//     // Esconde o card
//     document.getElementById("cardboxPersonagemRetornado").style.display = "none";

//     // *****************
//     // Aplica os filtros
//     // *****************

//     let personagemListTemp = personagemList;

//     // Filtro de obra
//     let filtroObra = document.getElementById("filtroObra").value;
//     if(filtroObra != 0){
//         personagemListTemp = personagemListTemp.filter((personagem) => personagem.obra === filtroObra);
//     }

//     // Filtro de gênero
//     let filtroFeminino = document.getElementById("filtroFeminino").checked;
//     let filtroMasculino = document.getElementById("filtroMasculino").checked;
//     if(filtroFeminino && !filtroMasculino){
//         personagemListTemp = personagemListTemp.filter((personagem) => personagem.sexo === "F");
//     }else if(!filtroFeminino && filtroMasculino){
//         personagemListTemp = personagemListTemp.filter((personagem) => personagem.sexo === "M");  
//     }

//     // ******************************
//     // Retorna o personagem aleatório
//     // ******************************

//     // Remove ultimo personagem retornado da lista
//     if(personagemListTemp.length > 1) personagemListTemp = personagemListTemp.filter((personagem) => personagem.nome !== ultimoPersonagemRetornado);
    
//     // Retorna um personagem aleatório
//     let personagemRetornado = retornaObjetoAleatorio(personagemListTemp);
//     ultimoPersonagemRetornado = personagemRetornado.nome;

//     // Adiciona borda branca em volta do card de personagem
//     document.getElementsByClassName("personagem-retornado")[0].classList.add("white-border");

//     // *******************************************************
//     // Preenche com os dados do personagem aleatório retornado
//     // *******************************************************

//     await preencheCardboxPersonagem(personagemRetornado);
    
//     // Libera o botão para gerar novamente
//     setTimeout(() => {
//         document.getElementById("btnRandomizar").disabled = false;
//     }, 200);
// }

// async function preencheCardboxPersonagem(personagem){
//     randomizou = true;

//     // Dados básicos
//     document.getElementById("imgPersonagem").src = "img/personagens/" + (personagem.obra).toLowerCase() + "/" + (personagem.nome).toLowerCase() + "/0.png";
//     document.getElementById("personagem").innerText = personagem.nome;
//     document.getElementById("obra").innerText = personagem.obra;


//     /*  COMENTADO TEMPORARIAMENTE
//     // Variação
//     let variacaoSelecionada = personagem.variacaoList.length > 0 ? retornaObjetoAleatorio(personagem.variacaoList): "- - - - - -";
//     document.getElementById("variacao").innerText = variacaoSelecionada;
//     */
    
//     // Imagens de referência
//     if(personagem.numeroReferencia != null && personagem.numeroReferencia > 0){
//         let tamanhoCol = 12;
//         if(personagem.numeroReferencia == 2){
//             tamanhoCol = 6
//         }else if(personagem.numeroReferencia > 2){
//             tamanhoCol = 4
//         }

//         for(let i = 1; i <= personagem.numeroReferencia; i++){
//             let imagemReferenciaHTML = "<div class=\"col-sm-" + tamanhoCol + " text-center\"><img class=\"img-referencia img-rounded hover-expand-sm cursor-pointer text-center m-t-10 white-border-hover white-bkg\" src=\"img/personagens/" + (personagem.obra).toLowerCase() + "/" + (personagem.nome).toLowerCase() + "/" + i + ".png\" onError=\"trataPersonagemSemImagem();\" onclick=\"expandirImagem(this);\"/></div>";

//             $("#divImagemReferencia").append(imagemReferenciaHTML);
//         }
//     }else{
//         let imagemReferenciaHTML = "<div class=\"col-md-12 m-t-10\"><i>*Sem referências cadastradas*</i></div>";

//         $("#divImagemReferencia").append(imagemReferenciaHTML);
//     }

//     // Exibe os elementos
//     document.getElementById("imgPersonagem").style.display = "";
//     document.getElementById("personagem").style.display = "";
//     document.getElementById("obra").style.display = "";
//     document.getElementById("cardboxPersonagemImagem").style.display = "";
//     document.getElementById("divExibirInfoAdicional").style.display = "";
//     document.getElementById("iCopiar").style.display = "";

//     $("#cardboxPersonagemRetornado").fadeIn("1000");

//     // Altera o plano de fundo
//     document.getElementById("bkgCardboxPersonagemImagem").style.backgroundImage = "URL(\"img/obras/" + personagem.obra + "/0.png\")";
// } 

// async function preencheListaPersonagemHTML() {
//     let totalRegistros = obraList.length + personagemList.length;
//     let registrosPorColuna = Math.round(totalRegistros / 3);
//     let registrosAdicionados = 0;
//     let colunaAtual = 1;

//     for(let index = 0; index < obraList.length; index++){
//         let obra = obraList[index];

//         if(registrosAdicionados > 0 && registrosAdicionados / registrosPorColuna >= 1){
//             colunaAtual++;
//             registrosAdicionados = 0;
//         }

//         let ULObraId = await tratarString(obra);
//         let ULObraHTML = 
//                 `
//                     <span class="ul-title">${obra}</span>
//                     <ul class="ul-character" id="ul${ULObraId}"></ul>
//                 `;

//         $("#listaPersonagemColuna" + colunaAtual + "Label").append(ULObraHTML);

//         let personagemListTemp = personagemList.filter((personagem) => personagem.obra === obra);
//         for(let index2 = 0; index2 < personagemListTemp.length; index2++){
//             let personagem = personagemListTemp[index2];

//             let LIPersonagemHTML = 
//                 `
//                     <li class="li-character cursor-pointer hover-purple hover-expand-li" onclick="retornaPersonagem('${personagem.nome}', '${obra}')">${personagem.nome}</li>
//                 `;
        
//             $("#ul" + ULObraId).append(LIPersonagemHTML);

//             registrosAdicionados++;
//         }
//     }
// }

// function toggleFiltros(){
//     const filtros = document.getElementById("filtros");

//     if(filtros.classList.contains("display-none")){
//         $("#filtros").fadeIn("100");

//         filtros.classList.remove("display-none");
//     }else{
//         filtros.classList.add("display-none");
//     }
// }

// function exibeInfoAdicional(exibir){
//     let btnExibirInfoAdicional = document.getElementById("btnExibirInfoAdicional");

//     // Exibir
//     if(btnExibirInfoAdicional.classList.contains("fa-chevron-down")){
//         btnExibirInfoAdicional.classList.remove("fa-chevron-down");
//         btnExibirInfoAdicional.classList.add("fa-chevron-up");

//         $("#divInfoAdicional").fadeIn("1000");
//     // Não exibir
//     }else{
//         btnExibirInfoAdicional.classList.remove("fa-chevron-up");
//         btnExibirInfoAdicional.classList.add("fa-chevron-down");

//         document.getElementById("divInfoAdicional").style.display = "none";
//     }
// }

// async function retornaPersonagem(nomePersonagem, obra){
//     let personagemListTemp = personagemList;

//     personagemListTemp = personagemListTemp.filter((personagem) => personagem.nome === nomePersonagem && personagem.obra === obra);

//     // Adiciona borda branca em volta do card de personagem
//     document.getElementsByClassName("personagem-retornado")[0].classList.add("white-border");

//     // Remove informações adicionais
//     btnExibirInfoAdicional.classList.remove("fa-chevron-up");
//     btnExibirInfoAdicional.classList.add("fa-chevron-down");

//     document.getElementById("divInfoAdicional").style.display = "none";

//     $("#divImagemReferencia").find("div").remove();
    
//     // Esconde o card
//     document.getElementById("cardboxPersonagemRetornado").style.display = "none";

//     // Preenche o cardbox do personagem com os dados
//     await preencheCardboxPersonagem(personagemListTemp[0]);

//     // Scrolla até o cardbox
//     document.getElementById("cardboxPersonagemRetornado").scrollIntoView();
// } 

// function retornaObjetoAleatorio(lista) {
//     return lista[Math.floor((Math.random() * lista.length))];
// }

// function retornaIndexAleatorio(range){
//     return Math.floor((Math.random() * range));
// }

// function trataPersonagemSemImagem(){
//     document.getElementById("imgPersonagem").src = "img/personagens/semFoto.jpg";
// }

// function copiaPersonagemAreaTransferencia(elem){
//     let nomePersonagem = document.getElementById("personagem").innerText;
//     let obra = document.getElementById("obra").innerText;

//     navigator.clipboard.writeText(nomePersonagem + " " + obra);

//     elem.style.display = "none";
//     $(elem).fadeIn("1000");
// }

// async function expandirImagem(imgElement) {
//     let src = imgElement.src;

//     document.getElementById('expandedImage').src = imgElement.src;
//     document.getElementById('imageOverlay').classList.add('active');
//     document.body.style.overflow = 'hidden';
// }

// function fecharImagem() {
//     document.getElementById('imageOverlay').classList.remove('active'); // Remove a classe 'active' do overlay
//     document.body.style.overflow = ''; // Restaura o scroll da página
//     expandedImage.src = ''; // Limpa a src para economizar memória (opcional)
// }

// document.getElementById('imageOverlay').addEventListener('click', (event) => {
//     // Se o clique foi exatamente no overlay (não na imagem dentro dele)
//     if (event.target === imageOverlay) {
//         fecharImagem();
//     }
// });

// async function tratarString(string) {
//     string = string.replaceAll(" ", "");
//     string = string.replaceAll("'", "");
//     string = string.replaceAll(",", "");
//     string = string.replaceAll(".", "");

//     return string;
// }

// ------------------------------------------------------------------------------------------------------------------------------

