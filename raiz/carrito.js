const checkoutButton = document.querySelector(".checkout");
const quantityButtons = document.querySelectorAll(".quantity button");
const removeButtons = document.querySelectorAll(".remove");

checkoutButton.addEventListener("click", () => {
  alert("Este es un avance visual. El pago se implementará próximamente.");
});

quantityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("La modificación de cantidades estará disponible en la siguiente versión.");
  });
});

removeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("La eliminación de productos todavía está en desarrollo.");
  });
});