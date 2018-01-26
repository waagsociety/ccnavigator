import ReactModal from 'react-modal'
import React from 'react';

/**
wraps ReactModal with some defaults
*/

ReactModal.setAppElement('body');

const Modal = (props) =>

  <ReactModal
    isOpen={props.isOpen}
    onAfterOpen={() => {}}
    onRequestClose={() => {}}
    closeTimeoutMS={0}
    style={{ overlay: {background : "#fffb"}, content: {background : "#eee"} }}
    contentLabel="Example Modal"
    ariaHideApp={true}
    shouldFocusAfterRender={true}
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEsc={true}
    shouldReturnFocusAfterClose={true}
    role="dialog"
    parentSelector={() => document.body}
    aria={{
      labelledby: "heading",
      describedby: "full_description"
    }}
  >
    {props.children}
  </ReactModal>


export default Modal;
