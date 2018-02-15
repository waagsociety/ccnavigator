import ReactModal from 'react-modal'
import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';

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
    className={css(Style.modalContent)}
    overlayClassName={css(Style.modalOverlay)}
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
    <Link to="/" className={css(Style.close)}>&times;</Link>
    {props.children}
  </ReactModal>


export default Modal;
