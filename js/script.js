function saveModel() {
  let modelSelector = document.getElementById("inputText");
  let selectedModel = modelSelector.value;

  if (selectedModel) {
    // Recupera os modelos salvos do localStorage
    let savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

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

function loadModels() {
  let modelList = document.getElementById("modelList");
  modelList.innerHTML = "";

  // Recupera os modelos salvos do localStorage
  let savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

  if (savedModels.length === 0) {
    let noModelsText = document.createElement("p");
    noModelsText.className = "text-muted";
    noModelsText.textContent = "Nenhum modelo salvo.";
    modelList.className = "text-center";
    modelList.appendChild(noModelsText);
  }

  // Percorre os modelos e cria os cards
  for (let i = 0; i < savedModels.length; i++) {
    let model = savedModels[i];

    // Cria o card do modelo
    let modelCard = document.createElement("div");
    modelCard.className = "model-card";

    // Cria o texto do modelo
    let modelText = document.createElement("p");
    modelText.innerHTML = formatModelText(model); // Aplica a formatação ao texto
    modelCard.appendChild(modelText);

    // Cria o botão de exclusão
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm mr-3";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", deleteModel.bind(null, modelCard));
    modelCard.appendChild(deleteButton);

    // Cria o botão de cópia
    let copyButton = document.createElement("button");
    copyButton.className = "btn btn-info btn-sm copy-button";
    copyButton.textContent = "Copiar";
    copyButton.addEventListener("click", copyModelText.bind(null, modelText.innerText));
    modelCard.appendChild(copyButton);

    modelList.appendChild(modelCard);
  }
}
function formatModelText(text) {
  let formattedText = text
    .replace(/\*([^\*]+)\*/g, "<b>$1</b>")
    .replace(/\_([^\_]+)\_/g, "<i>$1</i>")
    .replace(/\~([^\~]+)\~/g, "<strike>$1</strike>")
    .replace(/\`([^`]+)\`(?![^<]*<\/code>)/g, "<code>$1</code>")
    .replace(/\n\-\s/g, "<br>- ")
    .replace(/\n\d+\.\s/g, "<br>1. ")
    .replace(/`/g, "")
    .replace(/\n/g, "<br>");

  return formattedText;
}

function deleteModel(card) {
  let modelList = document.getElementById("modelList");
  let modelText = card.querySelector("p").textContent;

  // Recupera os modelos salvos do localStorage
  let savedModels = JSON.parse(localStorage.getItem("savedModels")) || [];

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
  let textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  alert("Texto copiado para a área de transferência!");
}

loadModels();

function addFormatting(mark) {
  let inputText = document.getElementById("inputText");
  let start = inputText.selectionStart;
  let end = inputText.selectionEnd;
  let selectedText = inputText.value.substring(start, end);
  let formattedText = mark + selectedText + mark;
  inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

  updatePreview();
}
function addList(type) {
  let inputText = document.getElementById("inputText");
  let start = inputText.selectionStart;
  let end = inputText.selectionEnd;
  let selectedText = inputText.value.substring(start, end);
  let listItems = selectedText.split('\n');
  let formattedText = "";

  if (type === "ul") {
    formattedText = listItems.map(item => "- " + item).join("\n");
  } else if (type === "ol") {
    let index = 1;
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
function openEmojiModal() {
  let modal = document.getElementById("emojiModal");
  modal.style.display = "block";
}

function closeEmojiModal() {
  let modal = document.getElementById("emojiModal");
  modal.style.display = "none";
}

function insertEmoji(emoji) {
  let inputText = document.getElementById("inputText");
  let start = inputText.selectionStart;
  let end = inputText.selectionEnd;
  let selectedText = inputText.value.substring(start, end);
  let formattedText = emoji;

  inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

  updatePreview();
  closeEmojiModal();
}

function updatePreview() {
  let inputText = document.getElementById("inputText");
  let previewText = document.getElementById("previewText");

  let formattedText = inputText.value
    .replace(/\*([^\*]+)\*/g, "<b>$1</b>")
    .replace(/\_([^\_]+)\_/g, "<i>$1</i>")
    .replace(/\~([^\~]+)\~/g, "<strike>$1</strike>")
    .replace(/\`([^`]+)\`(?![^<]*<\/code>)/g, "<code>$1</code>")
    .replace(/\n\-\s/g, "<br>- ")
    .replace(/\n\d+\.\s/g, "<br>1. ")
    .replace(/`/g, "")
    .replace(/\n/g, "<br>");

  previewText.innerHTML = formattedText;
}
function copyText() {
  let inputText = document.getElementById("inputText");
  inputText.select();
  inputText.setSelectionRange(0, 99999)
  document.execCommand('copy');

  if (inputText.value === null || inputText.value === '') {
    alert('Sem mensagem para cópia!')
  } else {
    navigator.clipboard.writeText(inputText.value)
    confirm(`A mensagem: ${inputText.value} foi copiada com sucesso!`)
  }
  // Remova a chamada para a função eraseText() aqui
}


function clearFormatting() {
  let inputText = document.getElementById("inputText");
  let unformattedText = inputText.value.replace(/\*|_|~/g, "");

  inputText.value = unformattedText;

  updatePreview();
}

function fetchEmojis() {
  fetch('https://emoji-api.com/emojis?access_key=afbf73a432f34028d70288c21768f4195cd6e0b9')
      .then(response => response.json())
      .then(data => {
          let emojiContainer = document.getElementById('emojiContainer');
          let emojiSearchInput = document.getElementById('emojiSearch');

          emojiSearchInput.addEventListener('input', function () {
              let searchQuery = emojiSearchInput.value.toLowerCase();

              let filteredEmojis = data.filter(emoji => {
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
  let emojiContainer = document.getElementById('emojiContainer');
  emojiContainer.innerHTML = '';

  emojis.forEach(emoji => {
      let button = document.createElement('button');
      button.textContent = emoji.character;
      button.className = 'btn btn-primary';
      button.onclick = function () {
          insertEmoji(emoji.character);
          closeEmojiModal();
      };

      emojiContainer.appendChild(button);
  });
}
function insertEmoji(emoji) {
  let inputText = document.getElementById("inputText");
  let start = inputText.selectionStart;
  let end = inputText.selectionEnd;
  let selectedText = inputText.value.substring(start, end);
  let formattedText = emoji;

  inputText.value = inputText.value.substring(0, start) + formattedText + inputText.value.substring(end);

  updatePreview();
}

function closeEmojiModal() {
  let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.hide();
}
fetchEmojis();

function updateSaveButtonVisibility() {
  let previewText = document.getElementById("previewText").textContent;
  let saveModelButton = document.getElementById("saveModelButton");

  if (previewText.trim() === "") {
    saveModelButton.classList.add("d-none");
  } else {
    saveModelButton.classList.remove("d-none");
  }
}