/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

import { ComponentType } from 'react';

import { IVisibilityObserverProps, withVisibilityObserver } from '../with-visibility-observer';

describe('Visibility Observer', () => {
    it('should render correctly', () => {
        const props = {} as ComponentType<IVisibilityObserverProps>;

        const Component = withVisibilityObserver(props);

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- withVisibility object.
        const responseData = new Component();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- function call.
        responseData.componentDidMount();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- function call.
        responseData.shouldComponentUpdate(undefined, responseData.state);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- function call.
        responseData.render();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- function call.
        responseData.shouldComponentUpdate(undefined);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- object.
        responseData.selfRef = {
            current: {
                offsetWidth: 10,
                offsetHeight: 10
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- function call.
        responseData.handleVisibilityChange();

        expect(responseData).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- unmount.
        responseData.componentWillUnmount();
    });
});
