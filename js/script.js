// Função para adicionar formatação ao texto selecionado
function addFormatting(mark) {
    var inputText = document.getElementById("inputText");
    var start = inputText.selectionStart;
    var end = inputText.selectionEnd;
    var selectedText = inputText.value.substring(start, end);
    var formattedText = mark + selectedText + mark;
    inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

    updatePreview();
}

// Função para adicionar uma lista ao texto
function addList(type) {
    var inputText = document.getElementById("inputText");
    var start = inputText.selectionStart;
    var end = inputText.selectionEnd;
    var selectedText = inputText.value.substring(start, end);
    var listItems = selectedText.split('\n');
    var formattedText = "";

    if (type === "ul") {
        formattedText = listItems.map(item => "- " + item).join("\n");
    } else if (type === "ol") {
        var index = 1;
        formattedText = listItems.map(item => {
            if (item.startsWith(index + ".")) {
                index++;
                return item.replace(/^\d+\./, index - 1 + ".");
            } else if (item.startsWith((index - 1) + ".")) {
                return item.replace(/^\d+\./, index - 1 + ".1.");
            } else if (item.startsWith((index - 1) + ".1.")) {
                return item.replace(/^\d+\.\d+\./, index - 1 + ".2.");
            } else {
                index++;
                return index - 1 + ". " + item;
            }
        }).join("\n");
    }

    inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

    updatePreview();
}

// Função para abrir o modal de emojis
function openEmojiModal() {
    var modal = document.getElementById("emojiModal");
    modal.style.display = "block";
}

// Função para fechar o modal de emojis
function closeEmojiModal() {
    var modal = document.getElementById("emojiModal");
    modal.style.display = "none";
}

// Função para inserir um emoji no texto
function insertEmoji(emoji) {
    var inputText = document.getElementById("inputText");
    var start = inputText.selectionStart;
    var end = inputText.selectionEnd;
    var selectedText = inputText.value.substring(start, end);
    var formattedText = emoji;

    inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

    updatePreview();
    closeEmojiModal();
}

// Função para atualizar a visualização com o texto formatado
function updatePreview() {
    var inputText = document.getElementById("inputText");
    var previewText = document.getElementById("previewText");
    var formattedText = inputText.value
        .replace(/\*([^\*]+)\*/g, "<b>$1</b>")
        .replace(/\_([^\_]+)\_/g, "<i>$1</i>")
        .replace(/\~([^\~]+)\~/g, "<strike>$1</strike>")
        .replace(/\n\-\s/g, "<br>- ")
        .replace(/\n\d+\.\s/g, "<br>1. ");

    previewText.innerHTML = formattedText;
}

// Função para copiar o texto e confirmar a cópia!
function copyText() {
    var inputText = document.getElementById("inputText");
    inputText.select();
    inputText.setSelectionRange(0, 99999)
    //document.execCommand('copy');

    if(inputText.value === null  || inputText.value === '') {
        alert('Sem mensagem para cópia!')
    } else {
        navigator.clipboard.writeText(inputText.value)
        confirm(`A mensagem: ${inputText.value} foi copiada com sucesso!`)
    }
    eraseText();
}

// Função para apagar a mensagem selecionada
function eraseText () {
    var inputText = document.getElementById("inputText");
    var previewText = document.getElementById("previewText");
    
    inputText.value = '';
    previewText.innerHTML = null;
}

// Função para selecionar um modelo de mensagem
function selectModel() {
    var modelSelector = document.getElementById("modelSelector");
    var selectedModel = modelSelector.value;

    if (selectedModel === "Boas-vindas") {
        document.getElementById("inputText").value = "Olá! Bem-vindo(a) ao nosso grupo. Esperamos que você aproveite sua estadia e participe ativamente das discussões.";
    } else if (selectedModel === "Ola") {
        document.getElementById("inputText").value = "Olá! Como posso ajudar você hoje?";
    } else if (selectedModel === "Agradecimento") {
        document.getElementById("inputText").value = "Muito obrigado(a) pelo seu tempo e consideração. Agradecemos sua participação.";
    } else if (selectedModel === "ConfirmacaoPedido") {
        var nome = "*Nome do cliente*";
        var numeroPedido = "*Número do pedido*";
        document.getElementById("inputText").value = "Olá, " + nome + "! Seu pedido número " + numeroPedido + " foi confirmado. Em breve, entraremos em contato para fornecer mais informações.";
    } else if (selectedModel === "Promocao") {
        var nome = "*Nome do cliente*";
        document.getElementById("inputText").value = "Olá, " + nome + "! Temos uma promoção especial para você. Aproveite descontos incríveis em nossos produtos!";
    } else if (selectedModel === "Lembrete") {
        document.getElementById("inputText").value = "Apenas um lembrete amigável sobre nosso evento no próximo fim de semana. Esperamos vê-lo lá!";
    } else if (selectedModel === "Despedida") {
        document.getElementById("inputText").value = "Até logo! Desejamos um ótimo dia para você.";
    }

    updatePreview();
}