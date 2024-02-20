/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

// eslint-disable-next-line import/no-anonymous-default-export -- Existing code.
export default `
    .chckt-sdk {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        font-weight: normal;
        font-size: 16px;
        line-height: 21px;
        margin-left: -7px;
        text-transform: none;
    }

    /* Card pannel */

    .chckt-pm,
    .chckt-pm__header,
    .chckt-pm__header:hover,
    .chckt-pm.chckt-pm-card.js-chckt-pm.chckt-pm--last-child.js-chckt-pm--selected,
    .js-chckt-pm--selected .js-chckt-pm__details {
        background-color: transparent;
        background: none !important;
    }

    .chckt-pm__header,
    .chckt-pm__details {
        padding-left: 0;
        padding-top: 0;
    }

    .chckt-pm.chckt-pm-card.js-chckt-pm.chckt-pm--last-child.js-chckt-pm--selected,
    .chckt-pm,
    .chckt-pm:first-child {
        border: none;
    }

    .chckt-form {
        margin-left: 53px;
    }

    .chckt-form--max-width {
        max-width: 430px;
    }

    @media only screen and (max-width: 400px) {
        .chckt-form {
            margin-left: auto;
        }

        .chckt-form--max-width {
            max-width: unset;
        }
    }

    /* Input fields */
    .chckt-input-field {
        background: white;
        box-shadow: none;
        border: 1px solid transparent;
        border-radius: 0;
        box-shadow: none;
        color: #1D1D1D;
        height: 50px;
        padding: 5px 8px;
    }

    .chckt-form-label {
        padding-bottom: 20px;
    }

    .chckt-form-label__text {
        color: #1D1D1D;
        font-size: 18px;
        line-height: 24px;
        padding-bottom: 4px;
    }

    /* Card holder name field */
    .chckt-input-field.js-chckt-holdername:hover {
        background: white;
    }

    /* Expiry date field */
    .chckt-form-label--exp-date {
        margin-right: 20px;
        width: 40%
    }
    /* Expiry date field -- has selected expiry date */
    .chckt-input-field--recurring {
        background: none;
        padding-left: 0;
    }

    /* CVV field */
    .chckt-form-label--cvc {
        width: 40%
    }

    /* Error text */
    .chckt-form-label__error-text {
        color: #A80000;
        font-size: 16px;
        line-height: 21px;
    }

    /* Error input field */
    .chckt-input-field--error {
        border-left: 2px solid #A80000;
    }

    /* Radio button */
    .chckt-pm__radio-button {
        height: 24px;
        margin-left: 0;
        margin-right: 20px;
        margin-top: 0;
        padding-top: 0;
        width: 24px;
    }

    .chckt-pm__name {
        color: #1D1D1D;
    }

    /* Checkbox */
    .chckt-checkbox {
        margin: 7px 12px 3px 1px;
    }

    /* More payment methods button */
    .chckt-pm-list__button {
        background: #fff;
        border: 1px solid #4C833A;
        border-radius: 2px;
        color: #1D1D1D;
        font-size: 18px;
        font-weight: normal;
        height: 48px;
        line-height: 24px;
        padding: 12px 20px;
        text-transform: none;
        min-width: 160px;
        text-align: center;
        width: initial;
    }

    .chckt-pm-list__button:hover {
        background: #E1EFDC;
        color: #1D1D1D;
    }

    .chckt-more-pm-button__icon {
        display: none;
    }

    .chckt-more-pm-button__text {
        float: none;
        margin-left: 0;
        margin-top: 0;
        padding-top: 0;
    }

    .chckt-pm__details input[disabled] + span {
        color: #ccc !important;
    }
`;
