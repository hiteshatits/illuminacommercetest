/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { IPriceComponentResources } from '@msdyn365-commerce/components';
import MsDyn365 from '@msdyn365-commerce/core';
import { ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    ICategoryHierarchyViewProps,
    IRefineMenuViewProps,
    ISearchResultContainerViewProps,
    ISearchResultModalViewProps,
    ISortByViewProps,
    ITitleViewProps
} from '@msdyn365-commerce-modules/search-result-container';
import { Button, getTelemetryObject, Module, Node } from '@msdyn365-commerce-modules/utilities';
import React, { MouseEventHandler, useEffect, useState } from 'react';

import { ISearchResultContainerProps, ISearchResultContainerResources } from '../definition-extensions/search-result-container.ext.props.autogenerated';
import { ProductComponent } from './components/product.component';

/**
 * DescriptionInterval.
 */
enum DescriptionInterval {
    productDescriptionInterval = 14,
    productDescriptionIntervalRemainder0 = 0,
    productDescriptionIntervalRemainder9 = 9
}

/**
 * Render Clear button for mobile viewport.
 * @param props - The view props.
 * @returns The JSX Element.
 */
const renderProductCards = (props: ISearchResultContainerViewProps & ISearchResultContainerProps<{}>): JSX.Element | null => {
    return (
        <Node {...props.ProductsContainer}>
            {props.errorMessage}
            {props.products}
        </Node>
    );

};

/**
 * Returns the product inventory label.
 * @param  channelInventoryConfigurationId - The channel configuration Id.
 * @param  product - The product.
 * @returns The inventory label.
 */
function getInventoryLabel(channelInventoryConfigurationId: number | undefined, product: ProductSearchResult): string | undefined {
    if (!channelInventoryConfigurationId || !ArrayExtensions.hasElements(product.AttributeValues)) {
        return undefined;
    }
    const inventoryAttribute = product.AttributeValues.find(attribute => attribute.RecordId === channelInventoryConfigurationId);
    if (inventoryAttribute) {
        return inventoryAttribute.TextValue;
    }
    return undefined;
}

/**
 * Render Clear button for mobile viewport.
 * @param props - The view props.
 * @param product - The product item data.
 * @param index - The index of each product item.
 * @param isEnabledProductDescription - The flag for showing Product desription tile.
 * @returns The JSX Element.
 */
const renderProductCardsDescription = (
    props: ISearchResultContainerViewProps & ISearchResultContainerProps<{}>,
    product: ProductSearchResult,
    index: number,
    isEnabledProductDescription?: boolean): JSX.Element | null => {
    const { config, context, resources } = props;
    const telemetryContent = getTelemetryObject(props.context.request.telemetryPageName!, props.friendlyName, props.telemetry);
    const breadCrumbType = props.context.app.config.breadcrumbType;
    const isAllowBack = props.config.allowBackNavigation && (breadCrumbType === 'back' || breadCrumbType === 'categoryAndBack');
    const classname = isEnabledProductDescription ? 'ms-product-search-result__item product__description' : 'ms-product-search-result__item';
    const quickviewslot = ArrayExtensions.hasElements(props.slots.quickview) ? props.slots.quickview[0] : undefined;
    const channelInventoryConfigurationId = props.data.products.result?.channelInventoryConfigurationId;
    const isPriceMinMaxFeatureState = props.data.featureState.result?.find(
        featureState => featureState.Name === 'Dynamics.AX.Application.RetailSearchPriceRangeFeature');
    const priceResources: IPriceComponentResources = {
        priceRangeSeparator: resources.priceRangeSeparator
    };

    return (
        <li className={classname} key={index}>
            <ProductComponent
                context={context}
                telemetryContent={telemetryContent}
                imageSettings={config.imageSettings}
                freePriceText={resources.priceFree}
                originalPriceText={resources.originalPriceText}
                currentPriceText={resources.currentPriceText}
                ratingAriaLabel={resources.ratingAriaLabel}
                allowBack={isAllowBack}
                id={props.id}
                key={product.RecordId}
                typeName={props.typeName}
                data={{ product }}
                quickViewButton={quickviewslot}
                isEnabledProductDescription={isEnabledProductDescription}
                inventoryLabel={getInventoryLabel(channelInventoryConfigurationId, product)}
                isPriceMinMaxEnabled={isPriceMinMaxFeatureState?.IsEnabled}
                priceResources={priceResources}
                swatchItemAriaLabel={resources.swatchItemAriaLabel}
            />
        </li>
    );
};

