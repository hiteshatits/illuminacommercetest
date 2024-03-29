/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { IProductsDimensionsAvailabilities } from '@msdyn365-commerce/commerce-entities';
import { IPriceComponentResources, ISwatchItem, PriceComponent, ProductComponentSwatchComponent, RatingComponent } from '@msdyn365-commerce/components';
import {
    IAny, IComponent, IComponentProps, ICoreContext, IGeneric,
    IGridSettings, IImageData, IImageSettings, Image, msdyn365Commerce
} from '@msdyn365-commerce/core';
import { AttributeSwatch, AttributeValue, ProductDimension, ProductPrice, ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import {
    ArrayExtensions, convertDimensionTypeToProductDimensionType, Dictionary, DimensionTypes, generateImageUrl,
    getProductPageUrlSync, IDimensionsApp, StringExtensions
} from '@msdyn365-commerce-modules/retail-actions';
import { format, getPayloadObject, getTelemetryAttributes, ITelemetryContent, onTelemetryClick } from '@msdyn365-commerce-modules/utilities';
import React, { useState } from 'react';

export interface IProductComponentProps extends IComponentProps<{ product?: ProductSearchResult }> {
    className?: string;
    imageSettings?: IImageSettings;
    savingsText?: string;
    freePriceText?: string;
    originalPriceText?: string;
    currentPriceText?: string;
    ratingAriaLabel?: string;
    ratingCountAriaLabel?: string;
    allowBack?: boolean;
    telemetryContent?: ITelemetryContent;
    quickViewButton?: React.ReactNode;
    isEnabledProductDescription?: boolean;
    isPriceMinMaxEnabled?: boolean;
    priceResources?: IPriceComponentResources;
    inventoryLabel?: string;
    dimensionAvailabilities?: IProductsDimensionsAvailabilities[];
    swatchItemAriaLabel?: string;
}

export interface IProductComponent extends IComponent<IProductComponentProps> { }

const PriceComponentActions = {};

/**
 * Gets the product page url from the default swatch selected.
 * @param  productData - Product card to be rendered.
 * @returns The default color swatch selected if any.
 */
function getDefaultColorSwatchSelected(productData?: ProductSearchResult): AttributeSwatch | null {
    if (!productData || !productData.AttributeValues) {
        return null;
    }

    const colorAttribute = productData.AttributeValues.find(attributeValue => attributeValue.KeyName?.toLocaleLowerCase() === DimensionTypes.color);
    if (!colorAttribute) {
        return null;
    }

    const defaultSwatch = colorAttribute.Swatches?.find(item => item.IsDefault === true) ?? colorAttribute.Swatches?.[0];
    return defaultSwatch ?? null;
}

/**
 * Gets the product image from the default swatch selected.
 * @param  coreContext - Context of the module using the component.
 * @param  productData - Product card to be rendered.
 * @returns The product card image url.
 */
function getProductImageUrlFromDefaultColorSwatch(coreContext: ICoreContext, productData?: ProductSearchResult): string | undefined {
    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
    if (dimensionToPreSelectInProductCard === DimensionTypes.none) {
        return productData?.PrimaryImageUrl;
    }
    const defaultSwatch = getDefaultColorSwatchSelected(productData);
    return defaultSwatch && ArrayExtensions.hasElements(defaultSwatch.ProductImageUrls) ? generateImageUrl(
        defaultSwatch.ProductImageUrls[0], coreContext.request.apiSettings) : productData?.PrimaryImageUrl;
}

/**
 * Updates the product url link to product details page.
 * @param  productDetailsPageUrl - Product page url.
 * @param  coreContext - Context of the module using the component.
 * @param  queryString - Querystring to be added to the URL.
 * @returns The update product page url.
 */
function updateProductUrl(productDetailsPageUrl: string, coreContext: ICoreContext, queryString: string): string {
    const sourceUrl = new URL(productDetailsPageUrl, coreContext.request.apiSettings.baseUrl);
    if (sourceUrl.search) {
        sourceUrl.search += `&${queryString}`;
    } else {
        sourceUrl.search += queryString;
    }

    const updatedUrl = new URL(sourceUrl.href);
    return updatedUrl.pathname + sourceUrl.search;
}

/**
 * Gets the react node for product unit of measure display.
 * @param  unitOfMeasure - DefaultUnitOfMeasure property from product.
 * @returns The node representing markup for unit of measure component.
 */
function renderProductUnitOfMeasure(unitOfMeasure?: string): JSX.Element | null {
    if (!unitOfMeasure) {
        return null;
    }
    return (
        <div className='msc-product__unit-of-measure'>
            <span>
                {unitOfMeasure}
            </span>
        </div>
    );
}

/**
 * Gets the react node for product availability.
 * @param inventoryAvailabilityLabel - The product information.
 * @returns The node representing markup for product availability.
 */
function renderProductAvailability(inventoryAvailabilityLabel: string | undefined): JSX.Element | null {
    if (!inventoryAvailabilityLabel || inventoryAvailabilityLabel === '') {
        return null;
    }

    return (
        <div className='msc-product__availability'>
            <span>
                {inventoryAvailabilityLabel}
            </span>
        </div>
    );
}

/**
 * Gets the product page url from the default swatch selected.
 * @param  coreContext - Context of the module using the component.
 * @param productUrl - Product page url for the product card.
 * @param  productData - Product card to be rendered.
 * @returns The product card image url.
 */
function getProductPageUrlFromDefaultSwatch(coreContext: ICoreContext, productUrl: string, productData?: ProductSearchResult): string | undefined {
    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
    if (dimensionToPreSelectInProductCard === DimensionTypes.none) {
        return productUrl;
    }

    const defaultSwatch = getDefaultColorSwatchSelected(productData);
    if (!defaultSwatch || !defaultSwatch.SwatchValue) {
        return productUrl;
    }

    const queryString = `color=${defaultSwatch.SwatchValue}`;
    return updateProductUrl(productUrl, coreContext, queryString);
}

const ProductCard: React.FC<IProductComponentProps> = ({
    data,
    context,
    imageSettings,
    savingsText,
    freePriceText,
    originalPriceText,
    currentPriceText,
    ratingAriaLabel,
    ratingCountAriaLabel,
    allowBack,
    typeName,
    id,
    telemetryContent,
    quickViewButton,
    isEnabledProductDescription,
    isPriceMinMaxEnabled,
    priceResources,
    inventoryLabel,
    dimensionAvailabilities,
    swatchItemAriaLabel
}) => {
    const product = data.product;

    let productUrl = getProductPageUrlSync(product?.Name ?? '', product?.RecordId ?? Number.MIN_VALUE, context.actionContext, undefined);
    if (allowBack) {
        productUrl = updateProductUrl(productUrl, context, 'back=true');
    }
    const productImageUrlFromSwatch = getProductImageUrlFromDefaultColorSwatch(context, product) ?? product?.PrimaryImageUrl;
    const productPageUrlFromSwatch = getProductPageUrlFromDefaultSwatch(context, productUrl, product) ?? productUrl;
    const [productPageUrl, setProductPageUrl] = useState<string>(productPageUrlFromSwatch);
    const [productImageUrl, setProductImageUrl] = useState<string | undefined>(productImageUrlFromSwatch);
    React.useEffect(() => {
        setProductPageUrl(productPageUrlFromSwatch);
        setProductImageUrl(productImageUrlFromSwatch);
    }, [productUrl, productPageUrlFromSwatch, productImageUrlFromSwatch]);
    const [selectedSwatchItems] = useState(new Dictionary<DimensionTypes, ISwatchItem>());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access -- app context is generic
    const enableStockCheck = context.app.config.enableStockCheck;

    /**
     * Updates the product page and Image url based on swatch selected.
     * @param coreContext - Context of the caller.
     * @param swatchItem - Dimension swatch selected.
     */
    const updatePageAndImageUrl = React.useCallback((coreContext: ICoreContext, swatchItem: ISwatchItem) => {
        const dimensionType = swatchItem.dimensionType;
        selectedSwatchItems.setValue(dimensionType, swatchItem);
        if (StringExtensions.isNullOrWhitespace(swatchItem.value)) {
            return;
        }
        const queryString = `${dimensionType}=${swatchItem.value}`;
        let productPageUrlWithSwatch = '';
        if (productPageUrl.includes(dimensionType)) {
            const newUrl = new URL(productPageUrl, coreContext.request.apiSettings.baseUrl);
            newUrl.searchParams.delete(dimensionType);
            productPageUrlWithSwatch = updateProductUrl(newUrl.toString(), context, queryString);
        } else {
            productPageUrlWithSwatch = updateProductUrl(productPageUrl, context, queryString);
        }
        setProductPageUrl(productPageUrlWithSwatch);
        if (dimensionType === DimensionTypes.color) {
            const swatchProductImageUrl = ArrayExtensions.hasElements(swatchItem.productImageUrls) ? swatchItem.productImageUrls[0] : undefined;
            const newImageUrl = generateImageUrl(swatchProductImageUrl, coreContext.request.apiSettings);
            setProductImageUrl(newImageUrl);
        }
    }, [selectedSwatchItems, context, productPageUrl]);

    if (!product) {
        return null;
    }

    /**
     * Checks if rendering the particular dimensions is allowed for product card.
     * @param dimensionType - Dimension to be displayed.
     * @returns Updates the state with new product page url.
     */
    function shouldDisplayDimension(dimensionType: string): boolean {
        const dimensionsContext = context as ICoreContext<IDimensionsApp>;
        const dimensionsToDisplayOnProductCard = dimensionsContext.app.config.dimensionsInProductCard;
        return ArrayExtensions.hasElements(dimensionsToDisplayOnProductCard) &&
            !dimensionsToDisplayOnProductCard.includes(DimensionTypes.none) &&
            dimensionsToDisplayOnProductCard.includes(dimensionType.toLocaleLowerCase() as DimensionTypes);
    }

    /**
     * Gets the react node for product dimension as swatch.
     * @param  attributeValues - Attribute value property from product.
     * @returns The node representing markup for unit of measure component.
     */
    function renderProductDimensions(attributeValues?: AttributeValue[]): JSX.Element | null {
        if (!attributeValues) {
            return null;
        }

        return (
            <div className='msc-product__dimensions'>
                {
                    attributeValues.map((item: AttributeValue) => {
                        const dimensionTypeValue = item.KeyName?.toLocaleLowerCase() ?? '';
                        if (!shouldDisplayDimension(dimensionTypeValue)) {
                            return null;
                        }

                        const siteContext = context as ICoreContext<IDimensionsApp>;
                        const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
                        const dimensionType = dimensionTypeValue as DimensionTypes;
                        const swatches = item.Swatches?.map<ISwatchItem>(swatchItem => {
                            return {
                                itemId: `${item.RecordId ?? ''}-${dimensionTypeValue}-${swatchItem.SwatchValue ?? ''}`,
                                value: swatchItem.SwatchValue ?? '',
                                dimensionType,
                                colorHexCode: swatchItem.SwatchColorHexCode,
                                imageUrl: swatchItem.SwatchImageUrl,
                                productImageUrls: swatchItem.ProductImageUrls,
                                isDefault: swatchItem.IsDefault,
                                swatchItemAriaLabel: swatchItemAriaLabel ? format(swatchItemAriaLabel, dimensionType) : '',
                                isDisabled: enableStockCheck && dimensionAvailabilities?.find(
                                    dimensionAvailability => dimensionAvailability.value === (swatchItem.SwatchValue ?? ''))?.isDisabled
                            };
                        }) ?? [];
                        if (dimensionToPreSelectInProductCard !== DimensionTypes.none && ArrayExtensions.hasElements(swatches) &&
                            !swatches.some(swatch => swatch.isDefault) && dimensionType === DimensionTypes.color) {
                            swatches[0].isDefault = true;
                        }
                        return (
                            <ProductComponentSwatchComponent
                                context={context}
                                swatches={swatches}
                                onSelectDimension={updatePageAndImageUrl}
                                key={item.RecordId}
                            />
                        );
                    })
                }
            </div>
        );
    }

    function renderQuickView(quickview: React.ReactNode, item?: number): JSX.Element | undefined {
        if (quickview === null) {
            return undefined;
        }
        const selectedDimensions: ProductDimension[] = selectedSwatchItems.getValues().map<ProductDimension>(swatches => {
            return {
                DimensionTypeValue: convertDimensionTypeToProductDimensionType(swatches.dimensionType),
                DimensionValue: {
                    RecordId: 0,
                    Value: swatches.value
                }
            };
        });
        return React.cloneElement(quickview as React.ReactElement, { selectedProductId: item, selectedDimensions });
    }

    // Construct telemetry attribute to render
    const payLoad = getPayloadObject('click', telemetryContent!, '', product.RecordId.toString());

    const attribute = getTelemetryAttributes(telemetryContent!, payLoad);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- -- Do not need type check for appsettings
    const isUnitOfMeasureEnabled = context.app.config && context.app.config.unitOfMeasureDisplayType === 'buyboxAndBrowse';

    return (
        <>
            {isEnabledProductDescription ? <a
                href={productPageUrl}
                onClick={onTelemetryClick(telemetryContent!, payLoad, product.Name!)}
                aria-label={renderLabel(
                    product.Name,
                    context.cultureFormatter.formatCurrency(product.Price),
                    product.AverageRating, ratingAriaLabel,
                    product.TotalRatings, ratingCountAriaLabel)}
                className='msc-product' {...attribute}>
                <div className='msc-product__image__description'>
                    <div className='msc-product__image'>
                        {renderProductPlacementImage(imageSettings, context.request.gridSettings, productImageUrl,
                            product.PrimaryImageUrl, product.Name, context)}
                    </div>
                    <div className='msc-product__title_description'>
                        <h5 className='msc-product__title__text'>
                            {product.Name}
                        </h5>
                        {renderPrice(context, typeName, id, product.BasePrice, product.Price, savingsText, freePriceText, originalPriceText, currentPriceText, isPriceMinMaxEnabled, priceResources)}
                        {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.DefaultUnitOfMeasure)}
                        {renderDescription(product.Description)}
                    </div>
                </div>
            </a> : <a
                href={productPageUrl}
                onClick={onTelemetryClick(telemetryContent!, payLoad, product.Name!)}
                aria-label={renderLabel(product.Name, context.cultureFormatter.formatCurrency(product.Price),
                    product.AverageRating, ratingAriaLabel)}
                className='msc-product' {...attribute}>
                <div className='msc-product__image'>
                    {renderProductPlacementImage(imageSettings, context.request.gridSettings, productImageUrl, product.PrimaryImageUrl, product.Name, context)}
                </div>
                <div className='msc-product__details'>
                    <h5 className='msc-product__title'>
                        {product.Name}
                    </h5>
                    {renderPrice(context, typeName, id, product.BasePrice, product.Price, savingsText, freePriceText, originalPriceText, currentPriceText)}
                    {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.DefaultUnitOfMeasure)}
                </div>
            </a>}
            {renderProductDimensions(product.AttributeValues)}
            {!context.app.config.hideRating && renderRating(context, typeName, id, product.AverageRating, product.TotalRatings, ratingAriaLabel, ratingCountAriaLabel)}
            {renderProductAvailability(inventoryLabel)}
            {quickViewButton && renderQuickView(quickViewButton, product.RecordId)}
        </>
    );
};

