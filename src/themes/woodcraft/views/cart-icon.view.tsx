/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { AddToCartBehavior } from '@msdyn365-commerce/components';
import MsDyn365, { getUrlSync } from '@msdyn365-commerce/core';
import { ICartIconViewProps, ICartViewProps, IFlyoutCartLineItemViewProps } from '@msdyn365-commerce-modules/cart';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Button, getPayloadObject, INodeProps, KeyCodes, Modal, Node, onTelemetryClick } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import React from 'react';

import { ICartIconProps as ICartIconExtensionProps } from '../definition-extensions/cart-icon.ext.props.autogenerated';

/**
 * ICartIconViewState: Interface for Cart Icon View State.
 */
interface ICartIconViewState {
    isModalOpen: boolean;
}

/**
 * Render Cart lines.
 * @param cartLines - Flyout cart line view props.
 * @param props - Cart icon view props.
 * @returns JSX Element.
 */
const renderCartlines = (cartLines: IFlyoutCartLineItemViewProps[] | undefined, props: ICartIconViewProps): JSX.Element[] | null => {
    if (!cartLines) {
        props.context.telemetry.error('Cartlines content is empty, module wont render');
        return null;
    }
    return cartLines.map((cartLine, index) => {
        const cartLineIndex = index;
        return (
            <Node {...props.miniCartItemWrapper} key={cartLineIndex}>
                <Node className={classnames(cartLine.storeLocation ? 'msc-cart-line__set-net-price' : '')} >
                    {cartLine.cartline}
                </Node>
                {cartLine.remove}
                {cartLine.storeLocation}
            </Node>
        );
    });
};

/**
 * Initiate total price.
 * @param props - Cart icon view props.
 * @returns JSX Element.
 */
const renderTotalPrice = (props: ICartIconViewProps & ICartIconExtensionProps<{}>): JSX.Element | null => {
    const cart = props.data.cart.result ?? undefined;
    const price = cart && !cart.hasInvoiceLine && (cart.cart.TotalAmount || undefined);
    const totalPrice = price ? props.context.cultureFormatter.formatCurrency(price) : props.context.cultureFormatter.formatCurrency(props.resources.emptyPrice);
    return (
        <div className='ms-cart-icon__subTotalText'>
            <span className='ms-cart-icon__subTotalPriceText'>
                {props.resources.totalPriceFormatString && props.resources.totalPriceFormatString.replace('{price}', '')}
                <span className='ms-cart-icon__subTotalPrice'>
                    {totalPrice}
                </span>
            </span>
        </div>
    );
};

/**
 *
 * CartIconView component.
 * @extends {React.PureComponent<ICartIconViewProps>}
 */
export class CartIconView extends React.PureComponent<ICartViewProps & ICartIconViewProps & ICartIconExtensionProps<{}>, ICartIconViewState> {

    private isAutoDisplayTriggered: boolean;

    public constructor(props: ICartViewProps & ICartIconViewState & ICartIconViewProps & ICartIconExtensionProps<{}>) {
        super(props);
        this.isAutoDisplayTriggered = false;
        this.state = {
            isModalOpen: false
        };
    }

    public componentDidMount(): void {
        if (MsDyn365.isBrowser) {
            window.addEventListener('keydown', this._escFunction, false);
        }
    }

    public componentWillUnmount(): void {
        if (MsDyn365.isBrowser) {
            window.removeEventListener('keydown', this._escFunction, false);
        }
    }

