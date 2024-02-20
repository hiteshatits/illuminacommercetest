/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import * as React from 'react';

/**
 * The payment error.
 */
export interface IPaymentError {
    title: string;
    message: string;
    className?: string;
}

/**
 * The payment error.
 * @param param0 - First param.
 * @param param0.title - Title.
 * @param param0.message - Message.
 * @param param0.className - ClassName.
 * @returns React node.
 */
export const ErrorComponent: React.FC<IPaymentError> = ({ title, message, className = 'ms-checkout-payment-instrument' }) => (
    <div className={`${className}__error`} role='alert' aria-live='assertive'>
        <p className={`${className}__error-title`}>{title}</p>
        <p className={`${className}__error-message`}>{message}</p>
    </div>
);
