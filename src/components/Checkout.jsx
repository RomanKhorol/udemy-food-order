import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormater } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import { useHttp } from "../hooks/useHttp";
import Error from "./Error";
const configObject = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const totalPrice = cartCtx.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const { error, data, isLoading, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    configObject
  );
  function hideCheckout() {
    userProgressCtx.hideCheckOut();
  }
  function handleFinish() {
    hideCheckout();
    cartCtx.clearCart();
    clearData();
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={hideCheckout}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );
  if (isLoading) {
    actions = <span>Sending order data...</span>;
  }
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Succes!!!</h2>
        <p>Your order is submited succesfully.</p>
        <p>
          We will get back to you with mor details via email within the next few
          minutes.
        </p>
        <p className="modal-action">
          <Button onClick={handleFinish}>Okey</Button>
        </p>
      </Modal>
    );
  }
  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={hideCheckout}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormater.format(totalPrice)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
