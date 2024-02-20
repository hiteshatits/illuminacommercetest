/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { Waiting } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

/**
 * Payment waiting props.
 */
export interface IPaymentWaitingProps {
    message: string;
    className?: string;
}

/**
 * Payment waiting.
 * @param param0 - First in param.
 * @param param0.message - Message.
 * @param param0.className - ClassName.
 * @returns React node.
 */
export const WaitingComponent: React.FC<IPaymentWaitingProps> = ({ message, className = 'ms-checkout-payment-instrument' }) => (
    <div className={`${className}__loading-background`}>
        <Waiting />
        <span className={`${className}__loading-message`}>{message}</span>
    </div>
);
