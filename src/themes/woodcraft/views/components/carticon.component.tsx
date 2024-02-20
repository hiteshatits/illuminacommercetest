/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { IComponent, IComponentProps, msdyn365Commerce } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { format, getPayloadObject, getTelemetryAttributes, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import { observer } from 'mobx-react';
import * as React from 'react';

/**
 * ICartIconData: Interface for Cart Icon Data.
 */
export interface ICartIconData {
    cart?: ICartState;
}

/**
 * ICartIconComponentProps: Interface for Cart Icon component props.
 */
export interface ICartIconComponentProps extends IComponentProps<ICartIconData> {
    className?: string;
    cartLabel: string;
    cartQtyLabel: string;
    telemetryContent?: ITelemetryContent;
}

/**
 * ICartIconComponent: Interface for Cart Icon component.
 */
export interface ICartIconComponent extends IComponent<ICartIconComponentProps> {
}

const CartIconComponentActions = {};

/**
 *
 * CartIcon component.
 * @extends {React.FC<ICartIconComponentProps>}
 */
const CartIcon: React.FC<ICartIconComponentProps> = observer((props: ICartIconComponentProps) => {
    const { cartLabel, cartQtyLabel, data: { cart } } = props;
    const defaultCartItemCount: number = 0;

    // If there are invoice lines, don't update mini cart item quantity
    let cartItem = defaultCartItemCount;

    if (cart) {
        cartItem = cart.hasInvoiceLine ? defaultCartItemCount : cart.totalItemsInCart;
    }

    let qtyLabel: string = '';
    const cartMaxQuantity: number = 99;
    const maxQuantityLabel: string = '99+';
    if (cartItem > cartMaxQuantity) {
        qtyLabel = maxQuantityLabel;
    } else {
        qtyLabel = format(cartQtyLabel, cartItem);
    }
    const label = format(cartLabel, cartItem);

    // Construct telemetry attribute to render
    const payLoad = getPayloadObject('click', props.telemetryContent!, 'cart-icon', '');
    const attributes = getTelemetryAttributes(props.telemetryContent!, payLoad);
    const style: React.CSSProperties = {
        visibility: cart ? 'visible' : 'hidden'
    };
    return (
        <div
            className='msc-cart-icon' role='button' aria-label={label}
            title={label}
            {...attributes}>
            <div className='msc-cart-icon__count' aria-hidden style={style}>
                {qtyLabel}
            </div>
        </div>
    );
});

// @ts-expect-error -- Compatible issue with the component override.
export const CartIconComponent: React.FunctionComponent<ICartIconComponentProps> = msdyn365Commerce.createComponentOverride<ICartIconComponent>(
    'CartIcon',
    { component: CartIcon, ...CartIconComponentActions }
);

export default CartIconComponent;