function renderLabel(
    name?: string,
    price?: string,
    rating?: number,
    ratingAriaLabelText?: string,
    reviewCount?: number,
    ratingCountAriaLabelText?: string): string {
    const reviewCountArialableText = getReviewAriaLabel(reviewCount, ratingCountAriaLabelText ?? '');
    return (
        `${name ?? ''} ${price ?? ''} ${getRatingAriaLabel(rating, ratingAriaLabelText)}${reviewCountArialableText ? ` ${reviewCountArialableText}` : ''}`
    );
}

function renderDescription(description?: string): JSX.Element | null {
    return (<p className='msc-product__text'>
        {description}
    </p>);
}

function getRatingAriaLabel(rating?: number, ratingAriaLabel?: string): string {
    if (rating && ratingAriaLabel) {
        const roundedRating = rating.toFixed(2);
        return format(ratingAriaLabel || '', roundedRating, '5');
    }
    return '';
}

function getReviewAriaLabel(reviewCount?: number, ratingCountAriaLabelText?: string): string {
    if (reviewCount && ratingCountAriaLabelText) {
        return format(ratingCountAriaLabelText || '', reviewCount);
    }
    return '';
}

function renderRating(coreContext: ICoreContext, moduleTypeName: string, moduleId: string, avgRating?: number,
    totalRatings?: number, ariaLabel?: string, ratingCountAriaLabel?: string): JSX.Element | null {
    if (!avgRating) {
        return null;
    }

    const numberRatings = totalRatings?.toString() || undefined;
    const ratingAriaLabelText = getRatingAriaLabel(avgRating, ariaLabel);
    const ratingCountAriaLabelText = getReviewAriaLabel(Number(numberRatings), ratingCountAriaLabel);

    return (
        <RatingComponent
            context={coreContext}
            id={moduleId}
            typeName={moduleTypeName}
            avgRating={avgRating}
            ratingCount={numberRatings}
            readOnly
            ariaLabel={ratingAriaLabelText}
            ratingCountAriaLabel={ratingCountAriaLabelText}
            data={{}}
        />
    );
}