    /**
     * Render Cart Item count.
     * @returns JSX Element.
     */
    public render(): JSX.Element | null {
        const cart = this.props.data.cart.result ?? undefined;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- check config.
        const shouldShowMiniCart = cart?.isProductAddedToCart && this.props.context.app.config.addToCartBehavior === AddToCartBehavior.showMiniCart;
        if (shouldShowMiniCart) {
            if (!this.isAutoDisplayTriggered) {
                // First time trigger auto mini cart.
                this.setState({ isModalOpen: true });
                this.isAutoDisplayTriggered = true;
            } else if (!this.state.isModalOpen) {
                // If modal is closed, reset the flag.
                this.isAutoDisplayTriggered = false;
            }
        }
        return (
            <Node{...this.props.miniCartWrapper} {...this.props.renderModuleAttributes(this.props)}>
                <button
                    onClick={this._openModal} className='ms-cart-icon-wrapper msc-btn'>
                    {this.props.cartIcon}
                </button>
                <Node{...this._modalContainer()}>
                    <Node className='ms-cart-icon__header msc-modal__header'>
                        {this.props.flyoutTitle}
                        {this._renderCartItemCount(this.props)}
                        {this._renderCartCloseIcon()}
                    </Node>
                    <Node className='ms-cart-icon__body msc-modal__body'>
                        {this.props.data.cart.result?.isEmpty ? this.props.slots.emptyCart : null}
                        <Node {...this.props.CartlinesWrapper}>
                            {renderCartlines(this.props.cartlines, this.props)}
                        </Node>
                    </Node>
                    <Node className='ms-cart-icon__footer msc-modal__footer'>
                        {this.props.slots.promoContentItem}
                        {renderTotalPrice(this.props)}
                        <p className='ms-cart-icon__subtotal-message'>
                            {this.props.resources.subTotalMessage}
                        </p>
                        {this.props.checkoutAsSignInUserButton}
                        {this.props.checkoutAsGuestButton}
                        {this.props.data.cart.result?.isEmpty ? null : this.props.goToCartButton}
                        <Node className='ms-cart-icon__btn-section'>
                            {
                                this.props.data.cart.result?.isEmpty ? <Button
                                    className='ms-cart-icon__btn-backtoshopping'
                                    href={getUrlSync('home', this.props.context.actionContext)}
                                >
                                    {this.props.resources.continueShoppingButtonTitle}
                                </Button> : null
                            }
                        </Node>
                    </Node>
                </Node>
            </Node>
        );
    }

    /**
     * Initiate modal container.
     * @returns Inode props.
     */
    private readonly _modalContainer = (): INodeProps => {
        return {
            tag: Modal,
            placement: 'bottom-end',
            hideArrow: true,
            className: 'ms-cart-icon__minicartmodal-container',
            wrapClassName: 'ms-cart-icon__minicartmodal',
            isOpen: this.state.isModalOpen,
            toggle: this.closeModal
        };
    };

    /**
     * Initiate open modal.
     */
    private readonly _openModal = (): void => {
        const payLoad = getPayloadObject('click', this.props.telemetryContent!, 'cart-icon', '');
        onTelemetryClick(this.props.telemetryContent!, payLoad, 'cart-icon');
        this.setState({
            isModalOpen: true
        });
    };

    /**
     * Initiate close modal.
     */
    private readonly closeModal = (): void => {
        this.setState({
            isModalOpen: false
        });

    };

    /**
     * Initiate cart close Icon.
     * @returns JSX Element.
     */
    private readonly _renderCartCloseIcon = (): JSX.Element | null => {
        return (
            <Button
                className='ms-cart-icon__btn-close'
                aria-label='Close' onClick={this.closeModal} />
        );
    };

    /**
     * Render Cart Item count.
     * @param props - Cart icon view props.
     * @returns JSX Element.
     */
    private readonly _renderCartItemCount = (props: ICartIconViewProps & ICartIconExtensionProps<{}>): JSX.Element | null => {
        let cartItemCount;
        const defaultCartItemCount: number = 0;
        const defaultCartItemCountOne: number = 1;

        if (ArrayExtensions.hasElements(props.cartlines)) {
            if (props.cartlines.length === defaultCartItemCountOne) {
                cartItemCount = `${defaultCartItemCountOne} ${props.resources.item}`;
            } else {
                cartItemCount = `${props.cartlines.length} ${props.resources.items}`;
            }
        } else {
            cartItemCount = `${defaultCartItemCount} ${props.resources.items}`;
        }
        return (
            <Node className='ms-cart-icon__count' tabIndex='0'>
                {cartItemCount}
            </Node>
        );
    };

    /**
     * Handle escape click to close modal.
     * @param event - On press of any key.
     */
    private readonly _escFunction = (event: KeyboardEvent) => {
        if (event.keyCode === KeyCodes.Escape && this.state.isModalOpen) {
            this.closeModal();
        }
    };

}

export default CartIconView;
