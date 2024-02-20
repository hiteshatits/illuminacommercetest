/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';
import { INavigationMenuViewProps } from '@msdyn365-commerce-modules/navigation-menu';
import { generateImageUrl } from '@msdyn365-commerce-modules/retail-actions';
import * as React from 'react';

import { INavigationMenuProps } from '../../definition-extensions/navigation-menu.ext.props.autogenerated';

/**
 * INavigationMenuViewRootProps.
 */
export interface INavigationMenuViewRootProps {
    navProps: INavigationMenuViewProps & INavigationMenuProps<{}>;
}

/**
 * Represent navigation menu state interface.
 */
export interface INavigationState {
    parentMenu?: number;
    activeMenu?: number;
    categoryImage?: Msdyn365.IImageData[] | null;
    mobileViewLabelText?: string;
    drawerKeyValue: Msdyn365.IDictionary<boolean>;
    isOnlyMobile: boolean;
    isNavOpen: boolean;
}

/**
 * NavMenuConstants enum.
 */
export enum NavMenuConstants {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
    four = 4,
    escapeKey = 27,
    rootMenu = 1
}

/**
 * GridSizes.
 */
export type GridSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Get category image.
 * @param props - Navigation menu props.
 * @param categoryImage - Category Image.
 * @param alttext - AltText String.
 * @returns Returns Node.
 */
export const getCategoryImage = (props: INavigationMenuViewRootProps, categoryImage: string, alttext: string): React.ReactNode | null => {

    const categoryImageUrl = generateImageUrl(`${categoryImage}`, props.navProps.context.actionContext.requestContext.apiSettings);
    const defaultImageSettings: Msdyn365.IImageSettings = {
        viewports: {
            xs: { q: 'w=162&h=162&m=8', w: 0, h: 0 },
            sm: { q: 'w=162&h=162&m=8', w: 0, h: 0 },
            md: { q: 'w=203&h=203&m=8', w: 0, h: 0 },
            lg: { q: 'w=203&h=203&m=8', w: 0, h: 0 }
        },
        lazyload: true
    };
    if (categoryImageUrl !== undefined) {
        const imageData: Msdyn365.IImageData = { src: categoryImageUrl };
        return (
            <Msdyn365.Image
                requestContext={props.navProps.context.actionContext.requestContext}
                className='ms-nav-image__item'
                {...imageData}
                gridSettings={props.navProps.context.request.gridSettings!}
                imageSettings={props.navProps.config.categoryImageSettings ?? defaultImageSettings}
                loadFailureBehavior='hide'
                role='tabpanel'
                altText={alttext}
            />
        );
    }
    return null;
};