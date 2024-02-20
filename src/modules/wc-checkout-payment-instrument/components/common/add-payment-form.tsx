/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { Button } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

import { Iframe } from './iframe';
import defaultPaymentConnectorDropinStyle from './payment-instrument.dropin.style';
import defaultPaymentConnectorPaypalStyle from './payment-instrument.paypal.style';
import defaultPaymentConnectorStyle from './payment-instrument.style';

/**
 * Interface for add payment form.
 */
export interface IAddPaymentFormProps {
    acceptPageUrl?: string;
    acceptPageContent?: string;
    iframeRef?: React.RefObject<Iframe>;
    canSubmit?: boolean;
    canCancel?: boolean;
    hasSelectedItem?: boolean;
    iFrameHeightOverride?: number;
    style?: string;
    requestUrlOrigin?: string;
    messageOrigin?: string;
    isFetchingPaymentConnector?: boolean;
    paymentStyleOverride?: string;
    className?: string;
    moduleName?: string;
    resources: {
        cancelButtonText: string;
        submitButtonText: string;
        iframeAriaLabel: string;
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention -- For IFrame.
    onIFrameMessage?(event: MessageEvent): void;
    onSubmit?(): void;
    onCancel?(): void;
}

/**
 * AddPaymentForm SFC.
 * @param root0 - Root.
 * @param root0.acceptPageUrl - Accept page url.
 * @param root0.acceptPageContent - Accept page content.
 * @param root0.onSubmit - On submit.
 * @param root0.onCancel - On cancel.
 * @param root0.onIFrameMessage - On iFrame message.
 * @param root0.iframeRef - IFrame ref.
 * @param root0.canSubmit - Can submit.
 * @param root0.canCancel - Can cancel.
 * @param root0.iFrameHeightOverride - IFrame height override.
 * @param root0.requestUrlOrigin - Origin request url.
 * @param root0.messageOrigin - Message origin.
 * @param root0.isFetchingPaymentConnector - Is fetching payment connector.
 * @param root0.paymentStyleOverride - Payment style override.
 * @param root0.className - ClassName.
 * @param root0.moduleName - ModuleName.
 * @param root0.resources - Resources.
 * @param root0.resources.cancelButtonText - Cancel button text.
 * @param root0.resources.submitButtonText - Submit button text.
 * @param root0.resources.iframeAriaLabel - IFrame aria label.
 * @extends {React.FunctionComponent<IAddPaymentFormProps>}
 * @returns React nodes.
 */
export const AddPaymentFormComponent: React.FunctionComponent<IAddPaymentFormProps> = ({
    acceptPageUrl = '',
    acceptPageContent = '',
    onSubmit,
    onCancel,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Existing name.
    onIFrameMessage,
    iframeRef,
    canSubmit,
    canCancel,
    iFrameHeightOverride,
    requestUrlOrigin,
    messageOrigin,
    isFetchingPaymentConnector,
    paymentStyleOverride,
    className = 'ms-checkout-payment-instrument',
    moduleName = 'checkout-payment-instrument',
    resources: { cancelButtonText, submitButtonText, iframeAriaLabel }
}) => (
    <div className={classnames(`${className}__add`, { 'is-fetching': isFetchingPaymentConnector })}>
        <Iframe
            className={`${className}__add`}
            moduleName={moduleName}
            ref={iframeRef}
            iframeAriaLabel={iframeAriaLabel}
            displayContent={acceptPageContent}
            sourceUrl={acceptPageUrl}
            requestUrlOrigin={requestUrlOrigin}
            messageOrigin={messageOrigin}
            onIFrameMessage={onIFrameMessage}
            height={iFrameHeightOverride}
            css={
                paymentStyleOverride ??
                defaultPaymentConnectorStyle + defaultPaymentConnectorDropinStyle + defaultPaymentConnectorPaypalStyle
            }
        />
        {canSubmit && (
            <Button className={`${className}__btn-save`} title={submitButtonText} color='primary' onClick={onSubmit}>
                {submitButtonText}
            </Button>
        )}
        {canCancel && (
            <Button className={`${className}__btn-cancel`} title={cancelButtonText} color='secondary' onClick={onCancel}>
                {cancelButtonText}
            </Button>
        )}
    </div>
);

export default React.memo(AddPaymentFormComponent);
