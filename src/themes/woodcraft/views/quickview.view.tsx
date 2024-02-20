/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { AddToWishlistComponent, IWishlistActionErrorResult } from '@msdyn365-commerce/components';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { getConfigureErrors, IBuyboxAddToCartViewProps,
    IBuyboxCallbacks,
    IBuyboxCommonResources,
    IBuyboxKeyInPriceViewProps,
    IBuyboxProductConfigureDropdownViewProps,
    IBuyboxProductConfigureViewProps,
    IBuyboxProductQuantityViewProps,
    IBuyboxState,
    IQuickviewViewProps } from '@msdyn365-commerce-modules/buybox';
import { StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { IModuleProps, Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IQuickviewProps as IQuickviewPropsExtend } from '../definition-extensions/quickview.ext.props.autogenerated';

/**
 * RenderAddToCart.
 * @param addToCart - AddToCart.
 * @returns -- Returns.
 */
const renderAddToCart = (addToCart: IBuyboxAddToCartViewProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from Quickview.tsx file
    const { ContainerProps, errorBlock, button } = addToCart;

    return (
        <Node {...ContainerProps}>
            {errorBlock}
            {button}
        </Node>
    );
};

/**
 * Add to wishlist failed function.
 * @param callbacks -Buybox callbacks.
 * @param resources -Buybox resources.
 * @param product -Simple product.
 * @returns Update error state.
 */
const onAddToWishlistFailed = (callbacks: IBuyboxCallbacks | undefined,
    resources: IBuyboxCommonResources, product: SimpleProduct | undefined) => (result: IWishlistActionErrorResult) => {
    callbacks?.updateErrorState({
        errorHost: 'WISHLIST',
        configureErrors: result.status === 'MISSINGDIMENSION' ? getConfigureErrors(result.missingDimensions, resources, product?.IsGiftCard) : {}
    });
};

/**
 * RenderAddToWishlist.
 * @param props - Buybox viewprops.
 * @param state - Buybox state.
 * @param callbacks - Buybox callbacks.
 * @param product - Product data.
 * @returns -- Returns.
 */
const renderAddtoWishlistButton = (props: IQuickviewViewProps,
    state: IBuyboxState, callbacks: IBuyboxCallbacks | undefined, product: SimpleProduct): React.ReactNode => {
    const { context, resources } = props;
    const wishlists = props.data.wishlists.result;
    const isShowWishlitButtonText = true;
    return (
        <AddToWishlistComponent
            className='msc-add-to-cart-extra-actions'
            addToWishlistButtonText={resources.addToWishlistButtonText}
            removeFromWishlistButtonText={resources.removeFromWishlistButtonText}
            addToWishlistMessage={resources.addToWishlistMessage}
            removedFromWishlistMessage={resources.removedFromWishlistMessage}
            addItemToWishlistError={resources.addItemToWishlistError}
            removeItemFromWishlistError={resources.removeItemFromWishlistError}
            nameOfWishlist={resources.nameOfWishlist}
            data={{ product, wishlists }}
            context={context}
            id={props.id}
            typeName={props.typeName}
            onError={onAddToWishlistFailed(callbacks, resources, product)}
            getSelectedProduct={state.selectedProduct}
            showButtonText={isShowWishlitButtonText}
            showButtonTooltip={false}
        />
    );
};

/**
 * RenderAddToWishlist.
 * @param props - Buybox viewprops.
 * @param state - Buybox state.
 * @param callbacks - Buybox callbacks.
 * @returns -- Returns.
 */
const renderAddToWishlist = (props: IQuickviewViewProps,
    state: IBuyboxState, callbacks: IBuyboxCallbacks | undefined): JSX.Element | null => {
    const product = props.productDetails?.product;
    if (!props.addToWishlist || !product) {
        return null;
    }

    const wishlistButton = renderAddtoWishlistButton(props, state, callbacks, product);
    return (
        <Node {...props.addToWishlist.ContainerProps}>
            {props.addToWishlist.errorBlock}
            {wishlistButton}
        </Node>
    );
};

/**
 * RenderQuantity.
 * @param quantity - Quantity.
 * @param quantityLimitsMessages - QuantityLimitsMessages.
 * @param props - Props.
 * @returns -- Returns.
 */
const renderQuantity = (quantity: IBuyboxProductQuantityViewProps, quantityLimitsMessages: React.ReactNode, props: IQuickviewViewProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from Quickview.tsx file
    const { ContainerProps, LabelContainerProps, heading, input, errors } = quantity;
    const { unitOfMeasure } = props;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
            </Node>
            {input}
            {unitOfMeasure}
            {quantityLimitsMessages}
            {errors}
        </Node>
    );
};

