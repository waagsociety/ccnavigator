import React from 'react';
import ReactModal from 'react-modal'


ReactModal.setAppElement('body');

const Modal = (props) =>

  <ReactModal
    isOpen={props.isOpen}
    onAfterOpen={() => {}}
    onRequestClose={props.onRequestClose}
    closeTimeoutMS={0}
    className="modal-content"
    overlayClassName="modal-overlay"
    contentLabel="..."
    ariaHideApp={true}
    shouldFocusAfterRender={true}
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEsc={true}
    shouldReturnFocusAfterClose={true}
    role="dialog"
    parentSelector={() => document.body}
    aria={{ labelledby: "heading",describedby: "full_description" }}
  >
    {props.children}
  </ReactModal>


export default Modal;
