'use strict'

// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value
  console.log(`classification_id is: ${classification_id}`)
  let classIdURL = "/inv/getInventory/"+classification_id
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log('There was a problem: ', error.message)
    })
})

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  // Set up the table labels 
  let dataTable = '<thead>';
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body 
  dataTable += '<tbody>';
  // Iterate over all vehicles in the array and put each in a row 
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>`;
    dataTable += `<td><button class="add-to-cart" data-id="${element.inv_id}">Add to Cart</button></td></tr>`;
  })
  dataTable += '</tbody>';
  // Display the contents in the Inventory Management view 
  inventoryDisplay.innerHTML = dataTable;

  // Add event listeners to "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      const invId = this.getAttribute("data-id");
      fetch("/inv/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inv_id: invId })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        // Redirect to cart page to show updated cart
        window.location.href = "/inv/cart";
      })
      .catch(error => {
        console.error("Error adding to cart:", error);
      });
    });
  });
}

// Add event listener for Add to Cart button on detail page
const addToCartDetailButton = document.getElementById("add-to-cart-detail");
if (addToCartDetailButton) {
  addToCartDetailButton.addEventListener("click", function () {
    const invId = this.getAttribute("data-id");
    fetch("/inv/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inv_id: invId })
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      // Redirect to cart page to show updated cart
      window.location.href = "/inv/cart";
    })
    .catch(error => {
      console.error("Error adding to cart:", error);
    });
  });
}