function renderPrice(context: ICoreContext, typeName: string, id: string, basePrice?: number, adjustedPrice?: number, savingsText?: string, freePriceText?: string, originalPriceText?: string, currentPriceText?: string, isPriceMinMaxEnabled?: boolean, priceResources?: IPriceComponentResources): JSX.Element | null {
    const price: ProductPrice = {
        BasePrice: basePrice,
        AdjustedPrice: adjustedPrice,
        CustomerContextualPrice: adjustedPrice
    };

    return (
        <PriceComponent
            context={context}
            id={id}
            typeName={typeName}
            data={{ price }}
            savingsText={savingsText}
            freePriceText={freePriceText}
            originalPriceText={originalPriceText}
            isPriceMinMaxEnabled={isPriceMinMaxEnabled}
            priceResources={priceResources}
        />
    );
}

function renderProductPlacementImage(imageSettings?: IImageSettings, gridSettings?: IGridSettings,
    imageUrl?: string, fallbackImageUrl?: string, altText?: string,
    context?: ICoreContext<IGeneric<IAny>>): JSX.Element | null {
    if (!imageUrl || !gridSettings || !imageSettings) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- Site level config can be of any type.
    const contextConfig = context?.app.config?.placeholderImageName;
    const emptyPlaceHolderImage = contextConfig as string;
    let fallbackImageSource = fallbackImageUrl;
    if (emptyPlaceHolderImage && fallbackImageUrl) {
        fallbackImageSource = `${fallbackImageUrl},${emptyPlaceHolderImage}`;
    }
    const img: IImageData = {
        src: imageUrl,
        altText: altText ? altText : '',
        fallBackSrc: fallbackImageSource
    };
    const imageProps = {
        gridSettings,
        imageSettings
    };
    imageProps.imageSettings.cropFocalRegion = true;
    return (
        <Image
            requestContext={context?.actionContext.requestContext} {...img} {...imageProps}
            loadFailureBehavior='empty'
            bypassHideOnFailure />
    );
}

export const ProductComponent: React.FunctionComponent<IProductComponentProps> = msdyn365Commerce.createComponentOverride<IProductComponent>(
    'Product',
    { component: ProductCard, ...PriceComponentActions }
);

export default ProductComponent;
