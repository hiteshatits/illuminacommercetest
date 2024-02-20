/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

// eslint-disable-next-line import/no-anonymous-default-export -- Existing code.
export default `
    .adyen-dropin {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        font-weight: normal;
        font-size: 16px;
        line-height: 21px;
        margin-left: -7px;
        text-transform: none;
    }

    /* Card pannel */

    .adyen-checkout__payment-method--next-selected,
    .adyen-checkout__payment-method:last-child {
        background-color: transparent;
        background: none !important;
        border: none;
    }

    .adyen-checkout__payment-method__name {
        color: #1D1D1D;
        font-weight: normal;
    }

    .adyen-checkout__label__text--error,
    .adyen-checkout__helper-text,
    .adyen-checkout__label__text {
        color: #1D1D1D;
        font-size: 18px;
        line-height: 24px;
        padding-bottom: 4px;
    }

    .adyen-checkout__error-text {
        color: #A80000;
        font-size: 16px;
        line-height: 21px;
    }

    .adyen-checkout__input {
        background: white;
        box-shadow: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
        color: #1D1D1D;
        height: 42px;
        padding: 5px 8px;
    }

    .adyen-checkout__input--focus,
    .adyen-checkout__input--focus:hover,
    .adyen-checkout__input:active,
    .adyen-checkout__input:active:hover,
    .adyen-checkout__input:focus,
    .adyen-checkout__input:focus:hover {
        border: 1px dashed #fff;
        outline: 1px dashed #000;
        box-shadow: none;
    }

    .adyen-checkout__input:hover {
        border: none;
    }

    .adyen-checkout__input--error,
    .adyen-checkout__input--error:hover,
    .adyen-checkout__input--invalid,
    .adyen-checkout__input--invalid:hover {
        border: none;
        border-left: 2px solid #A80000;
        color: #A80000;
    }

    .adyen-checkout__label--focused .adyen-checkout__label__text {
        color: inherit;
    }
`;