/**
 * Render Clear button for mobile viewport.
 * @param props - The view props.
 * @returns The JSX Element.
 */
const renderProducts = (props: ISearchResultContainerViewProps & ISearchResultContainerProps<{}>): JSX.Element | null => {
    const products = props.data.listPageState.result?.activeProducts;
    if (!products || !ArrayExtensions.hasElements(products)) {
        return null;
    }
    const productDescriptionInterval: number = DescriptionInterval.productDescriptionInterval;
    const productDescriptionIntervalRemainder0: number = DescriptionInterval.productDescriptionIntervalRemainder0;
    const productDescriptionIntervalRemainder9: number = DescriptionInterval.productDescriptionIntervalRemainder9;
    return (
        <Node {...props.ProductsContainer}>
            {props.errorMessage}
            <ul className='list-unstyled'>
                {products.map((product: ProductSearchResult, index: number) => (
                    (index % productDescriptionInterval === productDescriptionIntervalRemainder0) ||
                        (index % productDescriptionInterval === productDescriptionIntervalRemainder9) ? renderProductCardsDescription(props, product,
                            index, true) : renderProductCardsDescription(props, product, index, false)
                ))}
            </ul>
        </Node>
    );
};

/**
 * Render Title Count.
 * @param props - The title view props.
 * @returns The JSX Element.
 */
const renderTitleCount = (props: ITitleViewProps): JSX.Element | null => {
    const { title, TitleContainer } = props;
    if (title) {
        return (
            <Node {...TitleContainer}>
                {title.titleCount}
            </Node>
        );
    }
    return null;
};

/**
 * Render Category Hierarchy.
 * @param props - The category hierarchy view props.
 * @returns The JSX Element.
 */
const renderCategoryHierarchy = (props: ICategoryHierarchyViewProps): JSX.Element | null => {
    const { CategoryHierarchyContainer, categoryHierarchyList, categoryHierarchySeparator } = props;
    if (categoryHierarchyList) {
        return (
            <Node {...CategoryHierarchyContainer}>
                {categoryHierarchyList.map((category, index) => (
                    <React.Fragment key={index}>
                        {category}
                        {categoryHierarchyList[index + 1] && categoryHierarchySeparator}
                    </React.Fragment>
                ))}
            </Node>
        );
    }

    return null;
};

/**
 * Function to make filter sticky.
 * @param isMobile - The boolean prop.
 * @param isStickyHeader - The boolean prop.
 */
export const configureStickyFilter = (isMobile: boolean, isStickyHeader: boolean): void => {
    // Get heights of cookie and promotion banners
    const defaultValue = 0;
    const defaultOffset = 28;
    const headerContainer: HTMLElement | null = document.querySelector('.ms-header');

    const headerHeight: number | undefined = headerContainer?.offsetHeight;
    const containerHeight: number = headerHeight ?? defaultOffset;
    const bannerHeights = isStickyHeader ? defaultValue : containerHeight;
    const headerElement = document.querySelector('header .lock-opaque');
    const defaultContainer = document.querySelector('header .default-container');
    const refinerElement = isMobile ? document.querySelector('.msc-sort-filter-wrapper') : document.querySelector('.ms-refiner-heading');
    if (refinerElement && headerElement && defaultContainer) {
        if (MsDyn365.isBrowser && document.documentElement.scrollTop > bannerHeights) {
            refinerElement.classList.add('lock-Filter');
            refinerElement.setAttribute('style', `top: ${defaultContainer.clientHeight}px`);
        } else {
            refinerElement.classList.remove('lock-Filter');
        }
    } else if (refinerElement) {
        if (MsDyn365.isBrowser && document.documentElement.scrollTop > bannerHeights) {
            refinerElement.classList.add('lock-top');
        } else {
            refinerElement.classList.remove('lock-top');
            refinerElement.classList.remove('lock-Filter');
            refinerElement.removeAttribute('style');
        }
    }
};

/**
 * Function to setup filter sticky.
 * @param isMobile - The boolean prop.
 * @param isStickyHeader - The boolean prop.
 */
function stickyFilterSetup(isMobile: boolean, isStickyHeader: boolean): void {
    window.addEventListener('scroll', () => {
        configureStickyFilter(isMobile, isStickyHeader);
    });
    configureStickyFilter(isMobile, isStickyHeader);
}

/**
 * Function to make filter sticky.
 * @param refinerRefernce - Ref prop for filter.
 * @param toggle - Toggle function for filter menu.
 */
