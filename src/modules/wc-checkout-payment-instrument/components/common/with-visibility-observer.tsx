/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import * as React from 'react';

/**
 * Visibility observer state.
 */
interface IVisibilityObserverState {
    isVisible?: boolean;
    errorMessage?: string;
    observer?: MutationObserver;
}

/**
 * Visibility observer props.
 */
export interface IVisibilityObserverProps {
    visibilityObserver?: IVisibilityObserverState;
}

/**
 * With visibility observer.
 * @param WrappedComponent - Wrapped component.
 * @param className - ClassName.
 * @returns React node.
 */
export const withVisibilityObserver = <P extends IVisibilityObserverProps>(
    WrappedComponent: React.ComponentType<P>,
    className = 'ms-checkout-payment-instrument'
): React.ComponentType<P> => {
    /**
     *
     * VisibilityObserver component.
     * @extends {React.Component<P>}
     */
    class VisibilityObserver extends React.Component<P> {
        // eslint-disable-next-line react/state-in-constructor -- Existing pattern.
        public state: IVisibilityObserverState = {
            isVisible: false,
            // eslint-disable-next-line react/no-unused-state -- Need show error.
            errorMessage: '',
            observer: undefined
        };

        private readonly selfRef: React.RefObject<HTMLDivElement> = React.createRef();

        public componentDidMount(): void {
            this.initMutationObserver();
        }

        public componentWillUnmount(): void {
            this.stopMutationObserver();
        }

        public shouldComponentUpdate(nextProps: IVisibilityObserverProps, nextState: IVisibilityObserverState): boolean {
            if (this.state === nextState && this.props === nextProps) {
                return false;
            }
            return true;
        }

        public render(): JSX.Element | null {
            return (
                <div className={`${className}__mutation-observer`} ref={this.selfRef}>
                    <WrappedComponent {...this.props} visibilityObserver={this.state} />
                </div>
            );
        }

        /**
         * Initial mutation observer.
         */
        private readonly initMutationObserver = (): void => {
            // Select the node that will be observed for mutations
            const targetNode = document.getElementsByTagName('body')[0];
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Better double check.
            if (!targetNode) {
                this.setState({
                    // eslint-disable-next-line react/no-unused-state -- Need show error.
                    errorMessage: 'No body element found'
                });
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Better double check.
            if (!MutationObserver) {
                this.setState({
                    // eslint-disable-next-line react/no-unused-state -- Need show error.
                    errorMessage: 'MutationObserver is not supported'
                });
                return;
            }

            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: true, subtree: true };

            // Create an observer instance linked to the callback function
            const mutationObserver = new MutationObserver(() => {
                this.handleVisibilityChange();
            });
            mutationObserver.observe(targetNode, config);

            this.setState({
                observer: mutationObserver
            });
        };

        /**
         * Stop mutation observer.
         */
        private readonly stopMutationObserver = (): void => {
            this.state.observer?.disconnect();
        };

        /**
         * Handle visibility change.
         */
        private readonly handleVisibilityChange = (): void => {
            // If module is visible or not
            const isVisible = !!this.selfRef.current && this.selfRef.current.offsetWidth > 0 && this.selfRef.current.offsetHeight > 0;
            if (!this.state.isVisible && isVisible) {
                this.setState({
                    isVisible
                });
                this.stopMutationObserver();
            }
        };
    }

    return VisibilityObserver;
};
