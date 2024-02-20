/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { IImageData, IImageSettings, Image } from '@msdyn365-commerce/core';
import { IMediaGalleryThumbnailItemViewProps,
    IMediaGalleryThumbnailsViewProps,
    IMediaGalleryViewProps
} from '@msdyn365-commerce-modules/media-gallery';
import { getFallbackImageUrl } from '@msdyn365-commerce-modules/retail-actions';
import { Button, KeyCodes, Module, Node, NodeTag } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import React from 'react';

/**
 * Render the thumbnail item images.
 * @param thumbnail - The carousel thumbnail line props.
 * @returns Return HTML having thumnailcontainer props with image.
 */
const renderThumbnailItem = (thumbnail: IMediaGalleryThumbnailItemViewProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention --  Dependency from media-gallery.tsx file
    const { ThumbnailItemContainerProps, Picture } = thumbnail;

    return (
        <Node {...ThumbnailItemContainerProps}>
            {Picture}
        </Node>
    );
};

/**
 * Gets the thumbnail item to display media gallery images.
 * @param image - The media gallery images.
 * @param imageSettings - Image settings for the image gallery items.
 * @param imageId - Image id.
 * @param modifiedActiveIndex - Modified Index of the images when selection changes.
 * @param props - The Media gallery view props from business layer.
 * @returns Return thumbnail view props which will be used to render images.
 */
const GetThumbnailItemComponent = (
    image: IImageData,
    imageSettings: IImageSettings,
    imageId: number,
    modifiedActiveIndex: number,
    props: IMediaGalleryViewProps
): IMediaGalleryThumbnailItemViewProps => {
    let fallbackImage: string | undefined = '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Site level config can be of any type.
    const emptyPlaceHolderImage = props.context.app.config?.placeholderImageName as string;
    if (props.data.product.result) {
        fallbackImage = getFallbackImageUrl(props.data.product.result.ItemId, props.context.request.apiSettings);
    }
    if (emptyPlaceHolderImage && fallbackImage) {
        fallbackImage = `${fallbackImage},${emptyPlaceHolderImage}`;
    }

    /**
     * OnClick method of media gallery item.
     * */
    const onClick = () => {
        props.callbackToggle?.();
        props.callbackThumbnailClick?.(imageId);
        props.state.activeIndex = imageId;
    };

    const classes = classnames(
        'ms-media-gallery__thumbnail-item',
        modifiedActiveIndex === imageId ? 'ms-media-gallery__thumbnail-item-active' : ''
    );

    /**
     * Keydown event of media gallery item.
     * @param event - React.KeyboardEvent.
     * */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === KeyCodes.Enter) {
            event.preventDefault();
            onClick();
        }
    };
    const defaultIndex = 0;
    return {
        ThumbnailItemContainerProps: {
            tag: 'li' as NodeTag,
            className: classes,
            role: 'presentation',
            key: imageId
        },
        Picture: (
            <Node className='ms-fullscreen-section'>
                <Button
                    role='tab'
                    aria-label={image.altText}
                    aria-selected={modifiedActiveIndex === imageId}
                    aria-controls={`${props.id}__carousel-item__${imageId}`}
                    className='msc-ss-carousel-vert-button-wrapper'
                    onClick={onClick}
                    onKeyDown={handleKeyDown}>
                    <Image
                        requestContext={props.context.actionContext.requestContext}
                        className='ms-media-gallery__thumbnail'
                        {...image}
                        gridSettings={props.context.request.gridSettings!}
                        imageSettings={props.config.thumbnailImageSettings ?? imageSettings}
                        loadFailureBehavior='hide'
                        imageFallbackOptimize={props.state.shouldUseOptimizedImage}
                        fallBackSrc={imageId === defaultIndex ? fallbackImage : image.src}
                        bypassHideOnFailure={imageId === defaultIndex}
                    />
                </Button>
                <Node className='ms-fullscreen-section__overlay'>
                    <Button
                        onKeyDown={handleKeyDown}
                        title={props.resources.fullScreenTitleText} role='button'
                        className='ms-fullscreen-section__magnifying-glass-icon'
                        onClick={onClick}
                    />
                </Node>
            </Node>
        )
    };
};

