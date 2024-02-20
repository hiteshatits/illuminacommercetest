/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { IOrderTemplateListViewProps, ISingleOrderTemplateViewProps } from '@msdyn365-commerce-modules/order-template';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { INodeProps, Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IOrderTemplateListProps, IOrderTemplateListResources } from '../definition-extensions/order-template-list.ext.props.autogenerated';

/**
 * Interface for OrderTemplateImage.
 */
interface IOrderTemplateImage {
    props: {
        children: React.ReactElement[];
    };
}

/**
 * To render order template.
 * @param orderTemplate - The order template view props.
 * @param orderTemplateNodeProps - The order template node props.
 * @returns The JSX Element.
 */
const renderOrderTemplate = (orderTemplate: ISingleOrderTemplateViewProps, orderTemplateNodeProps?: INodeProps): JSX.Element | null => {

    // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from module file
    const { key, addToCartButton, orderTemplateImage, orderTemplateStatusMessage, removeButton, orderTemplateName } = orderTemplate;

    const orderTemplateImageElement: IOrderTemplateImage = orderTemplateImage as React.ReactElement;
    const currentImageListLength = orderTemplateImageElement.props.children.length;
    const defaultNumberImagesInTile = 4;

    if (currentImageListLength < defaultNumberImagesInTile) {
        for (let index = 0; index < defaultNumberImagesInTile - currentImageListLength; index++) {
            orderTemplateImageElement.props.children.push(<picture />);
        }
    }

    return (
        <Node key={key} className={orderTemplateNodeProps!.className} {...orderTemplateNodeProps}>
            {orderTemplateName}
            {orderTemplateImage}
            {addToCartButton}
            {removeButton}
            {orderTemplateStatusMessage}
        </Node>
    );
};

/**
 * Order Template List View.
 * @param props - The view props.
 * @returns The JSX Element.
 */
export const OrderTemplateListViewComponent: React.FC<IOrderTemplateListViewProps & IOrderTemplateListProps<IOrderTemplateListResources>> = props => {
    const {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Dependency from module file
        OrderTemplateList, OrderTemplates, OrderTemplate,
        status,
        statusMessage,
        heading,
        orderTemplates,
        createOrderTemplateButton,
        templateHeaderStatusMessage
    } = props;

    return (
        <Module {...OrderTemplateList}>
            {heading}
            {status !== 'SUCCESS' && statusMessage}
            <Node className=''>
                {status === 'SUCCESS' &&
                    (!OrderTemplates || !orderTemplates ||
                    !ArrayExtensions.hasElements(orderTemplates)) ? (
                        <div className='ms-order-template__empty-list'>
                            <h2 className='ms-order-template__empty-list-heading'>
                                {props.resources.headingForEmptyOrderTemplateList}
                            </h2>
                            <p className='ms-order-template__empty-list-text'>
                                {props.resources.textForEmptyOrderTemplateList}
                            </p>
                            {createOrderTemplateButton}
                        </div>
                    ) : createOrderTemplateButton}
                {templateHeaderStatusMessage}
            </Node>
            { OrderTemplates && orderTemplates && ArrayExtensions.hasElements(orderTemplates) &&
                <Node {...OrderTemplates}>
                    {orderTemplates.map((orderTemplate) => {
                        return renderOrderTemplate(orderTemplate, OrderTemplate);
                    })}
                </Node>}
        </Module>
    );
};

export default OrderTemplateListViewComponent;