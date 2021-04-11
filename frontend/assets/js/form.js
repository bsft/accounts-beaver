let itemIndex = 2;

function addItem() {
  const descriptionLabel = document.createElement("label");
  descriptionLabel.setAttribute("for", `item${itemIndex}-description`);
  descriptionLabel.innerText = `Item ${itemIndex} Description`;
  const descriptionInput = document.createElement("input");
  descriptionInput.setAttribute("type", "text");
  descriptionInput.setAttribute("name", `item${itemIndex}-description`);
  descriptionInput.setAttribute("id", `item${itemIndex}-description`);

  const quantityLabel = document.createElement("label");
  quantityLabel.setAttribute("for", `item${itemIndex}-quantity`);
  quantityLabel.innerText = `Item ${itemIndex} Quantity`;
  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("type", "text");
  quantityInput.setAttribute("name", `item${itemIndex}-quantity`);
  quantityInput.setAttribute("id", `item${itemIndex}-quantity`);

  const amountLabel = document.createElement("label");
  amountLabel.setAttribute("for", `item${itemIndex}-amount`);
  amountLabel.innerText = `Item ${itemIndex} Unit Price`;
  const amountInput = document.createElement("input");
  amountInput.setAttribute("type", "text");
  amountInput.setAttribute("name", `item${itemIndex}-amount`);
  amountInput.setAttribute("id", `item${itemIndex}-amount`);

  const container = document.createElement("div");
  container.setAttribute("id", `item${itemIndex}`);
  container.appendChild(descriptionLabel);
  container.appendChild(descriptionInput);
  container.appendChild(quantityLabel);
  container.appendChild(quantityInput);
  container.appendChild(amountLabel);
  container.appendChild(amountInput);

  const target = document.querySelector("#items-container");
  target.appendChild(container);
  itemIndex++;
}

document.querySelector("#add-item-btn").addEventListener("click", (e) => {
  e.preventDefault();
  addItem();
});