/**
 * Gets the empty thumbnail item to display media gallery images.
 * @param imageSettings - Image settings for the image gallery items.
 * @param props - The Media gallery view props from business layer.
 * @returns Return thumbnail view props which will be used to render empty images.
 */
const GetEmptyThumbnailItemComponent = (imageSettings: IImageSettings, props: IMediaGalleryViewProps): IMediaGalleryThumbnailItemViewProps => {
    let fallbackImage: string | undefined = '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Site level config can be of any type.
    const emptyPlaceHolderImage = props.context.app.config?.placeholderImageName as string;
    if (props.data.product.result) {
        fallbackImage = getFallbackImageUrl(props.data.product.result.ItemId, props.context.request.apiSettings);
    }
    if (emptyPlaceHolderImage && fallbackImage) {
        fallbackImage = `${fallbackImage},${emptyPlaceHolderImage}`;
    }
    return {
        ThumbnailItemContainerProps: {
            tag: 'li' as NodeTag,
            className: 'ms-media-gallery__thumbnail-item',
            role: 'tab',
            tabIndex: 0,
            key: 0,
            'aria-label': '',
            'aria-selected': true
        },
        Picture: (
            <Image
                requestContext={props.context.actionContext.requestContext}
                className='ms-media-gallery__thumbnail-item__image'
                src='empty'
                gridSettings={props.context.request.gridSettings!}
                imageSettings={props.config.thumbnailImageSettings ?? imageSettings}
                loadFailureBehavior='empty'
                imageFallbackOptimize={!!props.config.skipImageValidation}
                fallBackSrc={fallbackImage}
            />
        )
    };
};

/**
 * Update media gallery items method.
 * @param items - The media gallery thumbnail item view props.
 * @returns The IImageData array.
 */
const getMediaGalleryItems = (items?: IMediaGalleryThumbnailItemViewProps[]): IImageData[] | undefined => {
    return items?.map(item => {
        return {
            altText: item.Picture.props.altText,
            src: item.Picture.props.src
        };
    });
};

const defaultThumbnailImageSettings: IImageSettings = {
    viewports: {
        xs: { q: 'w=295&h=295&q=80&m=6&f=jpg', w: 295, h: 295 },
        xl: { q: 'w=295&h=295&q=80&m=6&f=jpg', w: 295, h: 295 }
    },
    lazyload: true,
    cropFocalRegion: true
};

/**
 * Render the Media gallery thumbnails to represent images in grid view.
 * @param thumbnails - The thumbnail view props.
 * @param props - The media gallery view props.
 * @returns - The single slide carousel component to render as media gallery image.
 */
const renderThumbnails = (
    thumbnails: IMediaGalleryThumbnailsViewProps,
    props: IMediaGalleryViewProps
): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/naming-convention --  Dependency from media-gallery.tsx file
    const { ThumbnailsContainerProps, SingleSlideCarouselComponentProps } = thumbnails;
    const { state, Thumbnails } = props;
    const mediaGalleryItems = getMediaGalleryItems(Thumbnails.items);

    const items: IMediaGalleryThumbnailItemViewProps[] | undefined =
    // eslint-disable-next-line multiline-ternary -- need multiline for easy code reading
    state.lastUpdate && mediaGalleryItems && mediaGalleryItems[0].src === 'empty' ? [GetEmptyThumbnailItemComponent(defaultThumbnailImageSettings, props)] :
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from media-gallery
        mediaGalleryItems?.map((item: IImageData, id: number) => GetThumbnailItemComponent(item,
            defaultThumbnailImageSettings, id, state.activeIndex, props));

    return (
        <Node {...ThumbnailsContainerProps}>
            <Node {...SingleSlideCarouselComponentProps}>
                {items?.map(renderThumbnailItem)}
            </Node>
        </Node>
    );
};

/**
 * Render the Media gallery items using viewprops.
 * @param props - The media gallery view props.
 * @returns The media gallery module wrapping up images node.
 */
const mediaGalleryView: React.FC<IMediaGalleryViewProps> = props => {
    // eslint-disable-next-line @typescript-eslint/naming-convention --  Dependency from media-gallery.tsx file
    const { CarouselProps, Thumbnails, MediaGallery, Modal } = props;
    return (
        <Module {...MediaGallery}>
            <Node {...CarouselProps} />
            {Modal}
            {renderThumbnails(Thumbnails, props)}
        </Module>
    );
};

export default mediaGalleryView;