function useOutsideClick(refinerRefernce: React.RefObject<HTMLElement>, toggle: (event: Event) => void) {
    React.useEffect(() => {

        /**
         * Function to make filter sticky.
         * @param event - Event prop for filter.
         */
        function handleClickOutside(event: Event) {
            const element = document.querySelector('.ms-refine-filter__toggle_collapsed');
            if (refinerRefernce.current && !refinerRefernce.current.contains(event.target as Node) && !element) {
                toggle(event);
            }
        }
        if (MsDyn365.isBrowser) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            if (MsDyn365.isBrowser) {
                document.removeEventListener('click', handleClickOutside);
            }
        };
    }, [refinerRefernce, toggle]);
}

/**
 * Render the category page items.
 * @param props - The view props.
 * @returns The search Result container module view.
 */
const SearchResultContainerView: React.FC<ISearchResultContainerViewProps & ISearchResultContainerProps<{}>> = props => {
    const { SearchResultContainer, pagination, ProductSectionContainer, choiceSummary, isMobile, modalToggle, searchResultModal, TitleViewProps,
        refineMenu, categoryHierarchy, sortByOptions, CategoryNavContainer, RefineAndProductSectionContainer, FeatureSearchContainer,
        similarLookProduct, errorMessage, resources } = props;
    useEffect(() => {
        if (props.config.useStickyFilter && MsDyn365.isBrowser) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- app context is generic
            stickyFilterSetup(props.isMobile, props.context.app.config.enableStickyHeader as boolean);
        }
    }, [props]);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const toggle = () => {
        setIsExpanded(!isExpanded);
    };
    const wrapperRefiner = React.useRef(null);
    useOutsideClick(wrapperRefiner, toggle);
    const isRecoSearchPage = props.context.actionContext.requestContext.query?.recommendation;
    if (isMobile) {
        return (
            <Module {...SearchResultContainer}>
                {similarLookProduct ? null : <Node {...CategoryNavContainer}>
                    {renderCategoryHierarchy(categoryHierarchy)}
                    {renderTitle(TitleViewProps)}
                    {renderTitleCount(TitleViewProps)}
                </Node>}
                {choiceSummary}
                <Node className='msc-sort-filter-wrapper'>
                    {modalToggle}
                </Node>
                {createSearchResultModal(searchResultModal, refineMenu, sortByOptions, isRecoSearchPage)}
                <Node {...FeatureSearchContainer}>
                    {similarLookProduct}
                </Node>
                {errorMessage}
                {props.config.enableProdutDescription ? renderProducts(props) : renderProductCards(props)}
                {pagination}
            </Module>
        );
    }
    return (
        <Module {...SearchResultContainer}>
            {similarLookProduct ? null : <Node {...CategoryNavContainer}>
                {categoryHierarchy && renderCategoryHierarchy(categoryHierarchy)}
                {TitleViewProps && renderTitle(TitleViewProps)}
                {TitleViewProps && renderTitleCount(TitleViewProps)}
            </Node>}
            <Node {...FeatureSearchContainer}>
                {similarLookProduct}
            </Node>
            <Node {...RefineAndProductSectionContainer}>
                <Node ref={wrapperRefiner} className='ms-refiner-heading'>
                    <Node className='ms-refiner-heading_title'>
                        <Button
                            className={isExpanded ? 'ms-refine-filter__toggle_expanded' : 'ms-refine-filter__toggle_collapsed'}
                            aria-label='Filter'
                            onClick={toggle}
                            aria-expanded={isExpanded}
                            tabIndex={0}
                        >
                            {resources.filterText}
                        </Button>
                        <div className='ms-search-result-wrapper-title-choice-summary'>
                            {choiceSummary}
                        </div>
                        <div className='ms-search-result-wrapper-sort-by-category'>
                            {sortByOptions && !isRecoSearchPage && renderSort(sortByOptions)}
                        </div>
                    </Node>
                    {refineMenu && isExpanded && renderRefiner(refineMenu)}
                    <Node className='ms-refine__footer'>
                        {refineMenu && isExpanded && renderRefinerFooter(refineMenu, toggle, resources)}
                    </Node>
                </Node>

                <Node {...ProductSectionContainer}>
                    {errorMessage}
                    {props.config.enableProdutDescription ? renderProducts(props) : renderProductCards(props)}
                    {pagination}
                </Node>
            </Node>
        </Module>
    );
};

