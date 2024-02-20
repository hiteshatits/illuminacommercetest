/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/**
 * Payment connect post message type.
 */
export enum PaymentConnectorPostMessageType {
    CardPrefix = 'msax-cc-cardprefix',
    Error = 'msax-cc-error',
    Height = 'msax-cc-height',
    Result = 'msax-cc-result',
    Submit = 'msax-cc-submit',
    ExtraContext = 'msax-cc-extracontext',
    Redirect = 'msax-cc-redirect',
    Showoverlay = 'msax-cc-showoverlay',
    Hideoverlay = 'msax-cc-hideoverlay',
    ShippingAddress = 'msax-shipping-address'
}

/**
 * Interface for payment connector post message.
 */
export interface IPaymentConnectorPostMessage {
    message: string;
    targetOrigin: string;
}

/**
 * Payment connector message.
 * @param data - Data with message.
 * @param messageType - Message type.
 * @returns Payment connector post message.
 */
export function paymentConnectorMessage(data: string, messageType: PaymentConnectorPostMessageType): IPaymentConnectorPostMessage {
    return {
        message: JSON.stringify({
            type: messageType,
            value: data
        }),
        targetOrigin: '*'
    };
}

/**
 * Payment connector extra context message.
 * @param data - The data.
 * @returns The payment connector post message.
 */
export function paymentConnectorExtraContextMessage(data: string): IPaymentConnectorPostMessage {
    return paymentConnectorMessage(data, PaymentConnectorPostMessageType.ExtraContext);
}

/**
 * Payment connector submit message.
 * @returns The payment connector post message.
 */
export function paymentConnectorSubmitMessage(): IPaymentConnectorPostMessage {
    return paymentConnectorMessage('true', PaymentConnectorPostMessageType.Submit);
}
