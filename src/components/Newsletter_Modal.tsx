import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Newsletter_Modal = ({ isOpen, closeModal }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={closeModal}
        ></div>
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {" "}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3
              className="text-center text-lg font-medium leading-6 text-gray-900"
              id="modal-headline"
            >
              Subscribe to{" "}
              <a
                href="https://andrewstaylor.com/"
                target="_blank"
                className="text-decoration: underline"
              >
                Andrew's
              </a>{" "}
              Newsletter
            </h3>

            <div className="mt-5">
              <form
                method="post"
                action="https://sendfox.com/form/m7dwqr/3qk6dj"
                className="sendfox-form"
                id="3qk6dj"
                data-async="true"
                data-recaptcha="false"
              >
                <p className="flex flex-col items-center">
                  <input
                    type="email"
                    id="sendfox_form_email"
                    placeholder="Email"
                    name="email"
                    required
                    ref={inputRef}
                    className="rounded border-transparent bg-gradient-to-r from-purple-200 to-red-200 p-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </p>
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="a_password"
                    tabIndex={-1}
                    value=""
                    autoComplete="off"
                  />
                </div>
                <p className="flex justify-center pt-5">
                  <button
                    type="submit"
                    className="rounded bg-gradient-to-r from-purple-500 to-red-500 px-4 py-2 text-white"
                  >
                    Subscribe
                  </button>
                </p>
              </form>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter_Modal;
