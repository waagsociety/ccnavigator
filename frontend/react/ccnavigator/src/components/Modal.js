import ReactModal from 'react-modal'
import React from 'react';

/**
wraps ReactModal with some defaults
*/

ReactModal.setAppElement('body');

const customStyles = {
  overlay: {
    background : "#000c"
  },
  content : {
    background : "#e5e5e5",
    top                   : '10%',
    left                  : '20%',
    right                 : '10%',
    bottom                : '0%',
    borderRadius          : '0px',
    border                : 'none',
    padding               : "none"
  }
};

const Modal = (props) =>

  <ReactModal
    isOpen={props.isOpen}
    onAfterOpen={() => {}}
    onRequestClose={() => {}}
    closeTimeoutMS={0}
    style={customStyles}
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