/**
 * Render Search result Modal.
 * @param modalProps - The Search Result Modal view props.
 * @param refineMenu - The Refine Menu view props.
 * @param sortByDropDown - The Sort by view props.
 * @param isRecoSearchPage - The recomandation search page flag.
 * @returns The JSX Element.
 */
const createSearchResultModal = (modalProps: ISearchResultModalViewProps, refineMenu: IRefineMenuViewProps, sortByDropDown: ISortByViewProps,
    isRecoSearchPage?: string): JSX.Element => {
    return React.cloneElement(modalProps.modal, {}, modalProps.modalHeader, createModalBody(modalProps, refineMenu, sortByDropDown,
        isRecoSearchPage), modalProps.modalFooter);
};

/**
 * Render Refiner Mobile.
 * @param props - The Refine Menu view props.
 * @returns The JSX Element.
 */
const renderRefinerMobile = (props: IRefineMenuViewProps): JSX.Element | null => {
    const { refiners, RefineMenuContainer, RefinerSectionContainer } = props;
    if (refiners) {
        return (
            <Node {...RefinerSectionContainer}>
                <Node {...RefineMenuContainer}>
                    {refiners.map((submenu, index) => (
                        <React.Fragment key={index}>
                            {submenu}
                        </React.Fragment>
                    ))}
                </Node>
            </Node>
        );
    }
    return null;
};

/**
 * Render Search result Body.
 * @param props - The Search Result Modal view props.
 * @param refineMenu - The Refine Menu view props.
 * @param sortByDropDown - The Sort by view props.
 * @param isRecoSearchPage - The recomandation search page flag.
 * @returns The JSX Element.
 */
const createModalBody = (props: ISearchResultModalViewProps, refineMenu: IRefineMenuViewProps,
    sortByDropDown: ISortByViewProps, isRecoSearchPage?: string): JSX.Element | null => {
    if (sortByDropDown) {
        return React.cloneElement(props.modalBody, {}, renderSort(sortByDropDown, isRecoSearchPage), renderRefinerMobile(refineMenu));
    }
    return null;
};

/**
 * Render Refiner.
 * @param props - The Refine Menu view props.
 * @returns The JSX Element.
 */
const renderRefiner = (props: IRefineMenuViewProps): JSX.Element | null => {
    const { refiners, RefineMenuContainer, RefinerSectionContainer } = props;
    if (refiners) {
        return (
            <Node {...RefinerSectionContainer}>
                <Node {...RefineMenuContainer}>
                    {refiners.map((submenu, index) => (
                        <React.Fragment key={index}>
                            {submenu}
                        </React.Fragment>
                    ))}
                </Node>
            </Node>
        );
    }
    return null;
};

/**
 * Render Refiner Footer.
 * @param props - The Refine Menu view props.
 * @param handler - The Refine menu toggle function.
 * @param resources - Resources to get the done text and aria label.
 * @returns The JSX Element.
 */
const renderRefinerFooter = (props: IRefineMenuViewProps, handler: MouseEventHandler, resources: ISearchResultContainerResources): JSX.Element | null => {
    const { refiners } = props;
    if (refiners) {
        return (
            <Node className='ms-refine__footer__done'>
                <Node
                    tag='button'
                    className='ms-refine-filter-done'
                    aria-label={resources.doneAriaLabel}
                    tabIndex={0}
                    onClick={handler}
                >
                    {resources.doneText}
                </Node>
            </Node>
        );
    }
    return null;
};

/**
 * Render sort by drop down.
 * @param props - The sort by view props.
 * @param isRecoSearchPage - The recomandation search page flag.
 * @returns The JSX Element.
 */
const renderSort = (props: ISortByViewProps, isRecoSearchPage?: string): JSX.Element | null => {
    const { SortingContainer, sortByDropDown } = props;
    if (sortByDropDown && !isRecoSearchPage) {
        return (
            <Node {...SortingContainer}>
                {sortByDropDown}
            </Node>
        );
    }
    return null;
};

/**
 * Render Title.
 * @param props - The title view props.
 * @returns The JSX Element.
 */
const renderTitle = (props: ITitleViewProps): JSX.Element | null => {
    const { title, TitleContainer } = props;
    if (title) {
        return (
            <Node {...TitleContainer}>
                <Node tag='h1' className=''>
                    {title.titlePrefix}
                    {title.titleText}
                </Node>
            </Node>
        );
    }
    return null;
};

export default SearchResultContainerView;