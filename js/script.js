// Função para salvar o modelo da mensagem em localStorage

function saveModel() {
  var modelSelector = document.getElementById("inputText");
  var selectedModel = modelSelector.value;

  if (selectedModel) {
    // Recupera os modelos salvos do localStorage
    var savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

    // Verifica se o modelo já está salvo
    if (savedModels.includes(selectedModel)) {
      alert("Este modelo já está salvo.");
    } else {
      // Adiciona o novo modelo ao array
      savedModels.push(selectedModel);
      // Salva o array atualizado no localStorage
      localStorage.setItem("savedModels", JSON.stringify(savedModels));
    }
  } else {
    alert("Selecione um modelo antes de salvá-lo.");
  }
  loadModels();
}

// Função para recuperar os modelos salvos do localStorage

function loadModels() {
  var modelList = document.getElementById("modelList");
  modelList.innerHTML = "";

  // Recupera os modelos salvos do localStorage
  var savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

  // Percorre os modelos e cria os cards
  for (var i = 0; i < savedModels.length; i++) {
    var model = savedModels[i];

    // Cria o card do modelo
    var modelCard = document.createElement("div");
    modelCard.className = "model-card";

    // Cria o texto do modelo
    var modelText = document.createElement("p");
    modelText.textContent = model;
    modelCard.appendChild(modelText);

    // Cria o botão de exclusão
    var deleteButton = document.createElement("button");
    deleteButton.className = "button delete-button";

    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", function (event) {
      deleteModel(event.target.parentNode);
    });

    modelCard.appendChild(deleteButton);

    // Cria o botão de cópia
    var copyButton = document.createElement("button");
    copyButton.className = "button copy-button";
    copyButton.textContent = "Copiar";
    copyButton.addEventListener("click", function (event) {
      copyModelText(event.target.previousSibling.textContent);
    });
    modelCard.appendChild(copyButton);

    modelList.appendChild(modelCard);
  }
}

function deleteModel(card) {
  var modelList = document.getElementById("modelList");
  var modelText = card.querySelector("p").textContent;

  // Recupera os modelos salvos do localStorage
  var savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

  // Remove o modelo do array
  savedModels = savedModels.filter(function (model) {
    return model !== modelText;
  });

  // Atualiza o localStorage com os modelos restantes
  localStorage.setItem("savedModels", JSON.stringify(savedModels));

  // Remove o card do modelo da lista
  modelList.removeChild(card);
}

function copyModelText(text) {
  // Copia o texto do modelo para a área de transferência
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  alert("Texto copiado para a área de transferência!");
}

// Chama a função para carregar os modelos ao carregar a página
loadModels();


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
    .replace(/\`([^`]+)\`(?![^<]*<\/code>)/g, "<code>$1</code>")
    .replace(/\n\-\s/g, "<br>- ")
    .replace(/\n\d+\.\s/g, "<br>1. ")
    .replace(/`/g, "");

  previewText.innerHTML = formattedText;
}

// Função para copiar o texto e confirmar a cópia!
function copyText() {
  var inputText = document.getElementById("inputText");
  inputText.select();
  inputText.setSelectionRange(0, 99999)
  //document.execCommand('copy');

  if (inputText.value === null || inputText.value === '') {
    alert('Sem mensagem para cópia!')
  } else {
    navigator.clipboard.writeText(inputText.value)
    confirm(`A mensagem: ${inputText.value} foi copiada com sucesso!`)
  }
  eraseText();
}

// Função para apagar a mensagem selecionada
function eraseText() {
  var inputText = document.getElementById("inputText");
  var previewText = document.getElementById("previewText");

  inputText.value = '';
  previewText.innerHTML = null;
}

// Função para limpar formatação do texto
function clearFormatting() {
  var inputText = document.getElementById("inputText");
  var unformattedText = inputText.value.replace(/\*|_|~/g, "");

  inputText.value = unformattedText;

  updatePreview();
}

// Função para buscar emojis da API e exibi-los no modal
function fetchEmojis() {
  fetch('https://emoji-api.com/emojis?access_key=afbf73a432f34028d70288c21768f4195cd6e0b9')
    .then(response => response.json())
    .then(data => {
      var emojiContainer = document.getElementById('emojiContainer');
      var emojiSearchInput = document.getElementById('emojiSearch');

      emojiSearchInput.addEventListener('input', function () {
        var searchQuery = emojiSearchInput.value.toLowerCase();

        var filteredEmojis = data.filter(emoji => {
          return emoji.unicodeName.toLowerCase().includes(searchQuery);
        });

        renderEmojis(filteredEmojis);
      });

      renderEmojis(data);
    })
    .catch(error => {
      console.error('Erro ao buscar emojis:', error);
    });
}

function renderEmojis(emojis) {
  var emojiContainer = document.getElementById('emojiContainer');
  emojiContainer.innerHTML = '';

  emojis.forEach(emoji => {
    var button = document.createElement('button');
    button.textContent = emoji.character;
    button.onclick = function () {
      insertEmoji(emoji.character);
      closeEmojiModal();
    };

    emojiContainer.appendChild(button);
  });
}

function updateSaveButtonVisibility() {
  var previewText = document.getElementById("previewText").textContent;
  var saveModelButton = document.getElementById("saveModelButton");

  if (previewText.trim() === "") {
    saveModelButton.classList.add("d-none");
  } else {
    saveModelButton.classList.remove("d-none");
  }
}


// Chame a função fetchEmojis para buscar e exibir os emojis no modal
fetchEmojis();