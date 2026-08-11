(function () {
  "use strict";

  function createEasyOrder(button) {
    const product = button.dataset.product || "Товар";
    const price = Number(button.dataset.price || 0);

    const overlay = document.createElement("div");
    overlay.className = "easyorder-overlay";

    overlay.innerHTML = `
      <div class="easyorder-window">

        <button class="easyorder-close" type="button">&times;</button>

        <h2>Оформление заказа</h2>

        <div class="easyorder-product">
          <strong>${product}</strong>
          <span>$${price.toFixed(2)}</span>
        </div>

        <label>
          Количество
          <input class="easyorder-quantity" type="number" value="1" min="1">
        </label>

        <label>
          Ваше имя
          <input class="easyorder-name" type="text" placeholder="Введите имя">
        </label>

        <label>
          Телефон
          <input class="easyorder-phone" type="tel" placeholder="+380...">
        </label>

        <label>
          Email
          <input class="easyorder-email" type="email" placeholder="example@gmail.com">
        </label>

        <div class="easyorder-total">
          Сумма: $<span>0.00</span>
        </div>

        <button class="easyorder-submit" type="button">
          Оформить заказ
        </button>

        <div class="easyorder-message"></div>

      </div>
    `;

    document.body.appendChild(overlay);

    const quantity = overlay.querySelector(".easyorder-quantity");
    const total = overlay.querySelector(".easyorder-total span");
    const closeButton = overlay.querySelector(".easyorder-close");
    const submitButton = overlay.querySelector(".easyorder-submit");
    const message = overlay.querySelector(".easyorder-message");

    function updateTotal() {
      const qty = Math.max(1, Number(quantity.value) || 1);
      quantity.value = qty;
      total.textContent = (price * qty).toFixed(2);
    }

    updateTotal();

    quantity.addEventListener("input", updateTotal);

    closeButton.addEventListener("click", function () {
      overlay.remove();
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

    submitButton.addEventListener("click", async function () {

      const name = overlay.querySelector(".easyorder-name").value.trim();
      const phone = overlay.querySelector(".easyorder-phone").value.trim();
      const email = overlay.querySelector(".easyorder-email").value.trim();
      const qty = Math.max(1, Number(quantity.value) || 1);

      if (!name || !phone) {
        message.textContent = "Введите имя и телефон.";
        return;
      }

      const order = {
        product: product,
        price: price,
        quantity: qty,
        total: price * qty,
        name: name,
        phone: phone,
        email: email
      };

      message.textContent = "⏳ Отправляем заказ...";

      try {

        const response = await fetch(
          "https://easyorder.netw20200.workers.dev/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
          }
        );

        const data = await response.json();

        console.log("EasyOrder server:", data);

        if (data.success) {
          message.textContent = "✅ Заказ отправлен!";
        } else {
          message.textContent = "❌ Сервер не принял заказ.";
        }

      } catch (error) {

        console.error("EasyOrder error:", error);

        message.textContent =
          "❌ Не удалось связаться с сервером.";
      }

    });
  }

  function init() {

    document
      .querySelectorAll(".easyorder-buy")
      .forEach(function (button) {

        button.addEventListener("click", function () {
          createEasyOrder(button);
        });

      });

  }

  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", init);

  } else {

    init();

  }

})();
