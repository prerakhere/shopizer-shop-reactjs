import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { multilanguage } from "redux-multilanguage";
import WebService from "../../util/webService";

const NotifyMeModal = ({ show, onHide, productId, productName, strings }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(strings["PRODUCT.NOTIFY_INVALID_EMAIL"] || "Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await WebService.post(`product/${productId}/notify-stock`, { email });
      setMessage(strings["PRODUCT.NOTIFY_SUCCESS"] || "You'll be notified when back in stock!");
      setTimeout(() => {
        onHide();
        setEmail("");
        setMessage("");
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(strings["PRODUCT.NOTIFY_ALREADY_SUBSCRIBED"] || "You're already subscribed");
      } else {
        setError(strings["PRODUCT.NOTIFY_ERROR"] || "Failed to subscribe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{strings["PRODUCT.NOTIFY_ME"] || "Notify Me When Available"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{strings["PRODUCT.NOTIFY_DESCRIPTION"] || `Get notified when "${productName}" is back in stock.`}</p>
        <input
          type="email"
          className="form-control"
          placeholder={strings["PRODUCT.NOTIFY_EMAIL_PLACEHOLDER"] || "Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide} disabled={loading}>
          {strings["Cancel"] || "Cancel"}
        </button>
        <button className="btn btn-primary" onClick={handleSubscribe} disabled={loading}>
          {loading ? (strings["Loading"] || "Loading...") : (strings["PRODUCT.NOTIFY_SUBSCRIBE"] || "Subscribe")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default multilanguage(NotifyMeModal);