/**
 * KenderKeyInPrice.
 * @param keyInPrice - KeyInPrice.
 * @returns -- Returns.
 */
const renderKeyInPrice = (keyInPrice: IBuyboxKeyInPriceViewProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from Quickview.tsx file
    const { ContainerProps, LabelContainerProps, heading, input } = keyInPrice;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
            </Node>
            {input}
        </Node>
    );
};

/**
 * RenderConfigureDropdown.
 * @param dropdown - Buybox product configure dropdown view props.
 * @returns -- Returns JSX.Element.
 */
const renderConfigureDropdown = (dropdown: IBuyboxProductConfigureDropdownViewProps): JSX.Element => {
    const { ContainerProps, LabelContainerProps, heading, errors, select } = dropdown;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
            </Node>
            {select}
            {errors}
        </Node>
    );
};

/**
 * RenderConfigure.
 * @param configure - Buybox product configure view props.
 * @returns -- Returns JSX.Element.
 */
const renderConfigure = (configure: IBuyboxProductConfigureViewProps): JSX.Element => {
    const { ContainerProps, dropdowns } = configure;

    return (
        <Node {...ContainerProps}>
            {dropdowns.map(renderConfigureDropdown)}
        </Node>
    );
};

/**
 * RenderBodyContent.
 * @param props - Props.
 * @returns -- Returns.
 */
const renderBodyContent = (props: IQuickviewViewProps & IQuickviewPropsExtend<{}>): JSX.Element => {
    const { price, keyInPrice, quantity, inventoryLabel, quantityLimitsMessages, loading,
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from Quickview.tsx file
        ProductInfoContainerProps, MediaGalleryContainerProps, CarouselProps, addToWishlist, configure, callbacks, state } = props;
    if (loading) {
        return (
            <>
                {loading}
            </>
        );
    }

    return (
        <>
            <Node {...MediaGalleryContainerProps}>
                <Node {...CarouselProps} />
            </Node>
            <Node {...ProductInfoContainerProps}>
                <Node className='msc-quickview__price-section'>
                    <Node className='msc-quickview__price-section-text'>
                        {props.resources.priceText}
                        {price}
                    </Node>
                    {addToWishlist && renderAddToWishlist(props, state, callbacks)}
                </Node>
                {configure && renderConfigure(configure)}
                {keyInPrice && renderKeyInPrice(keyInPrice)}
                {quantity && renderQuantity(quantity, quantityLimitsMessages, props)}
                {inventoryLabel}
            </Node>
        </>
    );

};

/**
 * RenderQuickViewPopup.
 * @param props - Props.
 * @returns -- Returns.
 */
const renderQuickViewPopup = (props: IQuickviewViewProps & IQuickviewPropsExtend<{}>): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from Quickview.tsx file
    const { ModalContainer, ModalHeaderContainer, ModalFooterContainer, ModalHeaderContent, ModalBodyContainer, addToCart,
        cartContainerProps, seeDetailsbutton } = props;

    return (
        <Module {...ModalContainer}>
            <Node {...ModalHeaderContainer}>
                {ModalHeaderContent}
                <Node className='msc-quickview__heading'>
                    {props.title}
                    {!props.loading && !StringExtensions.isNullOrEmpty(props.state.productPrice?.ItemId) ? <Node className='msc-quickview__sku-text'>
                        {props.resources.skuText}
                        {props.state.productPrice?.ItemId}
                    </Node> : ''}
                    {props.rating}
                </Node>
            </Node>
            <Node {...ModalBodyContainer}>
                {renderBodyContent(props)}
            </Node>
            <Node {...ModalFooterContainer}>
                <Node {...cartContainerProps}>
                    {addToCart && seeDetailsbutton}
                    {addToCart && renderAddToCart(addToCart)}
                </Node>
            </Node>
        </Module>
    );
};

/**
 * Functional component which renders quick view button and popup based by the given props file.
 * @param props - Configuration for the quick view component.
 * @returns - Functional component of the quick view.
 */
export const QuickViewFunctionalComponent:
React.FC<IQuickviewViewProps & IQuickviewPropsExtend<{}>> = (props: IQuickviewViewProps & IQuickviewPropsExtend<{}>) => {
    const { quickView, quickViewButton, isModalOpen } = props;
    const quickViewUpdatedProps: IModuleProps = { ...quickView, title: props.resources.quickViewbuttonText };
    return (
        <Module {...quickViewUpdatedProps}>
            {quickViewButton}
            {isModalOpen && renderQuickViewPopup(props)}
        </Module>
    );
};

export default QuickViewFunctionalComponent;
