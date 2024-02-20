/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import classnames from 'classnames';
import * as React from 'react';

import { IPaymentConnectorPostMessage } from './payment-instrument-message';

/**
 * Payment iFrame interface.
 */
export interface IPaymentFrameElementProps {
    className?: string;
    moduleName?: string;
    iframeAriaLabel: string;
    displayContent?: string;
    sourceUrl?: string;
    requestUrlOrigin?: string;
    messageOrigin?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- public props.
    css?: string;
    height?: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention -- public event.
    onIFrameMessage?(event: MessageEvent): void;
}

/**
 * Default post message name.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Existing name.
export const POST_MESSAGE_NAME = 'message';

/**
 * Get host name.
 * @param url - The url.
 * @returns The host name.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Public props.
const getHostName = (url: string = ''): string => {
    return (url.includes('//') ? url.split('/')[2] : url.split('/')[0]).toLowerCase();
};

/**
 *
 * IFrameElement component.
 * @extends {React.PureComponent<IPaymentFrameElementProps>}
 */
export class Iframe extends React.PureComponent<IPaymentFrameElementProps> {
    private readonly iframeRef: React.RefObject<HTMLIFrameElement>;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility -- Existing code.
    constructor(props: IPaymentFrameElementProps) {
        super(props);
        this.iframeRef = React.createRef();
    }

    public componentDidMount(): void {
        window.addEventListener(POST_MESSAGE_NAME, this.onEvent);

        this.updateContentDocument();
    }

    public componentDidUpdate(previousProps: IPaymentFrameElementProps): void {
        if (previousProps.displayContent !== this.props.displayContent) {
            this.updateContentDocument();
        }
    }

    public componentWillUnmount(): void {
        window.removeEventListener(POST_MESSAGE_NAME, this.onEvent);
    }

    public render(): JSX.Element | null {
        const { sourceUrl, className, iframeAriaLabel, height, moduleName = 'checkout-payment-instrument' } = this.props;
        return (
            <iframe
                title={iframeAriaLabel}
                className={classnames(`${moduleName}__iframe`, className)}
                aria-label={iframeAriaLabel}
                src={sourceUrl}
                ref={this.iframeRef}
                height={height}
                sandbox='allow-scripts allow-forms allow-same-origin allow-popups'
            />
        );
    }

    /**
     * Post message.
     * @param parameters - Payment connector post message.
     */
    public postMessage = (parameters: IPaymentConnectorPostMessage): void => {
        if (this.iframeRef.current?.contentWindow?.postMessage) {
            this.iframeRef.current.contentWindow.postMessage(parameters.message, parameters.targetOrigin);
        }
    };

    /**
     * On event.
     * @param event - The message event.
     */
    private readonly onEvent = (event: MessageEvent) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- IFrame.
        const { sourceUrl, onIFrameMessage, requestUrlOrigin, messageOrigin } = this.props;
        const sourceHost = getHostName(sourceUrl);
        const eventHost = getHostName(event.origin);
        const requestHost = getHostName(requestUrlOrigin);
        const messageHost = getHostName(messageOrigin);

        // Important: security check
        // check actual origin matches with expected origin
        if (
            !onIFrameMessage ||
            (sourceUrl && !(sourceHost === eventHost || requestHost === eventHost || messageHost === eventHost)) ||
            (!sourceUrl && !(requestHost === eventHost || messageHost === eventHost))
        ) {
            return;
        }

        onIFrameMessage(event);
    };

    /**
     * Update content document.
     */
    private readonly updateContentDocument = (): void => {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Existing props.
        const { displayContent, sourceUrl, css } = this.props;
        if (!sourceUrl && displayContent && this.iframeRef.current) {
            const innerDocument = this.iframeRef.current.contentDocument;

            if (innerDocument) {
                innerDocument.open();
                innerDocument.write(displayContent);
                if (css) {
                    // Append custom style
                    const style = document.createElement('style');
                    const cssNote = document.createTextNode(css);
                    style.appendChild(cssNote);
                    innerDocument.head.appendChild(style);
                }

                innerDocument.close();
            }
        }
    };
}
